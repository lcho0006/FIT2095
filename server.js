let express = require('express');
let mongodb = require('mongodb');
let MongoDBClient = mongodb.MongoClient;
let app = express();
let bodyParser= require('body-parser');

app.engine("html", require('ejs').renderFile);
app.set('view engine','html');
app.use(express.static('images'));
app.use(express.static('css'));

app.use(bodyParser.urlencoded({
    extended: false
}))

let db = null;
let col = null;
let url = "mongodb://localhost:27017"
MongoDBClient.connect(url,{useNewUrlParser: true,useUnifiedTopology: true},function(err,client){
    db = client.db('w6t1')
    col=db.collection('Tasks');
});


app.get('/',function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.get('/addtask',function(req,res){
    res.sendFile(__dirname+"/addtask.html");
});

app.get('/nonSamLee',function(req,res){
    col.updateMany({TaskAssign: "Sam"}, {$set:{TaskStatus:"InProgress"}},{upsert: false});
    col.updateMany({TaskAssign: "Sam"}, {$set:{TaskAssign:"Anna"}},{upsert: false});
    col.updateMany({TaskAssign: "Lee"}, {$set:{TaskStatus:"InProgress"}},{upsert: false});
    col.updateMany({TaskAssign: "Lee"}, {$set:{TaskAssign:"Anna"}},{upsert: false});
    res.sendFile(__dirname+"/nonSamLee.html");
});

app.get('/deletetask',function(req,res){
    res.sendFile(__dirname+"/deletetask.html");
});

app.get('/updatetask',function(req,res){
    res.sendFile(__dirname+"/updatetask.html");
});

app.get('/deleteall',function(req,res){
    res.sendFile(__dirname+"/deleteall.html");
});

app.get('/listtask',function(req,res){
    let query = {};
    col.find(query).toArray(function(err,data){
        res.render(__dirname+"/listtask.html",{ data: data });
    });

});

app.post('/addtask',function(req,res){
    let Obj = {TaskName: req.body.TaskName,
        TaskAssign: req.body.TaskAssign,
        TaskDue:req.body.TaskDue,
        TaskStatus: req.body.TaskStatus,
        TaskDesc: req.body.TaskDesc
    };
    col.insertOne(Obj);
    res.redirect('/listtask');
});

app.post('/deletetask',function(req,res){
    let query = {_id: new mongodb.ObjectID(req.body.TaskId)};
    col.deleteOne(query);
    res.redirect('/listtask');
});

app.post('/deleteall',function(req,res){
    col.deleteMany({});
    res.redirect('/listtask');
});

app.post('/updatetask',function(req,res){
    col.updateOne({_id: new mongodb.ObjectID(req.body.TaskId)}, {$set:{TaskStatus:req.body.TaskStatus}},{upsert: false});
    res.redirect('/listtask');
});

//sudo apt install -y mongodb
app.listen(8080);