import { GoBackButton } from '@/app/_components/GoBackButton'
import { BookUploadForm } from '../_components/BookUploadForm'

export default function UploadBook() {
  return (
    <main className="container my-2">
      <GoBackButton />
      <BookUploadForm />
    </main>
  )
}
