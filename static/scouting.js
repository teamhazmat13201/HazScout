var recordedData = {};



















// Function to increment value
function incrementValue(elementById) {
    var input = document.getElementById(elementById);
    var value = parseInt(input.value, 10);
    value = isNaN(value) ? 0 : value;
    input.value = value + 1;
}

// Function to decrement value (ensuring it doesn't go below 0)
function decrementValue(elementById) {
    var input = document.getElementById(elementById);
    var value = parseInt(input.value, 10);
    value = isNaN(value) ? 0 : value;
    input.value = value > 0 ? value - 1 : 0;
}

// Automatically add increment and decrement buttons to all number inputs except teamNum and matchNum
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('input[type="number"]').forEach(function (input) {
        if (input.id !== "teamNum" && input.id !== "matchNum" && input.id !== "join-room-input") {
            const parent = input.parentElement;
            const id = input.id;

            // Create decrement button
            const decrementBtn = document.createElement("button");
            decrementBtn.textContent = "-";
            decrementBtn.onclick = function () {
                decrementValue(id);
            };

            // Create increment button
            const incrementBtn = document.createElement("button");
            incrementBtn.textContent = "+";
            incrementBtn.onclick = function () {
                incrementValue(id);
            };

            // Wrap input with buttons
            parent.insertBefore(decrementBtn, input);
            parent.insertBefore(incrementBtn, input.nextSibling);
        }
    });
});

function addToJson() {
    // Gather data from inputs
    var teamNum = document.getElementById("teamNum").value;
    var matchNum = document.getElementById("matchNum").value;

    var highBucketAuto = parseInt(document.getElementById('samplesHighBucketAuto').value) || 0;
    var lowBucketAuto = parseInt(document.getElementById('samplesLowBucketAuto').value) || 0;
    var netZoneAuto = parseInt(document.getElementById('NetZoneAuto').value) || 0;
    var highRungAuto = parseInt(document.getElementById('HighRungAuto').value) || 0;
    var lowRungAuto = parseInt(document.getElementById('LowRungAuto').value) || 0;
    var park = parseInt(document.querySelector('input[name="park"]:checked')?.value) || 0;

    var highBucket = parseInt(document.getElementById('samplesHighBucket').value) || 0;
    var lowBucket = parseInt(document.getElementById('samplesLowBucket').value) || 0;
    var netZone = parseInt(document.getElementById('NetZone').value) || 0;
    var highRung = parseInt(document.getElementById('HighRung').value) || 0;
    var lowRung = parseInt(document.getElementById('LowRung').value) || 0;
 
    var climb = parseInt(document.querySelector('input[name="climb"]:checked')?.value) || 0;

    var final_score = 
        (highBucketAuto * 8 + lowBucketAuto * 4 + netZoneAuto * 2 + highRungAuto * 10 + lowRungAuto * 5 + park) * 2 +
        (highBucket * 8 + lowBucket * 4 + netZone * 2 + highRung * 10 + lowRung * 5 + climb);

    let samplesTotal = highBucketAuto + lowBucketAuto + highBucket + lowBucket;
    let rungTotal = highRungAuto + lowRungAuto + highRung + lowRung;

    let priority = "none";
    if (samplesTotal > rungTotal) {
        priority = "samples";
    } else if (rungTotal > samplesTotal) {
        priority = "specimen";
    }

    // Store in JSON structure
    if (!recordedData[teamNum]) {
        recordedData[teamNum] = {};
    }

    recordedData[teamNum][matchNum] = {
        final_score: final_score,
        priority: priority
    };

    // Don't forget to reset the data
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = radio.defaultChecked;
    });

    document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
        input.value = input.defaultValue;
    });
      

    // Exit the function and return data
    return recordedData;

}
