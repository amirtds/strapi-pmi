'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    const fetch = require('node-fetch');
    let products = []
    // Get all products from dummyjson API and append them to the products array
    fetch('https://dummyjson.com/products').then(response => response.json()).then(dummyProducts => {
      products.push(...dummyProducts.products);
      // Get all products from fakestoreapi API and append them to the products array
      fetch('https://fakestoreapi.com/products').then(response => response.json()).then(fakeStoreProducts => {
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
      });
    });
  }
};
