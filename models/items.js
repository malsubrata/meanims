var mongoose = require('mongoose');

// User Schema
var ItemSchema = mongoose.Schema({
    item_name: {
        type: String, index:true
    },
    item_description: {
        type: String, index:true, default: ''
    },
    item_cat_id: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Item_category'
    }],
    uom_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Uom'
    },
    item_rate: {
        type: Number, default: 0.0
    },
    vendor_id:{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    stoct_in: {
        [{ type: Schema.Types.ObjectId, ref: 'stock_in' }]
    }
    created_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    created_date: {
        type: Date, default: Date.now
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    updated_date:{
        type: Date, default: Date.now
    },
    status:{
        type: Boolean, default: true
    }
});

var Items = module.exports = mongoose.model('Item', ItemSchema);

module.exports.createItem = function(newItem, callback){
    newItem.save(callback);
}

module.exports.getAllItems = function(callback){
    Items.find({}).populate('item_cat_id uom_id vendor_id').exec(callback);
}

module.exports.getItemById = function(id, callback){
    Items.findById(id, callback);
}

module.exports.updateItem = function(_id,item,callback){
    Items.update(
        {
            _id: _id
        },
        {
            item_name: item.item_name
            ,item_description: item.item_description
            ,item_cat_id: item.item_cat_id
            ,uom_id: item.uom_id
            ,item_rate: item.item_rate
            ,vendor_id: item.vendor_id
            ,updated_date: new Date()
        },
        callback
    );
}

module.exports.deleteItem = function(id,callback){
    Items.findByIdAndRemove({_id:id},callback);
}