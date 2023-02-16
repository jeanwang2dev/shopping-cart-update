/* product model */
const productModel = require("../../models").Product;
/* mkdir -p module */
const mkdirp = require("mkdirp");

let js = '<script src="/public/js/Ajax.js"></script>';
js += '<script src="/public/js/admin.js"></script>';

module.exports = {
  //this provides the content for the index page
  index: function (req, res) {
    res.render("admin/add-product-group", {
      title: "Admin Area",
      heading: "Admin Add Group",
      admin: true,
      admin_head: true,
      js: js,
    });
  },

  // add product group
  addGroup: function (req, res) {
    console.log("addGroup... ");

    const data = JSON.parse(req.body.data);

    /* save all the varibles in lowerCase */
    const productData = {};
    productData.groupName = data.groupName.toLowerCase();
    productData.imgFolder = data.imgFolder.toLowerCase();

    /*if there is space in the imgFolder name, replace the space with dash */
    const str = productData.imgFolder;
    if (str.split(" ").length != 1) {
      str = str.replace(/\s/gi, "-");
    }
    productData.imgFolder = str;

    const product = new productModel(productData);

    /*search the database if there is a same groupName exisit already
		 if it does exisit then send error1, else save the data*/
    productModel.findOne(
      { groupName: productData.groupName },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          if (docs) {
            console.log(
              "group name " + productData.groupName + " already exist!"
            );
            res.send("error1");
          } else {
            product.save(function (err) {
              if (err) {
                res.send("error");
              } else {
                  console.log(productData.imgFolder);
                  mkdirp("./public/img/" + productData.imgFolder)
                    .then( () => {
                      res.send("success");
                    })
                    .catch(err => {
                      console.log(err);
                    });
                  
              }
            });
          }
        }
      }
    );
  },
};
