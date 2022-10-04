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

	static async hiddenProduct(req, res){
		let prdNo = req.params.prdNo
		console.log(prdNo)
		try{
			let temp = await axios.put('http://api.elevenia.co.id/rest/prodstatservice/stat/stopdisplay/'+prdNo);
			let myJson = convertXML(temp.data);
			let status = myJson.ClientMessage.children[1].resultCode.content;
			if(status == 200){
				await db.product.deleteOne({no: prdNo})
			}
			return res.send({
				message: myJson.ClientMessage.children[0].message.content, 
				statusCode: myJson.ClientMessage.children[1].resultCode.content})
		}catch(err){
			console.log(err.message);
			return res.send({message: err.message})
		}
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

	static async category(req, res){
		try{
			let temp = await axios.get(' http://api.elevenia.co.id/rest/cateservice/category/1');
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
				{ selMnbdNckNm: 'aka' },
				{ selMthdCd: '05' },
				{ dispCtgrNo: '53' },
				{ ProductCtgrAttribute: 
					[
						{ prdAttrCd: '2000042', },
						{ prdAttrNm: 'Neck Style', },
						{ prdAttrNo: '161075', },
						{ prdAttrVal: 'Neck Style Value', },
					] 
				},
				{ ProductCtgrAttribute: 
					[
						{ prdAttrCd: '2000017', },
						{ prdAttrNm: 'Fabric', },
						{ prdAttrNo: '161074', },
						{ prdAttrVal: 'FabricValue', },
					] 
				},
				{ prdNm: 'test Product' },
				{ advrtStmt: 'hot item' },
				{ orgnTypCd: '03' },
				{ orgnNmVal: 'Other: China' },
				{ sellerPrdCd: 'SKU-000010001' },
				{ suplDtyfrPrdClfCd: '01' },
				{ prdStatCd: '01' },
				{ minorSelCnYn: 'Y' },
				{ prdImage01: '<![CDATA[https://s0.bukalapak.com/img/02352615592/s-330-330/data.jpeg.webp]]>' },
				{ htmlDetail: '<![CDATA[<p>descript</p>]]>' },
				{ selTermUseYn: 'N' },
				{ selPrc: '50000' },
				{ prdSelQty: '100' },
				{ divCnAreaCd: '01' },
				{ spplWyCd: '01' },
				{ divCstInsBasiCd: '03' },
				{ divCstI: '2500' },
				{ PrdFrDivBasiAmt: '50000' },
				{ divCstPayTypCd: '01' },
				{ addrSeqOut: '4' },
				{ addrSeqIn: '8' },
				{ rtngdDivCst: '25000' },
				{ exchDivCst: '60000' },
				{ asDetail: 'Sorry, no after select this product' },
				{ company: 'testing humnan' },
				{ brand: 'testing brand' },
				{ modelNm: 'testing model' },
				{ prcCmpExpYn: 'Y' },
				{ paidSelPrc: '250000' },
				{ exteriorSpecialNote: 'baru digunakan 2 kali' }, 
				{ tmpltSeq: '15557714' },
				{ prdWght: '10' },
				{ rtngExchDetail: 'https://www.elevenia.co.id/prd-lap-kanebo-super-mobil-motor-cafe-tanpa-serat-15557714' },
				{ modelNm: 'testing model' },
			]
		};

		let dataXML = '<?xml version="1.0" encoding="UTF-8"?>'+xml(data);


		console.log(dataXML)

		try{
			let temp = await axios.post('http://api.elevenia.co.id/rest/prodservices/product', dataXML);
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