var mongoose = require('mongoose');

// UOM Schema
var UOMSchema = mongoose.Schema({
    unit: {
        type: String,
        index:true
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

var UOM = module.exports = mongoose.model('Uom', UOMSchema);

module.exports.createUOM = function(newUOM, callback){
    newUOM.save(callback);
}

module.exports.getAllUOM = function(callback){
    UOM.find({},callback);
}

module.exports.getUOMById = function(id, callback){
    UOM.findById(id, callback);
}

module.exports.updateUOM = function(_id,uom,callback){
    UOM.update({_id: _id},{unit: uom.name},callback);
}

module.exports.deleteUOM = function(id,callback){
    UOM.findByIdAndRemove({_id:id},callback);
}