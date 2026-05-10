import { test, expect } from '@playwright/test'

// Disable CSS animations/transitions for stable screenshots across all visual tests.
test.use({ reducedMotion: 'reduce' })

test.describe('visual regression — desktop 1440×900', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('default explorer state', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('desktop-default.png')
  })
})

test.describe('visual regression — narrow desktop 1024×768', () => {
  test.use({ viewport: { width: 1024, height: 768 } })

  test('narrow canvas switches to two-column node layout', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('narrow-desktop.png')
  })
})

test.describe('visual regression — tablet 768×1024', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('tablet layout', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('tablet.png')
  })
})
