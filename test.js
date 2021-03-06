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

app.get('/', function (req, res) {
	res.render('index.ejs');
	res.end();
});

app.get('/internal' , function (req, res) {
	res.render('internal.ejs');
	res.end();
});

app.get('/external' , function (req, res) {
	res.render('external.ejs');
	res.end();
});

app.get('/customerpage', function (req, res) {
	res.render('customer.ejs');
	res.end();
});

app.get('/addcustomerpage', function (req, res) {
	res.render('addcustomer.ejs');
	res.end();
});

app.get('/estimatepage', function (req, res) {
	res.render('estimate.ejs');
	res.end();
});

app.get('/timepage', function (req, res) {
	var output = '<html><form name="input" action="/choosedate" method="post">';
	output += 'Reference Date: <input type="date" name="reference">';
	output += '<button type="submit" class="btn">Proceed</button>';
	output += '<button type="submit" class="btn">Cancel</button></form></html>';
	res.end(output);
});


app.get('/management', function (req, res) {
	res.render('management.ejs');
	res.end();
});

app.get('/adduser', function (req, res) {
	res.render('adduser.ejs');
	res.end();
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
		var output = '<html><head></head><body><form name="input" action="/milestonepage" method="post"><select name="code">';
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
		var output = '<html><head></head><body><form name="input" action="/generateexisting" method="post"><select name="estimate">';
		for (var i in rows) {
			output += '<option value=' + rows[i].ID + '>' + rows[i].ID + '</option>';
		}
		output += '</select><input type="submit" value="Select"></form></body></html>';
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(output);
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
	var output = '<html><body><form name="input" action="/generate" method="post">';
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
	output += '<br><input type="submit" value="Generate"><input type="button" value="Cancel" onclick="window.location = \'/selectcustomer\' "></form></body></html>';

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
	});
});

/*

app.post('/milestone', function (req, res){
	console.log("POST: ");

	estimateid = req.body.estimate;

	connection.query("SELECT Classification, Billingrate FROM milestones WHERE EstimateID = 80;" , function (error, rows, fields) { 
		classification = rows[0].Classification;
		billingrate = rows[0].Billingrate;

		res.render('multiplemilestones.ejs');
		res.end();
	});
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
	//consideration = req.body.consideration;
	producer = 'user';

	//insert estimate

	console.log('INSERT INTO estimates ( CustomerID ) values (' + "'" + customerid +"'" +');');
	connection.query('INSERT INTO estimates ( CustomerID ) values (' + "'" + customerid +"'"  +');', function (req, res) {
	//connection.query('INSERT INTO estimates ( CustomerID ) values (' + "'" + customerid +"'"  +');');
		
		estimateid = res.insertId;
		
/*
		console.log('INSERT INTO estimates (method, price) VALUES ("' + method +'","' + price + '") WHERE ID = "' + estimateid + '";');
		connection.query('INSERT INTO estimates (method, price) VALUES ("' + method +'","' + price + '") WHERE ID = "' + estimateid + '";');
*/
		limit = number;
		for (var i=0; i<number; i++){
			if(number==1){
				console.log('INSERT INTO activity (EstimateID, DateTime, Classification, Hours, Deadline) values ("'+ estimateid + '", NOW(), "' + classification +'","' + hours + '","' + deadline +'");');
				connection.query('INSERT INTO activity (EstimateID, DateTime, Classification, Hours, Deadline) values ("'+ estimateid + '", NOW(), "' + classification +'","' + hours + '","' + deadline +'");');

			}
			else{
				console.log('INSERT INTO activity (EstimateID, DateTime, Classification, Hours, Deadline) values ("'+ estimateid + '", NOW(), "' + classification[i] +'","' + hours[i] + '","' + deadline[i] +'");');
				connection.query('INSERT INTO activity (EstimateID, DateTime, Classification, Hours, Deadline) values ("'+ estimateid + '", NOW(), "' + classification[i] +'","' + hours[i] + '","' + deadline[i] +'");');
			}
			//insert milestone
			console.log('INSERT INTO milestones ( EstimateID) values (' + "'" + estimateid +"'" +');');
		
			connection.query('INSERT INTO milestones (EstimateID) values (' + "'" + estimateid +"'" +');', function (req, res) {

				milestoneid = res.insertId;
					

				//console.log(limit);
				
				console.log('UPDATE activity SET MilestoneID = "' + milestoneid  +'" WHERE EstimateID = "' + estimateid + '" ORDER BY ID DESC LIMIT ' + limit + ';');
				connection.query('UPDATE activity SET MilestoneID = "' + milestoneid  +'" WHERE EstimateID = "' + estimateid + '" ORDER BY ID DESC LIMIT ' + limit + ';');
				limit--;
					
				
			});
		}
			

	});

			res.render('display.ejs');
			res.end();
});

