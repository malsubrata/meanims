var express = require('express');
var router = express.Router();
/* Items Stock In */
var StockIn = require('../models/item_stock_in');
/* Items Stock In */
var StockOut = require('../models/item_stock_out');
/* Items Model */
var Items = require('../models/items');

router.get('/getItems', function(req, res, next){
    Items.getItemStockOuts(function(err,items){
        if(err) throw err;
        res.json(items);
    });
});

router.post('/',ensureAuthenticated,function(req,res,next){
    var newStockOut = new StockOut({
        item_id: req.body.item_id,
        item_rate: req.body.item_rate,
        issue_qty: req.body.issue_qty,
        issue_anount: req.body.issue_qty * req.body.item_rate,
        store_close_qty: req.body.store_close_qty,
        kitchen_close_qty: req.body.kitchen_close_qty,
        total_close_amount: req.body.item_rate * (req.body.store_close_qty + req.body.kitchen_close_qty),
        total_close_qty: req.body.store_close_qty + req.body.kitchen_close_qty,
        created_by: req.user._id,
        updated_by: req.user._id
    });
    StockOut.createStockOut(newStockOut,function(err,stock){
       if(err){ return next(err); }
        Items.updateStockOut(req.body.item_id, stock._id, function(err,item){
            if(err){ return next(err); }
            res.json(item);
        });
    });
});
/* update stock in */
router.put('/:_id',ensureAuthenticated,function(req,res,newxt){
    var updateStockIn = new StockOut({
        issue_qty: req.body.issue_qty,
        issue_anount: req.body.issue_qty * req.body.item_rate,
        store_close_qty: req.body.store_close_qty,
        kitchen_close_qty: req.body.kitchen_close_qty,
        total_close_qty: req.body.store_close_qty + req.body.kitchen_close_qty,
        total_close_amount: req.body.item_rate * (req.body.store_close_qty + req.body.kitchen_close_qty),
        updated_by: req.user._id
    });
    StockOut.updateStockOut(req.params._id, updateStockIn,function(err,status){
       if(err) { return next(err); }
        res.json(status);
    });
});
/* GET home page. */
router.get('/*',ensureAuthenticated, function(req, res, next) {
	res.render('stock/out', { title: 'Issue Items',selectedMenu: 'issue_item' });
});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users');
	}
}

module.exports = router;
