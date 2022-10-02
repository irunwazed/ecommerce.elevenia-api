import xml from 'xml';
import db from "../../models";
import axios from 'axios';
const {convertXML, createAST} = require("simple-xml-to-json")

axios.defaults.headers.common['openapikey'] = '721407f393e84a28593374cc2b347a98' // for POST requests
axios.defaults.headers.post['Content-type'] = 'application/xml' // for all requests
axios.defaults.headers.common['Accept-Charset'] = 'utf-8' // for all requests

export default class EleveniaController {

	
	static async getProductFromElevenia(req, res){
		
		await db.product.deleteMany({})
		let tes = await loadData(1);
		let status = await inputData(tes, 0);

		return res.send(status)

	}

	static async product(req, res){
		try{
			let temp = await axios.get('http://api.elevenia.co.id/rest/prodservices/product/details/29325975');
			let myJson = convertXML(temp.data);
			return res.send({message: myJson})
		}catch(err){
			console.log(err.message);
			return res.send({message: err.message})
		}
	}

	static async store(req, res){
		let data = {
			Product: [
				{ selMnbdNckNm: 'N' },
				{ selMthdCd: '01' },
				{ dispCtgrNo: '01' },
				{ ProductCtgrAttribute: [
					{
						prdAttrCd: '200',
						prdAttrNm: 'Brand',
						prdAttrNo: '2002',
					}
				] },
			]
		};
		console.log(xml(data))



		try{
			let temp = await axios.post('http://api.elevenia.co.id/rest/prodservices/product', xml(data));
			let myJson = convertXML(temp.data);
			return res.send({message: myJson})

		}catch(err){
			console.log(err.message);
			return res.send({message: err.message})
		}
	}
	
}

var data = [];

const loadData = async (page) => {
	try{
		console.log(page);
		let temp = await axios.get('http://api.elevenia.co.id/rest/prodservices/product/listing?page='+page);
		let myJson = convertXML(temp.data);
		if(myJson.Products.children===undefined){
			return data;
		}
		data = data.concat(myJson.Products.children);
		return loadData(page+1)
	}catch(err){
		console.log(err.message);
		return data;
	}
}

const inputData = async (products, no) => {
	try{
		// get nomor
		let prdNo = '';
		products[no].product.children.forEach(element => {
			if(Object.keys(element)[0] == 'prdNo'){
				prdNo = element.prdNo.content;
			}
		});
		let temp = await axios.get('http://api.elevenia.co.id/rest/prodservices/product/details/'+prdNo);
		let dataProduct = convertXML(temp.data);
		let data = {};
		dataProduct.Product.children.forEach(e => {
			if(Object.keys(e)[0] === 'prdNo'){
				data = {...data, no: e.prdNo.content}
			}
			if(Object.keys(e)[0] === 'sellerPrdCd'){
				data = {...data, sku: e.sellerPrdCd.content}
			}
			if(Object.keys(e)[0] === 'prdNm'){
				data = {...data, name: e.prdNm.content}
			}
			if(Object.keys(e)[0] === 'selPrc'){
				data = {...data, price: e.selPrc.content}
			}
			if(Object.keys(e)[0] === 'htmlDetail'){
				data = {...data, description: e.htmlDetail.content}
			}
			if(Object.keys(e)[0] === 'prdImage01'){
				data = {...data, image: e.prdImage01.content}
			}
			if(Object.keys(e)[0] === 'prdImage02'){
				data = {...data, image: e.prdImage02.content}
			}
			if(Object.keys(e)[0] === 'prdImage03'){
				data = {...data, image: e.prdImage03.content}
			}
			if(Object.keys(e)[0] === 'prdImage04'){
				data = {...data, image: e.prdImage04.content}
			}
		})
		if(data.image === undefined){
			data.image = 'http://127.0.0.1:8000/img/image.png';
		}
		await db.product.insertMany([data]);
		console.log(data);
		// Object.keys(products[no].product.children)
		// console.log(dataProduct.Product.children);
		// console.log(dataProduct);
	}catch(err){
		console.log(err.message);
		// return data;
	}
	
	if(products.length === no+1){
		return {status: true};
	}
	return inputData(products, no+1);
}