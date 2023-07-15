import { ErrorOptions } from '@/lib/api/server'
import { ReservationMachineState } from 'core'

import { ReservationStatus } from 'database/server'

export function handleReservationTransitionResponse(
  newState: ReservationMachineState
): [error: ErrorOptions, newState: 'ERROR']
export function handleReservationTransitionResponse(
  newState: ReservationMachineState
): [error: undefined, newState: ReservationStatus]
export function handleReservationTransitionResponse(
  newState: ReservationMachineState
): [error: ErrorOptions | undefined, newState: ReservationStatus | 'ERROR'] {
  if (newState.value === 'ERROR') {
    if (newState.context?.error) {
      return [{ errors: [{ title: 'Invalid user input', description: newState.context.error }] }, 'ERROR']
    } else {
      return [{ errorMessage: "There was a problem processing you're request." }, 'ERROR']
    }
  } else {
    return [undefined, newState.value as ReservationStatus]
  }
}
