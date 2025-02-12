let categories = [];
let player1Score = 0;
let player2Score = 0;
let removeCategory = "";
let player1;
let player2;
const startTheGame = () => {
  player1 = document.getElementById("playerOne").value || 'Player1';
  player2 = document.getElementById("playerTwo").value || 'Player2';

  console.log(player1, player2);
  document.getElementById("playerNames").style.display = "none";

  fetchCategories();
};

const fetchCategories = async () => {
  try {
    const response = await fetch("https://the-trivia-api.com/v2/categories");
    const data = await response.json();
    console.log(data);

    for (const key in data) {
        categories.push(key);
    }

    console.log(categories);

  } catch (error) {
    alert("Failed to fetch categories. Please try again later.");
    throw new Error("Failed to fetch categories: " + error.message);
  }
  loadingCategories();
  document.getElementById("categoryContainer").style.display = "block";
};

const loadingCategories = () => {
  const categorySelect = document.getElementById("categorySelection");
  categorySelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a category";
  categorySelect.appendChild(defaultOption);

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  }
};

// After clicking on "Display Questions" button.

//Explicitly given because iterating through and putting limit with api call as gives 2 easy 2 medium and 2 hard

const difficultyLevels = ["easy", "medium", "hard"];
let totalQuestions = [];

const fetchQuestions = async function() {
  const selectedCategory = document.getElementById("categorySelection").value;
  removeCategory = selectedCategory;
  if (!selectedCategory) {
    alert("Please select a category");
    return;
  }
  document.getElementById("categoryContainer").style.display = "none";
  totalQuestions = [];
  try {
    for (const difficulty of difficultyLevels) {
      const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&limit=2&difficulties=${difficulty}`);
      const data = await response.json();
      totalQuestions = totalQuestions.concat(data);
    }
  } catch (error) {
    console.error("API Error", error);
  }
  console.log(totalQuestions);
  let questionIndex = 0;
  document.getElementById("questionsContainer").style.display = "block";
  displayNextQuestion(questionIndex);
};

const displayNextQuestion = function (questionIndex) {
  if (questionIndex >= totalQuestions.length) {
    console.log("All questions answered");

    const questionContainer = document.getElementById("questionsContainer");
    questionContainer.textContent = "";

    const button1 = document.createElement("button");
    button1.textContent = "End The Game";
    button1.addEventListener("click", displayScores);

    const button2 = document.createElement("button");
    button2.textContent = "Play Different Category";
    button2.addEventListener("click", function() {
      categories = categories.filter((category) => category !== removeCategory);

      if (categories.length === 0) {
        alert("No more categories left!");
        displayScores();
        return;
      }

      loadingCategories();
      document.getElementById("categoryContainer").style.display = "block";
      questionContainer.style.display = "none";
    });

    questionContainer.appendChild(button1);
    questionContainer.appendChild(button2);
    return;
  }

  const questionObj = totalQuestions[questionIndex];
  const questionContainer = document.getElementById("questionsContainer");

  questionContainer.innerHTML = "";
  const heading = document.createElement("h3");
  heading.textContent = questionIndex % 2 === 0 ? `${player1}'s Question` : `${player2}'s Question`;
  questionContainer.appendChild(heading);

  const questionDisplay = document.createElement("p");
  questionDisplay.textContent = questionObj.question.text;
  questionContainer.appendChild(questionDisplay);

  const options = questionObj.incorrectAnswers.concat(questionObj.correctAnswer);

  options.sort(() => Math.random() - 0.5);

  options.forEach((option) => {
    const label = document.createElement("label");
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "answer-value";
    radioInput.value = option;
    label.textContent = option;
    questionContainer.appendChild(radioInput);
    questionContainer.appendChild(label);
    questionContainer.appendChild(document.createElement("br"));
  });

  const submitAnswer = document.createElement("button");
  submitAnswer.textContent = "Submit";
  questionContainer.appendChild(submitAnswer);

  submitAnswer.addEventListener("click", () => {
    const attemptedAnswer = document.querySelector('input[name="answer-value"]:checked').value;
    if (attemptedAnswer === questionObj.correctAnswer)
    {
      console.log("Correct Answer");
      if (questionIndex === 0 || questionIndex === 1) {
        if (questionIndex % 2 === 0) {
          player1Score += 10;
        } else {
          player2Score += 10;
        }
      } else if (questionIndex === 2 || questionIndex === 3) {
        if (questionIndex % 2 === 0) {
          player1Score += 15;
        } else {
          player2Score += 15;
        }
      } else {
        if (questionIndex % 2 === 0) {
          player1Score += 20;
        } else {
          player2Score += 20;
        }
      }
    }
    questionIndex++;
    displayNextQuestion(questionIndex);
  });
};

const displayScores = function () {
  const questionContainer = document.getElementById("questionsContainer");

    questionContainer.textContent = '';
    const head3 = document.createElement('h3');
    head3.textContent = 'Final Scores';
    const head4 = document.createElement('h4');
    head4.textContent = player1+':'+player1Score;
    const head5 = document.createElement('h4');
    head5.textContent = player2+':'+player2Score;

    questionContainer.appendChild(head3);
    questionContainer.appendChild(head4);
    questionContainer.appendChild(head5);

  if (player1Score > player2Score) 
  {
    alert(`${player1} is winner.`);
  }
  else if (player1Score < player2Score)
  {
    alert(`${player2} is winner.`);
  }
  else
  {
    alert("It's a tie!");
  }

};