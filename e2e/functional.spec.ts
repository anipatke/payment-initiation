import { test, expect, type Page } from '@playwright/test'

const leftNav = (page: Page) => page.getByRole('complementary').first()
const detailPanel = (page: Page) => page.getByRole('complementary').last()

test.describe('mode switching', () => {
  test('updates tab labels to match selected mode', async ({ page }) => {
    await page.goto('/')

    // Business (default) — "Activities" tab is unique to this mode
    await expect(page.getByRole('button', { name: 'Activities' })).toBeVisible()

    // API mode — "JSON" tab is unique to this mode
    await leftNav(page).getByRole('button', { name: 'API' }).click()
    await expect(page.getByRole('button', { name: 'JSON' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Activities' })).not.toBeVisible()

    // Schema mode — "Samples" tab is unique to this mode
    await leftNav(page).getByRole('button', { name: 'Schema' }).click()
    await expect(page.getByRole('button', { name: 'Samples' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'JSON' })).not.toBeVisible()

    // Back to Business
    await leftNav(page).getByRole('button', { name: 'Business' }).click()
    await expect(page.getByRole('button', { name: 'Activities' })).toBeVisible()
  })
})

test.describe('search selection', () => {
  test('node result drives detail panel state', async ({ page }) => {
    await page.goto('/')
    const search = page.getByRole('combobox', { name: 'Search' })

    await search.fill('payment')

    // Results dropdown opens
    const resultsList = page.getByRole('listbox', { name: 'Search results' })
    await expect(resultsList).toBeVisible()

    // Node group appears (search index surfaces nodes first)
    const nodesGroup = page.getByRole('group', { name: 'Nodes' })
    await expect(nodesGroup).toBeVisible()

    // Clicking a node result selects it and dismisses the dropdown
    await nodesGroup.getByRole('option').first().click()
    await expect(resultsList).not.toBeVisible()
    await expect(search).toHaveValue('')

    // Detail panel leaves empty state — node is now selected
    await expect(
      detailPanel(page).getByText('Select a node on the canvas.'),
    ).not.toBeVisible()
  })
})

test.describe('node selection', () => {
  test('clicking a canvas node changes the active selection', async ({ page }) => {
    await page.goto('/')

    // One node is pre-selected on load (paymentInitiationTransaction)
    await expect(page.getByRole('button', { pressed: true })).toHaveCount(1)

    // Find first unselected node and capture its label
    const unselectedNode = page.getByTitle(/^Click to inspect/).first()
    const titleAttr = await unselectedNode.getAttribute('title')
    const label = titleAttr?.replace('Click to inspect ', '') ?? 'unknown'

    await unselectedNode.click()

    // That node is now selected — title switches to "Label — selected"
    await expect(page.getByTitle(`${label} — selected`)).toBeVisible()
    // Detail panel still shows node content (never empty since a node is always selected)
    await expect(
      detailPanel(page).getByText('Select a node on the canvas.'),
    ).not.toBeVisible()
  })
})

test.describe('scenario toggles', () => {
  test('activating and deactivating a scenario keeps canvas intact', async ({ page }) => {
    await page.goto('/')
    const btn = page.getByRole('button', { name: 'One-Off Payment' })

    // Activate scenario
    await btn.click()
    // Canvas nodes must still be visible after toggle
    await expect(page.getByTitle(/^Click to inspect/).first()).toBeVisible()

    // Deactivate
    await btn.click()
    await expect(page.getByTitle(/^Click to inspect/).first()).toBeVisible()
  })
})

test.describe('playback controls', () => {
  test('play → stop → reset cycle completes without error', async ({ page }) => {
    await page.goto('/')

    const playBtn = page.getByRole('button', { name: /play journey/i })
    const stopBtn = page.getByRole('button', { name: /stop/i })
    const resetBtn = page.getByRole('button', { name: /reset/i })

    // Only play visible at idle
    await expect(playBtn).toBeVisible()
    await expect(stopBtn).not.toBeVisible()
    await expect(resetBtn).not.toBeVisible()

    // Start playback
    await playBtn.click()
    await expect(stopBtn).toBeVisible()
    await expect(playBtn).not.toBeVisible()

    // Stop playback
    await stopBtn.click()
    await expect(resetBtn).toBeVisible()
    await expect(stopBtn).not.toBeVisible()

    // Reset returns to idle
    await resetBtn.click()
    await expect(playBtn).toBeVisible()
    await expect(resetBtn).not.toBeVisible()
  })
})

test.describe('tablet viewport (768 × 1024)', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('mode switching works at tablet width', async ({ page }) => {
    await page.goto('/')
    await leftNav(page).getByRole('button', { name: 'API' }).click()
    await expect(page.getByRole('button', { name: 'JSON' })).toBeVisible()
  })

  test('node selection works at tablet width', async ({ page }) => {
    await page.goto('/')
    const unselectedNode = page.getByTitle(/^Click to inspect/).first()
    const titleAttr = await unselectedNode.getAttribute('title')
    const label = titleAttr?.replace('Click to inspect ', '') ?? 'unknown'
    await unselectedNode.click()
    await expect(page.getByTitle(`${label} — selected`)).toBeVisible()
  })

  test('playback controls work at tablet width', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /play journey/i }).click()
    await expect(page.getByRole('button', { name: /stop/i })).toBeVisible()
  })
})
