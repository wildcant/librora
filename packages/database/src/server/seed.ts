import { Role, Status, Type } from '@prisma/client'
import bcrypt from 'bcrypt'
import range from 'lodash/range'
import { Prisma, prisma } from '.'
import { createMock } from './mocks'

const DEFAULT_USERS: Prisma.UserCreateInput[] = [
  {
    firstName: 'Joe',
    lastName: 'Doe',
    email: 'joe@mail.com',
    type: Type.USER,
    role: Role.LENDER_BORROWER_USER,
    password: bcrypt.hashSync('12345', 10),
    status: Status.ACTIVE,
    location: {
      create: {
        city: 'Santa Marta',
        country: 'CO',
        zipcode: '470004',
      },
    },
  },
  {
    firstName: 'ad',
    lastName: 'min',
    email: 'admin@mail.com',
    type: Type.ADMIN,
    role: Role.SUPER_ADMIN,
    password: bcrypt.hashSync('12345', 10),
    status: Status.ACTIVE,
    location: {
      create: {
        city: 'Santa Marta',
        country: 'CO',
        zipcode: '470006',
      },
    },
  },
]

;(async () => {
  try {
    const [joe] = await Promise.all(
      DEFAULT_USERS.map((user) =>
        prisma.user.upsert({
          where: {
            email: user.email!,
          },
          update: {
            ...user,
          },
          create: {
            ...user,
          },
        })
      )
    )

    const joeBooks = range(5).map((_) =>
      createMock.book({ overrides: { owner: { connect: { id: joe.id } } } })
    )
    const books = range(25).map((_) => createMock.book({}))
    await Promise.all([...books, ...joeBooks].map((data) => prisma.book.create({ data })))
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
