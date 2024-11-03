var userAddress,
  contract,
  web3,
  inputs,
  spans,
  drSig,
  pSig,
  signatures = [],
  addresses = [];

var entities = {
  patient: {
    address: "0xF37E66e8BEF36eEcA82BDCd594fa7B60474Bd74B",
  },
  health_professional: {
    address: "0x54133A0742B925Da8Ab4A4665183dB1dEC9434d2",
  },
  health_center: {
    address: "0x09b74c8Bf2D0E71E4C97e081Ab00F5DC632F9B89",
  },
  pharmacy: {
    address: "0xc9dF15150A33A7984900D729444421aEB09dFC6C",
  },
  pharmaceutical_company: {
    address: "0x5F5607534F184234e05Cbb6787803b4A5fE064EF",
  },
  diagnostic_center: {
    address: "0x7662db3cbab459cf26e6480aef0489efc1002d89",
  },
  equipment_supplier: {
    address: "0xc88322A0E2D41dB9145546377d2EFb1c600Bdf91",
  },
  wholesale_dealer: {
    address: "0x0d7Cc46866E64e3A21ee3E862C8010B0e831dDE7",
  },
  insurance_company: {
    address: "0xd458dd932b9e620fea79280c3b11ed4795de8232",
  },
};

var abi = _abi,
  address = _address,
  bytecode = _bytecode;

async function loginMeta() {
  let accounts;
  if (window.ethereum) {
    web3 = new Web3(ethereum);
    try {
      accounts = await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error(error);
    }
  } else {
    alert("No wallet detected!");
  }
  userAddress = accounts[0];
  console.log("Address: " + userAddress);
  declareContract();
}

function declareContract() {
  contract = new web3.eth.Contract(abi, address);
  openModal();
}

function toPlainString(num) {
  return ("" + +num).replace(
    /(-?)(\d*)\.?(\d*)e([+-]\d+)/,
    function (a, b, c, d, e) {
      return e < 0
        ? b + "0." + Array(1 - e - c.length).join(0) + c + d
        : b + c + d + Array(e - d.length + 1).join(0);
    }
  );
}

var _prescription = [
  "patien's address",
  "hp's address",
  "title",
  "data",
  "date",
];

var _claim = [
  "entity's address",
  "last date",
  "fee",
  "fee Information",
  _prescription,
];

var _reimbursement = [
  _claim,
  "signers",
  "signatures",
  "percentage",
  "total fee",
];

var _reimbursewithsignature = ["reimbursement id", "insured's address"];

function refresh() {
  inputs = document.getElementsByClassName("inputs");

  pSig = document.getElementById("psig").innerHTML;
  drSig = document.getElementById("drsig").innerHTML;
  // addresses.push(inputs[6].value);
  // signatures.push(document.getElementById("hsig").innerHTML);

  // _prescription[2] = JSON.stringify(inputs[3].value);
  // _prescription[3] = JSON.stringify(inputs[4].value);
  _prescription[0] = inputs[1].value;
  _prescription[1] = inputs[2].value;
  _prescription[2] = inputs[3].value;
  _prescription[3] = inputs[4].value;
  _prescription[4] = inputs[5].value;
  _claim[0] = inputs[6].value;
  _claim[1] = inputs[7].value;
  _claim[2] = inputs[8].value;
  _claim[3] = inputs[9].value;
  _claim[4] = _prescription;
  _reimbursement[0] = _claim;
  _reimbursement[1] = addresses;
  _reimbursement[2] = signatures;
  _reimbursement[3] = inputs[10].value;
  _reimbursement[4] = inputs[8].value;
}

function createPrescription() {
  refresh();
  drSign();
}

async function drSign() {
  const parameters = getTypedDataDr();
  const signmessage = web3.currentProvider.sendAsync(
    {
      method: "eth_signTypedData_v4",
      params: [userAddress, parameters],
      from: userAddress,
    },
    (err, res) => {
      if (res) {
        drSig = res.result;
        document.getElementById("drsig").innerHTML = drSig;
      } else {
        console.error(err);
      }
    }
  );
}

// chain id

