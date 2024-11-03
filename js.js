var userAddress, contract, web3, drSig = "0x2bb54039d7c1886f7d2641e3daa474a7599c882d31e40ed7d5ab1ab5affe3d656a2cbb44b0de0229ae9fb2cb106d41e1b5675eefb0cfd1370efc6a53564eefee1b", patientSig = "0xe27a3eefad7512c1743acc612da5b9d60e32e1a95d0a5e4e0b5484d0f629b8797eb470c54e176f757bdf7d6bd67b964b43c0355d3129676784be6dcf4202c2151b", hospitalSig = "0x82dfb405588cb0db002b22f182f7892c7ca576ecbd5698f5bd6326c807758d3e53e458472167e7ed2797ed73faecddc912673782e79fd96793f2f093b72fd18c1c", icSig;
var entities = {
  patient: {
    address: "0xF37E66e8BEF36eEcA82BDCd594fa7B60474Bd74B",
    privKey: "80be4a5c73a58784a3d52927c7e1437d7ad2fea559ac23247cbaacc99013c135",
  },
  doctor: {
    address: "0x54133A0742B925Da8Ab4A4665183dB1dEC9434d2",
    privKey: "224eb97b1ab67d2765f0e85e752ee1469b0f142ab6ab1936e2f011720de51bf0",
  },
  hospital: {
    address: "0x09b74c8Bf2D0E71E4C97e081Ab00F5DC632F9B89",
    privKey: "909aff200bd36158e26e662573bebfbaf24684122efe304436bff6825e28f545",
  },
  pharmacy: {
    address: "0xc9dF15150A33A7984900D729444421aEB09dFC6C",
    privKey: "573dadd1ec3b8de9cb1bf79ab2cc52588d1aa2de3a4b8f96f44828188501d72d",
  },
  pharmaceutical_company: {
    address: "0x5F5607534F184234e05Cbb6787803b4A5fE064EF",
    privKey: "16e12168bac9fce87624db3c6499dc55fab97344285b4b4c1e5c1b4286067712",
  },
  diagnostic_center: {
    address: "0x7670Bd714B2cBAbA1B6dbB05CB768cC4aD9E093f",
    privKey: "9d8685b6fff85a5cfe86f160b1c7a6d459df40f5ed2711d4bd425c2fb9047d79",
  },
  equipment_supplier: {
    address: "0xc88322A0E2D41dB9145546377d2EFb1c600Bdf91",
    privKey: "61559600b10f70bc165dd8a4329edb49c33d83f91af4eff422b409f9a56250c4",
  },
  wholesale_dealer: {
    address: "0x0d7Cc46866E64e3A21ee3E862C8010B0e831dDE7",
    privKey: "93a8bd4bb3ffe951bce5e81f786fc965c32541e695f2008495734190837ce87f",
  },
  insurance_company: {
    address: "0x17ad441c05bda9CB9F366Db0bC91c442f30Cb020",
    privKey: "",
  }
  // insurance_company: {
  //   address: "0xBF8bd7f99345c6c6791553fa106A2d3b60Ca1CeC",
  //   privKey: "08d4ab660d846c4be9855d93a6da8e63bcb7b8216d74bb3cdacb6557de06fe9b",
  // }
};
var abi, address, bytecode;

window.request = "Body Pain, Fever";
window.symptomSignature = "0xabf4fe62cd9f3c868754e081006ea89bd9fbba7bf456948a15903b5b19ca8b4e5ce2eedb5c6d54cf0cb2fa55cbf7357dc3abc8abd02d341f901f8e6de5db4ddd1c";
window.patientAdd = entities.patient.address;
window.doctorAdd = entities.doctor.address;
window.hospitalAdd = entities.hospital.address;
window.remedies = '{"Symptoms":["Body Pain"," Fever"],"Remedies":["Medicine","Medicine"]}';
window.remedy = '{"Remedy0":["gelofen","400mg","once per day"],"Remedy1":["Acetaminophen","650 mg","three times per day"]}';
window.dateUsed = 1667760206358;
window.feeUsed = 10;
window.feeInfoUsed = '{"Service fee":"9","Remedy0":"0.5","Remedy1":"0.5"}';

abi = _abi;
address = _address;

function fillMessage() {
  document.getElementById("req").value = request;
}

function setEntities() {
  document.getElementById("req1").value = request;
  document.getElementById("req2").value = symptomSignature;
  document.getElementById("dr0").value = patientAdd;
  document.getElementById("dr1").value = doctorAdd;
  document.getElementById("dr2").value = "Medicine,Medicine";
  document.getElementById("dr3").value = 'gelofen/400mg/once per day,Acetaminophen/650 mg/three times per day';
}

var inputCounter = 2;

