import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) redirect('/login')

  const formData = await request.formData()
  const displayName = formData.get('display_name') as string
  const bio = formData.get('bio') as string
  const profileImageUrl = formData.get('profile_image_url') as string

  await prisma.user_Profile.upsert({
    where: { user_id: session.userId },
    update: {
      display_name: displayName || null,
      bio: bio || null,
      profile_image_url: profileImageUrl || null,
    },
    create: {
      user_id: session.userId,
      display_name: displayName || null,
      bio: bio || null,
      profile_image_url: profileImageUrl || null,
    },
  })

  revalidatePath(`/profile/${session.username}`)
  revalidatePath('/chefs')
  redirect(`/profile/${session.username}`)
}
