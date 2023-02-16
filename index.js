/* Set up your main variables */
const express = require('express'),
	config = require('./server/configure'),
	mongoose = require('mongoose');
	require('dotenv').config();
let app = express();

const { db_username, db_password, db_name, port } = require('./util/config');

const MONTGODB_URI = "mongodb+srv://" + db_username + ":" + db_password +"@cluster0.beflvhp.mongodb.net/" + db_name + "?retryWrites=true&w=majority";


/* Call the module.exports constructor function of the configure file
This adds to app and returns app
This is done so we do not have to write a bunch of code in our index file.*/
app = config(app);

/* Set the port */
app.set('port', port);
/* Make the views directory to serve up the files within that directory */
app.set('views', __dirname + '/views');

/* Connect to mongoose */
mongoose.set('strictQuery', true);
mongoose
  .connect( MONTGODB_URI)
  .then(result=> {
    console.log("Mongoose Connected.");
    app.listen(app.get('port'),function(){
		console.log('Server up : http://YOURSERVERIP:' + app.get('port'));
	}); 
  })
  .catch((err) => {
    console.log(err);
  });

/* need to do this to prevent promise error from happening */
mongoose.Promise = global.Promise;


/* Make Mongoose use `findOneAndUpdate()`. Note that this option is `true` */
//mongoose.set('useFindAndModify', false);


/*
http.createServer(app).listen(app.get('port'),'localhost');
console.log('Server running at http://localhost:8080/'); */

/* //Listen on port 80
http.createServer(app).listen(8080);

https.createServer(options, app).listen(app.get('port'),function(){
	console.log('Server up : https://YOURSERVERIP:' + app.get('port'));
}); */


//LISTEN ON PORT 5000 
// app.listen(app.get('port'),function(){
// 	console.log('Server up : http://YOURSERVERIP:' + app.get('port'));
// }); 
