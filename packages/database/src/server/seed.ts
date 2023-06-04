import bcrypt from 'bcrypt'
import { prisma, Prisma } from '.'

import { Type, Role, Status } from '@prisma/client'

const DEFAULT_USERS: Prisma.UserCreateInput[] = [
  {
    firstName: 'Joe',
    lastName: 'Doe',
    email: 'joe@mail.com',
    type: Type.USER,
    role: Role.LENDER_BORROWER_USER,
    password: bcrypt.hashSync('12345', 10),
    status: Status.ACTIVE,
  },
  {
    firstName: 'Kurtis',
    lastName: 'Weissnat',
    email: 'kurtis@mail.com',
    type: Type.USER,
    role: Role.LENDER_BORROWER_USER,
    password: bcrypt.hashSync('12345', 10),
    status: Status.ACTIVE,
  },
  {
    firstName: 'ad',
    lastName: 'min',
    email: 'admin@mail.com',
    type: Type.ADMIN,
    role: Role.SUPER_ADMIN,
    password: bcrypt.hashSync('12345', 10),
    status: Status.ACTIVE,
  },
]

;(async () => {
  try {
    await Promise.all(
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
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
