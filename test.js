var application_root = __dirname,
express = require("express"),
mysql = require('mysql'),
ejs = require('ejs'),
path = require("path");

var app = express();

var connection = mysql.createConnection({
	/*
	host : "plan7984.db.11656559.hostedresource.com",
	user : 'plan7984',
	password : 'PL@n7984',
	*/
	host : 'localhost',
	user : 'root',
	database: 'plan7984'
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
		var output = '<html><head></head><body><form name="input" action="http://127.0.0.1:1212/milestonepage" method="post"><select name="code">';
		for (var i in rows) {
			output += '<option value=' + rows[i].ID + '>' + rows[i].code + '</option>';
		}
		output += '</select><select name="mnumber">';
		for (var m=1; m<9; m++) {
			output += '<option value=' + m + '>' + m + '</option>';
		}
		output += '</select><input type="submit" value="Proceed"></form></body></html>';
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(output);
	});
});

app.get('/selectestimate', function (req, res){
	connection.query("SELECT ID FROM estimates;", function (error, rows, fields) {
		var output = '<html><head></head><body><form name="input" action="http://127.0.0.1:1212/generate" method="post"><select name="estimate">';
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


app.post('/milestonepage', function (req, res){

	customerid = req.body.code;
	number = req.body.mnumber;
	var output = '<html><body><form name="input" action="http://127.0.0.1:1212/generate" method="post">';
	output += 'Customer ID:' + customerid + '<br>'; 
	for (var i = 0; i < number; i++)
	{
		output += '<br>Classification:<select name="classification"><option value="appointment">Appointment</option><option value="formative">Formative</option>';
		output += '<option value="consulting">Consulting</option><option value="scoping">Scoping</option><option value="design">Design</option>';
		output += '<option value="slicing">Slicing</option><option value="development">Development</option><option value="deployment">Deployment</option>';
		output += '<option value="fixes">Fixes</option><option value="support">Support</option><option value="payment">Progress Payment</option>';
		output += '<option value="production">Production</option></select>';
		output += '<br>Hours: <input type="text" name="hours">';
		//output += '<br>Rate: <input type="text" name="rate">';
		output += '<br>Trigger:<select name="trigger"><option value="approval">Estimate approval</option><option value="premilestone">The Previous milestone</option>';
		output += '<option value="today">Today\'s date</option><option value="scoping">Scoping completed</option></select>';
		output += '<br>Deadline: <input type="text" name="deadline"><br>';
		//output += '<br>Resource:<select name="resource"><option value="10">10</option><option value="20">20</option></select><br>';
	}
	output += '<br><input type="submit" value="Generate"><input type="button" value="Cancel"></form></body></html>';

	res.end(output);

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
	deadline = req.body.deadline;
	trigger = req.body.trigger;
	resource = req.body.resource;

	console.log('display all details on the page');

	//res.cookie(hours,deadline,billingrate);
	res.render('display.ejs');
	res.end();
});	  



app.post('/generate', function (req, res){

	classification = req.body.classification;
	hours = req.body.hours;
	trigger = req.body.trigger;
	deadline = req.body.deadline;
	producer = 'user';

	//insert estimate

	console.log('INSERT INTO estimates ( CustomerID ) values (' + "'" + customerid +"'" +');');
	connection.query('INSERT INTO estimates ( CustomerID ) values (' + "'" + customerid +"'"  +');', function (req, res) {
	//connection.query('INSERT INTO estimates ( CustomerID ) values (' + "'" + customerid +"'"  +');');
		
		eid = res.insertId;
		


		for (var i=0; i<number; i++){
			//insert milestone
			console.log('INSERT INTO activity (EstimateID, Classification, Hours, Deadline) values ("'+ eid + '","' + classification[i] +'","' + hours[i] + '","' + deadline[i] +'");');
			connection.query('INSERT INTO activity (EstimateID, Classification, Hours, Deadline) values ("'+ eid + '","' + classification[i] +'","' + hours[i] + '","' + deadline[i] +'");');

			console.log('INSERT INTO milestones ( EstimateID) values (' + "'" + eid +"'" +');');
		
			connection.query('INSERT INTO milestones (EstimateID) values (' + "'" + eid +"'" +');', function (req, res) {
				mid = res.insertId;
				connection.query('UPDATE activity SET MilestoneID = "' + mid  +'" WHERE EstimateID = "' + eid + '";');
			});
		}
			

	});

/*	
	for (var i=0; i<number; i++){
		console.log('INSERT INTO activity (Classification, Hours, Deadline) values ("' + classification[i] +'","' + hours[i] + '","' + deadline[i] +'");');
		connection.query('INSERT INTO activity (Classification, Hours, Deadline) values ("' + classification[i] +'","' + hours[i] + '","' + deadline[i] +'");');
		
	}
*/
			res.render('display.ejs');
			res.end();
});

app.post('/updateactivity', function (req, res){

	customerid = req.body.code;
	//var classification = new Array();
	var output = '<html><body><form name="input" action="http://127.0.0.1:1212/regenerate" method="post">';
	output += 'Customer ID:' + customerid + '<br>'; 
	for (var i = 0; i < number; i++)
	{
		output += '<br>Producer:<select name="producer"><option>Choice</option></select>';
		output += '<br>Pricing method:<input type="radio" name="pricingmethod" value="proportion">Proportion<input type="radio" name="pricingmethod" value="rate">Rate<input type="radio" name="pricingmethod" value="manual">Manual';
		output += '<br>Price: <input type="text" name="price">';
		output += '<br>Classification:<select name="classification"><option value="appointment">Appointment</option><option value="formative">Formative</option>';
		output += '<option value="consulting">Consulting</option><option value="scoping">Scoping</option><option value="design">Design</option>';
		output += '<option value="slicing">Slicing</option><option value="development">Development</option><option value="deployment">Deployment</option>';
		output += '<option value="fixes">Fixes</option><option value="support">Support</option><option value="payment">Progress Payment</option>';
		output += '<option value="production">Production</option></select>';
		output += '<br>Hours: <input type="text" name="hours">';
		//output += '<br>Rate: <input type="text" name="rate">';
		output += '<br>Trigger:<select name="trigger"><option value="approval">Estimate approval</option><option value="premilestone">The Previous milestone</option>';
		output += '<option value="today">Today\'s date</option><option value="scoping">Scoping completed</option></select>';
		output += '<br>Deadline: <input type="text" name="deadline">';
		output += '<br>Consideration: <input type="text" name="consideration"><br>';
		//output += '<br>Resource:<select name="resource"><option value="10">10</option><option value="20">20</option></select><br>';
	}
	output += '<br><input type="submit" value="Regenerate"><input type="button" value="Cancel"></form></body></html>';

	res.end(output);

});

app.get('/selectappestimate', function (req, res){
	connection.query("SELECT e.ID FROM estimates e, milestones m, activity a WHERE e.ID = m.EstimateID AND m.ID = a.MilestoneID AND a.Status = 'Published';", function (error, rows, fields) {
		var output = '<html><head></head><body><form name="input" action="http://127.0.0.1:1212/customerapproval" method="post"><select name="estimate">';
		for (var i in rows) {
			output += '<option value=' + rows[i].ID + '>' + rows[i].ID + '</option>';
		}
		output += '</select><input type="submit" value="Select"></form></body></html>';
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(output);
	});
});	

app.post('/customerapproval', function (req, res){
	
	estimateid = req.body.estimate;
	res.render('approvaldisplay.ejs');
	res.end();
	
});

app.post('/approve', function (req, res){
	console.log(estimateid);
	connection.query('SELECT * FROM activity WHERE EstimateID = '+ estimateid +';' , function (error, rows, fields) { 
		milestoneid = rows[0].MilestoneID;
		classification = rows[0].Classification;
		hours = rows[0].Hours;
		deadline = rows[0].Deadline;

		console.log(milestoneid);
		connection.query('INSERT INTO activity(EstimateID, MilestoneID, Classification, Hours, Deadline, Status) VALUES("' + estimateid + '", "' + milestoneid + '", "' + classification + '", "' + hours + '", "' + deadline + '", "Approved" );', function (error, rows, fields) {
			res.end( 'The estimate has been approved');
		});		
		
	});

});

// Launch server
app.listen(1212);