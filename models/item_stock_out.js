var mongoose = require('mongoose');

// User Schema
var ItemStockOutSchema = mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    item_rate: {
        type: Number,
        default: 0.0
    },
    issue_qty: {
        type: Number,
        default: 0
    },
    issue_anount: {
        type: Number,
        default: 0.0
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

module.exports.updateStockOut = function(_id,stockOut,callback){
    ItemStockOutSchema.update(
        {
            _id: _id
        },
        {
            issue_qty: stockOut.issue_qty,
            issue_anount : stockOut.issue_anount,
            store_close_qty: stockOut.store_close_qty,
            kitchen_close_qty: stockOut.kitchen_close_qty,
            total_close_qty: stockOut.total_close_qty,
            total_close_amount: stockOut.total_close_amount,
            updated_by: stockOut.updated_by,
            updated_date: new Date()
        },
        callback
    )
}
