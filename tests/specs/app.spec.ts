import { test, expect, beforeAll, afterAll } from '../fixtures.mts'

test.beforeAll(beforeAll)
test.afterAll(afterAll)

test('Document element check', async ({ page, util }) => {
  try {
    await expect(
      page.getByTestId('main-logo').first(),
      `Confirm main logo is visible`
    ).toBeVisible()

    await util.captureScreenshot(page, 'result')
  } catch (error) {
    throw await util.onTestError(error)
  }
})
