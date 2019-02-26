let util = require("util");
let express =  require('express');
let app = express();
var name ="Hoai Dien";
var hel = "Hello!";
var so = 3;
var mes = util.format("%s %s%d", hel,name,so);
//loop

var arr = [1,2,3,4,5];
var sum = 0;
for (item of arr){
	sum += item;
}
util.log(sum);
util.log(mes);
app.listen(8080,() => {
    console.log('Server is listenning');
});