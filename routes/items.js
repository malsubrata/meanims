var express = require('express');
var router = express.Router();

/* item category model */
var ItemCategory = require('../models/item_category');
/* UOM Model */
var UOM = require('../models/uom');
/* Items Model */
var Items = require('../models/items');


/* Display category lidt */
router.get('/category/',ensureAuthenticated,function(req,res,next){
    ItemCategory.getAllCategory(function(err,categorys){
        res.render('items/category',{ title: 'Item Category',selectedMenu: 'items',errors:{}, categorys: categorys });
    });
});
/* get all category */
router.get('/category/allcategory',function(req,res,next){
    ItemCategory.getAllCategory(function(err,categorys){
        if(err) throw err;
        res.json(categorys);
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

/* Display UOM List */
router.get('/uom/',ensureAuthenticated,function(req,res,next){
    UOM.getAllUOM(function(err,uom){
        res.render('items/uom',{ title: 'Unit Of Mesurement',selectedMenu: 'items',errors:{}, uoms: uom });
    });
});

/* get all UOM */
router.get('/uom/alluom',function(req,res,next){
    UOM.getAllUOM(function(err,uom){
        if(err) throw err;
        res.json(uom);
    });
});

/* Create new UOM */
router.post('/uom/',ensureAuthenticated,function(req,res,next){
    var unit = req.body.name;
    // Validation
    req.checkBody('name', 'Unit name is required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        UOM.getAllUOM(function(err,uoms){
            res.render('items/uom',{
                title: 'Unit Of Mesurement',
                selectedMenu: 'items',
                errors:errors,
                uoms: uoms
            });
        });
    } else{
        var newUom = new UOM({
            unit: unit,
            created_by:req.user._id,
            updated_by:req.user._id
        });
        UOM.createUOM(newUom,function(err,category){
            if(err) throw err;
        });
        res.redirect('/items/uom/');
    }
});
/* Update and Delete UOM */
router.post('/uom/:id',ensureAuthenticated,function(req,res,next){
    if(req.body.action){
        if(req.body.action === 'edit' ){
            UOM.updateUOM(req.params.id,req.body,function(err,category){
                if(err) throw err;
                res.redirect('/items/uom/');
            });
        } else{
            UOM.deleteUOM(req.params.id,function(err){
                if(err) throw err;
                res.redirect('/items/uom/');
            });
        }
    }
});
/* GET All Items */
router.get('/getAllItems/',function(req,res,next){
    Items.getAllItems(function(err,items){
        if(err) throw err;
        res.json(items);
    });
});
/* create items */
router.post('/createItem/',ensureAuthenticated,function(req, res, next){
    var newItem = new Items({
        item_name: req.body.item_name,
        item_description: req.body.item_description,
        item_cat_id: req.body.item_cat_id,
        uom_id: req.body.uom_id,
        item_rate: req.body.item_rate,
        vendor_id: req.body.vendor_id,
        created_by: req.user._id
    });
    Items.createItem(newItem,function(err,item){
        if (err) throw err;
        res.json(item);
    });
});
/* GET home page. */
router.get('/*',ensureAuthenticated, function(req, res, next) {
    res.render('items/items', { title: 'Items',selectedMenu: 'items',errors:{} });
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
