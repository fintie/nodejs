var application_root = __dirname,
    express = require("express"),
	mysql = require('mysql'),
	ejs = require('ejs'),
    path = require("path");
    
var app = express();

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database: "plan7984"
	});

// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api', function (req, res) {
	  res.send('Our Sample API is up...');
	});

app.get('/getallcustomers', function (req, res) {
	   connection.query('SELECT * FROM customers;', function (error, rows, fields) { 
	         res.writeHead(200, {'Content-Type': 'text/plain'});
			 str='';
			 for(var i=0;i<rows.length;i++)
				str += rows[i].entityname +'\n';
			 res.end( str);
	      }); 
	});
app.get('/selectcustomer', function (req, res){
	   connection.query("SELECT ID, code FROM customers;", function (error, rows, fields) {
		   var output = '<html><head></head><body><form name="input" action="http://127.0.0.1:1212/insertestimate" method="post"><select name="code">';
		   for (var i in rows) {
			   output += '<option value=' + rows[i].ID + '>' + rows[i].code + '</option>';
		   }
		   output += '</select><input type="submit" value="Select"></form></body></html>';
		   res.writeHead(200, {'Content-Type': 'text/html'});
		   res.end(output);
	   });
});

app.get('/selectestimate', function (req, res){
	connection.query("SELECT ID FROM estimates;", function (error, rows, fields) {
		   var output = '<html><head></head><body><form name="input" action="http://127.0.0.1:1212/milestone" method="post"><select name="estimate">';
		   for (var i in rows) {
			   output += '<option value=' + rows[i].ID + '>' + rows[i].ID + '</option>';
		   }
		   output += '</select><input type="submit" value="Select"></form></body></html>';
		   res.writeHead(200, {'Content-Type': 'text/html'});
		   res.end(output);
	   });
});		

app.get('/customer/:id', function (req, res){
	connection.query('SELECT * FROM customers where id ='+req.params.id, function (error, rows, fields) { 
         res.writeHead(200, {'Content-Type': 'text/plain'});
		 str='';
		 if(rows.length==0)
		 {
			res.end( 'no such record found...');
			// break;
		 }
		 else
		 {
			str = str + 'Customer is '+ rows[0].entityname +'\n';
			res.end( str);
		}
      }); 
});

app.post('/insertcustomer', function (req, res){
	  console.log("POST: ");

	  entity = req.body.entity;
	  abn = req.body.abn;
	  code = req.body.code;
 
	  console.log('insert into customers ( entityname , ABN , Code) values (' + "'" + entity +"'" +',' + "'"+ abn +"'" +',' + "'"+ code + "'" +');');
	  connection.query('insert into customers ( entityname , ABN , Code) values (' + "'" + entity +"'" +',' + "'"+ abn +"'" +',' + "'"+ code + "'" +');', function (error, rows, fields) { 
			// console.log(error);
	         res.writeHead(200, {'Content-Type': 'text/html'});
	         res.end( 'customer created');
		}); 
});


app.post('/insertestimate', function (req, res){
	   console.log("POST: ");
	   
	   customerid = req.body.code;
	   //code = req.body.code;
	   
	   console.log('INSERT INTO estimates ( CustomerID ) values (' + "'" + customerid +"'" +');');
	   connection.query('INSERT INTO estimates ( CustomerID ) values (' + "'" + customerid +"'"  +');', function (error, rows, fields) { 
		   
		   estimateid = res.insertId;

		   //res.writeHead(200, {'Content-Type': 'text/plain'});
		   //res.writeHead(200, {'Set-Cookie': customerid, 'Content-Type': 'text/plain'});
		   //res.cookie(customerid);
		   res.render('milestone.ejs');
		   res.end();
		   //res.end('estimate created<br><a href="http://localhost/nodejs/index.html">Home</a>');
	   });
});

app.post('/milestone', function (req, res){
	   console.log("POST: ");
	   
	   estimateid = req.body.estimate;
	   //code = req.body.code;
	   
	   connection.query("SELECT Classification, Billingrate FROM milestones WHERE EstimateID = 80;" , function (error, rows, fields) { 
		   classification = rows[0].Classification;
		   billingrate = rows[0].Billingrate;
		   
		   res.render('multiplemilestones.ejs');
		   res.end();
	   });
});

/*
app.post('/existingmenu', function (req. res){
	var output = '<input type="submit" value="Vary" onclick="http://127.0.0.1:1212/milestone ">';
		res.end();
	
});
*/

app.post('/display', function (req, res){

	  hours = req.body.hours;
	  deadline = req.body.deadline;
	  billingrate = req.body.billingrate;
	  classification = req.body.classification;
	  
	  console.log('display all details on the page');

	  //res.cookie(hours,deadline,billingrate);
	  res.render('display.ejs');
	  res.end();
});	  

app.post('/savemilestone', function (req, res){
	   console.log("POST: ");
	   
	   //code = req.body.code;
	   
	   console.log('INSERT INTO milestones ( EstimateID, Classification, Billingrate ) values (' + "'" + customerid +"'"  +',' + "'"+ classification +"'" +',' + "'"+ billingrate + "'" +');');
	   console.log('INSERT INTO activity ( Hours, Deadline ) values (' + "'" + hours +"'"  +',' + "'"+ deadline +"'" +');');
	   //connection.query('INSERT INTO milestones ( EstimateID, Classification, Billingrate ) values (' + "'" + customerid +"'" +',' + "'"+ classification +"'" +',' + "'"+ billingrate + "'" +');', function (error, rows, fields) { 
	   connection.query("INSERT INTO milestones (EstimateID, Classification, Billingrate ) VALUES (" + "'" + customerid + "'" + "," + "'" + classification + "'" + "," + "'" + billingrate + "'" +") INSERT INTO activity ( Hours, Deadline ) values (" + "'" + hours +"'"  +"," + "'"+ deadline +"'" +");", function (error, rows, fields) {
		   
	         res.writeHead(200, {'Content-Type': 'text/html'});
	         res.end( 'estimate has been created');
		   //res.end('estimate created<br><a href="http://localhost/nodejs/index.html">Home</a>');
	   });
});

// Launch server
app.listen(1212);