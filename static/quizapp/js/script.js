let questions = [];

let currentIndex = 0; 
let score = 0;

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("finalScore");
const nextBtn = document.getElementById("nextBtn");

async function startQuiz() {
    //fetching the data from the backend
    const res = await fetch("http://127.0.0.1:8000/questions/");
    questions = await res.json();

  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  nextBtn.classList.add("hidden");
  const q = questions[currentIndex];
  questionEl.textContent = q.question;
  progressEl.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
  scoreEl.textContent = `Score: ${score}`;
  optionsEl.innerHTML = "";

  q.options.forEach((optObj) => {
    // instead of index and option, the id, text container optObj
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = optObj.option_text;
    div.dataset.id = optObj.id; //Without this, highlighting won’t work.
    div.onclick = () => selectAnswer(div, optObj.id);
    optionsEl.appendChild(div);
  });
}

async function selectAnswer(selectedDiv, optionId) {
    // remove this line
//   const correctIndex = questions[currentIndex].answer;
  const options = document.querySelectorAll(".option");

  options.forEach(o => o.style.pointerEvents = "none");

  // call backend API to verify answer

  const res = await fetch("submit/", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ option_id: optionId})
  })

  const result = await res.json()
  // instead of index === currectIndex, use result.currect from backend
  if (result.correct) {
    selectedDiv.classList.add("correct");
    score++;
  } else {
    selectedDiv.classList.add("wrong");
    // options[correctIndex].classList.add("correct");
    // instead of this line
    options.forEach(optDiv => {
        if (optDiv.dataset.id == result.correct_option_id) {
            optDiv.classList.add("correct");
        }
    })
  }

  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

async function showResult() {
    const res = await fetch("http://127.0.0.1:8000/finish/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            score: score,
            total: questions.length
        })
    })
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScoreEl.textContent = `${score} / ${questions.length}`;

  const data = await res.json()
  console.log(data.message)
}

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}
