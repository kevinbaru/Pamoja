var express = require('express');
var router = express.Router();
var models = require('../models');
var {User,Document} = models;
var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.Promise=global.Promise;
mongoose.connect(connect);

router.get('/documents',function(req,res){
  console.log('documentooooo')
  req.user._id
  User.findById(req.user._id).populate('documents')
  .then((user)=>{
    res.status(200).json({success:true,docs:user.documents})
  })
  .catch(err=>{
    console.log('errhhrhr',err)
    res.status(500).json({success:false, error:err})
  })


})

router.get('/documents/:docId',function(req,res){

  Document.findById(req.params.docId)
  .then((doc)=>{
    res.status(200).json({success:true,docs:doc})

  })
  .catch(err=>{
    res.status(500).json({success:false, error:err})
  })
})

router.post('/new',function(req,res){
  var doc  = new models.Document({
    users:[req.user._id],
    date: new Date(),
    title:req.body.title,
  });
  doc.save()
  .then((doc)=>{
    return User.findById(req.user._id)
  })
  .then((user)=>{
    user.documents.push(doc._id)
    return user.save()
  })
  .then((saved)=>{
    res.status(200).json({success:true, doc:doc})
  })
  .catch(err=>{
    console.log(err)
    res.status(500).json({error:err})

  })


})

router.post('/save',function(req,res){

  Document.findById(req.body.docId, function(err,doc){
    if(err){
      console.log(err)
      res.status(500).json({error:err})
    }else{
      doc.date=new Date();
      doc.content= req.body.content;
      if(doc.history.length===10){
        doc.history.splice(0,1)
      }
      doc.history.push({content:req.body.content, date:new Date()})
      doc.save(function(err,saved){
        if(err){
          console.log(err)
          res.status(500).json({error:err})
        }else{
          res.status(200).json({success:true, doc:saved})
        }

      })

    }

  })

})


router.post('/sharedoc',function(req,res){


  User.findOne({email:req.body.collaborator})
  .then((user)=>{

    user.documents.push(req.body.docId)
    return user.save()
  })
  .then((user2)=>{

    return Document.findById(req.body.docId)
  })
  .then((doc)=>{

    doc.users.push(req.user._id);
    doc.save()
  })
  .then((shared)=>{

    res.status(200).json({success:true, doc:shared})
  })
  .catch((err)=>{
    console.log(err)
    res.status(500).json({error:err})

  })




})




module.exports = router;
