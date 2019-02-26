let express =  require('express');
let app = express();
var bodyParser = require('body-parser');
var session		=	require('express-session');
var path = require("path");

let ctl = require('./Controller/FrontController');

var Controller = new ctl();
//setting hear
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'hdd',saveUninitialized: true,resave: true,cookie: { maxAge: 30*60*1000 }}));
// This user should log in again after restarting the browser

//Route index
app.get('/',Controller.Home);
app.get('/webAnimation.css',(req,res)=>{
	res.sendFile(path.join(__dirname+'/webAnimation.css'));
});
app.get('/slide-doctor-bg.jpg',(req,res)=>{
		res.sendFile(path.join(__dirname+'/slide-doctor-bg.jpg'));
});
app.get('/4.png',(req,res)=>{
	res.sendFile(path.join(__dirname+'/4.png'));
})
app.get('/img/:name',(req,res)=>{
	res.sendFile(path.join(__dirname + '/img/' + req.params.name));
});
//end index
app.get('/register',(req,res)=>{
    res.render('register',{
        linkcss : __dirname+'/webAnimation.css'
    });
});
app.get('/login',(req,res)=>{
    res.render('login');
});
app.post('/login',Controller.Login);
app.post('/register',Controller.Register);
app.get('/logout',Controller.Logout);
app.get('/Vocabulary',Controller.Vocabulary);
app.post('/Vocabulary',Controller.PostVocabulary);
app.get('/profile',Controller.MyProfile);
app.get('/firstTest',Controller.firstTest);
app.post('/firstTest',Controller.postfirstTest);
app.get('/PrepareTest/vocabulary',Controller.prepareTestVocabulary);
app.get('/GoToTest/vocabulary',Controller.testVocabulary);
app.post('/GoToTest/vocabulary',Controller.postTestVocabulary);
app.get('/Listening',Controller.getListening);
app.post('/ajax/register',Controller.checkEmail);
app.get('/chatbox.js',(req,res)=>{
   res.sendFile(path.join(__dirname + '/chatbox.js'));
});
app.get('/sound/:name',(req,res)=>{
    res.sendFile(path.join(__dirname+'/sound/'+ req.params.name));
});
server = app.listen(process.env.PORT || 8080,() => {
    console.log('Server is listenning');
});
var io = require('socket.io')(server);
io.on('connection', function(socket){
    socket.username= "Anonymous";

    socket.on('change_username',(data)=>{
        socket.username = data.username;
    });
    socket.on('send_message',(data)=>{
        //send message to all clien
        console.log(data);
        io.sockets.emit('send_message',{message: data.message, username: socket.username});
    })
});



