/* ===========================================
   GK QUIZ GENERATOR
   script.js
=========================================== */

// ===============================
// Quiz Variables
// ===============================

let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

let userAnswers = [];

let quizDetails = {

    name:"",
    class:"",
    genre:"",
    difficulty:""

};

let timer;
let timeLeft = 30;

// ===============================
// HTML Elements
// ===============================

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");


// ===============================
// Event Listeners
// ===============================

startBtn.addEventListener("click", startQuiz);

nextBtn.addEventListener("click", nextQuestion);

restartBtn.addEventListener("click", function () {

    location.reload();

});


// ===============================
// Start Quiz
// ===============================

function startQuiz() {

  const playerNameInput =
    document.getElementById("playerName").value.trim();

const selectedClass =
    document.getElementById("classSelect").value.replace("Class ", "");

const selectedGenre =
    document.getElementById("genreSelect").value;



 const numberOfQuestions =
        parseInt(document.getElementById("questionCount").value);




// Store Quiz Details

quizDetails.name = playerNameInput;

quizDetails.class = selectedClass;

quizDetails.genre = selectedGenre;




    // Player Name Check

   if (playerNameInput === "") {

    alert("Please enter your name.");

    return;

}


    // Filter Questions

    quizQuestions = questionBank.filter(question => {

    return (

        question.class === selectedClass &&

        (
            selectedGenre === "Mixed" ||
            question.genre === selectedGenre
        )

    );

});


    // No Questions

    if (quizQuestions.length === 0) {

        alert("No questions available for this selection.");

        return;

    }


    // Shuffle Questions

    quizQuestions.sort(() => Math.random() - 0.5);


    // Limit Questions

    quizQuestions =

        quizQuestions.slice(0, numberOfQuestions);


    // Reset Variables

    currentQuestion = 0;

    score = 0;

    selectedAnswer = null;

    userAnswers = [];


    // Change Screens

    startScreen.style.display = "none";

    quizScreen.style.display = "block";


    // Load First Question

    loadQuestion();

}
// ===============================
// Load Question
// ===============================

function loadQuestion() {

    selectedAnswer = null;

    // Reset Timer

    timeLeft = 30;

    document.getElementById("timer").textContent =
        "⏱ 30s";

    clearInterval(timer);

    timer = setInterval(function () {

        timeLeft--;

        document.getElementById("timer").textContent =
            "⏱ " + timeLeft + "s";

        if (timeLeft <= 0) {

            clearInterval(timer);

            nextQuestion(true);

        }

    }, 1000);


    const question = quizQuestions[currentQuestion];


    // Question Number

    document.getElementById("questionNumber").textContent =

        "Question " +
        (currentQuestion + 1) +
        " / " +
        quizQuestions.length;


    // Question Text

    document.getElementById("questionText").textContent =

        question.question;


    // Progress Bar

    document.getElementById("progressBar").style.width =

       (((currentQuestion) / quizQuestions.length) * 100) + "%"


    // Options

    const optionsDiv =

        document.getElementById("options");

    optionsDiv.innerHTML = "";


    question.options.forEach(function(option,index){

        const button = document.createElement("button");

        button.className = "option";

        button.textContent = option;

        button.onclick = function(){

            selectedAnswer = index;

            document
            .querySelectorAll(".option")
            .forEach(function(btn){

                btn.style.background = "#f5f5f5";
                btn.style.color = "#111";
                btn.style.border = "2px solid transparent";

            });

            button.style.background = "#90ee90";
            button.style.color = "#111";
            button.style.border = "2px solid green";

        };

        optionsDiv.appendChild(button);

    });

}



// ===============================
// Next Question
// ===============================

function nextQuestion(timeUp = false){

    clearInterval(timer);


    if(!timeUp && selectedAnswer === null){

    alert("Please select an answer.");

    return;

}


    // Save Detailed User Answer

const currentQuizQuestion = quizQuestions[currentQuestion];

let answerStatus;


if (selectedAnswer === null) {

    answerStatus = "unanswered";

}
else if (selectedAnswer === currentQuizQuestion.answer) {

    answerStatus = "correct";

}
else {

    answerStatus = "wrong";

}


userAnswers[currentQuestion] = {

    question: currentQuizQuestion.question,

    options: currentQuizQuestion.options,

    userAnswer: selectedAnswer,

    correctAnswer: currentQuizQuestion.answer,

    genre: currentQuizQuestion.genre,

    status: answerStatus

};


// Score

if (answerStatus === "correct") {

    score++;

}


    currentQuestion++;


    // Finished?

    if(currentQuestion >= quizQuestions.length){

        finishQuiz();

        return;

    }


    loadQuestion();

}
// ===============================
// Finish Quiz
// ===============================

