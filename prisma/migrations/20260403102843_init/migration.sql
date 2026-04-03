-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "User_Profile" (
    "profile_id" SERIAL NOT NULL,
    "display_name" TEXT,
    "bio" TEXT,
    "profile_image_url" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "User_Profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "User_Onboarding" (
    "onboarding_id" SERIAL NOT NULL,
    "onboarding_version" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "User_Onboarding_pkey" PRIMARY KEY ("onboarding_id")
);

-- CreateTable
CREATE TABLE "User_Taste_Signal" (
    "signal_id" SERIAL NOT NULL,
    "signal_type" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "User_Taste_Signal_pkey" PRIMARY KEY ("signal_id")
);

-- CreateTable
CREATE TABLE "Dietary_Restriction" (
    "restriction_id" SERIAL NOT NULL,
    "restriction_name" TEXT NOT NULL,

    CONSTRAINT "Dietary_Restriction_pkey" PRIMARY KEY ("restriction_id")
);

-- CreateTable
CREATE TABLE "FOLLOWS" (
    "user_id" INTEGER NOT NULL,
    "restriction_id" INTEGER NOT NULL,

    CONSTRAINT "FOLLOWS_pkey" PRIMARY KEY ("user_id","restriction_id")
);

-- CreateTable
CREATE TABLE "Cuisine" (
    "cuisine_id" SERIAL NOT NULL,
    "cuisine_name" TEXT NOT NULL,

    CONSTRAINT "Cuisine_pkey" PRIMARY KEY ("cuisine_id")
);

-- CreateTable
CREATE TABLE "SELECTS" (
    "onboarding_id" INTEGER NOT NULL,
    "cuisine_id" INTEGER NOT NULL,
    "preference_rank" INTEGER NOT NULL,

    CONSTRAINT "SELECTS_pkey" PRIMARY KEY ("onboarding_id","cuisine_id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "recipe_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimated_time" INTEGER NOT NULL,
    "difficulty_level" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("recipe_id")
);

-- CreateTable
CREATE TABLE "Recipe_Step" (
    "step_number" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "recipe_id" INTEGER NOT NULL,

    CONSTRAINT "Recipe_Step_pkey" PRIMARY KEY ("recipe_id","step_number")
);

-- CreateTable
CREATE TABLE "Recipe_Image" (
    "image_order" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipe_id" INTEGER NOT NULL,

    CONSTRAINT "Recipe_Image_pkey" PRIMARY KEY ("recipe_id","image_order")
);

-- CreateTable
CREATE TABLE "Recipe_View_Log" (
    "view_id" SERIAL NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,

    CONSTRAINT "Recipe_View_Log_pkey" PRIMARY KEY ("view_id")
);

-- CreateTable
CREATE TABLE "Cooking_Log" (
    "log_id" SERIAL NOT NULL,
    "cooked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,

    CONSTRAINT "Cooking_Log_pkey" PRIMARY KEY ("log_id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "ingredient_id" SERIAL NOT NULL,
    "ingredient_name" TEXT NOT NULL,
    "availability_tag" TEXT,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("ingredient_id")
);

-- CreateTable
CREATE TABLE "USES" (
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,

    CONSTRAINT "USES_pkey" PRIMARY KEY ("recipe_id","ingredient_id")
);

-- CreateTable
CREATE TABLE "SUBSTITUTES" (
    "reason" TEXT,
    "confidence_score" DOUBLE PRECISION NOT NULL,
    "explanation" TEXT,
    "original_ingredient_id" INTEGER NOT NULL,
    "substitute_ingredient_id" INTEGER NOT NULL,

    CONSTRAINT "SUBSTITUTES_pkey" PRIMARY KEY ("original_ingredient_id","substitute_ingredient_id")
);

-- CreateTable
CREATE TABLE "Board" (
    "board_id" SERIAL NOT NULL,
    "board_name" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("board_id")
);

-- CreateTable
CREATE TABLE "SAVES" (
    "saved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "board_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,

    CONSTRAINT "SAVES_pkey" PRIMARY KEY ("board_id","recipe_id")
);

-- CreateTable
CREATE TABLE "Mood" (
    "mood_id" SERIAL NOT NULL,
    "mood_name" TEXT NOT NULL,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("mood_id")
);

-- CreateTable
CREATE TABLE "FITS" (
    "recipe_id" INTEGER NOT NULL,
    "mood_id" INTEGER NOT NULL,

    CONSTRAINT "FITS_pkey" PRIMARY KEY ("recipe_id","mood_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Profile_user_id_key" ON "User_Profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_Onboarding_user_id_key" ON "User_Onboarding"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Dietary_Restriction_restriction_name_key" ON "Dietary_Restriction"("restriction_name");

-- CreateIndex
CREATE UNIQUE INDEX "Cuisine_cuisine_name_key" ON "Cuisine"("cuisine_name");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_ingredient_name_key" ON "Ingredient"("ingredient_name");

-- CreateIndex
CREATE UNIQUE INDEX "Mood_mood_name_key" ON "Mood"("mood_name");

-- AddForeignKey
ALTER TABLE "User_Profile" ADD CONSTRAINT "User_Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Onboarding" ADD CONSTRAINT "User_Onboarding_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Taste_Signal" ADD CONSTRAINT "User_Taste_Signal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FOLLOWS" ADD CONSTRAINT "FOLLOWS_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FOLLOWS" ADD CONSTRAINT "FOLLOWS_restriction_id_fkey" FOREIGN KEY ("restriction_id") REFERENCES "Dietary_Restriction"("restriction_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SELECTS" ADD CONSTRAINT "SELECTS_onboarding_id_fkey" FOREIGN KEY ("onboarding_id") REFERENCES "User_Onboarding"("onboarding_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SELECTS" ADD CONSTRAINT "SELECTS_cuisine_id_fkey" FOREIGN KEY ("cuisine_id") REFERENCES "Cuisine"("cuisine_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe_Step" ADD CONSTRAINT "Recipe_Step_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe_Image" ADD CONSTRAINT "Recipe_Image_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe_View_Log" ADD CONSTRAINT "Recipe_View_Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe_View_Log" ADD CONSTRAINT "Recipe_View_Log_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooking_Log" ADD CONSTRAINT "Cooking_Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cooking_Log" ADD CONSTRAINT "Cooking_Log_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USES" ADD CONSTRAINT "USES_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USES" ADD CONSTRAINT "USES_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "Ingredient"("ingredient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SUBSTITUTES" ADD CONSTRAINT "SUBSTITUTES_original_ingredient_id_fkey" FOREIGN KEY ("original_ingredient_id") REFERENCES "Ingredient"("ingredient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SUBSTITUTES" ADD CONSTRAINT "SUBSTITUTES_substitute_ingredient_id_fkey" FOREIGN KEY ("substitute_ingredient_id") REFERENCES "Ingredient"("ingredient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SAVES" ADD CONSTRAINT "SAVES_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "Board"("board_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SAVES" ADD CONSTRAINT "SAVES_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FITS" ADD CONSTRAINT "FITS_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FITS" ADD CONSTRAINT "FITS_mood_id_fkey" FOREIGN KEY ("mood_id") REFERENCES "Mood"("mood_id") ON DELETE CASCADE ON UPDATE CASCADE;
