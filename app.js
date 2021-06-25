const express=require("express");
const bodyParser=require("body-parser");
const mongoose= require("mongoose");
const ejs= require("ejs");

const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB",{useNewUrlParser:true, useUnifiedTopology:true});

const articleSchema={
  title:String,
  content:String
};
const Article= mongoose.model("Article",articleSchema);

app.get("/articles",function(req,res){
  Article.find({},function(err,foundArticle){
    if(!err){
      res.send(foundArticle);
    }else{
      res.send(err);
    }
  });
});

app.post("/articles",function(req,res){

  const newArticle= new Article({
    title:req.body.title,
    content:req.body.content
  })
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added article")
    }else{
      res.send(err);
    }
  });

});


///////////////////////////////for a specific article////////////////////////////////

app.route("/articles/:articleTitle")
  .get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,found){
      if(!err){
        res.send(found)
      }else{
        res.send(err)
      }
    })
  })
  .put(function(req,res){
    Article.update(
      {title:req.params.articleTitle},
      {title:req.body.title, content:req.body.content  },
      {overwrite:true},
      function(err){
        if(!err){
          res.send("Successfully updated article")
        }else{
          res.send(err)
        }
      }
    )
  })

  .patch(function(req,res){
    Article.update(
      {title:req.params.articleTitle  },
      {$set:req.body},function(err){
        if(!err){
          res.send("Successfully updated article")
        }else{
          res.send(err)
        }
      }
  )
});

app.listen(3000,function(){
  console.log("Server started");
});
