let express = require('express');
let mongoose = require('mongoose');
let app = express();
let bodyParser= require('body-parser');
//sudo apt install -y mongodb
const Developer = require('./models/developerSchema');
const Task = require('./models/taskSchema');

app.engine("html", require('ejs').renderFile);
app.set('view engine','html');
app.use(express.static('images'));
app.use(express.static('css'));

app.use(bodyParser.urlencoded({
    extended: false
}));

let url = "mongodb://localhost:27017/TaskDB";
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true},function(err){
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
        app.get('/', function (req, res) {
            res.render('index');
        });
        app.get('/:oldfirstname/:newfirstname', function (req, res) {
            Developer.updateMany({'Name.FirstName': req.params.oldfirstname}, {$set:{'Name.FirstName':req.params.newfirstname}},{upsert: false}).exec(err => {
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/listdeveloper');
                }
            });
        });
        app.get('/addtask', function (req, res) {
            res.render('addtask');
        });
        app.post('/addtask', function (req, res) {
            let taskDetails = req.body;
            Developer.find().exec(function(err, data) {
                let numberOfDev = data.length;
                if (numberOfDev == 0)
                {
                    let taskInstance = new Task({
                        _id: new mongoose.Types.ObjectId(),
                        TaskName: taskDetails.TaskName,
                        TaskDue: taskDetails.TaskDue,
                        TaskStatus: taskDetails.TaskStatus,
                        TaskDesc: taskDetails.TaskDesc
                    });
                    taskInstance.save(function (err) {
                        if (err) throw err;
                        res.redirect('/listtask');
                    });
                }
                else
                {
                    let randomDev = Math.floor(Math.random() * numberOfDev);
                    let taskInstance = new Task({
                        _id: new mongoose.Types.ObjectId(),
                        TaskAssign: data[randomDev]._id,
                        TaskName: taskDetails.TaskName,
                        TaskDue: taskDetails.TaskDue,
                        TaskStatus: taskDetails.TaskStatus,
                        TaskDesc: taskDetails.TaskDesc
                    });
                    taskInstance.save(function (err) {
                        if (err) throw err;
                        res.redirect('/listtask');
                    });
                }
            });
        });
        app.get('/adddeveloper', function (req, res) {
            res.render('adddeveloper');
        });
        app.post('/adddeveloper', function (req, res) {
            let DevDetails = req.body;
            let devInstance = new Developer({
                _id: new mongoose.Types.ObjectId(),
                Name: {
                    FirstName: DevDetails.FirstName,
                    LastName: DevDetails.LastName
                },
                Level: DevDetails.Level,
                Address: {
                    State: DevDetails.State,
                    Suburb: DevDetails.Suburb,
                    Street:DevDetails.Street,
                    Unit: DevDetails.Unit
                }
            });
            devInstance.save(function (err) {
                if (err) throw err;
                res.redirect('/listdeveloper');
            });
        });
        app.get('/updatetask', function (req, res) {
            res.render('updatetask');
        });
        app.post('/updatetask', function (req, res) {
            Task.updateOne({'_id': new mongoose.Types.ObjectId(req.body.TaskId)}, {$set:{'TaskStatus':req.body.TaskStatus}},{upsert: false}).exec(err => {
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/listtask');
                }
            });
        });
        app.get('/deletetask',function(req,res){
            res.render("deletetask");
        });
        app.post('/deletetask',function(req,res){
            let query = {'_id': (new mongoose.Types.ObjectId(req.body.TaskId)).toString()};
            Task.deleteOne(query).exec(err => {
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/listtask');
                }
            });
        });
        app.get('/deleteall',function(req,res){
            res.render("deleteall");
        });
        app.post('/deleteall',function(req,res){
            let query = {'TaskStatus':'Complete'}
            Task.deleteMany(query).exec(err => {
                if(err){
                    console.log(err)
                }
                else{
                    res.redirect('/listtask');
                }
            });
        });
        app.get('/listdeveloper', function (req, res) {
            Developer.find().exec(function (err, data) {
                res.render('listdeveloper', { data: data });
            });
        });
        app.get('/listtask', function (req, res) {

            Task.find().exec(function (err, data) {
                res.render('listtask', { data: data });
            });
        });
});
app.listen(8080);