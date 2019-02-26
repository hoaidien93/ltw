var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://hoaidien:maiyeu0510@ds151453.mlab.com:51453/hd_mongo";
var dbo;
class FrontController{
    constructor(){
        //Ket noi dtb:
        MongoClient.connect(url,{useNewUrlParser: true },(err,db)=> {
            if (err) throw  err;
            dbo = db.db("hd_mongo");
        });
    }
    /**
     *
     * @param req
     * @param res
     * @constructor
     */
    Home(req,res){
        var sess = req.session;
        var mess;
        if (typeof sess.mess !== 'undefined') {
            mess = ""+ sess.mess ;
        }
        else mess = undefined;

        //set empty mess after send
        sess.mess = undefined;

        return res.render('index',{
            mess : mess,
            name: sess.name
        });
    }

    /**
     *
     * @param req
     * @param res
     * @constructor
     */
    Login(req,res){
        let email = req.body.email;
        let password = req.body.password;
        //check database
            var query = {email : email, password: password};
            dbo.collection("user").find(query).toArray((err,result)=>{
                if(err) throw  err;
                if (result.length > 0) {
                    var sess = req.session;
                    sess.name = result[0]['name'] ;
                    sess.email = result[0]['email'];
                    sess.level = result[0]['level'];
                    var linkRD;//link redirect
                    if (typeof sess.linkRD !== 'undefined') {
                        linkRD = ""+ sess.linkRD ;
                    }
                    else linkRD = undefined;
                    //set empty link redirect
                    sess.linkRD = undefined;
                    if (typeof  linkRD !== 'undefined') return res.redirect(linkRD);
                    return res.redirect('/');
                }
                else{

                    return res.render('login',{
                        status: "Username or password is incorrect"
                    });
                }
            });
    }
	checkEmail(req,res){
		let email = req.body.email;
		var query = {email: email};
		dbo.collection("user").find(query).toArray((err, result) => {
			if (err) throw err;
			 if (result.length !== 0) {
				 return res.send({
					status : false
				});
			 }
			 else 
				return res.send({
					status : true
				});
		});
		
	}
    /**
     *
     * @param req
     * @param res
     * @constructor
     */
    Register(req,res) {
        let email = req.body.email;
        let password = req.body.password;
        let name = req.body.name;
        let pw_Rp = req.body.password_repeat;
        var renderData = [];
        var create = true;
        if (password !== pw_Rp) {
            renderData['status_password'] = "Repeated password not same";
            create = false;
        }
        //Connect MongoDB to check username !;
            var query = {email: email};
            dbo.collection("user").find(query).toArray((err, result) => {
                if (err) throw err;
                if (result.length !== 0) {
                    renderData['status_email'] = "Email is existed!";
                }
                else {
                    if (create === true) {
                        let account = {email: email,name: name, password: password};
                        dbo.collection("user").insertOne(account, (err, result) => {
                            if (err) throw err;
                        });
                        var sess = req.session;
                        sess.name = name;
                        sess.email = email;
                        return res.redirect('/');

                    }
                }
                return res.render('register', {
                    status_email: renderData['status_email'],
                    status_password: renderData['status_password']
                });
            });
    }
    Logout(req,res) {
        req.session.destroy(function (err) {
            if (err) throw err;
        });
        return res.redirect('/');
    }
    Vocabulary(req,res){
        var sess = req.session;
        var renderData = [];
        renderData['name'] = sess.name;
        if (typeof sess.name === 'undefined'){
            sess.linkRD = '/Vocabulary';
            return res.redirect('/login');
        }
        //check don't have a first test
        renderData['nameTest'] = "English Proficiency Test";
        renderData['content1'] = "To evaluate your ability exactly. We prepare for you a proficiency test";
        renderData['content2'] = "Thank you for your attention!";
        renderData['link'] = "/firstTest";
        if (typeof sess.level ==='undefined'){
            return res.render('prepareTest',{
                renderData: renderData
            })
        }
        //getCurrentLevel
        let query = {email : sess.email};
        dbo.collection('user').find(query).toArray((err,result)=>{
            if (err) throw err;
            //get data from result
            if (result.length === 0 ) return res.send('Something went wrong!');
            let level = result[0]['vocabularyLevel'];
            let level_FT = result[0]['level'] === "Beginer" ? "Level1" : "Level2";
            let table = "Vocabulary_"+level_FT+"_"+level;
            dbo.collection(table).find({}).toArray((err,result)=>{
                if (err) throw err;
                return res.render('Vocabulary',{
                    topic : result[0]['topic'],
                    name : "Hello "+ sess.name ,
                    renderData: result
                });
            });
        });
    }
    PostVocabulary(req,res){
        // list ket qua
            var score =0;
            dbo.collection('Vocabulary').find({}).toArray((err,result)=>{
                if (err) throw  err;
                var i;
                for(i = 0 ; i < result.length;i++){
                    if (result[i]['answer'] === req.body[i+1]) score++;
                }
                var sess = req.session;
                if (typeof sess.email ==='undefined') return res.redirect('/login');
                var query = {email :  sess.email};
                var newRecord = {$set : {scoreV1: score}};
               dbo.collection('user').updateOne(query,newRecord,(err,res)=>{
                   if (err) throw err;
                });

            })
        var sess = req.session;
        sess.mess = "Your Score will show to your profile in few seconds"
        return res.redirect('/');
    }
    MyProfile(req,res){
        var sess = req.session;
        var renderData =  [];
        if (typeof sess.email === 'undefined') return res.redirect('/login');
        renderData['name'] = sess.name;
           let query = {email : sess.email};
           dbo.collection('user').find(query).toArray((err,result)=>{
                if (err) throw err;
                //get data from result
               if (result.length === 0 ) return res.send('Something went wrong!');
                renderData = result[0];
               return res.render('profile',{
                   renderData: renderData
               });
           });
    }
    firstTest(req,res){
        var sess = req.session;
        if (typeof sess.name === 'undefined'){
            sess.linkRD = '/firstTest';
            return res.redirect('/login');
        }
        dbo.collection("firstTest").find({}).toArray((err,result)=>{
            if (err) throw err;
            return res.render('firstTest',{
                name : "Hello "+ sess.name ,
                renderData: result
            });
        })
    }
    postfirstTest(req,res){
        dbo.collection("answerFirstTest").find({}).toArray((err,result)=>{
            if (err) throw err;
            var score = 0;
            var i = 1;
            for (i=1;i<=20;i++){
                if (result[0][i.toString()] === req.body[i.toString()])
                    score++;
            }

            var renderData = [];
            renderData.name = "Hello "+ req.session.name;
            renderData.score = score;
            renderData.level = score >= 15? "Intermediate":"Beginer";
            var sess=req.session;
            sess.level = renderData.level;
            //add to db
            let query = {email : req.session.email};
            let newVal = {$set :{level : renderData.level, scoreFirstTest: score,listeningLevel: 1, vocabularyLevel: 1, grammarLevel:1}};
            dbo.collection("user").updateOne(query,newVal,(err,result)=>{
               if (err) throw  err;
               //do nothing
            });
            return res.render('thanks',{
                renderData: renderData
            });

        })
    }
    prepareTestVocabulary(req,res){
        //get LevelVocabulary
        var sess = req.session;
        if (typeof sess.email === 'undefined') return res.redirect('/login');
        let query = {email : sess.email};
        dbo.collection('user').find(query).toArray((err,result)=> {
            if (err) throw err;
            if (result.length <= 0 ) return res.send('Something went wrong!');
            let level = result[0]['vocabularyLevel'];
            var renderData = [];
            //check don't have a first test
            renderData['nameTest'] = result[0]['level']+" Vocabulary Test";
            renderData['content1'] = "Level : " + level;
            renderData['content2'] = "You have 5 second to choice answer";
            renderData['link'] = "/GoToTest/vocabulary";
            renderData['name'] = sess.name;
            return res.render('prepareTest',{
                renderData: renderData
            });
        });
    }
    testVocabulary(req,res){
        var sess = req.session;
        if (typeof sess.email === 'undefined') return res.redirect('/login');
        var query = {email : sess.email};
        dbo.collection('user').find(query).toArray((err,result)=> {
            if (err) throw err;
            if (result.length <= 0) return res.send('Something went wrong!');
            let levelFT = result[0]['level'];
            let level = result[0]['vocabularyLevel'] || 1;
            if (level === 5) return res.send('Your level is max, You can find another our lesson to learn');
            var renderData = [];
            query = {levelFT: levelFT , level : level};
            dbo.collection('vocabularyTest').find(query).toArray((err,result)=> {
                if (err) throw err;
                renderData =  result;
				renderData['level'] = level;
				renderData['levelFT'] = levelFT;
               return res.render('vocabularyTest',{
				   name: sess.name,
                 renderData: renderData
               });
            });
            });
    }
	postTestVocabulary(req,res){
		var sess =  req.session;
		let data = req.body;
		let level =  req.body.level;
		let levelFT = req.body.levelFT;
		var query = {LevelFT: levelFT , Level : level};
		var score = 0;
	    dbo.collection('answer_Vocabulary').find(query).toArray((err,result)=> {
			if (err) throw err;
			if (result.length === 0 ) return res.send('Something went wrong!');
			var i = 1;
			for (i = 1; i <= 5; i++){
				if (result[0][i] === data[i]) 
					score++;
			}
			//write score to db;
			query = {email: sess.email};
			var obj= {};
			obj["scoreVocabulary."+level] = score;
			let newVal = {$set : obj};
            if (score >= 4) obj['vocabularyLevel'] = parseInt(level)+1;
			dbo.collection("user").updateOne(query,newVal,(err,result)=>{
               if (err) throw  err;
               //do nothing
            });
			if (score >= 4) return res.send('You pass it');
			else res.send('Sorry!');
			
		});
    }
    getListening(req,res){
        
    }
}

module.exports = FrontController;