function finishQuiz(){

    clearInterval(timer);


    quizScreen.style.display = "none";

    resultScreen.style.display = "block";


    let correctCount = 0;

    let wrongCount = 0;

    let unansweredCount = 0;


    userAnswers.forEach(answer => {

        if(answer.status === "correct"){

            correctCount++;

        }
        else if(answer.status === "wrong"){

            wrongCount++;

        }
        else{

            unansweredCount++;

        }

    });


    const percentage =

        ((correctCount / quizQuestions.length) * 100).toFixed(1);



    let grade;


    if(percentage >= 90){

        grade = "A+";

    }
    else if(percentage >= 80){

        grade = "A";

    }
    else if(percentage >= 70){

        grade = "B";

    }
    else if(percentage >= 60){

        grade = "C";

    }
    else if(percentage >= 50){

        grade = "D";

    }
    else{

        grade = "F";

    }



    let message;


    if(percentage >= 90){

        message = "🌟 Outstanding Performance!";

    }
    else if(percentage >= 75){

        message = "🎉 Great Job!";

    }
    else if(percentage >= 50){

        message = "👍 Good Effort!";

    }
    else{

        message = "📚 Keep Practicing!";

    }



    // Summary

    document.getElementById("quizSummary").innerHTML = `

        <p><strong>Player:</strong> ${quizDetails.name}</p>

        <p><strong>Class:</strong> ${quizDetails.class}</p>

        <p><strong>Genre:</strong> ${quizDetails.genre}</p>

        <p><strong>Difficulty:</strong> ${quizDetails.difficulty}</p>

        <hr>

        <p>❓ Total Questions: ${quizQuestions.length}</p>

        <p>✅ Correct: ${correctCount}</p>

        <p>❌ Wrong: ${wrongCount}</p>

        <p>⏱ Not Attempted: ${unansweredCount}</p>

        <p><strong>Percentage:</strong> ${percentage}%</p>

        <p><strong>Grade:</strong> ${grade}</p>

    `;



    document.getElementById("performanceMessage").innerHTML =
        message;



    generateCategoryPerformance();

    generateQuestionReview();


}

function generateCategoryPerformance(){

    const categoryBox =
        document.getElementById("categoryPerformance");


    let categories = {};


    userAnswers.forEach(answer => {

        const genre = answer.genre || "Mixed";


        if(!categories[genre]){

            categories[genre] = {

                total:0,

                correct:0

            };

        }


        categories[genre].total++;


        if(answer.status === "correct"){

            categories[genre].correct++;

        }


    });



    let html = "<h2>📚 Category Performance</h2>";


    for(let category in categories){


        html += `

        <div class="category-card">

            <span>${category}</span>

            <span>

            ${categories[category].correct}

            /

            ${categories[category].total}

            Correct

            </span>

        </div>

        `;


    }


    categoryBox.innerHTML = html;


}

function generateQuestionReview(){

    const reviewBox =
        document.getElementById("questionReview");


    let html = "";


    userAnswers.forEach((answer,index)=>{


        let statusText = "";

        let reviewClass = "";


        if(answer.status === "correct"){

            statusText = "✅ Correct";

            reviewClass = "review-correct";

        }
        else if(answer.status === "wrong"){

            statusText = "❌ Wrong";

            reviewClass = "review-wrong";

        }
        else{

            statusText = "⏱ Not Attempted";

            reviewClass = "review-unanswered";

        }



        let userAnswerText = "Not Answered";


        if(answer.userAnswer !== null){

            userAnswerText =
                answer.options[answer.userAnswer];

        }



        let correctAnswerText =
            answer.options[answer.correctAnswer];



        html += `

        <div class="review-card ${reviewClass}">


            <h3>
                Question ${index + 1}
            </h3>


            <p>
                <strong>
                ${answer.question}
                </strong>
            </p>


            <p>
                <strong>Your Answer:</strong>
                ${userAnswerText}
            </p>


            <p>
                <strong>Correct Answer:</strong>
                ${correctAnswerText}
            </p>


            <p>
                <strong>Status:</strong>
                ${statusText}
            </p>


        </div>

        `;


    });



    reviewBox.innerHTML = html;


}
