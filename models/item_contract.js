var mongoose = require('mongoose');

// UOM Schema
var ContractSchema = mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    item_rate: {
        type: Number, default: 0.0
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

var itemContract = module.exports = mongoose.model('item_contract', ContractSchema);

module.exports.createContract = function(newContract, callback){
    newContract.save(callback);
}

module.exports.getAllContract = function(callback){
    itemContract.find({}).populate('item_id vendor_id').exec(callback);
}

module.exports.getContractById = function(id, callback){
    itemContract.findById(id, callback);
}

module.exports.updateContract = function(_id,Contract,callback){
    itemContract.update({_id: _id},{unit: Contract.name,updated_date: new Date()},callback);
}

module.exports.deleteContract = function(id,callback){
    itemContract.findByIdAndRemove({_id:id},callback);
}