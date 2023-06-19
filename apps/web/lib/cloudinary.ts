import crypto, { BinaryToTextEncoding } from 'crypto'
import isArray from 'lodash/isArray'
import { env } from './env'

const SUPPORTED_SIGNATURE_ALGORITHMS = ['sha1', 'sha256']
const DEFAULT_SIGNATURE_ALGORITHM = 'sha1'

/**
 * @desc Turns arguments that aren't arrays into arrays
 * @param arg
 * @returns { any | any[] }
 */
function toArray(arg: any) {
  switch (true) {
    case arg == null:
      return []
    case isArray(arg):
      return arg
    default:
      return [arg]
  }
}
/**
 * Verify that the parameter `value` is defined and it's string value is not zero.
 * <br>This function should not be confused with `isEmpty()`.
 * @private
 * @param {string|number} value The value to check.
 * @return {boolean} True if the value is defined and not empty.
 */

function present(value: string | number) {
  return value != null && ('' + value).length > 0
}

/**
 * Encode the given string
 * @private
 * @param {string} argString the string to encode
 * @return {string}
 */
function utf8_encode(argString: string) {
  let c1, enc, n
  if (argString == null) {
    return ''
  }
  let string = argString + ''
  let utftext = ''
  let start = 0
  let end = 0
  let stringl = string.length
  n = 0
  while (n < stringl) {
    c1 = string.charCodeAt(n)
    enc = null
    if (c1 < 128) {
      end++
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128)
    } else {
      enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128)
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.slice(start, end)
      }
      utftext += enc
      start = n + 1
      end = start
    }
    n++
  }
  if (end > start) {
    utftext += string.slice(start, stringl)
  }
  return utftext
}

/**
 * Computes hash from input string using specified algorithm.
 * @private
 * @param {string} input string which to compute hash from
 * @param {string} signature_algorithm algorithm to use for computing hash
 * @param {string} encoding type of encoding
 * @return {string} computed hash value
 */
function computeHash(input: string, signature_algorithm: string, encoding: BinaryToTextEncoding) {
  if (!SUPPORTED_SIGNATURE_ALGORITHMS.includes(signature_algorithm)) {
    throw new Error(
      `Signature algorithm ${signature_algorithm} is not supported. Supported algorithms: ${SUPPORTED_SIGNATURE_ALGORITHMS.join(
        ', '
      )}`
    )
  }
  let hash = crypto.createHash(signature_algorithm)
  hash.update(utf8_encode(input), 'binary')
  return hash.digest(encoding)
}

function api_sign_request<TParams extends Record<string, string | number | any>>(
  params_to_sign: TParams,
  api_secret: string
) {
  let to_sign = Object.entries(params_to_sign)
    .filter(([_k, v]) => present(v))
    .map(([k, v]) => `${k}=${toArray(v).join(',')}`)
    .sort()
    .join('&')
  return computeHash(to_sign + api_secret, DEFAULT_SIGNATURE_ALGORITHM, 'hex')
}

const getTimestamp = () => Math.floor(new Date().getTime() / 1000)

type ResourceType = 'image' | 'raw' | 'video'

type CloudinaryUnsignedUploadResponse = {
  asset_id: string
  public_id: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: any[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  original_filename: string
}

async function unsigned_upload(
  file: File,
  options: { resource_type: ResourceType } = { resource_type: 'image' }
) {
  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', env.CLOUDINARY_UPLOAD_PRESET)
  body.append('api_key', env.CLOUDINARY_API_KEY)

  const uploadApiResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${options.resource_type}/upload`,
    { method: 'post', body }
  ).catch((e) => new Error(e))

  if (uploadApiResponse instanceof Error) {
    return uploadApiResponse
  }

  if (!uploadApiResponse.ok) {
    return new Error('There was a problem making the request to upload the file.')
  }

  return (await uploadApiResponse.json()) as CloudinaryUnsignedUploadResponse
}

async function destroy(
  public_id: string,
  options: { resource_type?: ResourceType; invalidate?: boolean } = { resource_type: 'image' }
) {
  const { resource_type } = options
  const params = { public_id, api_key: env.CLOUDINARY_API_KEY, timestamp: getTimestamp(), resource_type }
  const signature = api_sign_request({ public_id, timestamp: getTimestamp() }, env.CLOUDINARY_API_SECRET)
  const body = new FormData()
  body.append('public_id', params.public_id)
  body.append('timestamp', params.timestamp.toString())
  body.append('api_key', params.api_key)
  body.append('signature', signature)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/${resource_type}/destroy`,
    {
      method: 'post',
      body,
    }
  )
  const { result }: { result: 'ok' | 'not found' } = await response.json()

  if (result === 'not found') {
    return new Error('File not found.')
  }

  if (result !== 'ok') {
    return new Error('There was a problem trying to remove the file.')
  }

  return
}

export const cloudinary = { unsigned_upload, destroy }
