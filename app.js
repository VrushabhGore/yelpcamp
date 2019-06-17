var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground');
    Comment = require('./models/comment'),
    seedDB = require('./seeds')

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+'/Public'))

//Home Function
app.get('/',function(req,res){
res.render('landing')
});
//INDEX -- SHows everything.
app.get('/campgrounds',function(req,res){
  Campground.find({},function(err,campgrounds){
    if (err) {
      console.log(err);
    }else {
      res.render('campgrounds/index',{campgrounds:campgrounds})
    }
  });
});
//NEW - show form to create new campground
app.get('/campgrounds/new',function(req,res){
  res.render('campgrounds/new');
});

//- CREATE - This creates a new campground in the DB
app.post('/campgrounds',function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name:name,image:image,description: desc};
  Campground.create(newCampground,function(err,campground){
    if (err) {
      console.log(err);
    }else {
      console.log("New Campground Created");
      console.log(campground);
      res.redirect('/campgrounds');
    }
  });
});
// - SHOW more info
app.get('/campgrounds/:id',function(req,res){
    Campground.findById(req.params.id).populate('comments').exec(function(err,foundCamp){
      console.log(foundCamp);
      if(err){
        console.log(err);
      }else {
        res.render('campgrounds/show',{campground:foundCamp});
      }
    });
  });

// - NEW COMMENT ROUTE

app.get('/campgrounds/:id/comments/new',function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    if (err) {
      console.log(err);
    }else{
      res.render('comments/new',{campground:campground})

    }
  })
});

app.post('/campgrounds/:id/comments',function(req,res){
  Campground.findById(req.params.id,function(err,campground){
    if (err) {
      console.log(err);
      redirect('/campgrounds')
    }else {
      Comment.create(req.body.comment, function(err,comment){
        if (err) {
          console.log(err);
        }else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/'+campground._id)
        }
      })
    }
  })
});

app.listen('3000',function(){
  console.log('Yelp has started')
})
