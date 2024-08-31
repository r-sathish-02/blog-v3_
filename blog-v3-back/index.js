const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require("mongoose");
const passport=require("passport");
const session=require('express-session')
const passportMongoose=require("passport-local-mongoose");
var LocalStrategy = require('passport-local').Strategy
const router=express();
const cors=require('cors');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv').config()
mongoose.connect("mongodb+srv://"+process.env.MYDBUSER+":"+process.env.MYDBPASS+"@myatlasclusteredu.3ebfqvk.mongodb.net/blogDB-v2");

router.use(cors({
    origin:'http://localhost:3000',
    credentials: true,
}
))
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://"+process.env.MYDBUSER+":"+process.env.MYDBPASS+"@myatlasclusteredu.3ebfqvk.mongodb.net/blogDB-v2", // MongoDB connection string
        collectionName:"sessions",
        ttl: 14 * 24 * 60 * 60 // Time-to-live for sessions in seconds (default 14 days)
    }),
}));
router.use(passport.initialize());
router.use(passport.session());

const userSchema=new mongoose.Schema({
    name:String,
    username:String,
    password:String,
    mobile:Number
})
const textSchema={
    title:String,
    content:String,
    author:String
}
userSchema.plugin(passportMongoose);
const Text=mongoose.model("Text",textSchema);
const User=mongoose.model("User",userSchema);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get("/current_user",(req,res)=>{
    if (req.isAuthenticated()){
        res.json({user:req.user})
    }
    else{
        res.json({user:null})
    }
})

router.post("/login",passport.authenticate("local"),(req,res)=>{
    res.status(200).json({user:req.user})
})

router.post("/register", (req, res) => {
    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        mobile: req.body.mobile,
    });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.json({ user });
        });
    });
});
router.get("/posts",(req,res)=>{
    Text.find().then(response=>{res.json(response)})
})

router.post("/compose",(req,res)=>{
    const newText=new Text({
        title:req.body.title,
        content:req.body.content,
        author:req.body.author
    })
    newText.save()
    .then(()=>res.status(200).send("Text Saved Successfully"))
    .catch((error) => res.status(500).send("Failed to save text"));
})
router.get("/logout", (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        
        req.session.destroy((err) => {
            if (err) return next(err);

            res.clearCookie('connect.sid', { path: '/' });
            res.json({ message: "Logout successful" });
        });
    });
});

router.listen(8000,(req,res)=>{
    console.log("Server live at 8000");
    
})