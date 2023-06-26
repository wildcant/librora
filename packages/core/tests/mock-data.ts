import type { DatabaseTypes } from 'database/client'

export const borrower: DatabaseTypes.User = {
  id: 'cljbn2vez000fvkx180der79y',
  email: 'forest@yahoo.com',
  emailVerified: null,
  firstName: 'Forest',
  lastName: 'Jast',
  password: '$2b$10$E3VczWt0JypBGWz606dHpep6/IVzZNTErqIPPRJHezmYsKzZtgEye',
  type: 'USER',
  role: 'LENDER_BORROWER_USER',
  status: 'ACTIVE',
  createdAt: new Date('2023-06-25T16:23:23.532Z'),
  updatedAt: new Date('2023-06-26T02:22:30.906Z'),
  locationId: 'cljbn2vez000hvkx19ilzibsl',
}

export const owner: DatabaseTypes.User = {
  id: 'cljbn2vez000fvkx180der79y',
  email: 'forest@yahoo.com',
  emailVerified: null,
  firstName: 'Forest',
  lastName: 'Jast',
  password: '$2b$10$E3VczWt0JypBGWz606dHpep6/IVzZNTErqIPPRJHezmYsKzZtgEye',
  type: 'USER',
  role: 'LENDER_BORROWER_USER',
  status: 'ACTIVE',
  createdAt: new Date('2023-06-25T16:23:23.532Z'),
  updatedAt: new Date('2023-06-26T02:22:30.906Z'),
  locationId: 'cljbn2vez000hvkx19ilzibsl',
}

export const book: DatabaseTypes.Book = {
  id: 'cljbn2yo10060vkx14v4d4nky',
  author: 'Frances Bruen-Rodriguez',
  date: new Date('2023-06-12T15:36:01.184Z'),
  description:
    'Eum aliquam expedita beatae tenetur illo qui sint. Voluptas deserunt sed inventore inventore cupiditate. Tempore a neque officiis.',
  numPages: 266,
  slug: 'perspiciatis-vel-est',
  title: 'Culpa praesentium tenetur.',
  userId: 'cljbn2s6c0000vkx1nvlyv5sv',
  createdAt: new Date('2023-06-25T16:23:23.532Z'),
  updatedAt: new Date('2023-06-25T16:23:23.532Z'),
  imageId: 'cljbn2yo10061vkx1x91zafpk',
}
