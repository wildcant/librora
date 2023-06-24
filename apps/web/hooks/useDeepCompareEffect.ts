import isEqual from 'lodash/isequal'
import { DependencyList, EffectCallback, useEffect, useRef } from 'react'

function useDeepCompareMemoize<T>(value: T) {
  const ref = useRef<T>()
  if (!isEqual(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

/**
 * The effect will only activate if any value of the dependencies in the list change
 * Note: Makes a deep comparison of the dependencies,so if you have dependencies
 * that are objects or arrays this will work just fine.
 */
export function useDeepCompareEffect(callback: EffectCallback, dependencies: DependencyList) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize))
}