function getTypedDataDr() {
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
        { name: "healthProfessional", type: "address" },
        { name: "title", type: "string" },
        { name: "data", type: "string" },
        { name: "date", type: "uint256" },
      ],
    },
    primaryType: "Prescription",
    domain: {
      name: "Smart Contracts in Health Insurance",
      version: "1",
      chainId: 250,
      verifyingContract: address,
    },
    message: {
      patient: _prescription[0],
      healthProfessional: _prescription[1],
      title: _prescription[2],
      data: _prescription[3],
      date: _prescription[4],
    },
  });
}

async function verifyDr() {
  refresh();
  var e = inputs[2].value;
  let dr = contract.methods
    .recoverHpAddress(_prescription, drSig)
    .call()
    .then((res) => {
      console.log(res);
      var btn = document.getElementById("vdr");
      if (e == res) {
        btn.innerHTML = "Signature is valid";
      } else {
        btn.innerHTML = "Signature is invalid";
      }
      // btn.innerHTML = (e == res) ? "Signature is valid" : "Signature is invalid";
    });
}

ethereum.on("chainChanged", (chainId) => {
  loginMeta();
});

ethereum.on("accountsChanged", (accounts) => {
  loginMeta();
});

function register() {
  loginMeta();
}

async function signMessage() {
  var txt = inputs[0].value;
  web3.eth.personal.sign(txt, userAddress).then((res) => {
    document.getElementById("psig").innerHTML = res;
  });
}

async function verifyMessage() {
  var txt = inputs[0].value;
  var _sig = document.getElementById("psig").innerHTML;
  web3.eth.personal.ecRecover(txt, _sig).then((res) => {
    console.log(res);
    var a = inputs[1].value;
    if (a.toLowerCase() == res) {
      document.getElementById("msg").innerHTML = "Signature is valid";
    } else {
      document.getElementById("msg").innerHTML = "Signature is invalid!";
    }
  });
}

var list = [
  "patient",
  "health_professional",
  "health_center",
  "pharmacy",
  "pharmaceutical_company",
  "diagnostic_center",
  "equipment_supplier",
  "wholesale_dealer",
  "insurance_company",
];

var _list = [
  "Patient",
  "Health Professional",
  "Health Center",
  "Pharmacy",
  "Pharmaceutical Company",
  "Diagnostic Center",
  "Equipment Seller",
  "Equipment Supplier",
  "Insurance Company",
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

function generateKey() {
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
  var a = -1;
  for (let i = 0; i < list.length; i++) {
    var add = entities[list[i]].address.toLowerCase();
    if (add == userAddress) {
      a = i;
    }
  }
  if (a !== -1) {
    console.log("Entity: " + _list[a]);
    document.getElementById("entityName").innerHTML = _list[a];
    document.getElementById("register").style = "display: none;";
    document.getElementById("container").style = "display: flex;";
    document.getElementById("generator").style = "display: none;";
  } else {
    document.getElementById("register").style = "display: none;";
    document.getElementById("generator").style = "display: flex;";
    document.getElementById("container").style = "display: none;";
  }
}

function createReceipt() {
  refresh();
  patientSign();
}

async function patientSign() {
  const parameters = getTypedDataP();
  const signmessage = web3.currentProvider.sendAsync(
    {
      method: "eth_signTypedData_v4",
      params: [userAddress, parameters],
      from: userAddress,
    },
    (err, res) => {
      if (res) {
        var sig = res.result;
        console.log(sig);
        if (sig) {
          signatures.push(String(sig));
          addresses.push(String(userAddress));
          window.localStorage.setItem("sigs", JSON.stringify(signatures));
          window.localStorage.setItem("adds", JSON.stringify(addresses));
          document.getElementById("hsig").innerHTML = sig;
        }
      } else {
        console.error(err);
      }
    }
  );
}

function getTypedDataP() {
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
        { name: "healthProfessional", type: "address" },
        { name: "title", type: "string" },
        { name: "data", type: "string" },
        { name: "date", type: "uint256" },
      ],
      Claim: [
        { name: "lastEntity", type: "address" },
        { name: "lastDate", type: "uint256" },
        { name: "fee", type: "uint256" },
        { name: "feeInfo", type: "string" },
        { name: "prescription", type: "Prescription" },
      ],
    },
    primaryType: "Claim",
    domain: {
      name: "Smart Contracts in Health Insurance",
      version: "1",
      chainId: 250,
      verifyingContract: address,
    },
    message: {
      lastEntity: _claim[0],
      lastDate: _claim[1],
      fee: _claim[2],
      feeInfo: _claim[3],
      prescription: {
        patient: _prescription[0],
        healthProfessional: _prescription[1],
        title: _prescription[2],
        data: _prescription[3],
        date: _prescription[4],
      },
    },
  });
}

