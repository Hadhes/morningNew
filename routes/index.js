const express = require('express');
const router = express.Router();

const uid2 = require('uid2')
const bcrypt = require('bcrypt');

const userModel = require('../models/users')
// Importation Model Article
const articleModel = require('../models/article');

router.post('/sign-up', async function(req,res,next){

  let error = []
  let result = false
  let saveUser = null
  let token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    const newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
    })
  
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  let result = false
  let user = null
  let error = []
  let token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})


});



  // Route Whislist qui enregistre en BDD les articles choisis
router.post('/wishlist-article', async function(req, res, next) {

    let result = false;
    var articleSave = null

    var user = await userModel.findOne({token: req.body.token});

    if(user != null) {
      var newArticle = new articleModel({
        title: req.body.name, 
        description: req.body.desc, 
        urlToImage: req.body.img, 
        content: req.body.content,
        lang: req.body.lang,
        token: req.body.token
      });

      // console.log('POST /wishlist-article newArticle', newArticle)
  
      articleSave = await newArticle.save();
    
      // if (articleSave.name) {
      //   result = true
      // };
    };

    res.json({result});

});


//Route get wishlist qui récupère de la db les articles de la wishlist
router.get('/wishlist-article', async function(req, res, next) {
  console.log('GET /Wishlist-article req.query', req.query)

  var articles = await articleModel.find({token: req.query.token}); 

  res.json({articles});
});



module.exports = router;
