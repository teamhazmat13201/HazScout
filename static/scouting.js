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
        if (input.id !== "teamNum" && input.id !== "matchNum") {
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



function calcScore(){
    highBucketAuto = document.getElementById('samplesHighBucketAuto').textContent;
    lowBucketAuto = document.getElementById('samplesLowBucketAuto').textContent;
    netZoneAuto = document.getElementById('NetZoneAuto').textContent;
    highRungAuto = document.getElementById('HighRungAuto').textContent;
    lowRungAuto = document.getElementById('LowRungAuto').textContent;
    
}