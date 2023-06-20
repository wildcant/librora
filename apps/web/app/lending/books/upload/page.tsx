import { GoBackButton } from '@/app/_components/GoBackButton'
import { BookUploadForm } from '../_components/BookUploadForm'

export default function UploadBook() {
  return (
    <div className="container py-2 h-[100vh] md:h-auto overflow-y-auto">
      <div>
        <GoBackButton />
        <BookUploadForm />
      </div>
    </div>
  )
}
