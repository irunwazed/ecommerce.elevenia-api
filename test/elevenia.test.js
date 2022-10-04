import app from '../app/app';
import request from 'supertest';
import db from '../app/models';

const table = db.product;


describe("Product /", () => {

  beforeEach(async () => {
    
		db.mongoose
				.connect('mongodb://localhost:27017/db_tes', {
					useNewUrlParser: true,
					useUnifiedTopology: true
				})
				.then(() => {
					// console.log("Connected to the database!");
				})
				.catch(err => {
					// console.log("Cannot connect to the database!", err);
					process.exit();
				});

				await table.deleteMany({})

  });

	// proses lama
  test("load categori", async () => {
    const response = await request(app).get("/elevenia/category").send({})
    .expect(200)
    .expect("Content-Type", /json/);
  })

  test("load one data", async () => {
    const response = await request(app).get("/elevenia/product").send({})
    .expect(200)
    .expect("Content-Type", /json/);

  })

	// proses akan lama sekali
  // test("load all data elevenia", async () => {

  //   const response = await request(app).get("/elevenia/set-product").send({})
  //   .expect(200)
  //   .expect("Content-Type", /json/);

  // })

	


})