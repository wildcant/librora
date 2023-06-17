import React from 'react'
import { GeneralTabNavigator, LenderTabNavigator } from './TabNavigator'

type PropsAreEqual<P> = (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean

export const withTabNavigator =
  <P extends {}>(
    component: {
      (props: P): Exclude<React.ReactNode, undefined>
      displayName?: string
    },
    propsAreEqual?: PropsAreEqual<P> | false,
    componentName = component.displayName ?? component.name
  ) =>
  (variant: 'general' | 'lender') => {
    function WithSampleHoc(props: P) {
      return (
        <>
          <div className="h-[calc(100vh-4rem)] md:h-auto overflow-y-auto">
            {component(props) as JSX.Element}
          </div>
          {variant === 'general' ? <GeneralTabNavigator /> : <></>}
          {variant === 'lender' ? <LenderTabNavigator /> : <></>}
        </>
      )
    }

    WithSampleHoc.displayName = `withSampleHoC(${componentName})`

    let wrappedComponent = propsAreEqual === false ? WithSampleHoc : React.memo(WithSampleHoc, propsAreEqual)

    return wrappedComponent as typeof WithSampleHoc
  }
