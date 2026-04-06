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
  const displayName = formData.get('display_name') as string

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: 'password123',
        profile: { create: { display_name: displayName || username } }
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
 * PROFILE: Update user profile
 */
export async function updateProfile(formData: FormData) {
  const session = await getSession()
  if (!session) return redirect('/login')

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

/**
 * RECIPE: Create new recipe
 */
export async function createRecipe(formData: FormData) {
  const session = await getSession()
  if (!session) return redirect('/login')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const estimated_time = parseInt(formData.get('estimated_time') as string)
  const difficulty = formData.get('difficulty') as string
  const cuisineName = formData.get('cuisine') as string | null
  const imagesJson = formData.get('images') as string | null
  const ingredientsJson = formData.get('ingredients') as string | null
  const stepsJson = formData.get('steps') as string | null
  const moodsJson = formData.get('moods') as string | null
  const dietsJson = formData.get('diets') as string | null

  const images: string[] = imagesJson ? JSON.parse(imagesJson) : []
  const ingredients: { name: string; quantity: number; unit: string }[] = ingredientsJson ? JSON.parse(ingredientsJson) : []
  const steps: { step_number: number; instruction: string }[] = stepsJson ? JSON.parse(stepsJson) : []
  const moods: string[] = moodsJson ? JSON.parse(moodsJson) : []
  const diets: string[] = dietsJson ? JSON.parse(dietsJson) : []

  let cuisineId: number | null = null
  if (cuisineName) {
    const cuisine = await prisma.cuisine.upsert({
      where: { cuisine_name: cuisineName },
      update: {},
      create: { cuisine_name: cuisineName }
    })
    cuisineId = cuisine.cuisine_id
  }

  const recipe = await prisma.recipe.create({
    data: {
      title,
      description,
      estimated_time,
      difficulty_level: difficulty,
      user_id: session.userId,
      cuisine_id: cuisineId,
      images: images.length > 0
        ? { create: images.map((url, i) => ({ image_url: url, image_order: i + 1, is_primary: i === 0 })) }
        : undefined,
      steps: steps.length > 0
        ? { create: steps.map(s => ({ step_number: s.step_number, instruction: s.instruction })) }
        : undefined,
    }
  })

  for (const ing of ingredients) {
    const ingredient = await prisma.ingredient.upsert({
      where: { ingredient_name: ing.name },
      update: {},
      create: { ingredient_name: ing.name }
    })
    await prisma.uSES.create({
      data: {
        recipe_id: recipe.recipe_id,
        ingredient_id: ingredient.ingredient_id,
        quantity: ing.quantity,
        unit: ing.unit
      }
    })
  }

  for (const moodName of moods) {
    const mood = await prisma.mood.upsert({
      where: { mood_name: moodName },
      update: {},
      create: { mood_name: moodName }
    })
    await prisma.fITS.create({
      data: { recipe_id: recipe.recipe_id, mood_id: mood.mood_id }
    })
  }

  for (const dietName of diets) {
    const diet = await prisma.dietary_Restriction.upsert({
      where: { restriction_name: dietName },
      update: {},
      create: { restriction_name: dietName }
    })
    await prisma.fITS_DIET.create({
      data: { recipe_id: recipe.recipe_id, restriction_id: diet.restriction_id }
    })
  }

  revalidatePath('/')
  redirect(`/recipe/${recipe.recipe_id}`)
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
