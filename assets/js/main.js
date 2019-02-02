
//=============================
// INITIALIZE VARIABLES
var trainNameInput;
var destinationInput;
var firstTrainInput;
var frequencyInput;
//=============================


//=============================
// CREATE REFERENCE TO THE DB
var database = firebase.database();
//=============================


//=============================
// DATABASE/DOM LINK
database.ref().on("child_added", function(snapshot) {
    // console.log(snapshot);
    // grab values for the DB entry
    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    firstTrain = snapshot.val().firstTrain;
    frequency = snapshot.val().frequency;
    // do some conversions
    var convertedFirstTrain = moment(firstTrain, "HH:mm"); // Convert captured time to moment format
    console.log(convertedFirstTrain);
    // figure out minutes to first arrival
    // var nextArrival = moment().diff(convertedFirstTrain, "m");
    if (convertedFirstTrain.diff(moment(),"m") > 0) {
        var minutesAway = convertedFirstTrain.diff(moment(),"m");
        var nextArrival = firstTrain;
    } else {
        // figure out how many minutes away the train is
        var timeSinceFirstTrain = moment().diff(convertedFirstTrain, "m"); // minutes between first train and now
        var remainder = timeSinceFirstTrain % frequency; // how many minutes it has been since the last train
        var minutesAway = frequency - remainder; // {time between trains} minus {# minutes since last train} = {time to next train}
        console.log(trainName + " minutesAway: " + minutesAway);
        // when is the next arrival?
        var nextArrival = moment().add(minutesAway,"minutes"); // add the minutesAway minutes to the current time
        nextArrival = moment(nextArrival).format("HH:mm"); // reformat the nextArrival value to HH:mm format
    }
    // build out the new row
    var newRow = "<tr>";
    newRow = newRow + "<td>" + trainName + "</td>";
    newRow = newRow + "<td>" + destination + "</td>";
    newRow = newRow + "<td>" + firstTrain + "</td>";
    newRow = newRow + "<td>" + frequency + "</td>";
    newRow = newRow + "<td>" + nextArrival + "</td>";
    newRow = newRow + "<td>" + minutesAway + " Minutes</td>";
    newRow = newRow + "</tr>";
    console.log(newRow);
    $("#trainTable").append(newRow);
})
//=============================


//=============================
// CAPTURE THE CLICK
$("#addTrainBtn").on("click", function(event) { 
    console.log("click captured");
    event.preventDefault(); // prevent form from trying to submit/refresh the page    
    // Capture User Inputs and store them into variables
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = $("#firstTrainInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();
    // Console log each of the user inputs to confirm we are receiving them
    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);
    // Push to DB
    database.ref().push({
        'trainName': trainName,
        'destination': destination,
        'firstTrain': firstTrain,
        'frequency': frequency
    });
});
//=============================