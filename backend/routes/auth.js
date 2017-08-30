// Add Passport-related auth routes here.
var express = require('express');
var router = express.Router();
var models = require('../models');
var  validator= require('validator');


function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }
  if (!payload || payload.passwordRepeat !== payload.password) {
    isFormValid = false;
    errors.passwordRepeat = "Passwords don't match.";
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}


module.exports = function(passport) {


  router.post('/signup', function(req, res) {
    // validation step
    const validationResult = validateSignupForm(req.body);
    if (!validationResult.success) {
      return  res.status(400).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      });
    }
    var u  = new models.User({
      name:req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).json({success:false,message:'Check the form for error',errors:{name: err}});
        return;
      }else{
        console.log(user);
        res.status(200).json({success:true});

      }

    });
  });



  // POST Login page

  router.post('/login', passport.authenticate('local',{'failureRedirect':'/failure'}), function(req,res) {

    res.status(200).json({success: true});
  });

  router.get('/failure', function(req, res) {
    res.json({
      success:false,
      error:'incorrect username or passowrd'
    })
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).json({success:true});
  });

  return router;
};
