# Build Your Own Backend

## GET endpoints

#### Get all brands

* /api/v1/brands

#### Get all products

* /api/v1/products

#### Get brands by id

* /api/v1/brands/:id

#### Get products by id

* /api/v1/products/:id

#### Custom Get for products that match a brand

* /api/v1/products?brand=essie
* Query param for ?brand= brand name


## PATCH endpoints

#### Patch brand name

* /api/v1/brands/:id
* Need to pass in 'brand' into body

#### Patch product information

* /api/v1/products/:id
* Need to send 'name', 'rating', or 'price' into body

## POST endpoints

#### Post new brand

* /api/v1/brands
* pass in 'brand' into body

#### Post new product

* /api/v1/products/brands/:id
* pass in brand id as param, pass in 'name', 'price', and 'rating' into body


## DELETE endpoints

#### Delete brand

* /api/v1/brands/:id
* Pass in id into params, will turn all products with foreign keys to null

#### Delete product

* /api/v1/products/:id
* Pass in id into params
