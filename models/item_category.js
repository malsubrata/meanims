var mongoose = require('mongoose');

// User Schema
var ItemCategorySchema = mongoose.Schema({
    category_name: {
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

var ItemCategory = module.exports = mongoose.model('Item_category', ItemCategorySchema);

module.exports.createCategory = function(newCategory, callback){
    newCategory.save(callback);
}

module.exports.getAllCategory = function(callback){
    ItemCategory.find({},callback);
}

module.exports.getCategoryById = function(id, callback){
    ItemCategory.findById(id, callback);
}

module.exports.updateCategory = function(category,callback){
    ItemCategory.update({_id: category.id},{category_name: category.name, updated_date: new Date()},callback);
}

module.exports.deleteCategory = function(id,callback){
    ItemCategory.findByIdAndRemove({_id:id},callback);
}