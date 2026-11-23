/* eslint-disable jest/no-standalone-expect */
import { nextTestSetup, isNextDev } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('proxy-index-data-request', () => {
  const { next, isTurbopack } = nextTestSetup({
    files: __dirname,
  })

  function fetchData(pathname: string, buildId = next.buildId) {
    return next.fetch(`/_next/data/${buildId}${pathname}`, {
      headers: { 'x-nextjs-data': '1' },
    })
  }

  it('passes / to the proxy for the data request of /', async () => {
    const res = await fetchData('/index.json')
    expect(res.headers.get('x-proxy-pathname')).toBe('/')
    expect((await res.json()).pageProps.page).toBe('landing')
  })

  it('passes /index to the proxy for the data request of /index', async () => {
    const res = await fetchData('/index/index.json')
    expect(res.headers.get('x-proxy-pathname')).toBe('/index')
    expect((await res.json()).pageProps.page).toBe('index')
  })

  it('passes /index to the proxy for a data request of another build', async () => {
    // The server only normalizes data requests for its own build ID. Others
    // reach the proxy unchanged, and the proxy parses the data URL itself.
    const res = await fetchData('/index/index.json', 'unknown-build-id')
    expect(res.headers.get('x-proxy-pathname')).toBe('/index')

    const rootRes = await fetchData('/index.json', 'unknown-build-id')
    expect(rootRes.headers.get('x-proxy-pathname')).toBe('/')
  })

  // pages named "index" are never hydrated in Webpack during development, see
  // test/e2e/index-index
  ;(isNextDev && !isTurbopack ? it.failing : it)(
    'renders /index after client navigation',
    async () => {
      const browser = await next.browser('/about')
      expect(await browser.elementByCss('#page').text()).toBe('about')

      await browser.elementByCss('#to-index').click()
      await retry(async () => {
        expect(new URL(await browser.url()).pathname).toBe('/index')
        expect(await browser.elementByCss('#page').text()).toBe('index')
      })

      await browser.elementByCss('#to-root').click()
      await retry(async () => {
        expect(await browser.elementByCss('#page').text()).toBe('landing')
      })
    }
  )

  it('renders /index on a full page load', async () => {
    const $ = await next.render$('/index')
    expect($('#page').text()).toBe('index')
  })
})
