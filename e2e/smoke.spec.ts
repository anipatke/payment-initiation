import { test, expect } from '@playwright/test'

test('explorer shell renders all four surfaces', async ({ page }) => {
  await page.goto('/')

  // Header — banner landmark contains the app title
  const header = page.getByRole('banner')
  await expect(header).toBeVisible()
  await expect(header.getByRole('heading', { name: /payment initiation explorer/i })).toBeVisible()

  // Left navigation — first complementary landmark
  const leftNav = page.getByRole('complementary').first()
  await expect(leftNav).toBeVisible()

  // Journey canvas — main landmark
  const canvas = page.getByRole('main')
  await expect(canvas).toBeVisible()

  // Detail panel — second complementary landmark
  const detailPanel = page.getByRole('complementary').last()
  await expect(detailPanel).toBeVisible()
})
