class Users{
	constructor(){
		this.username = 'HoaiDien';
		this.password = '12345';
	}
	
	getInfo(){
		return ({
			name: this.username,
			pass: this.password
		});
	}
};

module.exports = Users;