function addInput() {
  var input = document.createElement("input");
  input.type = "text";
  input.id = "dr" + inputCounter;
  input.placeholder = "Title: [Remedy1, Remedy2, Remedy3]";
  inputCounter++;
  var input2 = document.createElement("input");
  input2.type = "text";
  input2.id = "dr" + inputCounter;
  input2.placeholder = "Data: [RemedyName/ Strength/ Usage/ Id, RemedyName2/ Strength2...]";
  input2.style = "display: block";
  inputCounter++;
  var div = document.getElementById("doctordiv");
  div.appendChild(input);
  div.appendChild(input2);
  div.style = "display: block";
}

function createPrescription() {
  var patient = document.getElementById("dr0").value;
  var doctor = document.getElementById("dr1").value;
  var date = 1667760206358 || Date.now();
  var reqObj = {};
  var req = document.getElementById("req1").value;
  var arr = req.split(",");
  reqObj["Symptoms"] = arr;
  var title = document.getElementById("dr2").value;
  var data = document.getElementById("dr3").value;
  arr = title.split(",");
  reqObj["Remedies"] = arr;
  arr = data.split(",");
  // console.log(arr);
  var a;
  for (let i = 0; i < arr.length; i++) {
    var _arr = arr[i].split("/");
    reqObj["Remedy" + i] = _arr;
    // console.log(_arr);
    // console.log(reqObj);
    a = i;
  }
  var obj = {};
  obj["title"] = JSON.stringify({
    Symptoms: reqObj["Symptoms"],
    Remedies: reqObj["Remedies"]
  });
  var remedyArr = {};
  for (let i = 0; i <= a; i++) {
    remedyArr["Remedy" + i] = reqObj["Remedy" + i];
  }
  obj["data"] = JSON.stringify(remedyArr);
  drSign(patient, doctor, date, obj);
}

async function drSign(patient, doctor, date, obj) {
  const parameters = getTypedDataDr(patient, doctor, date, obj);
  const signmessage = web3.currentProvider.sendAsync(
    {
      method: "eth_signTypedData_v4",
      params: [userAddress, parameters],
      from: userAddress,
    },
    (err, res) => {
      if (res) {
        drSig = res.result;
        // sendPrescription();
        window.localStorage.setItem("dr sig", drSig);
        document.getElementById("drsig").innerHTML = drSig;
      } else {
        console.error(err);
      }
    }
  );
}

function getTypedDataDr(_patient, _doctor, _date, _obj) {
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
    },
    primaryType: "Prescription",
    domain: {
      name: "Smart Contracts in Health Insurance",
      version: "1",
      chainId: 80001,
      verifyingContract: address,
    },
    message: {
      patient: _patient,
      doctor: _doctor,
      title: _obj["title"],
      data: _obj["data"],
      date: _date,
    },
  });
}

function sendPrescription() {
  document.getElementById("req3").value = request;
  document.getElementById("req4").value = symptomSignature;
  document.getElementById("req5").value = drSig;
  document.getElementById("h0").value = entities.patient.address;
  document.getElementById("h1").value = entities.doctor.address;
  document.getElementById("h2").value = entities.hospital.address;
  document.getElementById("h3").value = remedies;
  document.getElementById("h4").value = remedy;
  document.getElementById("h5").value = dateUsed;
  document.getElementById("h6").value = feeUsed;
  document.getElementById("h7").value = feeInfoUsed;
  // createReceipt();
}

function fillPrescription() {
  document.getElementById("req6").value = drSig;
  document.getElementById("req7").value = hospitalSig;
  document.getElementById("p0").value = entities.patient.address;
  document.getElementById("p1").value = entities.doctor.address;
  document.getElementById("p2").value = entities.hospital.address;
  document.getElementById("p3").value = remedies;
  document.getElementById("p4").value = remedy;
  document.getElementById("p5").value = dateUsed;
  document.getElementById("p6").value = feeUsed;
  document.getElementById("p7").value = feeInfoUsed;
  // createReceipt();
}

function sendReceipt() {
  document.getElementById("req8").value = request;
  document.getElementById("req9").value = symptomSignature;
  document.getElementById("ic0").value = entities.patient.address;
  document.getElementById("ic1").value = entities.doctor.address;
  document.getElementById("ic2").value = entities.hospital.address;
  document.getElementById("ic3").value = remedies;
  document.getElementById("ic4").value = remedy;
  document.getElementById("ic5").value = "1667760206358";
  document.getElementById("ic6").value = feeUsed;
  document.getElementById("ic7").value = feeInfoUsed;
  // claim that gets hashed
  document.getElementById("ic8").value = 80;
  document.getElementById("ic9").value = true;
  document.getElementById("ic10").value = patientSig;
  document.getElementById("ic11").value = drSig;
  document.getElementById("ic12").value = hospitalSig;
  // createReimbursement();
}

ethereum.on("chainChanged", (chainId) => {
  loginMeta();
});

ethereum.on("accountsChanged", (accounts) => {
  // closeModal();
  loginMeta();
});
