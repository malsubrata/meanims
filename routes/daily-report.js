var express = require('express');
var router = express.Router();
/* Items Stock In */
var StockIn = require('../models/item_stock_in');
/* Items Stock In */
var StockOut = require('../models/item_stock_out');
/* Items Model */
var Items = require('../models/items');
/* Get Daily Report */
router.get('/getReport/:date',function(req, res, next){
	Items.getDailyReport(req.params.date, function(err,items){
		if(err){ return next(err); }
		res.json(items);
	})
})
/* GET page. */
router.get('/*',ensureAuthenticated, function(req, res, next) {
	res.render('report/daily', { title: 'Daily Report',selectedMenu: 'daily-report' });
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
