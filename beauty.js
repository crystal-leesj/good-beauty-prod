module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT products.id, name, brand, category, description, ingredient FROM products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products = results;
            complete();
        });
    }

    function getProduct(res, mysql, context, id, complete){
        var sql = "SELECT id, name, brand, category, description, ingredient FROM products WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.product = results[0];
            complete();
        });
    }

    /*Display all the beauty products*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        // context.jsscripts = ["deleteperson.js"];
        var mysql = req.app.get('mysql');
        getProducts(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('products', context);
            }

        }
    });

    /* Display one product for the specific purpose of updating product */

    router.get('/:id', function(req, res){
        console.log("GET ROUT!!!");
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateproduct.js"];
        var mysql = req.app.get('mysql');
        getProduct(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-product', context);
            }
        }
    });

    /* Adds a product, redirects to the product page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO products (name, brand, category, description, ingredient) VALUES (?,?,?,?,?)";
        var inserts = [req.body.name, req.body.brand, req.body.category, req.body.description, req.body.ingredient];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/beauty');
            }
        });
    });

    /* The URI that update data is sent to in order to update a product */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE products SET name=?, brand=?, category=?, description=?, ingredient=? WHERE id=?";
        var inserts = [req.body.name, req.body.brand, req.body.category, req.body.description, req.body.ingredient, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */



    return router;
}();