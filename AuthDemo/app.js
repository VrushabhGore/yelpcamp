var express               = require('express'),
    mongoose              = require('mongoose'),
    passport              = require('passport'),
    bodyParser            = require('body-parser'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/users');

var app= express();
mongoose.connect("mongodb://localhost/auth",{ useNewUrlParser: true });
app.set('view engine','ejs')
app.use(passport.initialize());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.session());
app.use(require('express-session')({
  secret: 'this is new',
  resave: false,
  saveUninitialized: false
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

////=========================
// ROUTES
///=====================
app.get('/',function(req,res){
  res.render('home')
})

app.get('/secret',isLoggedIn,function(req,res){
  res.render('secret')
})

/// AUTH ROUTES
app.get('/register',function(req,res){
  res.render('register')
});
///////////////////////////////////////
//POST
app.post('/register',function(req,res){
  User.register(new User({username: req.body.username}),req.body.password,function(err,user){
    if (err) {
      console.log(err);
      res.render('register')
    }
        passport.authenticate("local")(req,res,function(){
        res.redirect('/secret');
      });
  });
});
//////================
// LOGIN ROUTES
////==============

app.get('/login',function(req,res){
  res.render('login')
})

app.post('/login',passport.authenticate('local',{
  successRedirect:'/secret',
  failureRedirect : '/login'
}),function(req,res){

});

/////================
//Logout route
app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/')
})



function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}



app.listen(3000,function(){
  console.log('Started server');
})
