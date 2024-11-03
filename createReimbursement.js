async function createReimbursement() {
    var patient = document.getElementById("ic0").value;
    var doctor = document.getElementById("ic1").value;
    var title = document.getElementById("ic3").value;
    var data = document.getElementById("ic4").value;
    var date = document.getElementById("ic5").value;
    var hospital = document.getElementById("ic2").value;
    var fee = document.getElementById("ic6").value;
    var feeInfo = document.getElementById("ic7").value;
    var percentage = document.getElementById("ic8").value;
    var executed = document.getElementById("ic9").value;

    var claim = [
        hospital,
        fee,
        feeInfo,
        [
            patient,
            doctor,
            title,
            data,
            date
        ]
    ];
    console.log(claim);

    icReimburse(claim, percentage, executed);
  }
  
async function icReimburse(claim, percentage, executed) {
    var reimbursement = [claim, percentage, executed];

    contract.methods.reimburse(
        reimbursement, drSig, patientSig, hospitalSig
    ).estimateGas({
        from: userAddress
    }).then((res) => {
        if (res) {
            console.log("Gas: " + res);
            icReimburses(claim, percentage, executed);
        }
    });
}
  
async function icReimburses(claim, percentage, executed) {
    var reimbursement = [claim, percentage, executed];

    contract.methods.reimburse(
        reimbursement, drSig, patientSig, hospitalSig
    ).send({
        from: userAddress
    }).then((res) => {
        if (res) {
            console.log("Transaction: " + res);
            document.getElementById("icsig").innerHTML = "Your tx: " + res;
        }
    });
}