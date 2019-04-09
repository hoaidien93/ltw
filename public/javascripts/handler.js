// Get operation input
function getOperation(){
	var radios = document.getElementsByName('operation');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			return radios[i].value;
		}
	}
	return false;
}
// Calculator and printf result
function calc() {
	// Get number
	var notify = document.getElementById("notify").innerHTML;
	var firstNumber = document.getElementById("firstNumber").value;
	var secondNumber = document.getElementById("secondNumber").value;
	var operation = getOperation();
	if (operation === false){
		notify += "Chưa chọn phép tính ! <br/>";
    }
	else{
        if(firstNumber === "" || secondNumber === "") {
            notify = "Chưa nhập số !!!";
        }
        else {
            if (!isNaN(firstNumber) && !isNaN(secondNumber)){
                switch(operation){
                    case 'add':
                        document.getElementById('result').value = parseFloat(firstNumber) + parseFloat(secondNumber);
                        break;
                    case 'sub':
                        document.getElementById('result').value = parseFloat(firstNumber) - parseFloat(secondNumber);
                        break;
                    case 'mult':
                        document.getElementById('result').value = parseFloat(firstNumber) * parseFloat(secondNumber);
                        break;
                    case 'div':
                        document.getElementById('result').value = parseFloat(firstNumber) / parseFloat(secondNumber);
                        break;						
                }
                notify = "";
            }
        }
	}
	document.getElementById("notify").innerHTML = notify;
}

// Check input is a number
function checkNumber(position) {
	var number = document.getElementById(position).value;
	var pos = (position === "firstNumber" )? "Số thứ nhất" : "Số thứ hai";
	if(isNaN(number)){
		document.getElementById('notify').innerHTML = pos + " không phải là số thực <br/>";
	};
}
