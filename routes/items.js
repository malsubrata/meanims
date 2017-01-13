var express = require('express');
var router = express.Router();

/* item category model */
var ItemCategory = require('../models/item_category');

/* GET home page. */
router.get('/',ensureAuthenticated, function(req, res, next) {
    res.render('items/items', { title: 'Items',selectedMenu: 'items' });
});
/* Display category lidt */
router.get('/category/',ensureAuthenticated,function(req,res,next){
    ItemCategory.getAllCategory(function(err,categorys){
        res.render('items/category',{ title: 'Item Category',selectedMenu: 'items',errors:{}, categorys: categorys });
    });
});
/* create category */
router.post('/category/',ensureAuthenticated,function(req,res,next){
    var category_name = req.body.name;
    // Validation
    req.checkBody('name', 'Category name is required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        ItemCategory.getAllCategory(function(err,categorys){
            res.render('items/category',{
                title: 'Item Category',
                selectedMenu: 'items',
                errors:errors,
                categorys: categorys
            });
        });
    } else{
        var newCategory = new ItemCategory({
            category_name: category_name,
            created_by:req.user._id,
            updated_by:req.user._id
        });
        ItemCategory.createCategory(newCategory,function(err,category){
            if(err) throw err;
            console.log(category);
        });
        res.redirect('/items/category/');
    }
});
/* Update and Delete category */
router.post('/category/:id',ensureAuthenticated,function(req,res,next){
    if(req.body.action){
        if(req.body.action === 'edit' ){
            ItemCategory.updateCategory(req.body,function(err,category){
                if(err) throw err;
                res.redirect('/items/category/');
            });
        } else{
            ItemCategory.deleteCategory(req.params.id,function(err){
                if(err) throw err;
                res.redirect('/items/category/');
            });
        }
    }
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
