import { faker } from '@faker-js/faker'
import { Role, Status, Type, Country } from '@prisma/client'
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
  let json = args.json
  if (args.exclude) {
    json = omit(args.json, args?.exclude) as any
  }
  if (args.overrides) {
    json = merge(json, args.overrides) as any
  }
  return json as any
}

const booksImages = [
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485966/librora/books/photo-1518744386442-2d48ac47a7eb_h35nxa.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485926/librora/books/photo-1652571305415-03416a741883_c1syzu.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485768/librora/books/premium_photo-1681487388651-d744a4d9f781_ph5ukw.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485768/librora/books/photo-1633477189729-9290b3261d0a_l59nzn.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485768/librora/books/photo-1641154748135-8032a61a3f80_tgodoe.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485768/librora/books/photo-1629992101753-56d196c8aabb_tf32xg.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485767/librora/books/photo-1621351183012-e2f9972dd9bf_bjgezm.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485767/librora/books/photo-1621944190310-e3cca1564bd7_n2yjtl.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485767/librora/books/photo-1589829085413-56de8ae18c73_putk5b.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485767/librora/books/photo-1612969308146-066d55f37ccb_clxrgl.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485767/librora/books/photo-1605087156563-fdc6f3e8e6f7_xixitt.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485767/librora/books/photo-1605290975464-72d2acef7d4a_ygq1xk.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485767/librora/books/photo-1610882648335-ced8fc8fa6b6_rg4q1e.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485767/librora/books/photo-1601640365825-66327247a242_czmbif.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485766/librora/books/photo-1535398089889-dd807df1dfaa_dwnchz.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485766/librora/books/photo-1521123845560-14093637aa7d_oc9dfi.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485766/librora/books/photo-1544947950-fa07a98d237f_xbkm8p.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485766/librora/books/photo-1504610494206-81887ec0fff1_zoepmf.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485766/librora/books/photo-1592496431122-2349e0fbc666_vksjxi.webp',
  'https://res.cloudinary.com/dozluaaq6/image/upload/v1687485766/librora/books/photo-1544736779-08492534e887_sqrwif.webp',
]

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
        location: {
          create: {
            country: faker.helpers.enumValue(Country),
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
          },
        },
      },
    }),
  book: <TArgs extends CreateFakeArgs<Prisma.BookCreateInput>>(args: TArgs) =>
    createFakeEntity<Prisma.BookCreateInput, TArgs>({
      ...args,
      json: {
        date: faker.date.past(),
        description: faker.lorem.paragraph(),
        numPages: faker.number.int({ min: 1, max: 1000 }),
        slug: faker.lorem.slug(),
        title: faker.lorem.sentence(),
        author: faker.person.fullName(),
        owner: args.overrides?.owner ? args.overrides?.owner : { create: createMock.user({}) },
        image: { create: { url: faker.helpers.arrayElement(booksImages) } },
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
