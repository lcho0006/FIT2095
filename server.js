let express = require('express');
let app = express();
let bodyParser= require('body-parser');

let db = [];
app.engine("html", require('ejs').renderFile);
app.set('view engine','html');
app.use(express.static('images'));

app.use(bodyParser.urlencoded({
    extended: false
}))

app.get('/',function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.get('/addtask',function(req,res){
    res.sendFile(__dirname+"/addtask.html");
});
app.get('/listtask',function(req,res){
    res.render(__dirname+"/listtask.html", {
        db: db
    })
});
app.post('/addtask',function(req,res){
    db.push(req.body);
    res.sendFile(__dirname+"/addtask.html");
});


app.listen(8080);
