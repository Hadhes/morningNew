const express = require('express');
const router = express.Router();

const uid2 = require('uid2')
const bcrypt = require('bcrypt');

const userModel = require('../models/users')


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
      language: 'fr'
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

})

router.put('/language', async function(req,res,next){

  let result = false
  let user = null
  let language = null
  
  await userModel.updateOne({ 
    token: req.body.tokenFromFront }, {
    language: req.body.languageFromFront
  })

  user = await userModel.findOne({ token: req.body.tokenFromFront })

  if (user) {
    result = true

  }

  language = user.language

  res.json({result, user, language})

})

module.exports = router;
