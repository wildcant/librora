export type ExcludeArgs<T> = { exclude?: (keyof T)[] }
type OmitKeys<T, K extends Array<keyof T> | undefined> = K extends (infer U extends keyof T)[]
  ? Omit<T, U>
  : never
export type GetEntityPayload<T, S extends ExcludeArgs<T>, U = keyof S> = 'exclude' extends U
  ? OmitKeys<T, S['exclude']>
  : T

type HasExclude<T> = {
  exclude?: (keyof T)[] | undefined
}
export type CheckExclude<T, S, U> = T extends HasExclude<S> ? U : S
