const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    username: String,
    password: String,
  },
  { collection: "admins" }
);

module.exports = mongoose.model("Admin", adminSchema);
