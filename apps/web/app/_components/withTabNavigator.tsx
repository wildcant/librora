import { TabNavigator } from './TabNavigator'

export const withTabNavigator = (Component) => (props) => {
  return (
    <>
      <div className="h-[calc(100vh-4rem)] md:h-auto">
        <Component {...props} />
      </div>
      <TabNavigator />
    </>
  )
}
