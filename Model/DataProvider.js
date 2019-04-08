var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://hoaidien:maiyeu0510@ds151453.mlab.com:51453/hd_mongo";
var dbo;

class DataProvider{
    constructor(){
        //Ket noi dtb:
        MongoClient.connect(url,{useNewUrlParser: true },(err,db)=> {
            if (err) throw  err;
            dbo = db.db("hd_mongo");
        });
    }

    async checkLogin(email,password){
        var query = {email : email, password: password};
        var rs = await dbo.collection("user").find(query).toArray();
        console.log(rs);
        return rs;
    }

    async isExistEmail(email){
        var query = {email: email};
        var rs = await dbo.collection("user").find(query).toArray();
        var status = rs.length !== 0 ? false : true;
		return status;
    }

    createAccount(email,name,password){
        let account = {email: email,name: name, password: password};
        dbo.collection("user").insertOne(account, (err, result) => {
            if (err) throw err;
        });
        return true;
    }

    async findInfoUser(email){
        var query = {email : email};
        var rs = await dbo.collection("user").find(query).toArray();
        return rs;
    }

    async getQuestions(table){
        var rs = await dbo.collection(table).find({}).toArray();
        return rs;
    }
}

module.exports = DataProvider;