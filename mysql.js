var http = require('http')
  , mysql = require('mysql');
 
var client = mysql.createClient({
	user: 'root',
	password: ''
});
 
client.useDatabase('cookbook');
 
http.createServer(function (req, res) {
	if (req.url == '/') {
		client.query("SELECT r.name AS 'Recipe', ri.amount AS 'Amount',mu.name AS 'Unit',i.name"
            + " AS 'Ingredient' FROM Recipe r JOIN RecipeIngredient ri on r.id = ri.recipe_id"
            + " JOIN Ingredient i on i.id = ri.ingredient_id LEFT OUTER JOIN Measure mu on mu.id = measure_id", 
			function(err, results, fields) {
				if (err) throw err;
				var output = '<html><head></head><body><h1>Latest Posts</h1><ul><table border=1><tr>';
				for (var index in fields) {
					output += '<td>' + fields[index].name + '</td>';
				}
				output += '</tr>';
				for (var index in results) {
					output += '<tr><td>' + results[index].Recipe + '</td>';
					output += '<td>' + results[index].Amount + '</td>';
					output += '<td>' + results[index].Unit + '</td>';
					output += '<td>' + results[index].Ingredient + '</td></tr>';
				}
				output += '</ul></body></html>';
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.end(output);
			}
		); 
	}
}).listen(8000, "127.0.0.1");