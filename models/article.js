var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
    title: String, 
    description: String, 
    urlToImage: String, 
    content: String,
    lang: String,
    token: String,
});

var articleModel = mongoose.model('articles', articleSchema);

module.exports = articleModel;