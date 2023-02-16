const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    groupName: String,
    imgFolder: String,
    products: [
      {
        p_name: String,
        p_price: Number,
        p_desc: String,
        p_imgName: String,
        p_imgId: String,
        p_status: String,
      },
    ],
  },
  { collection: "products" }
);

module.exports = mongoose.model("Product", productSchema);
