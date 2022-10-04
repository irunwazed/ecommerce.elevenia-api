import xml from 'xml';
import db from "../../models";
import { validationResult } from "express-validator";

const baseUrl = 'http://127.0.0.1:8000/';

export default class ProductController {
	static async index(req, res) {

		let perPage = req.query.perPage?req.query.perPage:12;
		let page = req.query.page?req.query.page:1;
		let data = await db.product.find({}).sort({updatedAt: -1, _id: 1})
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
		let image = null;
		if(req.files !== undefined){
			image = req.files.image;
		}
		let no = Math.floor((Math.random() * 1000000000) + 1);
		let tmp = await db.product.find({no});
		
		while(tmp.id !== undefined){
			no = Math.floor((Math.random() * 1000000000) + 1);
			tmp = await db.product.find({no});
		}
		tmp = await db.product.find({sku});
		if(tmp.id !== undefined){
			return res.send({statusCode: 400, message: 'SKU sudah digunakan'})
		}
		
		no = no.toString();
		price = parseFloat(price);
		try{
			let data = {no, name, description, price, sku, image: baseUrl+'img/image.png'};
			if(image !== null){
				await image.mv('./public/img/products/'+no+'-'+ image.name);
				data = {no, name, description, price, sku, image: baseUrl+'img/products/'+no+'-'+image.name};
			}
			await db.product.insertMany([data]);
			return res.send({statusCode: 200, message: 'berhasil masuk', data: data})
		}catch(err){
			return res.send({statusCode: 500, message: err.message})
		}
	}

	static async update(req, res){
		let no = req.params.no;
		let name = req.body.name;
		let description = req.body.description;
		let price = req.body.price;
		let sku = req.body.sku;
		let id = req.body._id;
		let image = null;
		if(req.files !== null & req.files !== undefined){
			image = req.files.image;
		}
		no = no.toString();
		price = parseFloat(price);
		try{
			let data = {name: name, description: description, price:price, sku:sku};
			if(image !== null){
				await image.mv('./public/img/products/' + image.name);
				data = {name, description, price, sku, image: baseUrl+'img/products/'+image.name};
			}
			await db.product.findByIdAndUpdate(id, data,{useFindAndModify: false})
			return res.send({statusCode: 200, message: 'berhasil diubah', data: data})
		}catch(err){
			return res.status(500).send({statusCode: 500, message: err.message})
		}
	}

	static async delete(req, res){
		let no = req.params.no;
		try{
			await db.product.deleteOne({no: no})
			return res.send({statusCode: 200, message: 'berhasil dihapus'})
		}catch(err){
			return res.status(500).send({statusCode: 500, message: err.message})
		}
	}
}