var express = require('express');
var router = express.Router();

/* item category model */
var ItemCategory = require('../models/item_category');
/* UOM Model */
var UOM = require('../models/uom');
/* Items Model */
var Items = require('../models/items');
/* Contract Model */
var Contract = require('../models/item_contract');


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
/* Display All Contract List */
router.get('/contract/',ensureAuthenticated,function(req,res,next){
    Contract.getAllContract(function(err,Contracts){
        res.render('items/contract',{ title: 'Contracts',selectedMenu: 'items',errors:{}, contracts: Contracts });
    });
});

/* Create new Contract */
router.post('/contract/',ensureAuthenticated,function(req,res,next){
    var item_id = req.body.item_id;
    var item_rate = req.body.item_rate;
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var vendor_id = req.body.vendor_id;
    // Validation
    req.checkBody('item_id', 'Please Select a Item').notEmpty();
    req.checkBody('item_rate', 'Item price is required').notEmpty();
    req.checkBody('start_date', 'Start Date is required').notEmpty();
    req.checkBody('end_date', 'End Date is required').notEmpty();
    req.checkBody('vendor_id', 'Please Select a Vendor').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        Contract.getAllContract(function(err,uoms){
            res.render('items/contract',{
                title: 'Contracts',
                selectedMenu: 'items',
                errors:errors,
                contracts: Contracts
            });
        });
    } else{
        var newContract = new Contract({
            item_id: item_id,
            item_rate: item_rate,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            vendor_id: vendor_id,
            created_by:req.user._id,
            updated_by:req.user._id
        });
        console.log(newContract);
        Contract.createContract(newContract,function(err,category){
            if(err) throw err;
        });
        res.redirect('/items/contract/');
    }
});

/* GET All Items */
router.get('/getAllItems/',function(req,res,next){
    Items.getAllItems(function(err,items){
        if(err) throw err;
        res.json(items);
    });
});
/* Get items by id */
router.get('/getItem/:_id',function(req,res,next){
    Items.getItemById(req.params._id,function(err,item){
        if(err) throw err;
        res.json(item);
    });
})
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

/* Update item */
router.put('/updateItem/:_id',ensureAuthenticated,function(req, res, next){
    var updateItem = new Items({
        item_name: req.body.item_name,
        item_description: req.body.item_description,
        item_cat_id: req.body.item_cat_id,
        uom_id: req.body.uom_id,
        item_rate: req.body.item_rate,
        vendor_id: req.body.vendor_id,
        updated_by: req.user._id
    });
    Items.updateItem(req.params._id, updateItem,function(err,item){
        if (err) throw err;
        res.json(item);
    });
});
/* Delete item */
router.delete('/deleteItem/:_id',ensureAuthenticated,function(req,res,next){
    Items.deleteItem(req.params._id,function(err,status){
        if(err) throw err;
        res.json(status);
    })
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
