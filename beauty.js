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

    function getReviews(res, mysql, context, id, complete){
        console.log("REAL ALL REVIEWSS");
        var sql = "SELECT products.id, products.brand, products.name, comment FROM products INNER JOIN reviews ON products.id = reviews.pid WHERE products.id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.product = results[0];
            context.reviews = results;
            console.log('res: ', results);
            complete();
        });
    }

    /*Display all the beauty products*/

    router.get('/', function(req, res){
        console.log("READ ALL!!!");
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteproduct.js"];
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
        console.log("GET one ROUT!!!");
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateproduct.js", "deleteproduct.js"];
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
        console.log("REQBODY : ", req.body, "REQPARAM : ", req.params);
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

    /* Route to delete a product, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM products WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    /* Display one product to see reviews on specific product */

    router.get('/reviews/:id', function(req, res){
        console.log("Review ROUT!!!");
        var callbackCount = 0;
        var context = {};
        // context.jsscripts = ["updateproduct.js", "deleteproduct.js"];
        var mysql = req.app.get('mysql');
        getReviews(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('reviews', context);
            }
        }
    });

    /* Adds a review, redirects to the product page after adding */

    router.post('/reviews/:id', function(req, res){
        console.log("REQ BODY Params:::", req.params);
        var mysql = req.app.get('mysql');
        var userSql = "SELECT * FROM users WHERE name = ?";
        mysql.pool.query(userSql,[req.body.name],function(error, results, fields){
            if(error){
                console.log('err: ', error);
                return;
            }else{
                // check password
                console.log('results: ', results);
                if (results.length < 1) {
                    console.log('user name not found')
                    return;
                }
                if (req.body.password != results[0].password){
                    console.log('password not match')
                    return;
                }
            }
        });
        console.log('user matched')
        var sql = "INSERT INTO reviews (uid, pid, comment) VALUES (?,?,?)";
        var inserts = [1, req.params.id, req.body.comment];
        mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/beauty/reviews/'+req.params.id);
            }
        });
    });

    return router;
}();