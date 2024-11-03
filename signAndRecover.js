async function signMessage() {
    var txt = document.getElementById("req").value;
    web3.eth.personal.sign(
        txt, 
        userAddress
    ).then(
        (res) => {
            document.getElementById("patientsig").innerHTML = res;
        }
    );
}

async function verifyMessage() {
    var txt = document.getElementById("req1").value;
    var _sig = document.getElementById("req2").value;
    web3.eth.personal.ecRecover(
        txt,
        _sig
    ).then(
        (res) => {
            console.log(res);
            var a = document.getElementById("dr0").value;
            if (a.toLowerCase() == res) {
                document.getElementById("msg").innerHTML = "Match!";
            } else {
                document.getElementById("msg").innerHTML = "Invalid!";
            }
        }
    );
}

async function verifyDr() {
    var a = document.getElementById("req3").value;
    var b = document.getElementById("req4").value;
    var c = document.getElementById("req5").value;
    var d = document.getElementById("h0").value; // patient
    var e = document.getElementById("h1").value;
    var f = document.getElementById("h2").value; // hospital
    var g = document.getElementById("h3").value;
    var h = document.getElementById("h4").value;
    var j = document.getElementById("h5").value;
    var z;
    web3.eth.personal.ecRecover(
        a,
        b
    ).then(
        (res) => {
            console.log(res);
            if (d.toLowerCase() == res) {
                z = 1;
            } else {
                z = 0;
            }
        }
    );
    var p = [
        d,
        e,
        g,
        h,
        j
    ];
    let dr = contract.methods.verifyDrSignature(p, c).call().then((res) => {

        console.log(res);
        var btn = document.getElementById("vdr");
        if (e == res && z == 1) {
            z = 1;
        } else if (e == res && z == 0) {
            z = 2;
        } else if (e !== res && z == 1) {
            z = 3;
        } else {
            z = 4;
        }
        switch (z) {
            case 1:
                btn.innerHTML = "Both Match";
                break;
            case 2:
                btn.innerHTML = "Invalid Patient Signature";
                break;
            case 3:
                btn.innerHTML = "Invalid Doctor Signature";
                break;
            case 4:
                btn.innerHTML = "Both Invalid";
                break;
            default:
                console.log("Seems like an error occured");
                break;
        }
    });
}

async function verifyHospital() {
    var a = document.getElementById("req6").value;
    var b = document.getElementById("req7").value;
    var d = document.getElementById("p0").value; // patient
    var e = document.getElementById("p1").value;
    var f = document.getElementById("p2").value; // hospital
    var g = document.getElementById("p3").value;
    var h = document.getElementById("p4").value;
    var j = document.getElementById("p5").value;
    var i = document.getElementById("p6").value;
    var k = document.getElementById("p7").value;
    var z;
    var p = [
        d,
        e,
        g,
        h,
        j
    ];
    var obj = [
        f,
        i,
        k,
        p
    ];
    let dr = await contract.methods.verifyDrSignature(p, a).call();
    if (dr) {
        console.log(dr);
    }
    let hospit = await contract.methods.verifySignature(obj, b, b).call();
    if (hospit) {
        console.log(hospit[0]);
    }
    if (dr && hospit) {
        if (dr == e && hospit == f) {
            document.getElementById("vh").innerHTML = "Both Match";
        } else if (dr == e && hospit !== f) {
            document.getElementById("vh").innerHTML = "Invalid Hospital Signature";
        } else if (dr !== e && hospit == f) {
            document.getElementById("vh").innerHTML = "Invalid Doctor Signature";
        } else {
            document.getElementById("vh").innerHTML = "Both Invalid";
        }
    }
}