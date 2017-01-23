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

module.exports.updateContract = function(_id, user_id, contract, callback){
    itemContract.update(
        {
            _id: _id
        },
        {
            item_id: contract.item_id,
            item_rate: contract.item_rate,
            start_date: contract.start_date,
            end_date: contract.end_date,
            vendor_id: contract.vendor_id,
            updated_date: new Date(),
            updated_by: user_id
        },callback
    );
}

module.exports.deleteContract = function(id,callback){
    itemContract.findByIdAndRemove({_id:id},callback);
}