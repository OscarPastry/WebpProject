'use server'

import { prisma } from '@/lib/prisma'
import { setSession, clearSession, getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

/**
 * AUTHENTICATION: Login
 */
export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({
    where: { username },
    include: { profile: true }
  })

  // Simple academic check: seeded users have "password123" 
  // or a placeholder hash that we treat as "password123"
  if (!user || password !== 'password123') {
    // In a real app we'd use bcrypt.compare
    return redirect('/login?error=Invalid credentials')
  }

  await setSession(user.user_id, user.username)
  redirect('/onboarding')
}

/**
 * AUTHENTICATION: Register
 */
export async function register(formData: FormData) {
  const username = formData.get('username') as string
  const email = formData.get('email') as string


  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: 'password123', // Simple for demo
        profile: { create: { display_name: username } }
      }
    })
    await setSession(user.user_id, user.username)
  } catch {
    return redirect('/register?error=Username or email taken')
  }
  redirect('/onboarding')
}

/**
 * AUTHENTICATION: Logout
 */
export async function logout() {
  await clearSession()
  redirect('/login')
}

/**
 * ONBOARDING: Save preferences
 */
export async function saveOnboarding(cuisines: string[], restrictions: string[]) {
  const session = await getSession()
  if (!session) return redirect('/login')

  const userId = session.userId

  // 1. Ensure User_Onboarding exists
  const onboarding = await prisma.user_Onboarding.upsert({
    where: { user_id: userId },
    update: { completed_at: new Date() },
    create: { 
        user_id: userId, 
        onboarding_version: 'v2.1', 
        completed_at: new Date() 
    }
  })

  // 2. Save Cuisines (SELECTS)
  // Clear old ones first to allow re-onboarding
  await prisma.sELECTS.deleteMany({ where: { onboarding_id: onboarding.onboarding_id } })
  
  for (let i = 0; i < cuisines.length; i++) {
    const cuisine = await prisma.cuisine.findUnique({ where: { cuisine_name: cuisines[i] } })
    if (cuisine) {
      await prisma.sELECTS.create({
        data: {
          onboarding_id: onboarding.onboarding_id,
          cuisine_id: cuisine.cuisine_id,
          preference_rank: i + 1
        }
      })
    }
  }

  // 3. Save Dietary Restrictions (FOLLOWS)
  await prisma.fOLLOWS.deleteMany({ where: { user_id: userId } })
  for (const rName of restrictions) {
    const restriction = await prisma.dietary_Restriction.findUnique({ where: { restriction_name: rName } })
    if (restriction) {
        await prisma.fOLLOWS.create({
            data: { user_id: userId, restriction_id: restriction.restriction_id }
        })
    }
  }

  revalidatePath('/')
  return { success: true }
}

/**
 * BOARD: Save recipe
 */
export async function saveToBoard(formData: FormData) {
    const recipeId = parseInt(formData.get('recipeId') as string)
    const boardId = parseInt(formData.get('boardId') as string)
    
    try {
        await prisma.sAVES.create({
            data: { recipe_id: recipeId, board_id: boardId }
        })
        revalidatePath(`/recipe/${recipeId}`)
    } catch {
        // Already saved
    }
}
