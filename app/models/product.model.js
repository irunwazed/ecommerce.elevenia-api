import mongoose from "mongoose";

module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      no: {
				type: String,
				required: true,
        unique: true,
			},
      name: {
				type: String,
				required: true,
			},
      sku: {
				type: String,
				required: true,
        unique: true,
			},
      image: {
				type: String,
				required: true,
			},
      price: {
				type: Number,
				required: true,
      },
      description: {
				type: String,
				required: true,
			},
    },
    { timestamps: true }
  );

  const table = mongoose.model('product', schema);

  return table
}