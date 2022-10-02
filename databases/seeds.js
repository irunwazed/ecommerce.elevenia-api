import db from '../app/models';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker/locale/id_ID'

const running = async () => {

  await db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  await db.product.deleteMany({})
  let dataProduct = [];
  let number = 1;
  for(let i = 1; i <= 500; i++){
    dataProduct.push({ no: Math.random(), sku: Math.random(), name: faker.commerce.productName(), image: 'http://127.0.0.1:8000/img/image.png', price: faker.commerce.price(100, 9000000, 0), description: faker.commerce.productDescription() });
  }
  await db.product.insertMany(dataProduct);
  console.log('insert data product');

}

running()