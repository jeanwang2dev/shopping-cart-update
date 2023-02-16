const productModel = require("../../models").Product;
const customerModel = require("../../models").Customer;
const orderModel = require("../../models").Order;

let js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/user-checkout.js"></script>';
js += '<script src="/public/js/user.js"></script>';

js += "<script>\n";
js += "$(document).ready(function(){\n";
js +=
  '$(\'[data-toggle="popover"]\').popover({title: "Field Error", content:" ", trigger:"hover"}); \n';
js += "});\n";
js += "</script>";

let tContent = "";

module.exports = {
  index: function (req, res) {
    if (req.session.success) {
      res.render("user/checkout", {
        title: "User Home",
        heading: "Checkout",
        buyer: true,
        js: js,
      });
    } else {
      res.redirect("/user/login/?error=1");
    }
  },

  /* show the customer info on the checkout page: name and address */
  showCustomer: function (req, res) {
    const email = req.body.data;

    customerModel.findOne({ email: email }, function (err, customer) {
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        if (customer !== null) {
          const name = customer.f_name + "  " + customer.l_name;
          const address = customer.address;
          const location =
            customer.city + ", " + customer.state + " " + customer.zipcode;
          res.send("success^^^" + name + "^^^" + address + "^^^" + location);
        } else {
          console.log("can't find the cumstomer!");
          res.send("error");
        }
      }
    });
  },

  /* save the order to the database */
  placeOrder: function (req, res) {
    const data = JSON.parse(req.body.data);

    const len = data.length;
    const cart = [];
    cart = data.slice(0, len - 2);

    const email = data[len - 2];
    const timestamp = data[len - 1];

    findCustomerId(email, function (id) {
      const orderData = {};
      orderData.customerID = id;
      orderData.timestamp = timestamp;
      orderData.orderInfo = cart;

      const order = new orderModel(orderData);

      order.save(function (err) {
        if (err) {
          res.send("error");
        } else {
          res.send("success");
        }
      });
    });
  },

  /* show the shopping cart content */
  showCart: function (req, res) {
    let tHead = '<table class="table table-bordered">';
    tHead += "<thead><tr>";
    tHead += "<th>Product Name</th>";
    tHead += "<th>Price Each</th>";
    tHead += "<th>Amount</th>";
    tHead += "<th>Total Price</th>";
    tHead += "</tr></thead>";
    tHead += "<tbody>";

    const cart = JSON.parse(req.body.data);

    if (tContent !== "") {
      tContent = "";
    }

    if (cart) {
      const len = cart.length;
      let i = 0;
      let sum = 0;
      for (const j = 0; j < len; j++) {
        sum += parseInt(cart[j].count) * parseFloat(cart[j].price);
      }
      sum = sum.toFixed(2);

      let tTotal = "<tr>";
      tTotal += "<td></td> <td></td> <td>Grand Total</td>";
      tTotal += "<td>$" + sum + "</td>";
      tTotal += "</tr>";

      loopCart(cart, i, function () {
        const table = tHead + tContent + tTotal + "</tbody></table>";
        res.send("success^^^" + table);
      });
    } //end if cart
  },
};

function findCustomerId(email, callback) {
  setTimeout(function () {
    //const id;
    customerModel.findOne({ email: email }, function (err, customer) {
      if (err) {
        console.log(err);
      } else {
        if (customer !== null) {
          const id = customer._id;
          callback(id);
        }
      }
    });
  }, 100);
}

function loopCart(cart, i, callback) {
  setTimeout(function () {
    if (i < cart.length) {
      i++;

      setTimeout(function () {
        const idArr = cart[i - 1].pid.split("***");
        const gid = idArr[0];
        const pid = idArr[1];

        const amount = cart[i - 1].count;
        const id = cart[i - 1].id;

        productModel.findOne({ _id: gid }, function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            if (docs) {
              const path = docs.imgFolder;

              search4product(gid, pid, path, amount, docs);
            } //end if
          } //end else
        });
        loopCart(cart, i, callback);
      }, 10);
    } else {
      callback();
    }
  }, 20);
}

/* search for the product by the product id, get the product info and add it to the table */
function search4product(gid, pid, path, amount, docs) {
  tContent += "<tr>";
  let total = 0;
  for (let i = 0; i < docs.products.length; i++) {
    if (docs.products[i]._id == pid) {
      //if I use '===' it won't match, don't know why

      const pname = docs.products[i].p_name;
      const price = docs.products[i].p_price;
      const id = gid + "***" + pid;

      tContent += "<td>" + pname + "</td>";
      tContent += "<td> $" + price + "</td>";
      tContent += "<td>" + amount + "</td>";
      total = parseFloat(price) * parseFloat(amount);
      tContent += "<td> $" + total + "</td>";
    }
  }
  tContent += "</tr>";
}
