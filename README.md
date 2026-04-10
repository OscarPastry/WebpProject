# FlavorForge

FlavorForge is a comprehensive, modern recipe discovery and culinary management platform that distinguishes itself through an AI-driven ingredient substitution model, deep user personalization, and a distinct brutalist design aesthetic. The platform leverages modern web technologies (Next.js, React, Tailwind CSS, PostgreSQL via Prisma) to deliver a premium user experience.

Here is a detailed breakdown of the features integrated into the platform:

## 1. User Management & Onboarding Flow
* **Authentication**: Comprehensive authentication system utilizing secure JSON Web Tokens (`jose`) mapped perfectly with database user profiles. Secure password handling.
* **Onboarding Experience**: New users are guided through an onboarding flow designed to establish their culinary profile immediately. Users select their favorite cuisines (`Cuisine`), dietary restrictions (`Dietary_Restriction`), and preferences.
* **User Profiles**: Profiles that store critical identifying information, bio, display name, and avatar pictures. Contains references to their created recipes and saved collections.
* **Taste Signals**: An implicit feedback loop feature (`User_Taste_Signal`) that passively records users' interactions across the platform and assigns weights to build a data-driven model of their preferences over time.

## 2. Core Recipe Engine
* **Detailed Recipe Creation**: Users can define recipes containing titles, detailed descriptions, estimated preparation/cooking times, and varying difficulty levels. Recipes can be set to either public or private visibility.
* **Step-by-Step Instructions**: A strict structured schema allows for sequential step-by-step instructions (`Recipe_Step`) to correctly map out complex dishes.
* **Multi-Image Support**: Distinct image handling allowing recipes to retain a primary feature image alongside multiple secondary step or final-product photos (`Recipe_Image`).
* **Tags & Categorization**: Deep linking of recipes with tags, allowing connections across multiple vectors including `Cuisine`, `Mood`, and `Dietary Restriction`.

## 3. AI-Powered Ingredient Intelligence
* **Smart Substitute Engine**: Powered by the Google Gemini AI SDK (`@ai-sdk/google`), the platform can automatically process recipes and suggest context-aware, culinary-appropriate alternatives for ingredients. 
* **Confidence Scoring**: Substitutes are stored in the database with an AI-generated reasoning explanation and a normalized confidence score (0.0 - 1.0) to give users trust in the substitute quality.
* **Ingredient Matcher ("Pantry Matcher")**: A dedicated tool algorithm that cross-references a user's on-hand ingredients against massive relational datasets to surface recipes they can immediately cook without grocery shopping.

## 4. Community & Engagement
* **Ratings & Reviews System**: Verified logged-in users can leave public ratings (1-5 point scales) and text comments on recipes they have cooked. Only one review is permitted per user per recipe.
* **Log as Cooked**: A quick tracking mechanism (`Cooking_Log`) to let users easily record when they finish making a meal, providing a historically accurate diary of their culinary journey.
* **View Timelines**: Internal logging metrics track view trends across recipes (`Recipe_View_Log`).
* **Custom Boards**: Users can curate personal collections or "Boards" (e.g., "Thanksgiving Ideas," "High Protein Fast") to save recipes. These boards support customized visibility layers (public/private).

## 5. Geolocation & Sourcing
* **Find Nearby Map feature**: Uses `react-leaflet`, `@vis.gl/react-google-maps`, and `Leaflet` APIs to provide interactive mapping functionality. This allows users to find nearby specialty grocers or restaurants relevant to their recipe endeavors, complete with smooth panning and direct map links.

## 6. UI/UX & Aesthetics
* **Dynamic Dark Mode**: Fully supported via native CSS variables for dynamic thematic shifts.
* **Brutalist Design Core**: A visually striking, intentional brutalist aesthetics integrated across all interfaces. The design relies heavily on raw components and strong typography driven by `Tailwind CSS`.

## 7. Back-End Technologies & Operations
* **Type-Safe Database Interfacing**: Typed through Prisma ORM mapping heavily to robust relational PostgreSQL tables.
* **Optimized Seeders**: Database seeding capability via custom `.csv` data structures explicitly designed to fetch and attach remote imagery links.