app.post('/publish', function (req, res){
	
	console.log(classification);
	for (var i=0; i<number; i++){
		if(number==1){
			console.log('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion) values ("'+ estimateid +'","' + milestoneid +'", NOW(), "Published","' + classification +'","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + consideration +'");');
			connection.query('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion) values ("'+ estimateid +'","' + milestoneid +'", NOW(), "Published","' + classification +'","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + consideration +'");');

		}
		else{
			console.log('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion) values ("'+ estimateid +'","' + milestoneid +'", NOW(), "Published","' + classification[i] +'","' + hours[i] + '","' + trigger[i] + '","' + deadline[i] + '","' + producer[i] + '","' + consideration[i] +'");');
			connection.query('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion) values ("'+ estimateid +'","' + milestoneid +'", NOW(), "Published","' + classification[i] +'","' + hours[i] + '","' + trigger[i] + '","' + deadline[i] + '","' + producer[i] + '","' + consideration[i] +'");');
		}

	}	
	res.render('internal.ejs');
	res.end();
});

app.post('/generateexisting', function(req, res){

	estimateid = req.body.estimate;

	console.log('SELECT COUNT(m.ID) as counts, m.ID FROM estimates e, milestones m WHERE e.ID = m.EstimateID AND e.ID = "'+ estimateid +'";');
	connection.query('SELECT COUNT(m.ID) as counts, m.ID FROM estimates e, milestones m WHERE e.ID = m.EstimateID AND e.ID = "'+ estimateid +'";', function (error, rows, fields) {
			
			number = rows[0].counts;
			/*
			for(var i=0; i<rows.length;i++){
				milestoneid = rows[i].ID;				
			}
			*/
	});

	console.log('SELECT e.CustomerID, e.price, e.method, a.MilestoneID, a.Classification, a.Hours, a.Trigger, a.Deadline, a.Producer, a.Proportion FROM estimates e, activity a WHERE e.ID = a.EstimateID AND a.EstimateID = "'+ estimateid +'" GROUP BY a.MilestoneID;');
	connection.query('SELECT e.CustomerID, e.price, e.method, a.MilestoneID, a.Classification, a.Hours, a.Trigger, a.Deadline, a.Producer, a.Proportion FROM estimates e, activity a WHERE e.ID = a.EstimateID AND a.EstimateID = "'+ estimateid +'" GROUP BY a.MilestoneID;', function (error, rows, fields) {

			var milestoneid = [];
			var classification = [];
			var hours = [];
			var trigger = [];
			var deadline = [];
			var consideration = [];
			customerid = rows[0].CustomerID;
			price = rows[0].price;
			method = rows[0].method;
			producer = rows[0].Producer;
			output = '<html><form name="input" action="/updateactivity" method="post"><br>Customer ID:' + customerid;
			output += '<br>Producer:' +  producer;
		for (var i in rows) {
			milestoneid[i] = rows[i].MilestoneID;
			classification[i] = rows[i].Classification;
			hours[i] = rows[i].Hours;
			trigger[i] = rows[i].Trigger;
			deadline[i] = rows[i].Deadline;
			consideration[i] = rows[i].Proportion;
			output += '<br><br>Milestone ID: ' + milestoneid[i];
			output += '<br>Classification: ' + classification[i];
			output += '<br>Hours: ' + hours[i];
			output += '<br>Trigger: ' + trigger[i];
			output += '<br>Deadline: ' + deadline[i];
			output += '<br>Consideration: ' + consideration[i];
		}
			output += '<input type="hidden" name="code" value="' + customerid + '"><br><br>';
			output += '<input type="hidden" name="mIDs" value="' + milestoneid + '"><br>';
			output += '<input type="hidden" name="price" value="' + price + '"><br>';
			output += '<input type="hidden" name="method" value="' + method + '"><br>';
			output += '<input type="hidden" name="classifications" value="' + classification + '"><br>';
			output += '<input type="hidden" name="hourss" value="' + hours + '"><br>';
			output += '<input type="hidden" name="triggers" value="' + trigger + '"><br>';
			output += '<input type="hidden" name="deadlines" value="' + deadline + '"><br>';
			output += '<input type="hidden" name="considerations" value="' + consideration + '"><br>';
			output += '<input type="submit" value="Edit"><input type="button" value="Finish" onclick="window.location = \'/\' " /></form>';
			output += '	<form name="input" action="/publish" method="post">	<input type="submit" value="Publish"> </form></html>';
	/*
		var customerid = [];
		var classification = [];
		var hours = [];
		var trigger = [];
		var deadline = [];
		for(var i=0; i<rows.length; i++){
			customerid.push(rows[i].CustomerID);
			classification.push(rows[i].Classification);
			hours.push(rows[i].Hours);
			trigger.push(rows[i].Trigger);
			deadline.push(rows[i].Deadline);
			
		}
	*/
		//console.log(milestoneid[0]);
		//console.log(classification[0]);
			//res.render('display.ejs');
		res.end(output);
	});
});

app.post('/updateactivity', function (req, res){

	price = req.body.price;
	method = req.body.method;
	milestoneids = req.body.mIDs;
	if(typeof milestoneids!=="undefined"){
		milestoneid = milestoneids.split(",");
	}
	customerid = req.body.code;
	classifications = req.body.classifications;
	if(typeof classifications!=="undefined"){
		classification = classifications.split(",");
	}
	hourss = req.body.hourss;
	if(typeof hourss!=="undefined"){
		hours = hourss.split(",");
	}
	triggers = req.body.triggers;
	if(typeof trigers!=="undefined"){
		trigger = triggers.split(",");
	}
	deadlines = req.body.deadlines;
	if(typeof deadlines!=="undefined"){
		deadline = deadlines.split(",");
	}
	considerations = req.body.considerations;
	if(typeof considerations!=="undefined"){
		consideration = considerations.split(",");
	}
	
	//estimateid = req.body.estimate;
	//console.log(customerid);
	//var classification = new Array();
	
	connection.query('SELECT ID FROM users WHERE Classification = "Production";', function (error, rows, fields) {
		
		

	//console.log(userid);
	var output = '<html><body><form name="input" action="/regenerate" method="post">';
	output += 'Customer ID:' + customerid + '<br>'; 
	output += 'Estimate ID:' + estimateid + '<br>';
	output += '<br>Producer:<select name="producer">';
	for (var n in rows) {
		output += '<option>'+ rows[n].ID +'</option>';
	}
	output += '</select><br>Pricing method:<input type="radio" name="method" value="proportion">Proportion<input type="radio" name="method" value="rate">Rate<input type="radio" name="method" value="manual">Manual';
	output += '<br>Price: <input type="text" name="price" value="' + price + '">';
	
	output += '<br><br>';
	for (var i = 0; i < number; i++)
	{
		output += '<br>Milestone ID:' + milestoneid[i];
		output += '<br>Classification:<select name="classification"><option value="appointment">Appointment</option><option value="formative">Formative</option>';
		output += '<option value="consulting">Consulting</option><option value="scoping">Scoping</option><option value="design">Design</option>';
		output += '<option value="slicing">Slicing</option><option value="development">Development</option><option value="deployment">Deployment</option>';
		output += '<option value="fixes">Fixes</option><option value="support">Support</option><option value="payment">Progress Payment</option>';
		output += '<option value="production">Production</option></select>';
		output += '<br>Hours: <input type="text" name="hours" value="' + hours[i] + '">';
		//output += '<br>Rate: <input type="text" name="rate">';
		output += '<br>Trigger:<select name="trigger"><option value="approval">Estimate approval</option><option value="premilestone">The Previous milestone</option>';
		output += '<option value="today">Today\'s date</option><option value="scoping">Scoping completed</option></select>';
		output += '<br>Deadline: <input type="text" name="deadline" value="' + deadline[i] + '">';
		if(typeof consideration!=="undefined"){
			output += '<br>Consideration: <input type="text" name="consideration" value="' + consideration[i] + '"><br>';
		}
		//output += '<br>Resource:<select name="resource"><option value="10">10</option><option value="20">20</option></select><br>';
	}
	output += '<br><input type="submit" value="Regenerate"><input type="button" value="Cancel" onclick="window.location = \'/\' "></form></body></html>';

	res.end(output);
	});
});

app.post('/regenerate', function (req, res){
	
	classification = req.body.classification;
	hours = req.body.hours;
	trigger = req.body.trigger;
	deadline = req.body.deadline;	
	producer = req.body.producer;
	method = req.body.method;
	price = req.body.price;
	consideration = req.body.consideration;

	console.log('UPDATE estimates SET method= "' + method +'", price="' + price + '" WHERE ID = "' + estimateid + '";');
	connection.query('UPDATE estimates SET method= "' + method +'", price="' + price + '" WHERE ID = "' + estimateid + '";');
	
	for (var i=0; i<number; i++){
		if(number==1){
			console.log('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Classification, Hours, `Trigger`, Deadline, Producer, Proportion) values ("'+ estimateid +'","' + milestoneid +'", NOW(), "' + classification +'","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + consideration +'");');
			connection.query('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Classification, Hours, `Trigger`, Deadline, Producer, Proportion) values ("'+ estimateid +'","' + milestoneid +'", NOW(), "' + classification +'","' + hours + '","' + trigger + '","'  + deadline + '","' + producer + '","' + consideration +'");');
		}
		else{
			console.log('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Classification, Hours, `Trigger`, Deadline, Producer, Proportion) values ("'+ estimateid +'","' + milestoneid[i] +'", NOW(), "' + classification[i] +'","' + hours[i] + '","' + trigger[i] + '","' + deadline[i] + '","' + producer + '","' + consideration[i] +'");');
			connection.query('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Classification, Hours, `Trigger`, Deadline, Producer, Proportion) values ("'+ estimateid +'","' + milestoneid[i] +'", NOW(), "' + classification[i] +'","' + hours[i] + '","' + trigger[i] + '","'  + deadline[i] + '","' + producer + '","' + consideration[i] +'");');
		}

	}	
	res.render('display.ejs');
	res.end();
	
});

app.get('/selectappestimate', function (req, res){
	connection.query("SELECT DISTINCT e.ID FROM estimates e, milestones m, activity a WHERE e.ID = m.EstimateID AND m.ID = a.MilestoneID AND a.Status = 'Published';", function (error, rows, fields) {
		var output = '<html><head></head><body><form name="input" action="/customerapproval" method="post"><select name="estimate">';
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
	connection.query('SELECT * FROM activity WHERE EstimateID = '+ estimateid +' AND ID = any (SELECT MAX(ID) FROM activity GROUP BY EstimateID) AND Status = "Published";' , function (error, rows, fields) { 
		for (var i in rows) {
			milestoneid = rows[i].MilestoneID;
			classification = rows[i].Classification;
			hours = rows[i].Hours;
			trigger = rows[i].Trigger;
			deadline = rows[i].Deadline;
			producer = rows[i].Producer;
			proportion = rows[i].Proportion;


			//console.log(milestoneid);
			console.log('INSERT INTO activity(EstimateID, MilestoneID, DateTime, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Status) VALUES("' + estimateid + '", "' + milestoneid + '", NOW(), "' + classification + '", "' + hours + '", "' + trigger + '", "' + deadline + '", "' + producer + '", "' + proportion + '", "Approved" );');
			connection.query('INSERT INTO activity(EstimateID, MilestoneID, DateTime, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Status) VALUES("' + estimateid + '", "' + milestoneid + '", NOW(), "' + classification + '", "' + hours + '", "' + trigger + '", "' + deadline + '", "' + producer + '", "' + proportion + '", "Approved" );');
		
		}
		res.render('external.ejs');
		res.end();
		
	});

});

app.post('/insertuser', function (req, res){
	console.log("POST: ");

	firstname = req.body.firstname;
	lastname = req.body.lastname;
	email = req.body.email;
	mobile = req.body.mobile;
	classification = req.body.classification;

	console.log('insert into users ( firstname , lastname , email, mobile, Classification) values ("' + firstname + '", "' + lastname + '", "' + email + '", "' + mobile + '", "' + classification +'");');
	connection.query('insert into users ( firstname , lastname , email, mobile, Classification) values ("' + firstname + '", "' + lastname + '", "' + email + '", "' + mobile + '", "' + classification +'");', function (error, rows, fields) { 
			// console.log(error);
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end( 'user created');
		}); 
});

app.post('/choosedate', function (req, res){
	date = req.body.reference;
	console.log('Date selected:' + date);
	console.log('SELECT MilestoneID FROM activity WHERE ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND Status= "Approved";');
	connection.query('SELECT MilestoneID FROM activity WHERE ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND Status= "Approved";', function (error, rows, fields) {
		var output = '<html><head></head><body><form name="input" action="/updatetime" method="post">Milestone: <select name="milestone">';
		for (var i in rows) {
			output += '<option value=' + rows[i].ID + '>' + rows[i].ID + '</option>';
		}		
		output += '</select><br>';
		output += '<input type="checkbox" name="finished"> Finished	<br>Time:	<input type="text" name="time">	<br>';
		output += '<input type="submit" value="Submit">	<input type="button" value="Cancel" onclick="window.location = \'/\' " />';
		res.end(output);
	});
	/*
	console.log('SELECT MilestoneID, Classification, Hours FROM activity WHERE Reference="'+ date +'";');
	connection.query('SELECT MilestoneID, Classification, Hours FROM activity WHERE Reference="'+ date +'";', function (error, rows, fields) {
			milestoneid = rows[0].MilestoneID;
			classification = rows[0].Classification;
			hours = rows[0].Hours;
			
			res.render('assigntime.ejs');
			res.end();
		});
	*/
	
});

app.post('/updatetime', function (req, res){
	
	milestoneid = req.body.milestone;
	finished = req.body.finished;
	time = req.body.time;
	if(finished=='on')
		{
			finished = 'Executed';
		}
	else
		{
			finished = 'Approved';
		}
	console.log('SELECT EstimateID, Classification, Hours, `Trigger`, Deadline, Proportion FROM activity WHERE milestoneID="'+ milestoneid +'" ORDER BY ID DESC;');
	connection.query('SELECT EstimateID, Classification, Hours, `Trigger`, Deadline, Proportion FROM activity WHERE milestoneID="'+ milestoneid +'" ORDER BY ID DESC;', function (error, rows, fields) {
		
		estimateid = rows[0].EstimateID;
		classification = rows[0].Classification;
		hours = rows[0].Hours;
		trigger = rows[0].Trigger;
		deadline = rows[0].Deadline;
		producer = rows[0].Producer;
		proportion = rows[0].Proportion;
	
		console.log('INSERT INTO activity (MilestoneID, EstimateID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + milestoneid + '", "'+ estimateid + '", NOW(), "' + finished +'","' + classification + '","' + hours + '","' + trigger + '","' + deadline + '", "' + producer + '","' + proportion + '","' + time + '","' + date +'");');
		connection.query('INSERT INTO activity (MilestoneID, EstimateID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + milestoneid + '", "'+ estimateid + '", NOW(), "' + finished +'","' + classification + '","' + hours + '","' + trigger + '","' + deadline + '", "' + producer + '","' + proportion + '","' + time + '","' + date +'");');

		res.render('internal.ejs');
		res.end();
	});
});

app.get('/checklist', function (req,res){
	connection.query("SELECT MilestoneID FROM activity WHERE ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND Status= 'Executed';", function (error, rows, fields) {
			var output = '<html><head></head><body><form name="input" action="/displaymilestone" method="post"><select name="milestone">';
			for (var i in rows) {
				output += '<option value=' + rows[i].MilestoneID + '>' + rows[i].MilestoneID + '</option>';
			}
			output += '</select><input type="submit" value="Proceed"></form><form action="/estimatepage"><input type="submit" value="Back"></form></body></html>';
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(output);
		});
});	

app.post('/displaymilestone', function(req,res){

	milestoneid = req.body.milestone;
	console.log('SELECT e.CustomerID, a.EstimateID, a.Status, a.Producer, a.Classification, a.Hours, a.Trigger, a.Deadline, a.Proportion FROM estimates e, activity a WHERE a.ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND e.ID = a.EstimateID AND a.MilestoneID="'+ milestoneid +'";');
	connection.query('SELECT e.CustomerID, a.EstimateID, a.Status, a.Producer, a.Classification, a.Hours, a.Trigger, a.Deadline, a.Proportion FROM estimates e, activity a WHERE a.ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND e.ID = a.EstimateID AND a.MilestoneID="'+ milestoneid +'";', function (error, rows, fields) {
			customerid = rows[0].CustomerID;
			estimateid = rows[0].EstimateID;
			producer = rows[0].Producer;
			classification = rows[0].Classification;
			hours = rows[0].Hours;
			trigger = rows[0].Trigger;
			deadline = rows[0].Deadline;
			proportion = rows[0].Proportion;
			status = rows[0].Status;
			

			console.log('display all details on the page');
			console.log(status);
			//res.cookie(hours,deadline,billingrate);
			if(status=='Executed'){
				res.render('checkliststatus.ejs');
			}
			if(status=='Checked'){
				res.render('completionpage.ejs');
			}
			if(status=='Complete'){
				res.render('invoicepage.ejs');
			}
			if(status=='Invoiced'){
				connection.query('SELECT a.Proportion, a.Hours, e.method, e.price FROM activity a, estimates e WHERE a.ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND MilestoneID= "' + milestoneid +'" AND a.EstimateID = e.ID;', function (error, rows, fields) {
					consideration = rows[0].Proportion;
					hours = rows[0].Hours;
					method = rows[0].method;
					price = rows[0].price;
					console.log('consideration: ' + consideration);
					console.log('hours: ' + hours);
					console.log('method: ' + method);
					console.log('price: ' + price);
					if(method=='proportion'){
						milestoneprice = price * consideration;
					}
					if(method=='rate'){
						milestoneprice = hours * consideration;
					}
					if(method=='manual'){
						milestoneprice = consideration;
					}
					res.render('printinvoice.ejs');
				});
			}
			res.end();	
		});	
	

});

app.post('/updatestatus', function(req,res){
	status = req.body.status;
	console.log('SELECT EstimateID, Classification, Hours, `Trigger`, Deadline, Proportion, Resource, Time, Reference FROM activity WHERE MilestoneID="'+ milestoneid +'" ORDER BY ID DESC;');
	connection.query('SELECT EstimateID, Classification, Hours, `Trigger`, Deadline, Proportion, Resource, Time, Reference FROM activity WHERE MilestoneID="'+ milestoneid +'" ORDER BY ID DESC;', function (error, rows, fields) {
			estimateid = rows[0].EstimateID;
			classification = rows[0].Classification;
			hours = rows[0].Hours;
			trigger = rows[0].Trigger;
			deadline = rows[0].Deadline;
			proportion = rows[0].Proportion;
			resource = rows[0].Resource;
			time = rows[0].Time;
			date = rows[0].Reference;
	if(status=='satisfactory'){
		console.log('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + estimateid +'", "' + milestoneid +'", NOW(), "Checked", "' + classification + '","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + proportion + '","' + time + '","' + date +'");');
		connection.query('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + estimateid +'", "' + milestoneid +'", NOW(), "Checked", "' + classification + '","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + proportion + '","' + time + '","' + date +'");');
		res.render('internal.ejs');
		res.end();
	}
	if(status=='unsatisfactory'){
		console.log('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + estimateid +'", "' + milestoneid +'", NOW(), "Approved", "' + classification + '","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + proportion + '","' + time + '","' + date +'");');
		connection.query('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + estimateid +'", "' + milestoneid +'", NOW(), "Approved", "' + classification + '","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + proportion + '","' + time + '","' + date +'");');
		res.render('internal.ejs');
		res.end();
	}
	if(status=='complete'){
		console.log('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + estimateid +'", "' + milestoneid +'", NOW(), "Complete", "' + classification + '","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + proportion + '","' + time + '","' + date +'");');
		connection.query('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + estimateid +'", "' + milestoneid +'", NOW(), "Complete", "' + classification + '","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + proportion + '","' + time + '","' + date +'");');
		res.render('internal.ejs');
		res.end();
	}
	if(status=='incomplete'){
		console.log('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + estimateid +'", "' + milestoneid +'", NOW(), "Executed", "' + classification + '","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + proportion + '","' + time + '","' + date +'");');
		connection.query('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + estimateid +'", "' + milestoneid +'", NOW(), "Executed", "' + classification + '","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + proportion + '","' + time + '","' + date +'");');
		res.render('internal.ejs');
		res.end();
	}
	if(status=='invoiced'){
		console.log('SELECT a.Proportion, a.Hours, e.method, e.price FROM activity a, estimates e WHERE a.ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND a.MilestoneID= "' + milestoneid +'" AND a.EstimateID = e.ID;');
		connection.query('SELECT a.Proportion, a.Hours, e.method, e.price FROM activity a, estimates e WHERE a.ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND a.MilestoneID= "' + milestoneid +'" AND a.EstimateID = e.ID;', function (error, rows, fields) {
			consideration = rows[0].Proportion;
			hours = rows[0].Hours;
			method = rows[0].method;
			price = rows[0].price;
			console.log('consideration: ' + consideration);
			console.log('hours: ' + hours);
			console.log('method: ' + method);
			console.log('price: ' + price);
			if(method=='proportion'){
				milestoneprice = price * consideration;
			}
			if(method=='rate'){
				milestoneprice = hours * consideration;
			}
			if(method=='manual'){
				milestoneprice = consideration;
			}
			res.render("printinvoice.ejs");
			res.end();
		});
		console.log('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + estimateid +'", "' + milestoneid +'", NOW(), "Invoiced", "' + classification + '","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + proportion + '","' + time + '","' + date +'");');
		connection.query('INSERT INTO activity (EstimateID, MilestoneID, DateTime, Status, Classification, Hours, `Trigger`, Deadline, Producer, Proportion, Time, Reference) values ("' + estimateid +'", "' + milestoneid +'", NOW(), "Invoiced", "' + classification + '","' + hours + '","' + trigger + '","' + deadline + '","' + producer + '","' + proportion + '","' + time + '","' + date +'");');
	}
	});

});

app.get('/selectchecked', function (req,res){
	connection.query("SELECT MilestoneID FROM activity WHERE ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND Status= 'Checked';", function (error, rows, fields) {
			var output = '<html><head></head><body><form name="input" action="/displaymilestone" method="post"><select name="milestone">';
			for (var i in rows) {
				output += '<option value=' + rows[i].MilestoneID + '>' + rows[i].MilestoneID + '</option>';
			}
			output += '</select><input type="submit" value="Proceed"></form><form action="/external"><input type="submit" value="Back"></form></body></html>';
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(output);
		});
});	

app.get('/billing', function (req,res){
	connection.query("SELECT Distinct MilestoneID FROM activity WHERE ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND Status= 'Complete';", function (error, rows, fields) {
			var output = '<html><head></head><body><form name="input" action="/displaymilestone" method="post"><select name="milestone">';
			for (var i in rows) {
				output += '<option value=' + rows[i].MilestoneID + '>' + rows[i].MilestoneID + '</option>';
			}
			output += '</select><input type="submit" value="Proceed"></form><form action="/estimatepage"><input type="submit" value="Back"></form></body></html>';
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(output);
		});
});	

app.get('/customerinvoice', function (req,res){
	connection.query("SELECT Distinct MilestoneID FROM activity WHERE ID = any (SELECT MAX(ID) FROM activity GROUP BY MilestoneID) AND Status= 'Invoiced';", function (error, rows, fields) {
		var output = '<html><head></head><body><form name="input" action="/displaymilestone" method="post"><select name="milestone">';
		for (var i in rows) {
			output += '<option value=' + rows[i].MilestoneID + '>' + rows[i].MilestoneID + '</option>';
		}
		output += '</select><input type="submit" value="Proceed"></form><form action="/external"><input type="submit" value="Back"></form></body></html>';
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(output);
	});	
});

app.get('/showactivities', function (req,res){
	connection.query("SELECT * FROM activity ORDER BY ID;", function (error, rows, fields) {
		var output = '<html><table border="1">';
		output += '<tr><td>ID</td><td>estimateID</td><td>MilestoneID</td><td>DateTime</td><td>Status</td><td>Classification</td><td>Hours</td><td>Trigger</td>';
		output += '<td>Deadline</td><td>Producer</td><td>Proportion</td><td>Resource</td><td>Time</td><td>Reference</td></tr>';
		for(var i in rows){
			output += '<tr><td>' + rows[i].ID + '</td>';
			output += '<td>' + rows[i].EstimateID + '</td>';
			output += '<td>' + rows[i].MilestoneID + '</td>';
			output += '<td>' + rows[i].DateTime + '</td>';
			output += '<td>' + rows[i].Status + '</td>';
			output += '<td>' + rows[i].Classification + '</td>';
			output += '<td>' + rows[i].Hours + '</td>';
			output += '<td>' + rows[i].Trigger + '</td>';
			output += '<td>' + rows[i].Deadline + '</td>';
			output += '<td>' + rows[i].Producer + '</td>';
			output += '<td>' + rows[i].Proportion + '</td>';
			output += '<td>' + rows[i].Resource + '</td>';
			output += '<td>' + rows[i].Time + '</td>';
			output += '<td>' + rows[i].Reference + '</td></tr>';
		}
		output += '</table></html>';
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(output);
	});
});


// Launch server
app.listen(1212);
