# TechEcommerce API document

This is a documentation guide for the TechEcommerce system.


## V1

### Brand

#### Fetch All Brand:
Authorization token: `public`

```
GET /api/v1/brand
```
Query parameters available:
- `limit`: `optional` `integer`  `min=1`, limit the result
- `page`: `optional` `integer` `min=1`, page requested, need `limit` to work
- `sort`: `optional` `string`, name of the field to sort results with
- `order_by`: `optional` `must be either asc or desc`, only work it `sort` is specified, default to `desc`
- `query`: `optional` `string`, search by brand's name

#### Create Brand:
```
POST /api/v1/brand
```
Authorization token: `admin`

Body parameters available (just put these in `FormData`):
- `brandName`: `required` `string` `not empty` `length=3-50`
- `images`: `optional` `File` `0<=length<=1` `png or jpeg`, brand's image


#### Delete All Brand
Authorization token: `admin`

```
DELETE /api/v1/brand
```
#### Fetch Brand
Authorization token: `public`

```
GET /api/v1/brand/:id
```


#### Delete Brand

Authorization token: `admin`

```
DELETE /api/v1/brand/:id
```

#### Edit Brand

N/A


### Category

#### Fetch All Category:
Authorization token: `public`

```
GET /api/v1/category
```
Query parameters available:
- `limit`: `optional` `integer`  `min=1`, limit the result
- `page`: `optional` `integer` `min=1`, page requested, need `limit` to work
- `sort`: `optional` `string`, name of the field to sort results with
- `order_by`: `optional` `must be either asc or desc`, only work it `sort` is specified, default to `desc`
- `query`: `optional` `string`, search by category's name

#### Create Category:
```
POST /api/v1/brand
```
Authorization token: `admin`

Body parameters available:
- `categoryName`: `required` `string` `not empty` `length=3-50`


#### Delete All Brand
Authorization token: `admin`

```
DELETE /api/v1/category
```
#### Fetch Category
Authorization token: `public`

```
GET /api/v1/category/:id
```


#### Delete Category

Authorization token: `admin`

```
DELETE /api/v1/category/:id
```

#### Edit Category

N/A


### Product

#### Fetch All Product:
Authorization token: `public`

```
GET /api/v1/product
```
Query parameters available:
- `limit`: `optional` `integer`  `min=1`, limit the result
- `page`: `optional` `integer` `min=1`, page requested, need `limit` to work
- `sort`: `optional` `string`, name of the field to sort results with
- `order_by`: `optional` `must be either asc or desc`, only work it `sort` is specified, default to `desc`
- `brand`: `optional` `id`, valid brand's id
- `category`: `optional` `id`, valid category'id
- `range_field`: `optional`, name of the field to get value by range, require `min` or `max` to work
- `min`: `optional` `number`, the minimum value of said `range_field`
- `max`: `optional` `number`, the maximum value of said `range_field`
- `query`: `optional` `string`, search by category's name


#### Create Product:
```
POST /api/v1/product
```
Authorization token: `admin`

Body parameters available (just put these in `FormData`):
- `productName`: `required` `string` `not empty` `length=3-50`
- `productPrice`: `required` `number`, price of the product
- `productUnit`: `required` `integer`  , unit of the product
- `productBrand`: `required` `id`, valid brand's id
- `productCategory`: `required` `id`, valid category's id
- `productDetails`: `optional`, description of said product
- `images`: `optional` `File(s)` `png or jpeg` `length>=0`, array of pictures of product

#### Delete All Product
Authorization token: `admin`

```
DELETE /api/v1/product
```
#### Fetch Product
Authorization token: `public`

```
GET /api/v1/product/:id
```


#### Delete Product

Authorization token: `admin`

```
DELETE /api/v1/product/:id
```

#### Edit Product
Authorization token: `admin`

```
PUT /api/v1/product/:id
```

Body parameters available (just put these in `FormData`):
- `productName`: `required` `string` `not empty` `length=3-50`
- `productPrice`: `required` `number`, price of the product
- `productUnit`: `required` `integer`  , unit of the product
- `productBrand`: `required` `id`, valid brand's id
- `productCategory`: `required` `id`, valid category's id
- `productDetails`: `optional`, description of said product
- `images`: `optional` `File(s)` `png or jpeg` `length>=0`, array of pictures of product