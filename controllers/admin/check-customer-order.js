const customerModel = require("../../models").Customer;
const orderModel = require("../../models").Order;
const productModel = require("../../models").Product;

let js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/admin.js"></script>';

let tContent = "";
let grandTotal = 0;

module.exports = {
  index: function (req, res) {
    customerModel
      .find({})
      .select({ f_name: 1, l_name: 1, _id: 1 })
      .exec(function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          res.render("admin/check-customer-order", {
            title: "Admin Area",
            heading: "Customers",
            admin: true,
            admin_head: true,
            customers: docs,
            js: js,
          });
        }
      });
  },

  /* show the customer order table */
  showOrder: function (req, res) {
    const tHead = '<table class="table table-striped table-bordered">';
    tHead += "<thead>";
    tHead += "<tr>";
    tHead += '<th class="col-md-5">Date and Time</th>';
    tHead += '<th class="col-md-5">Order Number</th>';
    tHead += '<th class="col-md-2">Get Details</th>';
    tHead += "</tr></thead><tbody>";
    let tMiddle = "";

    orderModel.find({ customerID: req.body.data }, function (err, order) {
      if (err) {
        console.log(err);
        res.send("error^^^" + err);
      } else {
        if (order.length) {
          for (let i = 0; i < order.length; i++) {
            tMiddle += add2table(order[i]);
          }

          const table = tHead + tMiddle + "</tbody></table>";
          res.send("success^^^" + table);
        } else {
          /* the customer hasn't order anything yet*/
          res.send("error1");
        }
      }
    });
  },

  /* show the customer order detail table */
  showDetail: function (req, res) {
    let tHead = '<table class="table table-striped table-bordered">';
    tHead += "<thead>";
    tHead += "<tr>";
    tHead += '<th class="col-md-3">Product ID</th>';
    tHead += '<th class="col-md-4">Product Name</th>';
    tHead += '<th class="col-md-1">Count</th>';
    tHead += '<th class="col-md-2">Price</th>';
    tHead += '<th class="col-md-2">Total</th>';
    tHead += "</tr></thead><tbody>";

    orderModel.findOne({ _id: req.body.data }, function (err, order) {
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        if (order) {
          let i = 0;
          if (tContent !== "") tContent = "";
          if (grandTotal != 0) grandTotal = 0;
          loopOrder(order, i, function (tContent) {
            //const tTotal = 0;
            let tTotal = "<tr>";
            tTotal += "<td></td> <td></td> <td></td> <td>Grand Total</td>";
            tTotal += "<td>$" + grandTotal.toFixed(2) + "</td>";
            tTotal += "</tr>";
            const table = tHead + tContent + tTotal + "</tbody></table>";
            res.send("success^^^" + table);
          });
        } //end if
        else {
          res.send("error");
        }
      }
    });
  },
};

function loopOrder(order, i, callback) {
  setTimeout(function () {
    if (i < order.orderInfo.length) {
      i++;

      setTimeout(function () {
        add2DetailTable(order.orderInfo[i - 1], function (detail) {
          const arr = detail.split("^^^");
          const trs = arr[0];
          grandTotal += parseFloat(arr[1]);
          tContent += trs;
        });

        loopOrder(order, i, callback);
      }, 20);
    } else {
      callback(tContent);
    }
  }, 30);
}

/* add content to the detail table */
function add2DetailTable(order, callback) {
  setTimeout(function () {
    const content = "";
    const total = 0;
    content += "<tr>";
    const arr = order.pid.split("***");
    content += "<td>" + arr[1] + "</td>";
    // using the product id to get the product name;
    getProductName(order.pid, function (product) {
      //callback returns the productName and productStatus with a ^^^ connection
      const parr = product.split("^^^");
      const productName = parr[0];
      const productStatus = parr[1];
      if (parr[1] === "removed") {
        productName += " <div id='p-status'>PRODUCT REMOVED</div>";
      }

      content += "<td>" + productName + "</td>";
      content += "<td>" + order.count + "</td>";

      content += "<td>$" + order.price + "</td>";
      total = parseInt(order.count) * parseFloat(order.price);
      content += "<td>$" + total + "</td>";
      content += "</tr>";
      callback(content + "^^^" + total);
    });
  }, 10);
}

/* fetch the product name */
function getProductName(id, callback) {
  setTimeout(function () {
    const arr = id.split("***");
    const groupId = arr[0];
    const productId = arr[1];

    productModel.findOne({ _id: groupId }, function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        if (docs) {
          const len = docs.products.length;

          for (let i = 0; i < len; i++) {
            if (docs.products[i]._id == productId) {
              const productName = docs.products[i].p_name;
              const productStatus = docs.products[i].p_status;
              callback(productName + "^^^" + productStatus);
            }
          }
        }
      }
    });
  }, 5);
}

/* add content to the order table */
function add2table(order) {
  const content = "";
  const id = order._id;
  const timestamp = order.timestamp;
  const date_time = formatTime(timestamp);

  content += "<tr>";
  content += "<td>" + date_time + "</td>";
  content += "<td>" + id + "</td>";
  content +=
    '<td><button type="button" class="btn btn-primary" id="orderDetails">Details</button></td>';
  content += "</tr>";

  return content;
}

/* show the formatted time on the order table */
function formatTime(time) {
  const year = time.getFullYear();
  const month = time.getMonth();
  const date = time.getDate();

  const dateText = month + "-" + date + "-" + year + " at ";

  const hours = time.getHours();
  const minutes = time.getMinutes();

  const timeText = hours % 12 === 0 ? 12 : hours % 12;
  timeText += ":";
  timeText += minutes < 10 ? "0" + minutes : minutes;
  timeText += hours < 12 ? " am" : " pm";

  const text = dateText + timeText;
  return text;
}
