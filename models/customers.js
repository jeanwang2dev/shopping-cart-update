const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    f_name: String,
    l_name: String,
    address: String,
    city: String,
    state: String,
    zipcode: Number,
    phone: Number,
    email: String,
    password: String,
  },
  { collection: "customers" }
);

module.exports = mongoose.model("Customer", customerSchema);
