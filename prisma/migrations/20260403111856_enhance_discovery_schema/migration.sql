-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "cuisine_id" INTEGER;

-- CreateTable
CREATE TABLE "FITS_DIET" (
    "recipe_id" INTEGER NOT NULL,
    "restriction_id" INTEGER NOT NULL,

    CONSTRAINT "FITS_DIET_pkey" PRIMARY KEY ("recipe_id","restriction_id")
);

-- AddForeignKey
ALTER TABLE "FITS_DIET" ADD CONSTRAINT "FITS_DIET_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FITS_DIET" ADD CONSTRAINT "FITS_DIET_restriction_id_fkey" FOREIGN KEY ("restriction_id") REFERENCES "Dietary_Restriction"("restriction_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_cuisine_id_fkey" FOREIGN KEY ("cuisine_id") REFERENCES "Cuisine"("cuisine_id") ON DELETE SET NULL ON UPDATE CASCADE;
