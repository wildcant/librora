import { expect, test } from '@playwright/test'
import { createMock } from 'database/server'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import { login } from './commands'
import { database } from './db'

test.beforeEach(async () => {
  await database.reset()
})

test('should allow borrower to book available book.', async ({ page }) => {
  const [[book], user] = await Promise.all([
    database.insert.book([createMock.book({})]),
    database.utils.insertRandomUser({ overrides: { type: 'USER', role: 'LENDER_BORROWER_USER' } }),
  ])
  await login.desktop(page, { email: user.email, password: user.password })
  await page.getByRole('link', { name: book.title }).click()
  await page.waitForURL(`/book/${book.id}`)
  await expect(page.getByRole('heading', { name: 'About this book' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'When do you want to have it' })).toBeVisible()

  await page.getByRole('button', { name: 'Start Date Add date' }).click()
  const today = new Date()
  await page
    .getByRole('grid', { name: format(today, 'MMMM yyyy') })
    .getByText(format(addDays(today, 2), 'dd'))
    .click()
  await page
    .getByRole('grid', { name: format(today, 'MMMM yyyy') })
    .getByText(format(addDays(today, 9), 'dd'))
    .click()
  const reservePromise = page.waitForResponse('/api/reservations')
  await page.getByRole('button', { name: 'Reserve' }).click()
  await reservePromise
  await page.waitForURL('/reservations')
  await expect(page.getByRole('heading', { name: '1 Reservations' })).toBeVisible()
})
