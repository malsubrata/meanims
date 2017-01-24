var express = require('express');
var router = express.Router();
/* Items Stock In */
var StockIn = require('../models/item_stock_in');
/* Items Stock In */
var StockOut = require('../models/item_stock_out');
/* Items Model */
var Items = require('../models/items');


/* GET home page. */
router.get('/',ensureAuthenticated, function(req, res, next) {
	res.render('stock/in', { title: 'Stock Update',selectedMenu: 'dashboard' });
});

router.get('/getItems', function(req, res, next){
    Items.getStockItems(function(err,items){
        if(err) throw err;
        res.json(items);
    });
});

router.post('/',ensureAuthenticated,function(req,res,next){
    var newStockIn = new StockIn({
        item_id: req.body.item_id,
        contracted_rate: req.body.contracted_rate,
        reciving_rate: req.body.reciving_rate,
        store_opn_qty: req.body.store_opn_qty,
        kitchen_opn_qty: req.body.kitchen_opn_qty,
        purchage_qty: req.body.purchage_qty,
        total_purchage_amount: (req.body.reciving_rate * req.body.purchage_qty),
        total_opn_qty: (req.body.store_opn_qty + req.body.kitchen_opn_qty + req.body.purchage_qty),
        created_by: req.user._id,
        updated_by: req.user._id
    });
    StockIn.createStockIn(newStockIn,function(err,stock){
       if(err){ return next(err); }
        Items.updateStockIn(req.body.item_id, stock._id, function(err,item){
            if(err){ return next(err); }
            res.json(item);
        });
    });
});
/* update stock in */
router.put('/:_id',ensureAuthenticated,function(req,res,newxt){
    var updateStockIn = new StockIn({
        reciving_rate: req.body.reciving_rate,
        store_opn_qty: req.body.store_opn_qty,
        kitchen_opn_qty: req.body.kitchen_opn_qty,
        purchage_qty: req.body.purchage_qty,
        total_purchage_amount: (req.body.reciving_rate * req.body.purchage_qty),
        total_opn_qty: (req.body.store_opn_qty + req.body.kitchen_opn_qty + req.body.purchage_qty),
        updated_by: req.user._id
    });
    StockIn.updateStockIn(req.params._id, updateStockIn,function(err,status){
       if(err) { return next(err); }
        res.json(status);
    });
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
