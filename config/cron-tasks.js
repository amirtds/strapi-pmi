const fetch = require('node-fetch');

module.exports = {
    '0 0 0 * * *': async ({ strapi }) => {
        let products = []
        // Get all products from dummyjson API
        const dummyjsonResponse = await fetch('https://dummyjson.com/products');
        const dummyProducts = await dummyjsonResponse.json();
        // Append each product to the products array
        products.push(...dummyProducts.products);
        // Get all products from fakestoreapi API
        fakeStoreResponse = await fetch('https://fakestoreapi.com/products');
        fakeStoreProducts = await fakeStoreResponse.json();
        // Append each product to the products array
        products.push(...fakeStoreProducts);
        // Loop through each product
        products.forEach(async (product) => {
            // Check if the product already exists
            const existingProduct = await strapi.service("api::product.product").find({
                filters: {
                    name: product.title
                }
            });
            // If the product exists, log it
            if (existingProduct.results.length > 0){
                console.log(`Product ${product.title} already exists`)
            }
            else {
                // If the product doesn't exist, create it
                // create the image
                    let image = ""
                    product.image !== undefined ? image = product.image : product.images !== undefined ? image = product.images[0] : image = ""
                    const createdProduct = strapi.service("api::product.product").create({
                        data : {
                            name: product.title,
                            description: product.description,
                            imageUrl: image,
                            price: product.price,
                            brand: product.brand || '',
                            color: product.color || '',
                            size: product.size || '',
                            quantity: product.quantity || 0,
                            category: product.category || '',
                        }
                    });
            }
        });
  }
}