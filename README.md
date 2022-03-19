# teche-commerce-web
- I don't want play elden ring anymore
# How to use

### Collection Available: Product, Brand, Category, Image, Product

#### GET /api/v1/{collection_name}: get all collection in database
##### Option: You can pass option for sort by product's attribute, sort type(increasement and decreasement), limit the number of items
- sort by product's attribute: req.query[sort]
- sort by Type: req.query[type]
- limit the number of items: req.query[limit]


#### GET /api/v1/{collection_name}/:{id}: get one specific document in collection

#### DELETE /api/v1/{collection_name} => delete all document in collection

#### DELETE /api/v1/{collection_name}/{document_id} => delete one document in collection

#### POST /api.v1/{collection_name} send with req.body {FormData} -> create document in collection. Each collection has different parameter we explain later


# I AM TIRED TOO (TODO):
 - Test deleteProduct API
 - Change product.inStock to variants.inStock (I will change later, believe me)

# Upcomming Features (will be update after i become Elden Lord)
 - Management all database
 - Friendly UI for admin
 - Refactor project structure