async function verifyhealthCenter() {
  refresh();
  var hcSIg = document.getElementById("hsig").innerHTML;
  let hospit = await contract.methods.recoverAddress(_claim, hcSIg).call();
  var f = addresses[addresses.length-1];

  if (hospit) {
    if (hospit.toLowerCase() == f.toLowerCase()) {
      document.getElementById("vh").innerHTML = "Valid signature";
    } else {
      document.getElementById("vh").innerHTML = "Invalid signature";
    }
  }
}

async function verifySignatures() {
  refresh();
  let adds = await contract.methods.recoverAddresses(_claim, signatures).call();
  console.log(adds);
  console.log(addresses);
  if (JSON.stringify(addresses).toLowerCase() == JSON.stringify(adds).toLowerCase()) {
    document.getElementById("icVerify").innerHTML = "All signatures match";
  } else {
    document.getElementById("icVerify").innerHTML = "Not all signatures match";
  }
}

async function sendSimulation() {
  refresh();
  let gas = await contract.methods
    .reimburse(_reimbursement, eval(inputs[11].value), inputs[1].value)
    .estimateGas({ from: userAddress });
  document.getElementById("icGas").innerHTML = gas
    ? "Successful estimation: " + gas
    : "An error has occured";
}

async function createReimbursement() {
  refresh();
  let _data = await contract.methods
    .reimburse(_reimbursement, eval(inputs[11].value), inputs[1].value)
    .encodeABI();
  // console.log(_data);

  let _gas = await contract.methods
    .reimburse(_reimbursement, eval(inputs[11].value), inputs[1].value)
    .estimateGas({ from: userAddress });
  console.log(_gas);

  var privKey = inputs[14].value;
  if (privKey == "") {
    alert("Please fill in the private key");
  }

  web3.eth.accounts
    .signTransaction(
      {
        from: userAddress,
        to: address,
        // value: "1000000000",
        gas: _gas,
        data: _data,
      },
      privKey
    )
    .then((res) => {
      console.log(res);
      document.getElementById("icsig").innerHTML = res.rawTransaction;
    });
}

function verifyTx() {
  var tx = document.getElementById("icsig").innerHTML;
  var add = web3.eth.accounts.recoverTransaction(tx);
  console.log(add);
  if (add.toLowerCase() == entities.insurance_company.address.toLowerCase()) {
    document.getElementById("verifyTx").innerHTML = "Match";
    return;
  }
  document.getElementById("verifyTx").innerHTML = "Invalid signature";
}

async function sendTx() {
  console.log("Initiating transaction...");
  var tx = document.getElementById("icsig").innerHTML;
  await web3.eth.sendSignedTransaction(tx).then((res) => {
    if (res) {
      console.log(res);
      let subscription = web3.eth.subscribe('reimbursements', {}, (err, res) => {
        console.log(res);
        document.getElementById("eventData").appendChild(
          prettyPrint(res, {
            maxDepth: 15,
          })
        );
      });
      document.getElementById("txSig").innerHTML = res.transactionHash;
    }
  });
}

async function signReimbursement() {
  refresh();
  let id = await contract.methods.getReimbursementId(_reimbursement).call();
  if (id) {
    icSign(id);
  }
}

async function icSign(id) {
  const parameters = getTypedDataIC(id);
  const signmessage = web3.currentProvider.sendAsync(
    {
      method: "eth_signTypedData_v4",
      params: [userAddress, parameters],
      from: userAddress,
    },
    (err, res) => {
      if (res) {
        var sig = res.result;
        console.log(sig);
        document.getElementById("icsig").innerHTML = sig;
      } else {
        console.error(err);
      }
    }
  );
}

function getTypedDataIC(id) {
  return JSON.stringify({
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      ReimburseWithSignature: [
        { name: "reimbursementId", type: "uint256" },
        { name: "insured", type: "address" },
      ],
    },
    primaryType: "ReimburseWithSignature",
    domain: {
      name: "Smart Contracts in Health Insurance",
      version: "1",
      chainId: 250,
      verifyingContract: address,
    },
    message: {
      reimbursementId: id,
      insured: inputs[1].value,
    },
  });
}

