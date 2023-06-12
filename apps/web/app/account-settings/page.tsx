import { withTabNavigator } from '../_components/withTabNavigator'
import { SignOut } from './_components/SignOut'

function AccountSettings() {
  return (
    <div>
      Profile
      <br />
      <SignOut />
    </div>
  )
}

export default withTabNavigator(AccountSettings)
