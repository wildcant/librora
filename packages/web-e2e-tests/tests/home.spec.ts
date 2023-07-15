import { expect, test } from '@playwright/test'
import { createMock } from 'database/server'
import range from 'lodash/range'
import { database } from './db'

test.beforeEach(async () => {
  await database.reset()
})

test('Display home page with table of books.', async ({ page }) => {
  const books = range(4).map(() => createMock.book({}))
  await database.insert.book(books)
  await page.goto('/')
  await Promise.all(books.map((book) => expect(page.getByText(book.title).first()).toBeVisible()))
})
