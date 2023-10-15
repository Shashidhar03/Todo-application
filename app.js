const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://shashidhar:9573389923@cluster0.faydhvs.mongodb.net/todoDB",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("Connected to database"))
.catch(err=>console.log(err));

app.listen(3000,function(req,res)
{
    console.log("Server is running on port 3000");
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/view.html");
});

app.get("/login",function(req,res)
{
    res.render("login",{message:""});
});

app.get("/signup",function(req,res)
{
    res.render("signup",{message:""});
});

app.get("/home",function(req,res)
{
    usermodel.findOne({username:userForTask})
    .then((user)=>
    {
        res.render("home",{tasks:user.task});
    })
    .catch((err)=>console.log(err));
});

const signupschema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    username:String,
    task:Array
});
usermodel=new mongoose.model('username',signupschema);

const taskschema=new mongoose.Schema({
    task:String
});
taskmodel=new mongoose.model('task',taskschema);

app.post('/signup',function(req,res)
{
    let name=req.body.name;
    let email=req.body.email;
    let username=req.body.username;
    let password=req.body.password;
    
    const user=new usermodel({
        name:name,
        email:email,
        password:password,
        username:username,
        task:[]
    });

    
    usermodel.findOne([{email:email},{username:username},{name:name}])
    .then(()=>{
        
        // res.render("login.ejs",{message:"User already exists"});
        res.redirect("/login");
    })
    .catch(()=>
    {
        usermodel.insertMany([user]);
        res.redirect("/login");
    })
    

});

var userForTask;

app.post('/login',function(req,res)
{
    let username=req.body.username;
    let password=req.body.password;

    usermodel.findOne({username:username})
    .then((user)=>
    {
        if(user.password==password)
        {
            userForTask=username;
            res.redirect("/home");
        }
        else
        {
            // res.render("login.ejs",{message:"Incorrect password"});
            res.redirect("/login");
        }
    })
    .catch(()=>
    {
        // res.render("signup.ejs",{message:"User not registered"});
        res.redirect("/signup");
    })
})

app.post("/home",function(req,res)
{
    let task=req.body.task;
    if(task==="")
    {
        res.redirect("/home");
    }
    else{
        newtask=new taskmodel({
            task:task
        });
        usermodel.findOne({username:userForTask})
        .then((user)=>
        {
            user.task.push(newtask);
            user.save();
            res.render("home",{tasks:user.task});
        })  
        .catch((err)=>console.log(err));
    }
    

})



