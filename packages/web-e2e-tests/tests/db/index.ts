import { Prisma, createMock, generatePassword, prisma } from 'database/server'
import { z } from 'zod'
const entity = z.enum(['user', 'book', 'reservation'])
type Entity = z.infer<typeof entity>

export const database = {
  // @ts-ignore
  fetch: async (ent: Entity) => prisma[ent].findMany(),
  reset: async () => {
    const tableNames = await prisma.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tableName FROM pg_tables WHERE schemaname='public'`

    const tables = tableNames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ')

    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
    } catch (error) {
      console.error(error)
    }
  },
  insert: {
    [entity.Values.user]: async (records: Prisma.UserCreateInput[]) =>
      Promise.all(records.map((data) => prisma.user.create({ data }))),
    [entity.Values.book]: async (records: Prisma.BookCreateInput[]) =>
      Promise.all(records.map((data) => prisma.book.create({ data }))),
  },
  utils: {
    async insertRandomUser({ overrides }: Parameters<typeof createMock.user>[0]) {
      try {
        const { password, encryptedPassword } = generatePassword()

        const rawUser = await prisma.user.create({
          data: createMock.user({ overrides: { ...overrides, password: encryptedPassword } }),
        })

        const user = Object.assign(rawUser, { password })
        return user
      } catch (error) {
        console.error(error)
        throw new Error(error instanceof Error ? error.message : 'error')
      }
    },
  },
}
