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
    // openModal();
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