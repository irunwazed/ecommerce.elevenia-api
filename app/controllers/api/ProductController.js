import xml from 'xml';
import db from "../../models";
import { validationResult } from "express-validator";

export default class ProductController {
	static async index(req, res) {

		let perPage = req.query.perPage?req.query.perPage:24;
		let page = req.query.page?req.query.page:1;
		let data = await db.product.find({}).sort({updatedAt: 1, _id: 1})
    .limit(perPage)
    .skip(perPage * (page-1));
		let api = {
			status: false,
			data: data,
		};
		return res.send((api));
	}

	static async notFound(req, res) {
		let api = {
			status: false,
			message: "pages not found!",
		};
		res.status(404).send(api);
	}

	static async store(req, res){

		let name = req.body.name;
		let description = req.body.description;
		let price = req.body.price;
		let sku = req.body.sku;

		let image = req.files.image;
		try{
			image.mv('./public/img/products/' + image.name);
			await db.product.insertMany([
				{name, description, price, sku, image: 'http://127.0.0.1:8000/img/products/'+image.name}
			]);
			return res.send({statusCode: 200, message: 'berhasil masuk'})
		}catch(err){
			return res.status(500).send({statusCode: 500, message: err.message})
		}

	}
}