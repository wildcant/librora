import { type Page } from '@playwright/test'

type Credentials = { email: string; password: string }
export const login = {
  async desktop(page: Page, credentials: Credentials) {
    await page.goto('/')
    await page.getByRole('button', { name: /avatar-dialog-trigger/ }).click()
    await page.getByRole('button', { name: /Log in/ }).click()
    await page.getByLabel('Email').type(credentials.email)
    await page.getByLabel('Password').type(credentials.password)
    const loginPromise = page.waitForResponse('/api/auth/session')
    await page.getByRole('button', { name: 'Continue' }).click()
    return loginPromise
  },
  mobile() {},
}
