import { DatabaseTypes } from 'database/client'

export type ExcludeId<T> = Omit<T, 'id'>

export type SanitizedUser = Omit<DatabaseTypes.User, 'password'> & {
  location: DatabaseTypes.Location | null
}

export type Book = DatabaseTypes.Book & {
  image: DatabaseTypes.Image
}

export type BorrowerReservation = DatabaseTypes.Reservation & {
  book: DatabaseTypes.Book & {
    image: {
      url: string
    }
  }
  lender: DatabaseTypes.User & {
    location: DatabaseTypes.Location | null
  }
}
export type LenderReservation = DatabaseTypes.Reservation & {
  book: DatabaseTypes.Book & {
    image: {
      url: string
    }
  }
}
