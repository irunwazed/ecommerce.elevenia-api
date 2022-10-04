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

  test("load data", async () => {
    const response = await request(app).get("/api/product").send({})
    .expect(200)
    .expect("Content-Type", /json/);
  })

  test("post create", async () => {

		let datas = await table.find({});
		let data = {
			name: 'jualan baju', 
			description: '<p>baju kita</p>', 
			price: 20000, 
			sku: '123213123', 
		}
    const response = await request(app).post("/api/product").send(data)
    .expect(200)
    .expect("Content-Type", /json/);

		let datas2 = await table.find({});
		expect(datas2.length - 1).toBe(datas.length);

  })

  test("put to update", async () => {

		// input one data
		let data = {
			name: 'jualan baju', 
			description: '<p>baju kita</p>', 
			price: 20000, 
			sku: '123213123', 
		}
    const resProduct = await request(app).post("/api/product").send(data)

		// console.log(resProduct._body.data);
		let no = resProduct._body.data.no;

		data = {
			name: 'jualan baju2', 
			description: '<p>baju kita</p>2', 
			price: 21000, 
			sku: '123213123', 
			image: '',
		}
    const ubahProduct = await request(app).put("/api/product/"+no).send(data)
    .expect(200)
    .expect("Content-Type", /json/);
		// . input data

		let dataUbah = ubahProduct._body.data;
		expect(dataUbah.name).toBe(data.name)
		expect(dataUbah.description).toBe(data.description)
		expect(dataUbah.price).toBe(data.price)
  })



  test("delete product", async () => {

		// input one data
		let data = {
			name: 'jualan baju', 
			description: '<p>baju kita</p>', 
			price: 20000, 
			sku: '123213123', 
		}
    const resProduct = await request(app).post("/api/product").send(data)

		let dataAwal = await table.find({});

		// console.log(resProduct._body.data);
		let no = resProduct._body.data.no;

    const ubahProduct = await request(app).delete("/api/product/"+no).send()
    .expect(200)
    .expect("Content-Type", /json/);

		let dataAkhir = await table.find({});

		expect(dataAwal.length - 1).toBe(dataAkhir.length);

  })
})