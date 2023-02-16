const customerModel = require("../../models").Customer;

let js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/user.js"></script>';

js += "<script>\n";
js += "$(document).ready(function(){\n";
js +=
  '$(\'[data-toggle="popover"]\').popover({title: "Field Error", content:" ", trigger:"hover"}); \n';
js += "});\n";
js += "</script>";

module.exports = {
  index: function (req, res) {
    res.render("user/register", {
      title: "User Home",
      heading: "Registration",
      user: true,
      js: js,
    });
  },

  /* register a new customer */
  saveCustomer: function (req, res) {
    console.log("save customer");
    const data = JSON.parse(req.body.data);

    /* get the value from phone number if there is a format */
    data.phone = data.phone.replace(/-|\(|\)/g, "");

    /*Require Bcrypt and set the salt rounds */
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const pw = data.pw;
    const email = data.email;
    const documentData = {};

    bcrypt.hash(pw, saltRounds, function (err, hash) {
      if (err) {
        console.log(err);
      } else {
        documentData.password = hash;
        documentData.email = data.email;
        documentData.f_name = data.f_name;
        documentData.l_name = data.l_name;
        documentData.address = data.address;
        documentData.city = data.city;
        documentData.state = data.state;
        documentData.zipcode = data.zipcode;
        documentData.phone = data.phone;

        /*check if the email exists*/
        customerModel.findOne({ email: email }, function (err, name) {
          if (err) {
            console.log(err);
          } else {
            /*If the email is not found then save the customer info*/
            if (name === null) {
              const customer = new customerModel(documentData);
              customer.save(function (err) {
                if (err) {
                  console.log("here is the err: " + err);
                  res.send("error^^^System Error Cannot Login");
                } else {
                  req.session.success = "access approved";
                  res.send("success^^^Customer Account Created");

                  //res.redirect('/user/checkout');
                }
              });
            } else {
            /*IF THE USERNAME IS FOUND TELL THE USER THAT USERNAME IS ALREADY IN USE.*/
              res.send(
                "error^^^We are sorry that there is someone who already has that email address"
              );
            }
          }
        });
      }
    });
  },
};
