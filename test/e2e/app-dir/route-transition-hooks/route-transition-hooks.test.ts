import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('route-transition-hooks', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    dependencies: {
      'next-creative': 'latest',
    },
  })

  it('keeps the exiting node and reports navigation metadata', async () => {
    const browser = await next.browser('/')

    expect(
      await browser.elementByCss('[data-testid="route-home"]').text()
    ).toContain('Home route')
    expect(
      await browser.elementByCss('[data-testid="transition-action"]').text()
    ).toBe('none')
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toBe('none')
    expect(
      await browser
        .elementByCss('[data-testid="resolved-transition-source"]')
        .text()
    ).toBe('none')
    expect(
      await browser
        .elementByCss('[data-testid="resolved-transition-name"]')
        .text()
    ).toBe('none')
    expect(
      await browser.elementByCss('[data-testid="concurrency-policy"]').text()
    ).toBe('queue')
    expect(
      await browser.elementByCss('[data-testid="queued-exits"]').text()
    ).toBe('0')

    await browser.elementByCss('[data-testid="link-about"]').click()

    expect(
      await browser.elementByCss('[data-testid="route-about"]').text()
    ).toContain('About route')
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toContain('Home route')
    expect(
      await browser.elementByCss('[data-testid="transition-action"]').text()
    ).toBe('push')
    expect(
      await browser.elementByCss('[data-testid="transition-direction"]').text()
    ).toBe('forward')
    expect(
      await browser
        .elementByCss('[data-testid="resolved-transition-source"]')
        .text()
    ).toBe('explicit')
    expect(
      await browser
        .elementByCss('[data-testid="resolved-transition-name"]')
        .text()
    ).toBe('about-link-explicit')

    await browser.elementByCss('[data-testid="complete-exit"]').click()
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toBe('none')

    await browser.back()

    expect(
      await browser.elementByCss('[data-testid="route-home"]').text()
    ).toContain('Home route')
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toContain('About route')
    expect(
      await browser.elementByCss('[data-testid="transition-action"]').text()
    ).toBe('traverse')
    expect(
      await browser.elementByCss('[data-testid="transition-direction"]').text()
    ).toBe('backward')
    expect(
      await browser
        .elementByCss('[data-testid="resolved-transition-source"]')
        .text()
    ).toBe('rule')
    expect(
      await browser
        .elementByCss('[data-testid="resolved-transition-name"]')
        .text()
    ).toBe('about-to-home')

    await browser.elementByCss('[data-testid="complete-exit"]').click()
    await browser.elementByCss('[data-testid="link-work"]').click()

    expect(
      await browser.elementByCss('[data-testid="route-work"]').text()
    ).toContain('Work route')
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toContain('Home route')
    expect(
      await browser
        .elementByCss('[data-testid="resolved-transition-source"]')
        .text()
    ).toBe('default')
    expect(
      await browser
        .elementByCss('[data-testid="resolved-transition-name"]')
        .text()
    ).toBe('default-transition')
    expect(
      await browser.elementByCss('[data-testid="queued-exits"]').text()
    ).toBe('0')

    await browser.elementByCss('[data-testid="link-about"]').click()

    expect(
      await browser.elementByCss('[data-testid="route-about"]').text()
    ).toContain('About route')
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toContain('Home route')
    expect(
      await browser.elementByCss('[data-testid="queued-exits"]').text()
    ).toBe('1')

    await browser.elementByCss('[data-testid="complete-exit"]').click()
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toContain('Work route')
    expect(
      await browser.elementByCss('[data-testid="queued-exits"]').text()
    ).toBe('0')

    await browser.elementByCss('[data-testid="cancel-exit"]').click()
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toBe('none')
    expect(
      await browser.elementByCss('[data-testid="queued-exits"]').text()
    ).toBe('0')

    await browser.elementByCss('[data-testid="push-same-path-query"]').click()

    expect(
      await browser.elementByCss('[data-testid="route-about"]').text()
    ).toContain('About route')
    expect(
      await browser.elementByCss('[data-testid="transition-action"]').text()
    ).toBe('push')
    expect(
      await browser.elementByCss('[data-testid="transition-direction"]').text()
    ).toBe('none')
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toBe('none')

    await browser.elementByCss('[data-testid="link-home"]').click()
    expect(
      await browser.elementByCss('[data-testid="route-home"]').text()
    ).toContain('Home route')
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toContain('About route')
    await browser.elementByCss('[data-testid="complete-exit"]').click()
    expect(
      await browser.elementByCss('[data-testid="exiting-node"]').text()
    ).toBe('none')

    await browser.elementByCss('[data-testid="link-photo"]').click()

    await retry(async () => {
      expect(await browser.url()).toContain('/photos/1')
      expect(
        await browser.elementByCss('[data-testid="route-home"]').text()
      ).toContain('Home route')
      expect(
        await browser.elementByCss('[data-testid="exiting-node"]').text()
      ).toBe('none')
      expect(
        await browser.elementByCss('[data-testid="modal-entering-node"]').text()
      ).toContain('Photo modal 1')
      expect(
        await browser.elementByCss('[data-testid="modal-exiting-node"]').text()
      ).toContain('Modal default')
    })
    expect(
      await browser.hasElementByCssSelector('[data-testid="route-photo-page"]')
    ).toBe(false)
  })
})
