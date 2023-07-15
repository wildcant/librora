import { expect, test } from '@playwright/test'
import { login } from './commands'
import { database } from './db'

test.beforeEach(async () => {
  await database.reset()
})

test.describe('User signup and login', () => {
  test('should redirect unauthenticated user to home page', async ({ page }) => {
    await page.goto('/account-settings')
    expect(new URL(page.url()).pathname).toEqual('/')
  })

  test('should allow user to login', async ({ page }) => {
    const user = await database.utils.insertRandomUser({
      overrides: { type: 'USER', role: 'LENDER_BORROWER_USER' },
    })
    await login.desktop(page, { email: user.email, password: user.password })
    await page.getByRole('button', { name: /avatar-dialog-trigger/ }).click()
    await page.getByRole('link', { name: 'Account' }).click()
    await page.waitForURL('/account-settings')
    await expect(page.getByText('Account')).toBeVisible()
  })

  test('should error for an invalid email', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /avatar-dialog-trigger/ }).click()
    await page.getByRole('button', { name: /Log in/ }).click()
    await page.getByLabel('Email').type('invalidEmail')
    await page.getByLabel('Password').type('123')
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page.getByText('Email is invalid.')).toBeVisible()
  })

  test('should error for an invalid password for existing user', async ({ page }) => {
    const user = await database.utils.insertRandomUser({
      overrides: { type: 'USER', role: 'LENDER_BORROWER_USER' },
    })
    await login.desktop(page, { email: user.email, password: `invalidPa$$word${user.password}` })
    await expect(page.getByText('Invalid credentials', { exact: true })).toBeVisible()
  })

  // TODO: test.skip('should allow a visitor to sign-up', () => {})
})