async function verifyIC() {
  refresh();
  var sig = document.getElementById("icsig").innerHTML;
  let gas = await contract.methods.reimburseWithSignature(_reimbursement, sig).estimateGas({from: userAddress});
  console.log(gas);
  document.getElementById("verifySig").innerHTML = gas ? "Signature is valid" : "Signature is invalid";
} 

async function signedReimburse() {
  refresh();
  var sig = document.getElementById("icsig").innerHTML;
  let tx = await contract.methods.reimburseWithSignature(_reimbursement, sig).send({from: userAddress}).then((err, transactionHash) => {
    let subscription = web3.eth.subscribe('reimbursements', {
      address: userAddress,
    }, (err, res) => {
      console.log(res);
      document.getElementById("eventData").appendChild(
        prettyPrint(res, {
          maxDepth: 15,
        })
      );
    });
    document.getElementById("txSig").innerHTML = transactionHash;
  });
}

function addPlaceholder() {
  var a = document.getElementsByClassName("labels");
  var b = document.getElementsByClassName("inputs");
  var c = document.getElementsByClassName("spans"); 
  for (let i = 0; i < a.length; i++) {
    // console.log(i + ") " + a[i].innerHTML);
    b[i].placeholder = a[i].innerHTML;
    // b[i].value = fillData[i];
  }
  inputs = b;
  spans = c;
}

/*
title:
{
      healthProfessional: {
        remedies: [
          medicine, 
        ]
      },
      patient: {
        symptoms: [
          knee pain,
        ],
        signature: ""
      }
    }
    
    data:
      {
        healthProfessional: {
          remedies: [
            [1,2,3,4], []
          ]
        }
      }
      
      feeInfo:
      {
          lastEntity: {
            sth: why fee,
          },
          entity1: {
            name: ,
            address: ,
            date: ,
            fee: ,
            feeInfo: {
              sth: why fee
            },
            signature: 
          }
        }
        
*/

function convertToJson(p) {
  var obj;

  var a = inputs[16].value;
  var b = inputs[17].value;
  var c = inputs[18].value;
  var d = inputs[19].value;
  var e = inputs[20].value;
  var f = inputs[21].value;
  var g = inputs[22].value;

  if (p == 1) {
    obj = {
      healthProfessional: {
        remedies: a.split(","),
      },
      patient: {
        symptoms: b.split(","),
        signature: c,
      }
    }
  } else if (p == 2) {
    obj = {
      healthProfessional: {
        remedies: d.split(","),
      }
    }
  } else {
    obj = {
      lastEntity: {
        receipt: e.split(","),
      },
      previousEntity: f.split(","),
      olderData: g,
    }
  }
  document.getElementById("json"+p).innerHTML = JSON.stringify(obj);
}

function encodeMessage() {
  var a = prompt("Num", 1);
  var c = a.split(",");
  var b = [];
  for (let i = 0; i < c.length; i++) {
    b.push(inputs[c[i]].value);
  }
  console.log(b);
  var d = encryption(b);
  for (let j = 0; j < d.length; j++) {
    inputs[c[j]].value = d[j];
  }
}

function decodeMessage() {
  var a = prompt("Num", 1);
  //   if (a == 0) {
  //     initSK(inputs[15].value);
  //     var tx = document.getElementById("decodeTxt");
  //     var newTx = decrypt(tx.value);
  //     tx.value = newTx;
  // }
  if (a == -1) {
    initSK(inputs[15].value);
    var tx = document.getElementById("decodeTxt");
    var newTx = decrypt(tx.value);
    tx.value = JSON.stringify(newTx);
    return;
    // console.log("worked");
    // decodeEvent();
    // return;
  }
  var c = a.split(",");
  var b = [];
  for (let i = 0; i < c.length; i++) {
    b.push(inputs[c[i]].value);
  }
  console.log(b);
  var d = decryption(b);
  for (let j = 0; j < d.length; j++) {
    inputs[c[j]].value = d[j];
  }
}

function decodeEvent(encodedTxt) {
  if (inputs[15].value !== "") {
    initSK(inputs[15].value)
    var newTxt = decrypt(encodedTxt);
    return newTxt;
  }
  return encodedTxt;
}

