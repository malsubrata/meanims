var mongoose = require('mongoose');

// User Schema
var ItemStockOutSchema = mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    issue_qty: {
        type: Number,
        default: 0
    },
    issue_time: {
        type: Date, default: Date.now
    },
    store_close_qty: {
        type: Number,
        default: 0
    },
    kitchen_close_qty: {
        type: Number,
        default: 0
    },
    total_close_amount: {
        type: Number,
        default: 0.0
    },
    total_close_qty: {
        type: Number,
        default: 0
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_date: {
        type: Date, default: Date.now
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_date:{
        type: Date, default: Date.now
    },
    status:{
        type: Boolean, default: true
    }
});

var ItemStockOutSchema = module.exports = mongoose.model('Stock_out', ItemStockOutSchema);

module.exports.createStockOut = function(newStockOut, callback){
    newStockOut.save(callback);
}

module.exports.getAllStockOut = function(callback){
    ItemStockOutSchema.find({}).populate('item_id',callback);
}
//
//module.exports.getCategoryById = function(id, callback){
//    ItemCategory.findById(id, callback);
//}
//
//module.exports.updateCategory = function(category,callback){
//    ItemCategory.update({_id: category.id},{category_name: category.name, updated_date: new Date()},callback);
//}
//
//module.exports.deleteCategory = function(id,callback){
//    ItemCategory.findByIdAndRemove({_id:id},callback);
//}
