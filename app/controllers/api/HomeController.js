import xml from 'xml';

export default class HomeController {
	static async index(req, res) {
		let api = {
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
		return res.send(xml(api));
	}

	static async notFound(req, res) {
		let api = {
			status: false,
			message: "pages not found!",
		};
		res.status(404).send(api);
	}
}