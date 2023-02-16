const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customerID: String,
    timestamp: Date,
    orderInfo: [
      {
        pid: String,
        count: Number,
        price: String,
      },
    ],
  },
  { collection: "orders" }
);

module.exports = mongoose.model("Order", orderSchema);
