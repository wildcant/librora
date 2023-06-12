import React from 'react'
import { TabNavigator } from './TabNavigator'

type PropsAreEqual<P> = (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean

export const withTabNavigator = <P extends {}>(
  component: {
    (props: P): Exclude<React.ReactNode, undefined>
    displayName?: string
  },
  propsAreEqual?: PropsAreEqual<P> | false,

  componentName = component.displayName ?? component.name
): {
  (props: P): JSX.Element
  displayName: string
} => {
  function WithSampleHoc(props: P) {
    return (
      <>
        <div className="h-[calc(100vh-4rem)] md:h-auto">{component(props) as JSX.Element}</div>
        <TabNavigator />
      </>
    )
  }

  WithSampleHoc.displayName = `withSampleHoC(${componentName})`

  let wrappedComponent = propsAreEqual === false ? WithSampleHoc : React.memo(WithSampleHoc, propsAreEqual)

  return wrappedComponent as typeof WithSampleHoc
}
