import Link from 'next/link'
import { Edit2 } from 'lucide-react'

export default function EditProfileButton() {
  return (
    <Link href="/profile/edit"
      className="brutalist-btn bg-[#363cff] text-white px-4 py-2 text-xs flex items-center gap-2">
      <Edit2 className="w-3 h-3" /> Edit Profile
    </Link>
  )
}
