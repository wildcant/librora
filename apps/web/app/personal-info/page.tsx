import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/Breadcrumb'
import { GoBackButton } from '../_components/GoBackButton'
import { PersonalInfo } from './_components/PersonalInfo'

export default function PersonalInfoPage() {
  return (
    <main className="container pt-4">
      <GoBackButton />
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbLink href="/account-settings">Account</BreadcrumbLink>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Personal Info</BreadcrumbItem>
      </Breadcrumb>

      <h1 className="text-md font-bold my-4 md:text-2xl">Personal info</h1>
      <PersonalInfo />
    </main>
  )
}
