import { Client } from '@neondatabase/serverless'
import type { DatabaseTypes } from 'database/client'

export interface Env {
  DATABASE_URL: string
}

export default {
  // Ideally I would use Durable Object Alerts to handle 24 hours expired reservations but that feature is not free to use :(
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const client = new Client(env.DATABASE_URL)
    await client.connect()
    // TODO: We could create a new event table to store this mutation.
    const { rowCount } = await client.query<DatabaseTypes.Reservation>(
      `UPDATE "Reservation" SET status = 'EXPIRED' WHERE status='PENDING' AND start + interval '24 hours' > NOW();`
    )
    ctx.waitUntil(client.end())
    console.info(`Expired reservations trigger fired at ${event.cron}, reservations updated ${rowCount}`)
  },
}
