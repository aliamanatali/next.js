import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'
import type { Playwright } from 'next-webdriver'

describe('initial-load-hash-navigation', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  async function navigate(
    browser: Playwright,
    selector: string,
    expectedPath: string,
    expectedPage: string
  ) {
    await browser.elementByCss(selector).click()
    await retry(async () => {
      expect(await browser.url()).toBe(next.url + expectedPath)
    })
    expect(await browser.elementByCss('#results').text()).toBe(
      `Results page ${expectedPage}`
    )
  }

  it('replaces the hash of the initial URL when a link to its route has one', async () => {
    const browser = await next.browser('/s?q=1#a')

    await navigate(browser, '#to-page-2', '/s?q=1&page=2', '2')
    await navigate(browser, '#to-page-1-section-a', '/s?q=1#a', '1')
  })

  it('does not restore the hash of the initial URL when a link to its route has none', async () => {
    const browser = await next.browser('/s?q=1#a')

    await navigate(browser, '#to-page-2', '/s?q=1&page=2', '2')
    await navigate(browser, '#to-page-1', '/s?q=1', '1')
  })
})
