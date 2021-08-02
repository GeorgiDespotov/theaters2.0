const { Schema, model } = require('mongoose');
const User = require('./User');


const schema = new Schema({
    title: { type: String, required: [true, 'Title is required!'] },
    description: { type: String, required: [true, 'Description is required!'], maxLength: [50, 'Description is to long (max length is 50 symbols)!'] },
    imageUrl: { type: String, required: [true, 'Image URL is required!'] },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    author: { type: Schema.Types.ObjectId, ref: 'User' }
});
   

module.exports = model('Play', schema)