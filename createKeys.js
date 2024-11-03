
function register() {
    document.getElementById("register").style = "display: none;";
    document.getElementById("generator").style = "display: block;";
    document.getElementById("entitiesWrapper").style = "display: none;";
  }
  
var list = [
    "patient",
    "doctor",
    "hospital",
    "pharmacy",
    "pharmaceutical_company",
    "diagnostic_center",
    "equipment_supplier",
    "wholesale_dealer",
    "insurance_company",
];

var _list = [
    "message",
    "patient",
    "doctor",
    "hospital",
    "pharmacy",
    "pharmaceutical-company",
    "diagnostic-center",
    "equipment-supplier",
    "wholesale-dealer",
    "insurance-company",
];

function generateKeys() {
    var _entities = window.localStorage.getItem("Entities");
    if (!_entities) {
        for (let i = 0; i < list.length; i++) {
        generateKey(list[i]);
        }
    } else {
        entities = JSON.parse(_entities);
    }
}

function genKey() {
    var a = document.getElementById("entity").value;
    if (!a) {
        alert("Please fill in the entity field");
        return;
    }
    generateKey(a);
}

function generateKey(entity) {
    let account = web3.eth.accounts.create();
    console.log(account.privateKey);
    document.getElementById("address").innerHTML = account.address;
    document.getElementById("privKey").innerHTML = account.privateKey;
}

function signup() {
    var a = document.getElementById("entity").value;
    var b = document.getElementById("name").value;
    var c = document.getElementById("surname").value;
    var d = document.getElementById("home").value;
    var e = document.getElementById("phone").value;
    var f = document.getElementById("address").innerHTML;
    if (a && b && c && d && e && f) {
        var arr = [];
        window.localStorage.setItem(arr[0], arr);
        document.getElementById("response").innerHTML = "Successfully registered";
    } else {
        alert("Please fill in all the fields");
        return;
    }
}


function openModal() {
    document.getElementById("register").style = "display: none;";
    document.getElementById("entitiesWrapper").style = "display: block;";
    var a = -1;
    for (let i = 0; i < list.length; i++) {
        var add = entities[list[i]].address.toLowerCase();
        if (add == userAddress) {
            a = i;
        }
    }
    if (a !== -1) {
        console.log(list[a]);
        document.getElementById(_list[a + 1]).style = "display: block;";
    } else {
        document.getElementById("message").innerHTML = "You have not been registered on the system. <button onclick='register()'>Register</button>";
        document.getElementById("message").style = "display: block;";
    }
}
  
function closeModal() {
    for (let i = 0; i < _list.length; i++) {
        // console.log(i);
        document.getElementById(_list[i]).style = "display: none;";
    }
}
