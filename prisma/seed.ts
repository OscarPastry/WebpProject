
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

  // ── Ingredients (100) ────────────────────────────────────────────────────────
  const [
    tomato, basil, dryPasta, gfPasta, chicken, rice, garlic, onion,
    coconutMilk, curry, salmon, soySauce, tortilla, avocado, lime,
    cheddar, egg, butter, flour, honey,
    oliveOil, parmesan, mozzarella, oregano, chiliFlakes,
    shrimp, lemon, parsley, whiteWine, cream,
    ginger, turmeric, cumin, coriander, garamMasala,
    tofu, spinach, bellPepper, sweetPotato, quinoa,
    blackBeans, cilantro, jalapeno, cuminSeeds, sourCream,
    miso, nori, sesameOil, mirin, dashi,
    beef, thyme, rosemary, mustard, gruyere,
    lamb, mint, yogurt, saffron, cardamom,
    // Additional 40 ingredients
    almondMilk, cashews, walnuts, pecans, pineNuts,
    breadcrumbs, panko, cornstarch, bakingPowder, bakingSoda,
    vanillaExtract, cocoaPowder, darkChocolate, brownSugar, mapleSyrup,
    appleCiderVinegar, riceVinegar, balsamicVinegar, fishSauce, oysterSauce,
    sriracha, gochujang, harissa, smokedPaprika, cinnamon,
    nutmeg, cloves, bayLeaves, fennelSeeds, mustardSeeds,
    fenugreek, starAnise, lemongrass, galangal, kaffirLime,
    coconutFlour, almondFlour, tapiocaFlour, chickpeaFlour, nutritionalYeast,
    tempeh, seitan, edamame, lentils, kidneyBeans,
    zucchini, eggplant, cauliflower, broccoli, mushrooms,
    cherryTomatoes, sunDriedTomatoes, artichoke, capers, olives,
    anchovies, tuna, cod, scallops, crab,
    porkBelly, chorizo, prosciutto, bacon, sausage,
    feta, goatCheese, ricotta, mascarpone, creamCheese,
    coconutOil, ghee, lard, peanutOil, vegetableOil
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
    prisma.ingredient.create({ data: { ingredient_name: 'Olive Oil', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Parmesan', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Mozzarella', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Oregano', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Chili Flakes', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Shrimp', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Lemon', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Parsley', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'White Wine', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Heavy Cream', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Ginger', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Turmeric', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cumin', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Coriander', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Garam Masala', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Tofu', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Spinach', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Bell Pepper', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Sweet Potato', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Quinoa', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Black Beans', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cilantro', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Jalapeno', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cumin Seeds', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Sour Cream', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Miso Paste', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Nori Sheets', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Sesame Oil', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Mirin', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Dashi Stock', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Beef Sirloin', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Thyme', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Rosemary', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Dijon Mustard', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Gruyere Cheese', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Lamb Shoulder', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Fresh Mint', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Greek Yogurt', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Saffron', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cardamom', availability_tag: 'Low' } }),
    // Additional 40
    prisma.ingredient.create({ data: { ingredient_name: 'Almond Milk', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cashews', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Walnuts', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Pecans', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Pine Nuts', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Breadcrumbs', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Panko', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cornstarch', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Baking Powder', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Baking Soda', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Vanilla Extract', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cocoa Powder', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Dark Chocolate', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Brown Sugar', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Maple Syrup', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Apple Cider Vinegar', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Rice Vinegar', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Balsamic Vinegar', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Fish Sauce', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Oyster Sauce', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Sriracha', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Gochujang', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Harissa', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Smoked Paprika', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cinnamon', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Nutmeg', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cloves', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Bay Leaves', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Fennel Seeds', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Mustard Seeds', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Fenugreek', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Star Anise', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Lemongrass', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Galangal', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Kaffir Lime Leaves', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Coconut Flour', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Almond Flour', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Tapioca Flour', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Chickpea Flour', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Nutritional Yeast', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Tempeh', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Seitan', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Edamame', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Lentils', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Kidney Beans', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Zucchini', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Eggplant', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cauliflower', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Broccoli', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Mushrooms', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cherry Tomatoes', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Sun-Dried Tomatoes', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Artichoke Hearts', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Capers', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Kalamata Olives', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Anchovies', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Tuna', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cod Fillet', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Scallops', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Crab Meat', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Pork Belly', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Chorizo', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Prosciutto', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Bacon', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Italian Sausage', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Feta Cheese', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Goat Cheese', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Ricotta', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Mascarpone', availability_tag: 'Low' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Cream Cheese', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Coconut Oil', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Ghee', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Lard', availability_tag: 'Medium' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Peanut Oil', availability_tag: 'High' } }),
    prisma.ingredient.create({ data: { ingredient_name: 'Vegetable Oil', availability_tag: 'High' } }),
  ])
  console.log('✓ Created 100 ingredients')

  // ── Ingredient Substitutes (30+) ─────────────────────────────────────────────
  await Promise.all([
    // Pasta & Grain substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: dryPasta.ingredient_id,
      substitute_ingredient_id: gfPasta.ingredient_id,
      reason: 'Gluten intolerance', confidence_score: 0.95,
      explanation: 'GF pasta is a 1:1 substitute for boiled pasta dishes. Texture may vary slightly.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: rice.ingredient_id,
      substitute_ingredient_id: quinoa.ingredient_id,
      reason: 'Healthier grain alternative', confidence_score: 0.85,
      explanation: 'Quinoa provides more protein and a nuttier flavor while maintaining similar texture.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: rice.ingredient_id,
      substitute_ingredient_id: cauliflower.ingredient_id,
      reason: 'Low-carb alternative', confidence_score: 0.70,
      explanation: 'Riced cauliflower mimics the texture of rice with significantly fewer carbs.'
    }}),
    // Flour substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: flour.ingredient_id,
      substitute_ingredient_id: almondFlour.ingredient_id,
      reason: 'Gluten-free baking', confidence_score: 0.75,
      explanation: 'Almond flour works well in most baking at a 1:1 ratio. Adds nutty flavor and moisture.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: flour.ingredient_id,
      substitute_ingredient_id: coconutFlour.ingredient_id,
      reason: 'Gluten-free baking', confidence_score: 0.60,
      explanation: 'Use 1/4 cup coconut flour per 1 cup regular flour. Add extra liquid to compensate.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: flour.ingredient_id,
      substitute_ingredient_id: chickpeaFlour.ingredient_id,
      reason: 'High-protein alternative', confidence_score: 0.65,
      explanation: 'Chickpea flour works well for savory dishes and batters. Adds protein and earthy flavor.'
    }}),
    // Dairy substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: butter.ingredient_id,
      substitute_ingredient_id: coconutOil.ingredient_id,
      reason: 'Dairy-free alternative', confidence_score: 0.85,
      explanation: 'Coconut oil can replace butter 1:1 in most baking. Adds subtle coconut flavor.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: butter.ingredient_id,
      substitute_ingredient_id: ghee.ingredient_id,
      reason: 'Lactose-free alternative', confidence_score: 0.95,
      explanation: 'Ghee is clarified butter with milk solids removed. Use 1:1 in all recipes.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: cream.ingredient_id,
      substitute_ingredient_id: coconutMilk.ingredient_id,
      reason: 'Dairy-free cream alternative', confidence_score: 0.80,
      explanation: 'Full-fat coconut milk works well in curries and soups as a cream substitute.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: cream.ingredient_id,
      substitute_ingredient_id: cashews.ingredient_id,
      reason: 'Vegan cream alternative', confidence_score: 0.75,
      explanation: 'Soaked and blended cashews create a rich, creamy base for sauces and soups.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: sourCream.ingredient_id,
      substitute_ingredient_id: yogurt.ingredient_id,
      reason: 'Healthier alternative', confidence_score: 0.90,
      explanation: 'Greek yogurt is a tangy, protein-rich substitute for sour cream in most recipes.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: parmesan.ingredient_id,
      substitute_ingredient_id: nutritionalYeast.ingredient_id,
      reason: 'Vegan cheese alternative', confidence_score: 0.70,
      explanation: 'Nutritional yeast provides a similar umami, cheesy flavor. Use 2:1 ratio.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: mozzarella.ingredient_id,
      substitute_ingredient_id: feta.ingredient_id,
      reason: 'Different cheese profile', confidence_score: 0.60,
      explanation: 'Feta provides a tangier, saltier alternative. Works well in salads and baked dishes.'
    }}),
    // Milk substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: cream.ingredient_id,
      substitute_ingredient_id: almondMilk.ingredient_id,
      reason: 'Lower-fat alternative', confidence_score: 0.55,
      explanation: 'Almond milk is thinner but works in soups and sauces. Add cornstarch to thicken.'
    }}),
    // Protein substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: chicken.ingredient_id,
      substitute_ingredient_id: tofu.ingredient_id,
      reason: 'Plant-based protein', confidence_score: 0.75,
      explanation: 'Extra-firm tofu pressed and marinated can replace chicken in stir-fries and curries.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: chicken.ingredient_id,
      substitute_ingredient_id: tempeh.ingredient_id,
      reason: 'Plant-based protein', confidence_score: 0.70,
      explanation: 'Tempeh has a firmer, nuttier texture than tofu. Great in grilled and baked dishes.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: beef.ingredient_id,
      substitute_ingredient_id: lamb.ingredient_id,
      reason: 'Alternative red meat', confidence_score: 0.70,
      explanation: 'Lamb provides a richer, gamier flavor. Works well in stews and braised dishes.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: beef.ingredient_id,
      substitute_ingredient_id: mushrooms.ingredient_id,
      reason: 'Plant-based umami', confidence_score: 0.60,
      explanation: 'Portobello or shiitake mushrooms provide meaty texture and umami in sauces and stews.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: shrimp.ingredient_id,
      substitute_ingredient_id: tofu.ingredient_id,
      reason: 'Plant-based seafood alternative', confidence_score: 0.55,
      explanation: 'Firm tofu cut into strips mimics shrimp texture in stir-fries. Add nori for ocean flavor.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: salmon.ingredient_id,
      substitute_ingredient_id: tuna.ingredient_id,
      reason: 'Alternative fish', confidence_score: 0.65,
      explanation: 'Tuna is a leaner alternative. Adjust cooking time as tuna cooks faster.'
    }}),
    // Egg substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: egg.ingredient_id,
      substitute_ingredient_id: cornstarch.ingredient_id,
      reason: 'Binding alternative', confidence_score: 0.65,
      explanation: '2 tbsp cornstarch + 2 tbsp water = 1 egg. Works well as a binder in baking.'
    }}),
    // Fat & Oil substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: oliveOil.ingredient_id,
      substitute_ingredient_id: vegetableOil.ingredient_id,
      reason: 'Neutral oil alternative', confidence_score: 0.85,
      explanation: 'Vegetable oil is more neutral in flavor. Use 1:1 in cooking and baking.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: sesameOil.ingredient_id,
      substitute_ingredient_id: peanutOil.ingredient_id,
      reason: 'Asian cooking oil', confidence_score: 0.60,
      explanation: 'Peanut oil works for high-heat cooking but lacks the distinctive sesame flavor.'
    }}),
    // Acid substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: lime.ingredient_id,
      substitute_ingredient_id: lemon.ingredient_id,
      reason: 'Citrus alternative', confidence_score: 0.90,
      explanation: 'Lemon juice can replace lime juice 1:1. Slightly less tart and more floral.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: appleCiderVinegar.ingredient_id,
      substitute_ingredient_id: balsamicVinegar.ingredient_id,
      reason: 'Flavor profile shift', confidence_score: 0.65,
      explanation: 'Balsamic is sweeter and darker. Works in dressings but changes color profile.'
    }}),
    // Sweetener substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: honey.ingredient_id,
      substitute_ingredient_id: mapleSyrup.ingredient_id,
      reason: 'Vegan sweetener', confidence_score: 0.85,
      explanation: 'Maple syrup is a 1:1 substitute for honey. Slightly thinner consistency.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: brownSugar.ingredient_id,
      substitute_ingredient_id: honey.ingredient_id,
      reason: 'Natural sweetener', confidence_score: 0.75,
      explanation: 'Use 3/4 cup honey per 1 cup brown sugar. Reduce other liquids by 1/4 cup.'
    }}),
    // Herb & Spice substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: basil.ingredient_id,
      substitute_ingredient_id: oregano.ingredient_id,
      reason: 'Italian herb alternative', confidence_score: 0.60,
      explanation: 'Oregano is more pungent. Use half the amount of oregano compared to basil.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: chiliFlakes.ingredient_id,
      substitute_ingredient_id: sriracha.ingredient_id,
      reason: 'Heat alternative', confidence_score: 0.70,
      explanation: 'Sriracha adds heat plus garlic flavor. Use 1 tsp sriracha per 1/4 tsp chili flakes.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: smokedPaprika.ingredient_id,
      substitute_ingredient_id: chiliFlakes.ingredient_id,
      reason: 'Heat substitute', confidence_score: 0.55,
      explanation: 'Chili flakes provide heat but lack the smoky depth. Add a pinch of cumin for smokiness.'
    }}),
    // Bean & Legume substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: blackBeans.ingredient_id,
      substitute_ingredient_id: kidneyBeans.ingredient_id,
      reason: 'Bean alternative', confidence_score: 0.85,
      explanation: 'Kidney beans are slightly larger and firmer. Work well in the same dishes 1:1.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: blackBeans.ingredient_id,
      substitute_ingredient_id: lentils.ingredient_id,
      reason: 'Legume alternative', confidence_score: 0.70,
      explanation: 'Lentils cook faster and have a softer texture. Great in soups and stews.'
    }}),
    // Vegetable substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: spinach.ingredient_id,
      substitute_ingredient_id: broccoli.ingredient_id,
      reason: 'Green vegetable alternative', confidence_score: 0.60,
      explanation: 'Broccoli provides a firmer texture and stronger flavor. Adjust cooking time.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: bellPepper.ingredient_id,
      substitute_ingredient_id: zucchini.ingredient_id,
      reason: 'Vegetable alternative', confidence_score: 0.65,
      explanation: 'Zucchini has a milder flavor and softer texture. Cook briefly to avoid mushiness.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: tomato.ingredient_id,
      substitute_ingredient_id: cherryTomatoes.ingredient_id,
      reason: 'Tomato variety', confidence_score: 0.90,
      explanation: 'Cherry tomatoes are sweeter. Use 1.5x the amount of cherry tomatoes for regular tomatoes.'
    }}),
    // Nut substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: pineNuts.ingredient_id,
      substitute_ingredient_id: walnuts.ingredient_id,
      reason: 'Budget-friendly alternative', confidence_score: 0.70,
      explanation: 'Walnuts are more affordable and provide similar richness in pesto and salads.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: cashews.ingredient_id,
      substitute_ingredient_id: pecans.ingredient_id,
      reason: 'Nut alternative', confidence_score: 0.65,
      explanation: 'Pecans are softer and sweeter. Work well in baking and as toppings.'
    }}),
    // Asian sauce substitutes
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: fishSauce.ingredient_id,
      substitute_ingredient_id: soySauce.ingredient_id,
      reason: 'Umami alternative', confidence_score: 0.65,
      explanation: 'Soy sauce provides umami but lacks the fishy depth. Add a pinch of sugar.'
    }}),
    prisma.sUBSTITUTES.create({ data: {
      original_ingredient_id: mirin.ingredient_id,
      substitute_ingredient_id: riceVinegar.ingredient_id,
      reason: 'Japanese seasoning', confidence_score: 0.60,
      explanation: 'Rice vinegar + sugar mimics mirin. Use 1 tbsp vinegar + 1/2 tsp sugar per 1 tbsp mirin.'
    }}),
  ])
  console.log('✓ Created 40 ingredient substitutes')

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

  // ── Recipes (65 total: 15 original + 50 new) ────────────────────────────────
  const recipeData = [
    // Original 15
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
    // 50 NEW RECIPES
    // Italian (10)
    { title: 'Margherita Pizza', description: 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella and basil.', time: 30, diff: 'Medium', user: users[0], moods: [comfort, festive], cuisine: italian, diets: [vegetarian, nut_free] },
    { title: 'Carbonara', description: 'Authentic Roman pasta with eggs, pecorino, guanciale and black pepper.', time: 25, diff: 'Medium', user: users[0], moods: [comfort, quick], cuisine: italian, diets: [nut_free] },
    { title: 'Risotto alla Milanese', description: 'Creamy saffron-infused risotto, a Milanese classic.', time: 40, diff: 'Medium', user: users[9], moods: [comfort, festive], cuisine: italian, diets: [glutenFree, vegetarian, nut_free] },
    { title: 'Penne Arrabbiata', description: 'Spicy tomato sauce with garlic and chili flakes over penne.', time: 20, diff: 'Easy', user: users[0], moods: [quick, adventurous], cuisine: italian, diets: [vegan, vegetarian, dairyFree, nut_free] },
    { title: 'Lasagna Bolognese', description: 'Layers of pasta, rich meat ragù, béchamel and parmesan.', time: 120, diff: 'Hard', user: users[0], moods: [comfort, festive], cuisine: italian, diets: [nut_free] },
    { title: 'Bruschetta', description: 'Toasted bread topped with fresh tomatoes, garlic, basil and olive oil.', time: 15, diff: 'Easy', user: users[0], moods: [quick, light], cuisine: italian, diets: [vegan, vegetarian, dairyFree, nut_free] },
    { title: 'Pesto Genovese', description: 'Fresh basil pesto with pine nuts, garlic, parmesan and olive oil.', time: 15, diff: 'Easy', user: users[0], moods: [quick, healthy], cuisine: italian, diets: [vegetarian, nut_free] },
    { title: 'Osso Buco', description: 'Braised veal shanks in a rich vegetable and wine sauce.', time: 150, diff: 'Hard', user: users[9], moods: [festive, comfort], cuisine: italian, diets: [glutenFree, dairyFree, nut_free] },
    { title: 'Caprese Salad', description: 'Fresh mozzarella, ripe tomatoes and basil drizzled with olive oil.', time: 10, diff: 'Easy', user: users[1], moods: [light, healthy], cuisine: italian, diets: [vegetarian, glutenFree, keto, lowCarb, nut_free] },
    { title: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone.', time: 45, diff: 'Medium', user: users[4], moods: [festive, comfort], cuisine: italian, diets: [vegetarian, nut_free] },
    // Indian (10)
    { title: 'Butter Chicken', description: 'Tender chicken in a velvety tomato-butter sauce with aromatic spices.', time: 50, diff: 'Medium', user: users[2], moods: [comfort, festive], cuisine: indian, diets: [glutenFree, nut_free] },
    { title: 'Palak Paneer', description: 'Creamy spinach curry with homemade paneer cheese cubes.', time: 40, diff: 'Medium', user: users[2], moods: [healthy, comfort], cuisine: indian, diets: [vegetarian, glutenFree, nut_free] },
    { title: 'Biryani', description: 'Fragrant basmati rice layered with spiced meat and saffron.', time: 90, diff: 'Hard', user: users[8], moods: [festive, adventurous], cuisine: indian, diets: [halal, glutenFree, dairyFree] },
    { title: 'Chana Masala', description: 'Spicy chickpea curry with tomatoes, ginger and warming spices.', time: 35, diff: 'Easy', user: users[1], moods: [quick, healthy], cuisine: indian, diets: [vegan, vegetarian, dairyFree, glutenFree, nut_free, halal] },
    { title: 'Tandoori Chicken', description: 'Yogurt-marinated chicken roasted with bold tandoori spices.', time: 60, diff: 'Medium', user: users[5], moods: [festive, adventurous], cuisine: indian, diets: [glutenFree, lowCarb, keto, halal] },
    { title: 'Dal Tadka', description: 'Yellow lentils tempered with cumin, garlic and ghee.', time: 30, diff: 'Easy', user: users[8], moods: [comfort, quick], cuisine: indian, diets: [vegan, vegetarian, glutenFree, dairyFree, nut_free, halal] },
    { title: 'Samosas', description: 'Crispy pastry pockets filled with spiced potatoes and peas.', time: 60, diff: 'Medium', user: users[2], moods: [festive, adventurous], cuisine: indian, diets: [vegan, vegetarian, dairyFree, nut_free] },
    { title: 'Naan Bread', description: 'Soft, pillowy Indian flatbread baked until golden.', time: 30, diff: 'Medium', user: users[4], moods: [comfort], cuisine: indian, diets: [vegetarian, nut_free] },
    { title: 'Lamb Rogan Josh', description: 'Slow-cooked lamb in a rich Kashmiri spice gravy.', time: 120, diff: 'Hard', user: users[8], moods: [festive, comfort], cuisine: indian, diets: [glutenFree, dairyFree, nut_free, halal] },
    { title: 'Aloo Gobi', description: 'Dry curry of potatoes and cauliflower with turmeric and cumin.', time: 30, diff: 'Easy', user: users[1], moods: [healthy, quick], cuisine: indian, diets: [vegan, vegetarian, dairyFree, glutenFree, nut_free, halal, lowCarb, keto] },
    // Japanese (10)
    { title: 'Chicken Katsu Curry', description: 'Crispy breaded chicken cutlet served with Japanese curry sauce.', time: 45, diff: 'Medium', user: users[3], moods: [comfort, festive], cuisine: japanese, diets: [dairyFree, nut_free] },
    { title: 'Gyoza', description: 'Pan-fried pork and vegetable dumplings with dipping sauce.', time: 60, diff: 'Medium', user: users[3], moods: [festive, adventurous], cuisine: japanese, diets: [dairyFree] },
    { title: 'Tonkotsu Ramen', description: 'Rich pork bone broth ramen with chashu, egg and nori.', time: 180, diff: 'Hard', user: users[3], moods: [comfort, adventurous], cuisine: japanese, diets: [dairyFree, nut_free] },
    { title: 'Tempura Vegetables', description: 'Light and crispy battered vegetables served with tentsuyu sauce.', time: 30, diff: 'Medium', user: users[3], moods: [light, festive], cuisine: japanese, diets: [vegetarian, dairyFree] },
    { title: 'Okonomiyaki', description: 'Savory Japanese pancake with cabbage, toppings and okonomiyaki sauce.', time: 30, diff: 'Medium', user: users[3], moods: [festive, adventurous], cuisine: japanese, diets: [dairyFree, nut_free] },
    { title: 'Edamame', description: 'Steamed young soybeans sprinkled with sea salt.', time: 10, diff: 'Easy', user: users[1], moods: [quick, healthy, light], cuisine: japanese, diets: [vegan, vegetarian, dairyFree, glutenFree, nut_free, keto, lowCarb, halal] },
    { title: 'Yakitori', description: 'Grilled chicken skewers glazed with sweet-savory tare sauce.', time: 30, diff: 'Easy', user: users[5], moods: [festive, quick], cuisine: japanese, diets: [dairyFree, nut_free, glutenFree] },
    { title: 'Matcha Cheesecake', description: 'Light and fluffy Japanese cotton cheesecake with matcha.', time: 90, diff: 'Hard', user: users[4], moods: [festive, comfort], cuisine: japanese, diets: [vegetarian, nut_free] },
    { title: 'Onigiri', description: 'Japanese rice balls filled with salmon and wrapped in nori.', time: 20, diff: 'Easy', user: users[3], moods: [quick, light], cuisine: japanese, diets: [dairyFree, nut_free] },
    { title: 'Udon Noodle Soup', description: 'Thick wheat noodles in a hot dashi broth with toppings.', time: 30, diff: 'Easy', user: users[3], moods: [comfort, quick], cuisine: japanese, diets: [dairyFree, nut_free] },
    // Mexican (10)
    { title: 'Enchiladas Verdes', description: 'Corn tortillas filled with chicken and topped with tangy green salsa.', time: 50, diff: 'Medium', user: users[6], moods: [comfort, festive], cuisine: mexican, diets: [glutenFree, nut_free] },
    { title: 'Guacamole', description: 'Fresh avocado dip with lime, cilantro, onion and jalapeño.', time: 10, diff: 'Easy', user: users[6], moods: [quick, light], cuisine: mexican, diets: [vegan, vegetarian, dairyFree, glutenFree, nut_free, keto, lowCarb, halal] },
    { title: 'Quesadillas', description: 'Grilled tortillas stuffed with melted cheese and your choice of fillings.', time: 15, diff: 'Easy', user: users[6], moods: [quick, comfort], cuisine: mexican, diets: [vegetarian, nut_free] },
    { title: 'Pozole', description: 'Traditional Mexican hominy soup with pork and red chili broth.', time: 120, diff: 'Hard', user: users[6], moods: [festive, comfort], cuisine: mexican, diets: [glutenFree, dairyFree, nut_free] },
    { title: 'Churros', description: 'Crispy fried dough pastry rolled in cinnamon sugar.', time: 30, diff: 'Medium', user: users[4], moods: [festive, comfort], cuisine: mexican, diets: [vegetarian, nut_free] },
    { title: 'Elote (Street Corn)', description: 'Grilled corn on the cob with mayo, cotija cheese and chili powder.', time: 15, diff: 'Easy', user: users[6], moods: [quick, festive], cuisine: mexican, diets: [vegetarian, glutenFree, nut_free] },
    { title: 'Tamales', description: 'Steamed masa dough filled with seasoned meat, wrapped in corn husks.', time: 150, diff: 'Hard', user: users[6], moods: [festive, adventurous], cuisine: mexican, diets: [glutenFree, dairyFree, nut_free] },
    { title: 'Black Bean Tacos', description: 'Seasoned black beans in corn tortillas with fresh toppings.', time: 20, diff: 'Easy', user: users[1], moods: [quick, healthy], cuisine: mexican, diets: [vegan, vegetarian, dairyFree, glutenFree, nut_free, halal] },
    { title: 'Ceviche', description: 'Fresh fish cured in citrus juices with tomatoes, onion and cilantro.', time: 25, diff: 'Medium', user: users[7], moods: [light, healthy], cuisine: mexican, diets: [glutenFree, dairyFree, nut_free, lowCarb, keto] },
    { title: 'Mole Poblano', description: 'Complex chili-chocolate sauce served over chicken.', time: 180, diff: 'Hard', user: users[8], moods: [festive, adventurous], cuisine: mexican, diets: [glutenFree, dairyFree, nut_free] },
    // French (10)
    { title: 'Coq au Vin', description: 'Chicken braised in red wine with mushrooms, bacon and pearl onions.', time: 120, diff: 'Hard', user: users[9], moods: [comfort, festive], cuisine: french, diets: [glutenFree, dairyFree, nut_free] },
    { title: 'Ratatouille', description: 'Provençal stewed vegetables with herbs de Provence.', time: 60, diff: 'Medium', user: users[1], moods: [healthy, light], cuisine: french, diets: [vegan, vegetarian, dairyFree, glutenFree, nut_free, halal] },
    { title: 'Crème Brûlée', description: 'Rich vanilla custard with a caramelized sugar crust.', time: 60, diff: 'Medium', user: users[4], moods: [festive, comfort], cuisine: french, diets: [vegetarian, glutenFree, nut_free] },
    { title: 'Beef Bourguignon', description: 'Slow-braised beef in Burgundy wine with carrots and mushrooms.', time: 180, diff: 'Hard', user: users[9], moods: [comfort, festive], cuisine: french, diets: [glutenFree, dairyFree, nut_free] },
    { title: 'Quiche Lorraine', description: 'Savory tart with bacon, cheese and creamy egg custard.', time: 60, diff: 'Medium', user: users[4], moods: [comfort, festive], cuisine: french, diets: [nut_free] },
    { title: 'Niçoise Salad', description: 'Tuna, green beans, eggs, olives and potatoes with vinaigrette.', time: 25, diff: 'Easy', user: users[7], moods: [healthy, light], cuisine: french, diets: [glutenFree, dairyFree, nut_free] },
    { title: 'Croque Monsieur', description: 'Grilled ham and cheese sandwich with béchamel sauce.', time: 20, diff: 'Easy', user: users[9], moods: [quick, comfort], cuisine: french, diets: [nut_free] },
    { title: 'Bouillabaisse', description: 'Traditional Provençal fish stew with saffron and rouille.', time: 90, diff: 'Hard', user: users[7], moods: [festive, adventurous], cuisine: french, diets: [glutenFree, dairyFree, nut_free] },
    { title: 'Macarons', description: 'Delicate French almond meringue cookies with ganache filling.', time: 120, diff: 'Hard', user: users[4], moods: [festive, adventurous], cuisine: french, diets: [glutenFree, vegetarian, nut_free] },
    { title: 'Soupe à l\'Oignon Gratinée', description: 'Deeply flavored onion soup with toasted bread and melted cheese.', time: 75, diff: 'Medium', user: users[9], moods: [comfort, festive], cuisine: french, diets: [vegetarian, nut_free] },
  ]

  const recipeImages = [
    // Original 15
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
    // 50 NEW - Italian (10)
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
    'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    'https://safrescobaldistatic.blob.core.windows.net/media/2022/11/RISOTTO-ALLA-MILANESE.jpg',
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800',
    'https://assets.bonappetit.com/photos/656f48d75b552734225041ba/4%3A3/w_4172%2Ch_3129%2Cc_limit/20231120-WEB-Lasanga-6422.jpg',
    'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800',
    'https://images.unsplash.com/photo-1599789197514-47270cd526b4?w=800',
    'https://images.unsplash.com/photo-1628268909376-e8c44bb3153f?w=800',
    'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800',
    'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
    // Indian (10)
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800',
    'https://www.recipetineats.com/uploads/2021/02/Indian-Palak-Paneer_4.jpg',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
    'https://www.simplyrecipes.com/thmb/aD9M_iRHKbJ8cV2pn5zjOJBhCkI%3D/1500x0/filters%3Ano_upscale%28%29%3Amax_bytes%28150000%29%3Astrip_icc%28%29/__opt__aboutcom__coeus__resources__content_migration__simply_recipes__uploads__2019__05__Chana-Masala-LEAD-1-4b116e9ae8924d458a2758615a5e05a1.jpg',
    'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
    'https://www.recipetineats.com/uploads/2021/02/Naan_1-1.jpg',
    'https://images.unsplash.com/photo-1545247181-516773cae754?w=800',
    'https://images.unsplash.com/photo-1567337710282-00832b415979?w=800',
    // Japanese (10)
    'https://www.sushijunction.com/cdn/shop/products/Chicken-Curry.jpg?v=1520005585',
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800',
    'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=800',
    'https://www.thespruceeats.com/thmb/2h5LUE8WIiveyBjMzTk2_272XdI%3D/1500x0/filters%3Ano_upscale%28%29%3Amax_bytes%28150000%29%3Astrip_icc%28%29/tempura-batter-recipe-2031529-step-06-dbe3cee5fd0e4dce93eec2e96297cf48.jpg',
    'https://images.unsplash.com/photo-1619860860774-1e2e17343432?w=800',
    'https://www.bhg.com/thmb/UjbEcHMkG_2Ab1EwiFCz5roJmh0%3D/2000x0/filters%3Ano_upscale%28%29%3Astrip_icc%28%29/recipes-how-to-cooking-basics-how-to-cook-edamame-04-67af81d469994e7091e6135de04149ab.jpg',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
    'https://images.getrecipekit.com/20250812152413-matcha-20cheesecake-20recipe.webp?class=16x9',
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=800',
    // Mexican (10)
    'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=800',
    'https://cdn.foodfaithfitness.com/uploads/2024/10/Chunky-Guacamole-Recipe-A_FFF_Chunky-Guacamole_Featured_1.jpg',
    'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800',
    'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?w=800',
    'https://www.recipetineats.com/uploads/2016/08/Churros_9.jpg',
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800',
    'https://img.sndimg.com/food/image/upload/q_92%2Cfl_progressive%2Cw_1200%2Cc_scale/v1/img/recipes/17/00/23/Mq92FgsOQYuAUcSQ7DNG_MEXICAN_TAMALES_V_f.jpg',
    'https://assets.wsimgs.com/wsimgs/ab/images/dp/recipe/202545/0011/img177l.jpg',
    'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=800',
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800',
    // French (10)
    'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800',
    'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=800',
    'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800',
    'https://images.squarespace-cdn.com/content/v1/568e8fe6b204d5cbecd5c77e/1761493929185-D9DBMQJI8BO644QC3HJH/Beef%2BBourguignon-7451.jpg',
    'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800',
    'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800',
    'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
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
    await prisma.fITS.createMany({
      data: r.moods.map(m => ({ recipe_id: recipe.recipe_id, mood_id: m.mood_id }))
    })
    await prisma.fITS_DIET.createMany({
      data: r.diets.map(d => ({ recipe_id: recipe.recipe_id, restriction_id: d.restriction_id }))
    })
    await prisma.recipe_Step.createMany({ data: [
      { recipe_id: recipe.recipe_id, step_number: 1, instruction: `Prepare all ingredients for ${r.title}. Chop, dice, and measure everything needed.` },
      { recipe_id: recipe.recipe_id, step_number: 2, instruction: `Cook the main components following the recipe technique. Apply heat appropriately.` },
      { recipe_id: recipe.recipe_id, step_number: 3, instruction: `Plate beautifully and season to taste. Serve immediately and enjoy!` },
    ]})
    await prisma.recipe_Image.create({
      data: { recipe_id: recipe.recipe_id, image_order: 1, is_primary: true,
        image_url: recipeImages[i] }
    })
    recipes.push(recipe)
  }
  console.log(`✓ Created ${recipes.length} recipes with steps, images, moods`)

  // ── Recipe Ingredients (USES) ────────────────────────────────────────────────
  const ingredientUses = [
    // Original 15 recipes
    { recipe_id: recipes[0].recipe_id, ingredient_id: dryPasta.ingredient_id, quantity: 200, unit: 'g' },
    { recipe_id: recipes[0].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 3, unit: 'whole' },
    { recipe_id: recipes[0].recipe_id, ingredient_id: basil.ingredient_id, quantity: 10, unit: 'leaves' },
    { recipe_id: recipes[0].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 2, unit: 'cloves' },
    { recipe_id: recipes[1].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 500, unit: 'g' },
    { recipe_id: recipes[1].recipe_id, ingredient_id: coconutMilk.ingredient_id, quantity: 400, unit: 'ml' },
    { recipe_id: recipes[1].recipe_id, ingredient_id: curry.ingredient_id, quantity: 2, unit: 'tbsp' },
    { recipe_id: recipes[1].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 4, unit: 'cloves' },
    { recipe_id: recipes[2].recipe_id, ingredient_id: salmon.ingredient_id, quantity: 300, unit: 'g' },
    { recipe_id: recipes[2].recipe_id, ingredient_id: rice.ingredient_id, quantity: 200, unit: 'g' },
    { recipe_id: recipes[2].recipe_id, ingredient_id: soySauce.ingredient_id, quantity: 3, unit: 'tbsp' },
    { recipe_id: recipes[3].recipe_id, ingredient_id: tortilla.ingredient_id, quantity: 8, unit: 'pieces' },
    { recipe_id: recipes[3].recipe_id, ingredient_id: avocado.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[3].recipe_id, ingredient_id: lime.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[3].recipe_id, ingredient_id: onion.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[4].recipe_id, ingredient_id: flour.ingredient_id, quantity: 500, unit: 'g' },
    { recipe_id: recipes[4].recipe_id, ingredient_id: butter.ingredient_id, quantity: 250, unit: 'g' },
    { recipe_id: recipes[4].recipe_id, ingredient_id: egg.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[6].recipe_id, ingredient_id: avocado.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[6].recipe_id, ingredient_id: egg.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[6].recipe_id, ingredient_id: lime.ingredient_id, quantity: 0.5, unit: 'whole' },
    { recipe_id: recipes[9].recipe_id, ingredient_id: egg.ingredient_id, quantity: 3, unit: 'whole' },
    { recipe_id: recipes[9].recipe_id, ingredient_id: avocado.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[9].recipe_id, ingredient_id: cheddar.ingredient_id, quantity: 50, unit: 'g' },
    { recipe_id: recipes[10].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 500, unit: 'g' },
    { recipe_id: recipes[10].recipe_id, ingredient_id: honey.ingredient_id, quantity: 3, unit: 'tbsp' },
    { recipe_id: recipes[10].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 3, unit: 'cloves' },
    { recipe_id: recipes[10].recipe_id, ingredient_id: soySauce.ingredient_id, quantity: 2, unit: 'tbsp' },
    // Margherita Pizza
    { recipe_id: recipes[15].recipe_id, ingredient_id: flour.ingredient_id, quantity: 300, unit: 'g' },
    { recipe_id: recipes[15].recipe_id, ingredient_id: mozzarella.ingredient_id, quantity: 200, unit: 'g' },
    { recipe_id: recipes[15].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 4, unit: 'whole' },
    { recipe_id: recipes[15].recipe_id, ingredient_id: basil.ingredient_id, quantity: 8, unit: 'leaves' },
    { recipe_id: recipes[15].recipe_id, ingredient_id: oliveOil.ingredient_id, quantity: 2, unit: 'tbsp' },
    // Carbonara
    { recipe_id: recipes[16].recipe_id, ingredient_id: dryPasta.ingredient_id, quantity: 400, unit: 'g' },
    { recipe_id: recipes[16].recipe_id, ingredient_id: egg.ingredient_id, quantity: 4, unit: 'whole' },
    { recipe_id: recipes[16].recipe_id, ingredient_id: parmesan.ingredient_id, quantity: 100, unit: 'g' },
    { recipe_id: recipes[16].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 3, unit: 'cloves' },
    // Risotto
    { recipe_id: recipes[17].recipe_id, ingredient_id: rice.ingredient_id, quantity: 300, unit: 'g' },
    { recipe_id: recipes[17].recipe_id, ingredient_id: butter.ingredient_id, quantity: 50, unit: 'g' },
    { recipe_id: recipes[17].recipe_id, ingredient_id: parmesan.ingredient_id, quantity: 80, unit: 'g' },
    { recipe_id: recipes[17].recipe_id, ingredient_id: onion.ingredient_id, quantity: 1, unit: 'whole' },
    // Penne Arrabbiata
    { recipe_id: recipes[18].recipe_id, ingredient_id: dryPasta.ingredient_id, quantity: 350, unit: 'g' },
    { recipe_id: recipes[18].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 5, unit: 'whole' },
    { recipe_id: recipes[18].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 4, unit: 'cloves' },
    { recipe_id: recipes[18].recipe_id, ingredient_id: chiliFlakes.ingredient_id, quantity: 1, unit: 'tsp' },
    // Lasagna
    { recipe_id: recipes[19].recipe_id, ingredient_id: dryPasta.ingredient_id, quantity: 500, unit: 'g' },
    { recipe_id: recipes[19].recipe_id, ingredient_id: mozzarella.ingredient_id, quantity: 300, unit: 'g' },
    { recipe_id: recipes[19].recipe_id, ingredient_id: parmesan.ingredient_id, quantity: 100, unit: 'g' },
    { recipe_id: recipes[19].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 6, unit: 'whole' },
    // Bruschetta
    { recipe_id: recipes[20].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 4, unit: 'whole' },
    { recipe_id: recipes[20].recipe_id, ingredient_id: basil.ingredient_id, quantity: 12, unit: 'leaves' },
    { recipe_id: recipes[20].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 2, unit: 'cloves' },
    { recipe_id: recipes[20].recipe_id, ingredient_id: oliveOil.ingredient_id, quantity: 3, unit: 'tbsp' },
    // Pesto
    { recipe_id: recipes[21].recipe_id, ingredient_id: basil.ingredient_id, quantity: 50, unit: 'leaves' },
    { recipe_id: recipes[21].recipe_id, ingredient_id: parmesan.ingredient_id, quantity: 50, unit: 'g' },
    { recipe_id: recipes[21].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 2, unit: 'cloves' },
    { recipe_id: recipes[21].recipe_id, ingredient_id: oliveOil.ingredient_id, quantity: 100, unit: 'ml' },
    // Caprese
    { recipe_id: recipes[23].recipe_id, ingredient_id: mozzarella.ingredient_id, quantity: 250, unit: 'g' },
    { recipe_id: recipes[23].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 3, unit: 'whole' },
    { recipe_id: recipes[23].recipe_id, ingredient_id: basil.ingredient_id, quantity: 10, unit: 'leaves' },
    { recipe_id: recipes[23].recipe_id, ingredient_id: oliveOil.ingredient_id, quantity: 2, unit: 'tbsp' },
    // Butter Chicken
    { recipe_id: recipes[25].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 600, unit: 'g' },
    { recipe_id: recipes[25].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 4, unit: 'whole' },
    { recipe_id: recipes[25].recipe_id, ingredient_id: butter.ingredient_id, quantity: 50, unit: 'g' },
    { recipe_id: recipes[25].recipe_id, ingredient_id: cream.ingredient_id, quantity: 100, unit: 'ml' },
    // Palak Paneer
    { recipe_id: recipes[26].recipe_id, ingredient_id: spinach.ingredient_id, quantity: 400, unit: 'g' },
    { recipe_id: recipes[26].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 3, unit: 'cloves' },
    { recipe_id: recipes[26].recipe_id, ingredient_id: ginger.ingredient_id, quantity: 1, unit: 'tbsp' },
    { recipe_id: recipes[26].recipe_id, ingredient_id: cumin.ingredient_id, quantity: 1, unit: 'tsp' },
    // Biryani
    { recipe_id: recipes[27].recipe_id, ingredient_id: rice.ingredient_id, quantity: 500, unit: 'g' },
    { recipe_id: recipes[27].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 500, unit: 'g' },
    { recipe_id: recipes[27].recipe_id, ingredient_id: onion.ingredient_id, quantity: 3, unit: 'whole' },
    { recipe_id: recipes[27].recipe_id, ingredient_id: yogurt.ingredient_id, quantity: 200, unit: 'ml' },
    // Chana Masala
    { recipe_id: recipes[28].recipe_id, ingredient_id: onion.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[28].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 3, unit: 'whole' },
    { recipe_id: recipes[28].recipe_id, ingredient_id: cumin.ingredient_id, quantity: 1, unit: 'tsp' },
    { recipe_id: recipes[28].recipe_id, ingredient_id: ginger.ingredient_id, quantity: 1, unit: 'tbsp' },
    // Tandoori Chicken
    { recipe_id: recipes[29].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 800, unit: 'g' },
    { recipe_id: recipes[29].recipe_id, ingredient_id: yogurt.ingredient_id, quantity: 200, unit: 'ml' },
    { recipe_id: recipes[29].recipe_id, ingredient_id: lemon.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[29].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 4, unit: 'cloves' },
    // Dal Tadka
    { recipe_id: recipes[30].recipe_id, ingredient_id: onion.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[30].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 3, unit: 'cloves' },
    { recipe_id: recipes[30].recipe_id, ingredient_id: cuminSeeds.ingredient_id, quantity: 1, unit: 'tsp' },
    { recipe_id: recipes[30].recipe_id, ingredient_id: turmeric.ingredient_id, quantity: 0.5, unit: 'tsp' },
    // Aloo Gobi
    { recipe_id: recipes[33].recipe_id, ingredient_id: onion.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[33].recipe_id, ingredient_id: turmeric.ingredient_id, quantity: 1, unit: 'tsp' },
    { recipe_id: recipes[33].recipe_id, ingredient_id: cumin.ingredient_id, quantity: 1, unit: 'tsp' },
    { recipe_id: recipes[33].recipe_id, ingredient_id: ginger.ingredient_id, quantity: 1, unit: 'tbsp' },
    // Chicken Katsu
    { recipe_id: recipes[34].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 400, unit: 'g' },
    { recipe_id: recipes[34].recipe_id, ingredient_id: rice.ingredient_id, quantity: 200, unit: 'g' },
    { recipe_id: recipes[34].recipe_id, ingredient_id: egg.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[34].recipe_id, ingredient_id: flour.ingredient_id, quantity: 100, unit: 'g' },
    // Gyoza
    { recipe_id: recipes[35].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 300, unit: 'g' },
    { recipe_id: recipes[35].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 3, unit: 'cloves' },
    { recipe_id: recipes[35].recipe_id, ingredient_id: ginger.ingredient_id, quantity: 1, unit: 'tbsp' },
    { recipe_id: recipes[35].recipe_id, ingredient_id: soySauce.ingredient_id, quantity: 2, unit: 'tbsp' },
    // Tonkotsu Ramen
    { recipe_id: recipes[36].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 6, unit: 'cloves' },
    { recipe_id: recipes[36].recipe_id, ingredient_id: ginger.ingredient_id, quantity: 2, unit: 'tbsp' },
    { recipe_id: recipes[36].recipe_id, ingredient_id: soySauce.ingredient_id, quantity: 3, unit: 'tbsp' },
    { recipe_id: recipes[36].recipe_id, ingredient_id: egg.ingredient_id, quantity: 4, unit: 'whole' },
    // Tempura
    { recipe_id: recipes[37].recipe_id, ingredient_id: flour.ingredient_id, quantity: 150, unit: 'g' },
    { recipe_id: recipes[37].recipe_id, ingredient_id: egg.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[37].recipe_id, ingredient_id: sweetPotato.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[37].recipe_id, ingredient_id: bellPepper.ingredient_id, quantity: 2, unit: 'whole' },
    // Yakitori
    { recipe_id: recipes[40].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 500, unit: 'g' },
    { recipe_id: recipes[40].recipe_id, ingredient_id: soySauce.ingredient_id, quantity: 3, unit: 'tbsp' },
    { recipe_id: recipes[40].recipe_id, ingredient_id: ginger.ingredient_id, quantity: 1, unit: 'tbsp' },
    { recipe_id: recipes[40].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 2, unit: 'cloves' },
    // Onigiri
    { recipe_id: recipes[42].recipe_id, ingredient_id: rice.ingredient_id, quantity: 300, unit: 'g' },
    { recipe_id: recipes[42].recipe_id, ingredient_id: salmon.ingredient_id, quantity: 150, unit: 'g' },
    { recipe_id: recipes[42].recipe_id, ingredient_id: nori.ingredient_id, quantity: 4, unit: 'sheets' },
    { recipe_id: recipes[42].recipe_id, ingredient_id: sesameOil.ingredient_id, quantity: 1, unit: 'tsp' },
    // Udon
    { recipe_id: recipes[43].recipe_id, ingredient_id: onion.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[43].recipe_id, ingredient_id: soySauce.ingredient_id, quantity: 2, unit: 'tbsp' },
    { recipe_id: recipes[43].recipe_id, ingredient_id: ginger.ingredient_id, quantity: 1, unit: 'tbsp' },
    { recipe_id: recipes[43].recipe_id, ingredient_id: spinach.ingredient_id, quantity: 100, unit: 'g' },
    // Enchiladas
    { recipe_id: recipes[44].recipe_id, ingredient_id: chicken.ingredient_id, quantity: 400, unit: 'g' },
    { recipe_id: recipes[44].recipe_id, ingredient_id: tortilla.ingredient_id, quantity: 10, unit: 'pieces' },
    { recipe_id: recipes[44].recipe_id, ingredient_id: cheddar.ingredient_id, quantity: 200, unit: 'g' },
    { recipe_id: recipes[44].recipe_id, ingredient_id: sourCream.ingredient_id, quantity: 100, unit: 'ml' },
    // Guacamole
    { recipe_id: recipes[45].recipe_id, ingredient_id: avocado.ingredient_id, quantity: 3, unit: 'whole' },
    { recipe_id: recipes[45].recipe_id, ingredient_id: lime.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[45].recipe_id, ingredient_id: cilantro.ingredient_id, quantity: 3, unit: 'tbsp' },
    { recipe_id: recipes[45].recipe_id, ingredient_id: jalapeno.ingredient_id, quantity: 1, unit: 'whole' },
    // Quesadillas
    { recipe_id: recipes[46].recipe_id, ingredient_id: tortilla.ingredient_id, quantity: 4, unit: 'pieces' },
    { recipe_id: recipes[46].recipe_id, ingredient_id: cheddar.ingredient_id, quantity: 150, unit: 'g' },
    { recipe_id: recipes[46].recipe_id, ingredient_id: bellPepper.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[46].recipe_id, ingredient_id: onion.ingredient_id, quantity: 0.5, unit: 'whole' },
    // Black Bean Tacos
    { recipe_id: recipes[51].recipe_id, ingredient_id: blackBeans.ingredient_id, quantity: 400, unit: 'g' },
    { recipe_id: recipes[51].recipe_id, ingredient_id: tortilla.ingredient_id, quantity: 8, unit: 'pieces' },
    { recipe_id: recipes[51].recipe_id, ingredient_id: avocado.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[51].recipe_id, ingredient_id: cilantro.ingredient_id, quantity: 2, unit: 'tbsp' },
    // Ceviche
    { recipe_id: recipes[52].recipe_id, ingredient_id: lime.ingredient_id, quantity: 6, unit: 'whole' },
    { recipe_id: recipes[52].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[52].recipe_id, ingredient_id: onion.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[52].recipe_id, ingredient_id: cilantro.ingredient_id, quantity: 3, unit: 'tbsp' },
    // Ratatouille
    { recipe_id: recipes[55].recipe_id, ingredient_id: tomato.ingredient_id, quantity: 4, unit: 'whole' },
    { recipe_id: recipes[55].recipe_id, ingredient_id: bellPepper.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[55].recipe_id, ingredient_id: onion.ingredient_id, quantity: 1, unit: 'whole' },
    { recipe_id: recipes[55].recipe_id, ingredient_id: garlic.ingredient_id, quantity: 3, unit: 'cloves' },
    // Crème Brûlée
    { recipe_id: recipes[56].recipe_id, ingredient_id: cream.ingredient_id, quantity: 500, unit: 'ml' },
    { recipe_id: recipes[56].recipe_id, ingredient_id: egg.ingredient_id, quantity: 5, unit: 'whole' },
    { recipe_id: recipes[56].recipe_id, ingredient_id: honey.ingredient_id, quantity: 3, unit: 'tbsp' },
    { recipe_id: recipes[56].recipe_id, ingredient_id: butter.ingredient_id, quantity: 1, unit: 'tbsp' },
    // Niçoise Salad
    { recipe_id: recipes[59].recipe_id, ingredient_id: egg.ingredient_id, quantity: 4, unit: 'whole' },
    { recipe_id: recipes[59].recipe_id, ingredient_id: lemon.ingredient_id, quantity: 2, unit: 'whole' },
    { recipe_id: recipes[59].recipe_id, ingredient_id: oliveOil.ingredient_id, quantity: 3, unit: 'tbsp' },
    { recipe_id: recipes[59].recipe_id, ingredient_id: spinach.ingredient_id, quantity: 100, unit: 'g' },
    // Croque Monsieur
    { recipe_id: recipes[60].recipe_id, ingredient_id: flour.ingredient_id, quantity: 2, unit: 'tbsp' },
    { recipe_id: recipes[60].recipe_id, ingredient_id: butter.ingredient_id, quantity: 3, unit: 'tbsp' },
    { recipe_id: recipes[60].recipe_id, ingredient_id: cream.ingredient_id, quantity: 100, unit: 'ml' },
    { recipe_id: recipes[60].recipe_id, ingredient_id: cheddar.ingredient_id, quantity: 100, unit: 'g' },
    // Quinoa Bowl
    { recipe_id: recipes[7].recipe_id, ingredient_id: quinoa.ingredient_id, quantity: 200, unit: 'g' },
    { recipe_id: recipes[7].recipe_id, ingredient_id: coconutMilk.ingredient_id, quantity: 200, unit: 'ml' },
    { recipe_id: recipes[7].recipe_id, ingredient_id: spinach.ingredient_id, quantity: 100, unit: 'g' },
    { recipe_id: recipes[7].recipe_id, ingredient_id: sweetPotato.ingredient_id, quantity: 2, unit: 'whole' },
  ]

  await prisma.uSES.createMany({ data: ingredientUses })
  console.log(`✓ Created ${ingredientUses.length} ingredient uses`)

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
    { board_id: boards[0].board_id, recipe_id: recipes[15].recipe_id },
    { board_id: boards[1].board_id, recipe_id: recipes[28].recipe_id },
    { board_id: boards[2].board_id, recipe_id: recipes[34].recipe_id },
    { board_id: boards[3].board_id, recipe_id: recipes[44].recipe_id },
    { board_id: boards[4].board_id, recipe_id: recipes[55].recipe_id },
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
    { user_id: users[0].user_id, recipe_id: recipes[16].recipe_id },
    { user_id: users[1].user_id, recipe_id: recipes[28].recipe_id },
    { user_id: users[2].user_id, recipe_id: recipes[25].recipe_id },
    { user_id: users[3].user_id, recipe_id: recipes[36].recipe_id },
    { user_id: users[6].user_id, recipe_id: recipes[45].recipe_id },
  ]})
  console.log('✓ Created cooking logs')

  // ── View Logs ────────────────────────────────────────────────────────────────
  const viewData = []
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < 10; j++) {
      viewData.push({ user_id: users[i].user_id, recipe_id: recipes[(i + j * 7) % recipes.length].recipe_id })
    }
  }
  await prisma.recipe_View_Log.createMany({ data: viewData })
  console.log(`✓ Created ${viewData.length} view logs`)

  console.log('\n✅ FlavorForge database seeded successfully!')
  console.log(`   • ${users.length} users`)
  console.log(`   • ${recipes.length} recipes`)
  console.log(`   • 60 ingredients with substitutes`)
  console.log(`   • 5 cuisines, 8 dietary restrictions, 6 moods`)
  console.log(`   • Boards, saves, cooking logs, and view logs populated`)
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
