import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const { ingredientIds } = await request.json() as { ingredientIds: number[] }

  if (!ingredientIds || ingredientIds.length === 0) {
    return NextResponse.json({ recipes: [] })
  }

  // Find all recipes that use at least one of the selected ingredients
  // For each recipe, count total ingredients and how many match
  const recipes = await prisma.recipe.findMany({
    where: {
      is_public: true,
      ingredients: { some: { ingredient_id: { in: ingredientIds } } }
    },
    include: {
      images: { where: { is_primary: true }, take: 1 },
      cuisine: true,
      moods: { include: { mood: true } },
      ingredients: { include: { ingredient: true } },
      user: { include: { profile: true } },
    }
  })

  const results = recipes.map(recipe => {
    const totalIngredients = recipe.ingredients.length
    const matchedIngredients = recipe.ingredients.filter(u =>
      ingredientIds.includes(u.ingredient_id)
    )
    const missingIngredients = recipe.ingredients.filter(u =>
      !ingredientIds.includes(u.ingredient_id)
    )
    const matchPercentage = totalIngredients > 0
      ? Math.round((matchedIngredients.length / totalIngredients) * 100)
      : 0

    return {
      recipe_id: recipe.recipe_id,
      title: recipe.title,
      description: recipe.description,
      estimated_time: recipe.estimated_time,
      difficulty_level: recipe.difficulty_level,
      image_url: recipe.images[0]?.image_url || null,
      cuisine_name: recipe.cuisine?.cuisine_name || null,
      chef_name: recipe.user.profile?.display_name || recipe.user.username,
      moods: recipe.moods.map(m => m.mood.mood_name),
      totalIngredients,
      matchedCount: matchedIngredients.length,
      matchPercentage,
      matchedNames: matchedIngredients.map(m => m.ingredient.ingredient_name),
      missingNames: missingIngredients.map(m => m.ingredient.ingredient_name),
    }
  })

  // Sort: 100% first, then by match percentage descending
  results.sort((a, b) => b.matchPercentage - a.matchPercentage)

  return NextResponse.json({ recipes: results })
}