function generateSK() {
  var secretKey = makeid(64);
  window.simpleCrypto = new SimpleCrypto(secretKey);
  console.log(secretKey);
  document.getElementById("SK").value = secretKey;
  document.getElementById("newSK").value = secretKey;
}

function encryption(arr) {
  if (!inputs[15].value) {
    alert("Please fill the symmetric key field.");
    return;
  }
  initSK(inputs[15].value);
  // encrypt texts before signing
  var encryptedArr = [];
  for (let i = 0; i < arr.length; i++) {
    encryptedArr.push(encrypt(arr[i]));
  }
  console.log(encryptedArr);
  return encryptedArr;
}

function decryption(arr) {
  if (!inputs[15].value) {
    alert("Please fill the symmetric key field.");
    return;
  }
  initSK(inputs[15].value);
  var decryptedArr = [];
  for (let i = 0; i < arr.length; i++) {
    decryptedArr.push(decrypt(arr[i]));
  }
  console.log(decryptedArr);
  return decryptedArr;
}

function initSK(secretKey) {
  window.simpleCrypto = new SimpleCrypto(secretKey);
}

function encrypt(prop) {
  var cipherText = simpleCrypto.encrypt(prop);
  return cipherText;
}

function decrypt(prop) {
  var cipherText = simpleCrypto.decrypt(prop);
  return cipherText;
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?!@#$%&";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// AES-CBC

function getEvents(blockNumber) {
  if (!blockNumber) {
    blockNumber = prompt("Block number?", 
    "52224682");
    // "52226948");
  }
  contract.events
    .Reimbursements(
      {
        filter: { myIndexedParam: [userAddress] }, // Using an array means OR: e.g. 20 or 23
        fromBlock: blockNumber,
      },
      function (error, event) {
        // console.log("event: ");
      }
    )
    .on("data", function (event) {
      // console.log(event); // same results as the optional callback above
      // document.getElementById("eventData").textContent = JSON.stringify(event.returnValues, undefined, 4);
      var a = event.returnValues;
      console.log(a);
      // var arr = a.splice(0, 4);
      // console.log(arr);
      for (let i = 0; i < 5; i++) {
        delete a[i];
      }
      document.getElementById("eventData").appendChild(
        prettyPrint(a, {
          // maxArray: 20, // Set max for array display (default: infinity)
          // expanded: false, // Expanded view (boolean) (default: true),
          maxDepth: 15, // Max member depth (when displaying objects) (default: 3)
        })
      );
    })
    .on("changed", function (event) {
      // remove event from local database
    })
    .on("error", console.error);
  // eventData
}

// function decodeEvent() {
//   var a = document.getElementsByTagName("td");
//   for (let i = 0; i < a.length; i++) {
//     //
//   }
// }

function storeData() {
  var arr = [];
  for (let i = 0; i < inputs.length; i++) {
    arr.push(inputs[i].value);
  }
  var sigs = [];
  for (let i = 0; i < spans.length; i++) {
    sigs.push(spans[i].innerHTML);
  }
  window.localStorage.setItem("storedData", JSON.stringify(arr));
  window.localStorage.setItem("storedSigs", JSON.stringify(sigs));
  console.log("stored");
}

function retreiveData() {
  var arr = JSON.parse(window.localStorage.getItem("storedData"));
  for (let i = 0; i < arr.length; i++) {
    inputs[i].value = arr[i];
  }
  var sigs = JSON.parse(window.localStorage.getItem("storedSigs"));
  for (let i = 0; i < sigs.length; i++) {
    spans[i].innerHTML = sigs[i];
  }
  signatures = JSON.parse(window.localStorage.getItem("sigs")) || [];
  addresses = JSON.parse(window.localStorage.getItem("adds")) || [];
  inputs[12].value = JSON.stringify(signatures);
  inputs[13].value = JSON.stringify(addresses);
  console.log("retreived");
}

async function transferFunds() {
  let tx = await web3.eth.sendTransaction({from: userAddress, to: address, value: 100000000}).then(res => {
    console.log(res);
  });
  // 100'000'000 sends
  // 1'000'000 wei for price
  // 100 transactions
} 

function printJSON(res) {
  document.getElementById("eventData").appendChild(
    prettyPrint(res, {
      maxDepth: 15,
    })
  );
}