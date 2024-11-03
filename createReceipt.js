// hospitalSig = drSig;
// patientSig = drSig;

function createReceipt() {
    var prescription = {};
    var patient = document.getElementById("p0").value;
    var doctor = document.getElementById("p1").value;
    var hospital = document.getElementById("p2").value;
    var title = document.getElementById("p3").value;
    var data = document.getElementById("p4").value;
    var date = "1667760206358";
    prescription["patient"] = patient;
    prescription["doctor"] = doctor;
    prescription["title"] = title;
    prescription["data"] = data;
    prescription["date"] = date;
    // var date = document.getElementById("p5").value;
    var fee = document.getElementById("p6").value;
    var feeDescription = document.getElementById("p7").value;
    patientSign(prescription, fee, feeDescription, hospital);
}

function createReceiptH() {
    var prescription = {};
    var patient = document.getElementById("h0").value;
    var doctor = document.getElementById("h1").value;
    var hospital = document.getElementById("h2").value;
    var title = document.getElementById("h3").value;
    var data = document.getElementById("h4").value;
    var date = "1667760206358";
    prescription["patient"] = patient;
    prescription["doctor"] = doctor;
    prescription["title"] = title;
    prescription["data"] = data;
    prescription["date"] = date;
    // var date = document.getElementById("p5").value;
    var fee = document.getElementById("h6").value;
    var feeDescription = document.getElementById("h7").value;
    patientSignH(prescription, fee, feeDescription, hospital);
}
  
async function patientSign(prescription, fee, feeDescription, hospital) {
    const parameters = getTypedDataP(prescription, fee, feeDescription, hospital);
    const signmessage = web3.currentProvider.sendAsync(
    {
        method: "eth_signTypedData_v4",
        params: [userAddress, parameters],
        from: userAddress,
    },
    (err, res) => {
        if (res) {
            patientSig = res.result;
            window.localStorage.setItem("patient sig", patientSig);
            document.getElementById("psig").innerHTML = patientSig;
        } else {
            console.error(err);
        }
    }
    );
}
  
async function patientSignH(prescription, fee, feeDescription, hospital) {
    const parameters = getTypedDataP(prescription, fee, feeDescription, hospital);
    const signmessage = web3.currentProvider.sendAsync(
    {
        method: "eth_signTypedData_v4",
        params: [userAddress, parameters],
        from: userAddress,
    },
    (err, res) => {
        if (res) {
            hospitalSig = res.result;
            window.localStorage.setItem("hospital sig", patientSig);
            document.getElementById("hsig").innerHTML = hospitalSig;
        } else {
            console.error(err);
        }
    }
    );
}
  
function getTypedDataP(_prescription, _fee, _feeDescription, _hospital) {
    return JSON.stringify({
    types: {
        EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
        ],
        Prescription: [
            { name: "patient", type: "address" },
            { name: "doctor", type: "address" },
            { name: "title", type: "string" },
            { name: "data", type: "string" },
            { name: "date", type: "uint256" },
        ],
        Claim: [
            { name: "hospital", type: "address" },
            { name: "fee", type: "uint256" },
            { name: "feeInfo", type: "string" },
            { name: "prescription", type: "Prescription" },
        ],
    },
        primaryType: "Claim",
        domain: {
            name: "Smart Contracts in Health Insurance",
            version: "1",
            chainId: 80001,
            verifyingContract: address,
        },
        message: {
            hospital: _hospital,
            fee: _fee,
            feeInfo: _feeDescription,
            prescription: _prescription,
        },
    });
}
