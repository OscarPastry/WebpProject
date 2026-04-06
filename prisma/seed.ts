
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding FlavorForge database...')

  // ── Clear existing data (order matters due to FKs) ──────────────────────────
  await prisma.cooking_Log.deleteMany()
  await prisma.recipe_View_Log.deleteMany()
  await prisma.sAVES.deleteMany()
  await prisma.fITS.deleteMany()
  await prisma.uSES.deleteMany()
  await prisma.sUBSTITUTES.deleteMany()
  await prisma.recipe_Step.deleteMany()
  await prisma.recipe_Image.deleteMany()
  await prisma.recipe.deleteMany()
  await prisma.board.deleteMany()
  await prisma.fOLLOWS.deleteMany()
  await prisma.sELECTS.deleteMany()
  await prisma.user_Taste_Signal.deleteMany()
  await prisma.user_Onboarding.deleteMany()
  await prisma.user_Profile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.ingredient.deleteMany()
  await prisma.dietary_Restriction.deleteMany()
  await prisma.cuisine.deleteMany()
  await prisma.mood.deleteMany()
  console.log('✓ Cleared existing data')

  // ── Cuisines ────────────────────────────────────────────────────────────────
  const [italian, indian, japanese, mexican, french] = await Promise.all([
    prisma.cuisine.create({ data: { cuisine_name: 'Italian' } }),
    prisma.cuisine.create({ data: { cuisine_name: 'Indian' } }),
    prisma.cuisine.create({ data: { cuisine_name: 'Japanese' } }),
    prisma.cuisine.create({ data: { cuisine_name: 'Mexican' } }),
    prisma.cuisine.create({ data: { cuisine_name: 'French' } }),
  ])
  console.log('✓ Created 5 cuisines')

  // ── Dietary Restrictions ────────────────────────────────────────────────────
  const [vegan, glutenFree, keto, vegetarian, dairyFree, nut_free, halal, lowCarb] = await Promise.all([
    prisma.dietary_Restriction.create({ data: { restriction_name: 'Vegan' } }),
    prisma.dietary_Restriction.create({ data: { restriction_name: 'Gluten-Free' } }),
    prisma.dietary_Restriction.create({ data: { restriction_name: 'Keto' } }),
    prisma.dietary_Restriction.create({ data: { restriction_name: 'Vegetarian' } }),
    prisma.dietary_Restriction.create({ data: { restriction_name: 'Dairy-Free' } }),
    prisma.dietary_Restriction.create({ data: { restriction_name: 'Nut-Free' } }),
    prisma.dietary_Restriction.create({ data: { restriction_name: 'Halal' } }),
    prisma.dietary_Restriction.create({ data: { restriction_name: 'Low-Carb' } }),
  ])
  console.log('✓ Created 8 dietary restrictions')

  // ── Moods ───────────────────────────────────────────────────────────────────
  const [comfort, adventurous, quick, healthy, festive, light] = await Promise.all([
    prisma.mood.create({ data: { mood_name: 'Comfort' } }),
    prisma.mood.create({ data: { mood_name: 'Adventurous' } }),
    prisma.mood.create({ data: { mood_name: 'Quick' } }),
    prisma.mood.create({ data: { mood_name: 'Healthy' } }),
    prisma.mood.create({ data: { mood_name: 'Festive' } }),
    prisma.mood.create({ data: { mood_name: 'Light' } }),
  ])
  console.log('✓ Created 6 moods')

  // ── Ingredients (20) ────────────────────────────────────────────────────────
  const [
    tomato, basil, dryPasta, gfPasta, chicken, rice, garlic, onion,
    coconutMilk, curry, salmon, soySauce, tortilla, avocado, lime,
    cheddar, egg, butter, flour, honey
  ] = await Promise.all([
    prisma.ingredient.create({ data: { ingredient_name: 'Tomato', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Basil', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Dry Pasta', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Gluten-Free Pasta', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Chicken Breast', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'White Rice', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Garlic', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Onion', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Coconut Milk', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Curry Powder', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Salmon Fillet', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Soy Sauce', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Flour Tortilla', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Avocado', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Lime', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cheddar Cheese', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Egg', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Butter', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'All-Purpose Flour', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Honey', availability_tag: 'Medium' } }),
  ])
  console.log('✓ Created 20 ingredients')

  // ── Ingredient Substitutes ──────────────────────────────────────────────────
  await Promise.all([
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: dryPasta.ingredient_id,
      substitute_ingredient_id: gfPasta.ingredient_id,
      reason: 'Gluten intolerance', confidence_score: 0.95,
      explanation: 'GF pasta is a 1:1 substitute for boiled pasta dishes. Texture may vary slightly.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: butter.ingredient_id,
      substitute_ingredient_id: coconutMilk.ingredient_id,
      reason: 'Dairy-free alternative', confidence_score: 0.70,
      explanation: 'Use coconut milk as a moistener when butter is for softness; reduce other liquids.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: rice.ingredient_id,
      substitute_ingredient_id: avocado.ingredient_id,
      reason: 'Low-carb bowl alternative', confidence_score: 0.60,
      explanation: 'Sliced avocado works as a base in bowls for a keto-friendly option.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: flour.ingredient_id,
      substitute_ingredient_id: gfPasta.ingredient_id,
      reason: 'Gluten-free baking', confidence_score: 0.55,
      explanation: 'Almond flour or GF flour mix can be used at a 1:1 ratio, expect denser texture.'
    }}),
  ])
  console.log('✓ Created substitutes')

  // ── Users (10) ──────────────────────────────────────────────────────────────
  const userData = [
    { username: 'chef_mario', email: 'mario@flavor.co', name: 'Mario Rossi', bio: 'Italian cuisine specialist and pasta aficionado.' },
    { username: 'vegan_ninja', email: 'nina@flavor.co', name: 'Nina Chen', bio: 'Plant-based cooking advocate.' },
    { username: 'spice_queen', email: 'priya@flavor.co', name: 'Priya Sharma', bio: 'Lover of bold spices and Indian home cooking.' },
    { username: 'tokyo_toast', email: 'hiro@flavor.co', name: 'Hiroshi Tanaka', bio: 'Japanese fusion chef exploring world flavors.' },
    { username: 'bake_boss', email: 'emily@flavor.co', name: 'Emily Torres', bio: 'Pastry chef bringing French baking to your kitchen.' },
    { username: 'bbq_king', email: 'jake@flavor.co', name: 'Jake Miller', bio: 'Weekend warrior at the grill.' },
    { username: 'taco_time', email: 'rosa@flavor.co', name: 'Rosa Mendez', bio: 'Mexican street food lover and home cook.' },
    { username: 'salmon_sage', email: 'ben@flavor.co', name: 'Ben Harrison', bio: 'Health-conscious chef specializing in seafood.' },
    { username: 'currymaster', email: 'amir@flavor.co', name: 'Amir Patel', bio: 'Developed my palate in Mumbai, cooking for the world.' },
    { username: 'le_cordon', email: 'claire@flavor.co', name: 'Claire Dupont', bio: 'Trained at Le Cordon Bleu, Paris.' },
  ]

  const users: { user_id: number }[] = []
  for (const u of userData) {
    const user = await prisma.user.create({
      data: {
        username: u.username,
        email: u.email,
        password_hash: '$2b$10$placeholder_hash_for_demo',
        is_verified: true,
        profile: { create: { display_name: u.name, bio: u.bio } },
        onboarding: { create: { onboarding_version: 'v2.0', completed_at: new Date(), is_active: true } },
      }
    })
    users.push(user)
  }
  console.log(`✓ Created ${users.length} users`)

  // ── Dietary Follows ──────────────────────────────────────────────────────────
  await prisma.fOLLOWS.createMany({ data: [
    { user_id: users[1].user_id, restriction_id: vegan.restriction_id },
    { user_id: users[1].user_id, restriction_id: glutenFree.restriction_id },
    { user_id: users[2].user_id, restriction_id: vegetarian.restriction_id },
    { user_id: users[4].user_id, restriction_id: dairyFree.restriction_id },
    { user_id: users[7].user_id, restriction_id: keto.restriction_id },
    { user_id: users[7].user_id, restriction_id: lowCarb.restriction_id },
    { user_id: users[8].user_id, restriction_id: halal.restriction_id },
    { user_id: users[0].user_id, restriction_id: nut_free.restriction_id },
  ]})
  console.log('✓ Created dietary follows')

  // ── Onboarding Cuisine SELECTS ───────────────────────────────────────────────
  const allOnboardings = await prisma.user_Onboarding.findMany()
  for (let i = 0; i < users.length; i++) {
    const ob = allOnboardings.find(o => o.user_id === users[i].user_id)
    if (!ob) continue
    const cuisines = [italian, indian, japanese, mexican, french]
    // Each user gets 2-3 ranked cuisines
    const userCuisines = cuisines.slice(i % 5, (i % 5) + 2)
    for (let rank = 0; rank < userCuisines.length; rank++) {
      await prisma.sELECTS.create({
        data: { onboarding_id: ob.onboarding_id, cuisine_id: userCuisines[rank].cuisine_id, preference_rank: rank + 1 }
      })
    }
  }
  console.log('✓ Created cuisine selections')

  // ── Taste Signals ────────────────────────────────────────────────────────────
  const signalData = [
    { user: users[0], type: 'cuisine_pref', weight: 0.9 },
    { user: users[0], type: 'difficulty_pref', weight: 0.6 },
    { user: users[1], type: 'dietary', weight: 1.0 },
    { user: users[2], type: 'spice_level', weight: 0.85 },
    { user: users[3], type: 'cuisine_pref', weight: 0.75 },
    { user: users[7], type: 'health_score', weight: 0.95 },
  ]
  await prisma.user_Taste_Signal.createMany({
    data: signalData.map(s => ({ user_id: s.user.user_id, signal_type: s.type, weight: s.weight }))
  })
  console.log('✓ Created taste signals')

  // ── Recipes (15) ────────────────────────────────────────────────────────────
  const recipeData = [
    { title: 'Classic Tomato Basil Pasta', description: 'A simple Italian weeknight staple with fresh tomatoes and fragrant basil.', time: 20, diff: 'Easy', user: users[0], moods: [comfort, quick], cuisine: italian, diets: [vegan, vegetarian, dairyFree, nut_free] },
    { title: 'Chicken Tikka Masala', description: 'Tender chicken in a rich, creamy tomato-based curry sauce.', time: 45, diff: 'Medium', user: users[2], moods: [comfort, adventurous], cuisine: indian, diets: [halal, glutenFree] },
    { title: 'Salmon Teriyaki Bowl', description: 'Glazed salmon over steamed rice with a sweet soy teriyaki sauce.', time: 30, diff: 'Easy', user: users[3], moods: [healthy, quick], cuisine: japanese, diets: [dairyFree, nut_free, halal] },
    { title: 'Street Tacos Al Pastor', description: 'Authentic Mexican tacos with marinated pork and fresh salsa.', time: 60, diff: 'Hard', user: users[6], moods: [festive, adventurous], cuisine: mexican, diets: [dairyFree, nut_free] },
    { title: 'French Croissants', description: 'Flaky, buttery croissants made from scratch using laminated dough.', time: 240, diff: 'Hard', user: users[4], moods: [festive, comfort], cuisine: french, diets: [vegetarian, nut_free] },
    { title: 'Miso Ramen', description: 'Rich miso broth with noodles, soft egg, and chashu pork.', time: 90, diff: 'Hard', user: users[3], moods: [comfort, adventurous], cuisine: japanese, diets: [nut_free] },
    { title: 'Avocado Toast Deluxe', description: 'Smashed avocado with lime, chili flakes and poached egg on sourdough.', time: 10, diff: 'Easy', user: users[1], moods: [quick, healthy, light], cuisine: mexican, diets: [vegetarian, dairyFree, nut_free] },
    { title: 'Vegetable Curry', description: 'Aromatic Indian vegetable curry with coconut milk and curry powder.', time: 35, diff: 'Medium', user: users[8], moods: [healthy, comfort], cuisine: indian, diets: [vegan, vegetarian, dairyFree, glutenFree, halal] },
    { title: 'Garlic Butter Shrimp Pasta', description: 'Linguine tossed in garlic butter with jumbo shrimp and parsley.', time: 25, diff: 'Medium', user: users[0], moods: [comfort, festive], cuisine: italian, diets: [nut_free, halal] },
    { title: 'Keto Egg Bowl', description: 'Low-carb breakfast bowl with fried eggs, avocado and cheddar cheese.', time: 15, diff: 'Easy', user: users[7], moods: [quick, healthy], cuisine: french, diets: [vegetarian, keto, lowCarb, glutenFree, nut_free] },
    { title: 'Honey Garlic Chicken', description: 'Pan-seared chicken thighs glazed in a sticky honey-garlic sauce.', time: 35, diff: 'Medium', user: users[5], moods: [comfort, quick], cuisine: japanese, diets: [dairyFree, nut_free, halal] },
    { title: 'French Onion Soup', description: 'Classic caramelized onion soup topped with melted Gruyère and a crouton.', time: 70, diff: 'Medium', user: users[9], moods: [comfort, festive], cuisine: french, diets: [vegetarian, nut_free] },
    { title: 'Mango Coconut Curry', description: 'Tropical Thai-inspired curry with sweet mango and coconut milk.', time: 40, diff: 'Medium', user: users[2], moods: [adventurous, light], cuisine: indian, diets: [vegan, vegetarian, dairyFree, glutenFree, nut_free, halal] },
    { title: 'Sushi Hand Rolls', description: 'Simple temaki hand rolls with salmon, avocado and sushi rice.', time: 30, diff: 'Medium', user: users[3], moods: [festive, adventurous], cuisine: japanese, diets: [dairyFree, glutenFree, nut_free, halal] },
    { title: 'Lemon Herb Roasted Chicken', description: 'Whole roasted chicken infused with lemon and fresh herbs.', time: 90, diff: 'Easy', user: users[5], moods: [comfort, festive], cuisine: french, diets: [glutenFree, dairyFree, nut_free, lowCarb, keto, halal] },
  ]

  const recipeImages = [
    'https://www.southernliving.com/thmb/QvacOweW0h5jwaq9PHVNF9T9SAQ%3D/1500x0/filters%3Ano_upscale%28%29%3Amax_bytes%28150000%29%3Astrip_icc%28%29/27901_SUPT_TomBasil_Tomato-Basil-Pasta_100-b0d8a3b38cdb414ba6fc4c49e407caca.jpg',
    'https://www.recipetineats.com/tachyon/2018/04/Chicken-Tikka-Masala_0-SQ.jpg',
    'https://images.squarespace-cdn.com/content/v1/5ed666a6924cd0017d343b01/1593466332546-0FAWQJ5DT3ZMVIRO9H38/bite-me-more-apple-teriyaki-salmon-rice-bowl-recipe.jpg',
    'https://culinarybackstreets.s3.us-east-2.amazonaws.com/culinarybackstreets/uploads/CB_CDMX_Pastor_AR_top.jpg',
    'https://d2vbr83hnyiux1.cloudfront.net/image/975050285728/image_atp7qrie9p53l3b07mc9sg3q76/-FWEBP',
    'https://images.squarespace-cdn.com/content/v1/543dc236e4b0fffb45747ede/1468362338384-44ZLQXQ82J3DTRBY2TMU/image-asset.jpeg',
    'https://i.pinimg.com/736x/12/a7/ec/12a7eca2596695d2185a884f6ca2daed.jpg',
    'https://www.sbfoods-worldwide.com/recipes/eaq25q0000001bar-img/7_ColorfulvegeCurry_recipe.jpg',
    'https://media.hellofresh.com/q_100%2Cw_3840%2Cf_auto%2Cc_limit%2Cfl_lossy/recipes/image/garlic-butter-shrimp-scampi-9604b5c4.jpg',
    'https://ucarecdn.com/a562b1ce-47bc-42b8-8a0c-c05bee7bf7e4/',
    'https://del.h-cdn.co/assets/16/19/1600x1200/sd-aspect-1463087916-delish-sticky-honey-garlic-chicken.jpg',
    'https://www.onceuponachef.com/images/2019/02/french-onion-soup-1.jpg',
    'https://img.taste.com.au/K6hHHVrQ/taste/2024/12/healthy-chicken-breast-coconut-mango-curry-4-205852-1.jpg',
    'https://www.extraingredient.com/uploads/image-recipe-temaki-sushi-handrolls.jpg',
    'https://www.foodandwine.com/thmb/t9YqzGbmH-huAbV6xitCQs0-G4s%3D/1500x0/filters%3Ano_upscale%28%29%3Amax_bytes%28150000%29%3Astrip_icc%28%29/FAW-recipes-herb-and-lemon-roasted-chicken-hero-c4ba0aec56884683be482c47b1e1df11.jpg',
  ]

  const recipes = []
  for (let i = 0; i < recipeData.length; i++) {
    const r = recipeData[i]
    const recipe = await prisma.recipe.create({
      data: {
        title: r.title, description: r.description,
        estimated_time: r.time, difficulty_level: r.diff,
        user_id: r.user.user_id, is_public: true,
        cuisine_id: r.cuisine.cuisine_id,
      }
    })
    // Add moods
    await prisma.fITS.createMany({
      data: r.moods.map(m => ({ recipe_id: recipe.recipe_id, mood_id: m.mood_id }))
    })
    // Add Diets
    await prisma.fITS_DIET.createMany({
      data: r.diets.map(d => ({ recipe_id: recipe.recipe_id, restriction_id: d.restriction_id }))
    })
    // Add steps (3 per recipe)
    await prisma.recipe_Step.createMany({ data: [
      { recipe_id: recipe.recipe_id, step_number: 1, instruction: `Prepare all ingredients for ${r.title}. Chop, dice, and measure everything needed.` },
      { recipe_id: recipe.recipe_id, step_number: 2, instruction: `Cook the main components following the recipe technique. Apply heat appropriately.` },
      { recipe_id: recipe.recipe_id, step_number: 3, instruction: `Plate beautifully and season to taste. Serve immediately and enjoy!` },
    ]})
    // Add recipe image
    await prisma.recipe_Image.create({
      data: { recipe_id: recipe.recipe_id, image_order: 1, is_primary: true,
        image_url: recipeImages[i] }
    })
    recipes.push(recipe)
  }
  console.log(`✓ Created ${recipes.length} recipes with steps, images, moods`)

  // ── Recipe Ingredients (USES) ────────────────────────────────────────────────
  await prisma.uSES.createMany({ data: [
    // Pasta
    { recipe_id: recipes[0].recipe_id, ingredient_id: dryPasta.ingredient_id, quantity: 200, unit: 'g' },
    { recipe_id: recipes[0].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 3, unit: 'whole' },
    { recipe_id: recipes[0].recipe_id, ingredient_id: basil.ingredient_id, quantity: 10, unit: 'leaves' },
    { recipe_id: recipes[0].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 2, unit: 'cloves' },
    // Tikka Masala
    { recipe_id: recipes[1].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 500, unit: 'g' },
    { recipe_id: recipes[1].recipe_id, ingredient_id: coconutMilk.ingredient_id, quantity: 400, unit: 'ml' },
    { recipe_id: recipes[1].recipe_id, ingredient_id: curry.ingredient_id, quantity: 2, unit: 'tbsp' },
    { recipe_id: recipes[1].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 4, unit: 'cloves' },
    // Salmon Bowl
    { recipe_id: recipes[2].recipe_id, ingredient_id: salmon.ingredient_id, quantity: 300, unit: 'g' },
    { recipe_id: recipes[2].recipe_id, ingredient_id: rice.ingredient_id, quantity: 200, unit: 'g' },
    { recipe_id: recipes[2].recipe_id, ingredient_id: soySauce.ingredient_id, quantity: 3, unit: 'tbsp' },
    // Tacos
    { recipe_id: recipes[3].recipe_id, ingredient_id: tortilla.ingredient_id, quantity: 8, unit: 'pieces' },
    { recipe_id: recipes[3].recipe_id, ingredient_id: avocado.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[3].recipe_id, ingredient_id: lime.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[3].recipe_id, ingredient_id: onion.ingredient_id, quantity: 1, unit: 'whole' },
    // Croissants
    { recipe_id: recipes[4].recipe_id, ingredient_id: flour.ingredient_id, quantity: 500, unit: 'g' },
    { recipe_id: recipes[4].recipe_id, ingredient_id: butter.ingredient_id, quantity: 250, unit: 'g' },
    { recipe_id: recipes[4].recipe_id, ingredient_id: egg.ingredient_id, quantity: 2, unit: 'whole' },
    // Avocado Toast
    { recipe_id: recipes[6].recipe_id, ingredient_id: avocado.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[6].recipe_id, ingredient_id: egg.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[6].recipe_id, ingredient_id: lime.ingredient_id, quantity: 0.5, unit: 'whole' },
    // Keto Bowl
    { recipe_id: recipes[9].recipe_id, ingredient_id: egg.ingredient_id, quantity: 3, unit: 'whole' },
    { recipe_id: recipes[9].recipe_id, ingredient_id: avocado.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[9].recipe_id, ingredient_id: cheddar.ingredient_id, quantity: 50, unit: 'g' },
    // Honey Chicken
    { recipe_id: recipes[10].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 500, unit: 'g' },
    { recipe_id: recipes[10].recipe_id, ingredient_id: honey.ingredient_id, quantity: 3, unit: 'tbsp' },
    { recipe_id: recipes[10].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 3, unit: 'cloves' },
    { recipe_id: recipes[10].recipe_id, ingredient_id: soySauce.ingredient_id, quantity: 2, unit: 'tbsp' },
  ]})
  console.log('✓ Created ingredient uses')

  // ── Boards ───────────────────────────────────────────────────────────────────
  const boards = await Promise.all([
    prisma.board.create({ data: { board_name: 'Weekend Dinners', visibility: 'public', user_id: users[0].user_id } }),
    prisma.board.create({ data: { board_name: 'Quick Lunches', visibility: 'public', user_id: users[1].user_id } }),
    prisma.board.create({ data: { board_name: 'Meal Prep Sundays', visibility: 'private', user_id: users[2].user_id } }),
    prisma.board.create({ data: { board_name: 'Date Night Recipes', visibility: 'public', user_id: users[4].user_id } }),
    prisma.board.create({ data: { board_name: 'Healthy Eats', visibility: 'public', user_id: users[7].user_id } }),
  ])
  console.log('✓ Created boards')

  // ── Saves (junction) ─────────────────────────────────────────────────────────
  await prisma.sAVES.createMany({ data: [
    { board_id: boards[0].board_id, recipe_id: recipes[0].recipe_id },
    { board_id: boards[0].board_id, recipe_id: recipes[8].recipe_id },
    { board_id: boards[0].board_id, recipe_id: recipes[11].recipe_id },
    { board_id: boards[1].board_id, recipe_id: recipes[2].recipe_id },
    { board_id: boards[1].board_id, recipe_id: recipes[6].recipe_id },
    { board_id: boards[2].board_id, recipe_id: recipes[1].recipe_id },
    { board_id: boards[2].board_id, recipe_id: recipes[7].recipe_id },
    { board_id: boards[3].board_id, recipe_id: recipes[4].recipe_id },
    { board_id: boards[3].board_id, recipe_id: recipes[12].recipe_id },
    { board_id: boards[4].board_id, recipe_id: recipes[9].recipe_id },
    { board_id: boards[4].board_id, recipe_id: recipes[2].recipe_id },
  ]})
  console.log('✓ Created board saves')

  // ── Cooking Logs ─────────────────────────────────────────────────────────────
  await prisma.cooking_Log.createMany({ data: [
    { user_id: users[0].user_id, recipe_id: recipes[0].recipe_id },
    { user_id: users[0].user_id, recipe_id: recipes[8].recipe_id },
    { user_id: users[1].user_id, recipe_id: recipes[6].recipe_id },
    { user_id: users[2].user_id, recipe_id: recipes[1].recipe_id },
    { user_id: users[3].user_id, recipe_id: recipes[2].recipe_id },
    { user_id: users[3].user_id, recipe_id: recipes[5].recipe_id },
    { user_id: users[4].user_id, recipe_id: recipes[4].recipe_id },
    { user_id: users[5].user_id, recipe_id: recipes[10].recipe_id },
    { user_id: users[7].user_id, recipe_id: recipes[9].recipe_id },
    { user_id: users[8].user_id, recipe_id: recipes[7].recipe_id },
  ]})
  console.log('✓ Created cooking logs')

  // ── View Logs ────────────────────────────────────────────────────────────────
  const viewData = []
  for (let i = 0; i < users.length; i++) {
    // Each user views 5 random recipes
    for (let j = 0; j < 5; j++) {
      viewData.push({ user_id: users[i].user_id, recipe_id: recipes[(i + j) % recipes.length].recipe_id })
    }
  }
  await prisma.recipe_View_Log.createMany({ data: viewData })
  console.log(`✓ Created ${viewData.length} view logs`)

  console.log('\n✅ FlavorForge database seeded successfully!')
  console.log(`   • ${users.length} users`)
  console.log(`   • 15 recipes`)
  console.log(`   • 20 ingredients with substitutes`)
  console.log(`   • 5 cuisines, 8 dietary restrictions, 6 moods`)
  console.log(`   • Boards, saves, cooking logs, and view logs populated`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
