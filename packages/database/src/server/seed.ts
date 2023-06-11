import { faker } from '@faker-js/faker'
import { Role, Status, Type } from '@prisma/client'
import bcrypt from 'bcrypt'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import range from 'lodash/range'
import { prisma, Prisma } from '.'
import { CheckExclude, ExcludeArgs, GetEntityPayload } from './types'

/** Generic function that allows to create an object of a given entity, allows to exclude and override keys in a type safe manner. */
type CreateFakeArgs<T extends {}> = ExcludeArgs<T> & { overrides?: Partial<T> }
const createFakeEntity = <T extends {}, TArgs extends CreateFakeArgs<T>>(
  args: TArgs & { json: T }
): CheckExclude<TArgs, T, GetEntityPayload<T, TArgs>> => {
  return args?.exclude ? (merge(omit(args.json, args?.exclude), args.overrides ?? {}) as any) : args?.json
}

export const createMock = {
  user: <TArgs extends CreateFakeArgs<Prisma.UserCreateInput>>(args: TArgs) =>
    createFakeEntity<Prisma.UserCreateInput, TArgs>({
      ...args,
      json: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        type: Type.USER,
        role: Role.LENDER_BORROWER_USER,
        status: Status.ACTIVE,
      },
    }),
  book: <TArgs extends CreateFakeArgs<Prisma.BookCreateInput>>(args: TArgs) =>
    createFakeEntity<Prisma.BookCreateInput, TArgs>({
      ...args,
      json: {
        cover: faker.image.urlLoremFlickr({ category: 'books' }),
        date: faker.date.past().toString(),
        description: faker.lorem.paragraph(),
        numPages: faker.number.int({ min: 1, max: 1000 }),
        slug: faker.lorem.slug(),
        title: faker.lorem.sentence(),
        owner: {
          create: createMock.user({}),
        },
      },
    }),
}

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

    const books = range(100).map((_) => createMock.book({}))

    await Promise.all(books.map((data) => prisma.book.create({ data })))
  } catch (error) {
    console.error(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
