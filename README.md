# teche-commerce-web
- Beautiful website make by Tarnished from the Land Between, them who seek to elden ring to become Elden Lord
# How to use

- GET /api/v1/brand => all brand available
- GET /api/v1/brand/:id => brand with id
- POST  /api/v1/brand  send with body {FormData: {brandName: name(String), brandImg: img (File)}}} => createBrand, use the web UI 
- DELETE /api/v1/brand => delete all brands
- DELETE /api/v1/brand/:id => delete  brand with id
- GET /api/v1/image/:id => get image with id

{
# I AM TIRED TOO (TODO):
 - Test deleteProduct API
 - Change product.inStock to variants.inStock (I will change later, believe me)

# Upcomming Features (will be update after i become Elden Lord)
 - Management all database
 - Friendly UI for admin
 - Refactor project structure
