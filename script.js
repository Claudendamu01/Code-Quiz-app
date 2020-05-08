var start = $("#start-div");
var highScoreBtn = $("<button>");
var questionTitle = $("#questionDiv");
var secondsLeft = 0;
var timer = $("#timer");
var qNumber = 0;
var message = $("<h2>");
var highScoreList = [""];
var highScoreIndex = 0;
var endScreen = $("<div>");
var highScoreBoard = $("<ol>");
var input = $("<form>");
$("document").ready(function () {
console.log(highScoreList)
pullHighScore();
console.log(highScoreList);
});
$("#highScore").on("click",function(){
    displayHighScore();
    showDiv(highScoreBoard);  

    
})
function runQuiz(qNumber) {
    //find question title, choices, and answer
    var selection = $("<ol>");
    showDiv(questionTitle);
    //write and append question
    questionTitle.text(questions[qNumber].title);
    questionTitle.append(selection);
    //create buttons and append for choices
    questions[qNumber].choices.forEach(function (choice) {
        var choiceList = $("<li>")
        var choiceBtn = $("<button>");
        choiceBtn.text(choice)
        choiceBtn.attr("class", "btn btn-primary")
        selection.append(choiceList);
        choiceList.append(choiceBtn);
        
    });
    //check answer to scrip if wrong lose time, if right gain score and move on.
    selection.append(message);
    
    $("button").on("click", function (event) {
        if (event.target.textContent === questions[qNumber].answer) {
            message.text("Correct!");
            qNumber++;
            if(qNumber > 9)
            {
                var score = secondsLeft;
                endQuiz();
                showDiv(endScreen);
                clearInterval(timeLimit);
                
                
            }
            else{
                runQuiz(qNumber);
            }
        }
        else {
            message.text("Wrong!");
            secondsLeft -= 15;
            
        }
    })

}
function timeLeft(time){
        secondsLeft = time;
        timeLimit = setInterval(function(){
        secondsLeft--;
        timer.text("Time: " + secondsLeft);
        if(secondsLeft <= 0)
        {
            endQuiz();
            clearInterval(timeLimit);
        }
    }, 1000);
}

start.on("click",startQuiz);

function startQuiz(){
    hideDiv(start);
    hideDiv(endScreen);
    hideDiv(input);
    hideDiv(highScoreBoard);
    showDiv(questionTitle);
    timeLeft(150);
    runQuiz(0);

}
function endQuiz(){
    hideDiv(questionTitle);
    endScreen.attr("class", "col-md text-center")
    $("#display-div").append(endScreen);
    showDiv(endScreen);
    message.text("Quiz Over!");
    endScreen.append(message);
    var score = $("<div>");
    finalScore = secondsLeft;
    if(finalScore < 0){
        finalScore = 0;
    }
    score.text("Your score is " + finalScore + "!")
    message.append(score);
    clearInterval();
    highScoreBtn.text("Save High Score")
    highScoreBtn.attr("class", "btn btn-primary")
    endScreen.append(highScoreBtn);
    endScreen.append(start);
    showDiv(start);
    
}
highScoreBtn.on("click", function(){
    if(event.target.textContent === "Save High Score"){
    hideDiv(endScreen);
    hideDiv(highScoreBoard);
    showDiv(input);
    enterName();
    }
})
function enterName(){
    var name = $("<input>");
    var nameAsk = $("<h5>");
    nameAsk.text("Enter your name");
    input.attr("class", "col-md text-center")
    name.attr("type", "text");
    name.attr("id", "name");
    $("#display-div").append(input);
    input.append(name);
    input.prepend(nameAsk);
    input.append(start);
    showDiv(start);
    input.on("submit", function(event) {
        event.preventDefault(); 
        var scoreName = name.val();
        highScoreList.push(  {
            name: scoreName,
            score: finalScore,
        }
        )
        storeHighScore();
        message.text("Score Saved!")
        input.append(message);
    })
    
}
function hideDiv(element){
    element.attr("style", "display: none");
}
function showDiv(element){
    element.attr("style", "display: block");
}
function storeHighScore(){
    var strHigh = JSON.stringify(highScoreList);
    localStorage.setItem("highscores", strHigh);
}
function pullHighScore(){
    var strHigh = localStorage.getItem("highscores");
    highScoreList = JSON.parse(strHigh);
    if(highScoreList == null){
        highScoreList = [""]
    }
    else{
    console.log(highScoreList)
    return highScoreList;
    }
}
function displayHighScore(){
    hideDiv(endScreen);
    hideDiv(input);
    $("#display-div").append(highScoreBoard);
    highScoreBoard.text("");
    highScoreList.forEach(function(){
        var place = $("<li>");
        place.text("Name: " + highScoreList[highScoreIndex].name +" Score: " + highScoreList[highScoreIndex].score);
        highScoreBoard.append(place);
        highScoreIndex++;
        
    });
    highScoreIndex = 0;
    highScoreBoard.append(start);
    showDiv(start);
    
}