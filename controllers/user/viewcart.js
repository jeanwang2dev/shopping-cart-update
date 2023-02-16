const productModel = require("../../models").Product;

let js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/user-viewcart.js"></script>';
js += '<script src="/public/js/user.js"></script>';

let tContent = "";

module.exports = {
  index: function (req, res) {
    if (req.session.success) {
      res.render("user/viewcart", {
        title: "User Home",
        heading: "View Cart",
        buyer: true,
        js: js,
      });
    } else {
      res.render("user/viewcart", {
        title: "User Home",
        heading: "View Cart..",
        user: true,
        js: js,
      });
    }
  },

  getProduct: function (req, res) {
    //console.log('load table...');
    let tHead = '<table class="table table-bordered">';
    tHead += "<thead><tr>";
    tHead += '<th class ="col-md-2">Image</th>';
    tHead += '<th class ="col-md-4">Product Name</th>';
    tHead += '<th class ="col-md-1">Price</th>';
    tHead += '<th class ="col-md-1">Amount</th>';
    tHead += '<th class ="col-md-2">Description</th>';
    tHead += '<th class ="col-md-2">Update</th>';
    tHead += "</tr></thead>";
    tHead += "<tbody>";

    const cart = JSON.parse(req.body.data);

    if (tContent !== "") {
      tContent = "";
    }

    if (cart) {

      for(let i = 0; i< cart.length; i++){
        const idArr = cart[i].pid.split("***");
        const gid = idArr[0];
        const pid = idArr[1];
        let amount = cart[i].count;

        // console.log('gid: '  + gid);
        // console.log('pid: ' + pid);

        productModel
          .findOne({ _id: gid })
          .then( docs => {
            if(docs){
              let path = docs.imgFolder;
              tContent += "<tr>";
              for (let j = 0; j < docs.products.length; j++) {
                
                if (docs.products[j]._id == pid) {
                  //console.log('found');
                  //if I use '===' it won't match, don't know why
                  const imgPath = "/public/img/" + path + "/" + docs.products[j].p_imgId;
                  const pname = docs.products[j].p_name;
                  const price = docs.products[j].p_price;
                  const desc = docs.products[j].p_desc;
                  const id = gid + "***" + pid;
            
                  tContent +=
                    '<td> <img src="' + imgPath + '" class="img-thumbnail" ></td>';
                  tContent += "<td>" + pname + "</td>";
                  tContent += "<td> $" + price + "</td>";
                  tContent +=
                    '<td><input type="text" name="amount" id="p_amount" size="1" value="' +
                    amount +
                    '"></td>';
                  tContent +=
                    '<td desc="' +
                    desc +
                    '"><button type="button" class="btn btn-primary" id="desc">Description</button></td>';
                  tContent +=
                    '<td id="' +
                    id +
                    '"><button type="button" class="btn btn-success" id="update">Update</button></td>';
                  //console.log('tContent: ' + tContent);
                } //end if
              }
              tContent += "</tr>";
            }
          })
          .catch(err => {
          console.log(err);
        })

      }

      //console.log('tContent: ' + tContent);
      setTimeout(function () {
        let table = tHead + tContent + "</tbody></table>";
        //console.log('table: ' + table);
        res.send("success^^^" + table);
      }, 500 );

      // loopCart(cart, i, function () {
        
      //   let table = tHead + tContent + "</tbody></table>";
      //   res.send("success^^^" + table);
      // });
    }
  },
};

// /* loop through the shopping cart */
// function loopCart(cart, i, callback) {

//   setTimeout(function () {
//     if (i < cart.length) {
//       i++;

//       setTimeout(function () {
//         const idArr = cart[i - 1].pid.split("***");
//         const gid = idArr[0];
//         const pid = idArr[1];

//         console.log('gid: '  + gid);
//         console.log('pid: ' + pid);

//         let amount = cart[i - 1].count;
//         let id = cart[i - 1].id;

//         productModel.findOne({ _id: gid }, function (err, docs) {
//           if (err) {
//             console.log(err);
//           } else {
//             if (docs) {
//               let path = docs.imgFolder;
//               search4product(gid, pid, path, amount, docs);
//             } //end if
//           } //end else
//         });

//         loopCart(cart, i, callback);
//       }, 10);
//     } else {
//       callback();
//     }
//   }, 20);
// }

/* search for the product by the product id and get the product info then add to the table */
function search4product(gid, pid, path, amount, docs) {
  //console.log('search!');
  tContent += "<tr>";
  for (let i = 0; i < docs.products.length; i++) {
    if (docs.products[i]._id == pid) {
      //if I use '===' it won't match, don't know why

      const imgPath = "/public/img/" + path + "/" + docs.products[i].p_imgId;
      const pname = docs.products[i].p_name;
      const price = docs.products[i].p_price;
      const desc = docs.products[i].p_desc;
      const id = gid + "***" + pid;

      tContent +=
        '<td> <img src="' + imgPath + '" class="img-thumbnail" ></td>';
      tContent += "<td>" + pname + "</td>";
      tContent += "<td> $" + price + "</td>";
      tContent +=
        '<td><input type="text" name="amount" id="p_amount" size="1" value="' +
        amount +
        '"></td>';
      tContent +=
        '<td desc="' +
        desc +
        '"><button type="button" class="btn btn-primary" id="desc">Description</button></td>';
      tContent +=
        '<td id="' +
        id +
        '"><button type="button" class="btn btn-success" id="update">Update</button></td>';
    } //end if
  }
  tContent += "</tr>";
  return tContent;
  //console.log("end for search4product");//end for
}
