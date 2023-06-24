import { ReasonPhrase } from './reason-phrases'
import { StatusCode } from './status-codes'
import { reasonPhraseToStatusCode, statusCodeToReasonPhrase } from './utils'

/**
 * Returns the reason phrase for the given status code.
 * If the given status code does not exist, an error is thrown.
 *
 * @param {StatusCode} statusCode The HTTP status code
 * @returns {string} The associated reason phrase (e.g. "Bad Request", "OK")
 * */
export const getReasonPhrase = (statusCode: StatusCode): `${ReasonPhrase}` =>
  statusCodeToReasonPhrase[statusCode]

/**
 * Returns the status code for the given reason phrase.
 * If the given reason phrase does not exist, undefined is returned.
 *
 * @param {string} reasonPhrase The HTTP reason phrase (e.g. "Bad Request", "OK")
 * @returns {string} The associated status code
 * */
export const getStatusCode = (reasonPhrase: ReasonPhrase): StatusCode =>
  reasonPhraseToStatusCode[reasonPhrase]
