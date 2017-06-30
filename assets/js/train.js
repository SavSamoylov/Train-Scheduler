$(document).ready(function(){

 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDnElrjRXJ8U6S0AbCjKn74bFJTV293nyI",
    authDomain: "firstproject-47bee.firebaseapp.com",
    databaseURL: "https://firstproject-47bee.firebaseio.com",
    projectId: "firstproject-47bee",
    storageBucket: "firstproject-47bee.appspot.com",
    messagingSenderId: "606160814972"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = "";
  var trainDestination = "";
  var firstTrainTime = "";
  var trainFreq = "";
  var nextTrain ="";
  var minAway = "";

  $("#addTrain").on("click", function(){
  	trainName = $("#name").val().trim();
  	trainDestination = $("#destination").val().trim();
  	firstTrainTime = $("#fTrainTime").val().trim();
  	trainFreq = $("#frequency").val().trim();

  	 // Code for handling the push
     database.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        firstTrainTime: firstTrainTime,
        trainFreq: trainFreq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

    $("#name").val("");
  	$("#destination").val("");
  	$("#fTrainTime").val("");
  	$("#frequency").val("");


  })

    database.ref().on("child_added", function(snapshot){

    var db = snapshot.val();

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainTimeConverted = moment(db.firstTrainTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % db.trainFreq;

    // Minute Until Train
    var minAway = db.trainFreq - tRemainder;

    // Next Train
    var nextTrain = moment().add(minAway, "minutes");


      var monthsWorked = moment().diff(moment(db.start), "months");

      $("#table").prepend(`
	      <tr>
	        <td class="tName">${[db.trainName]}</td>
	        <td class="tDestination">${[db.trainDestination]}</td>
	        <td class="tFreq">${[db.trainFreq]}</td>
	        <td class="tNext">${[moment(nextTrain).format("LT")]}</td>
	        <td class="tMinAway">${[minAway]}</td>

	      </tr>
      	`)

    })

})