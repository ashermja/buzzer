import { hostActions } from './sharedActions.js';
import { screens } from './enums.js';
const socket = io();
const initialContainer = document.querySelector('.initial.container');
const joinContainer = document.querySelector('.join.container');
const startContainer = document.querySelector('.start.container');
const questionContainer = document.querySelector('.question.container');

const answerContainer = document.querySelector('.answer.container');
const answerQuestion = document.querySelector('p.questionAnswer');

const resultsContainer = document.querySelector('.results.container');
const scoreboardContainer = document.querySelector('.scoreboard.container');
const endContainer = document.querySelector('.end.container');
const containers = document.querySelectorAll('.container');

const question = document.querySelector('p.question');
const optionsContainer = document.querySelector('.options');
const optionsP = document.querySelectorAll('.option');


const joinList = document.querySelector('.js-join-container');
// const questionAnswer = document.querySelector('p.questionAnswer');
const answersDiv = document.querySelectorAll('.js-answer');

const resultList = document.querySelector('div.js-results');

const scoresList = document.querySelector('div.js-scoreboard');

// audio
const audio = {
  start: document.getElementById("start"),
  fffQuestion: document.getElementById("fffQuestion"),
  fffStart: document.getElementById("fffStart"),
  fffAnswer1: document.getElementById("fffAnswer1"),
  fffAnswer2: document.getElementById("fffAnswer2"),
  fffAnswer3: document.getElementById("fffAnswer3"),
  fffAnswer4: document.getElementById("fffAnswer4"),
  results: document.getElementById("results"),
  mainTheme: document.getElementById("mainTheme"),
  backgroundFff: document.getElementById("backgroundFff"),
  scoreboard: document.getElementById("scoreboard"),
};


const showContainer = (container) => {
  containers.forEach((container) => {
    container.classList.add('hidden');
  });
  optionsContainer.classList.add('hidden');
  container.classList.remove('hidden');
};

const showButtonOptions = (options, show) => {
  optionsP.forEach((option, i) => {
    if (show) {
      option.innerText = options[i];
    } else {
      option.innerText = '';
    }
  });
  if (show) {
    optionsContainer.classList.remove('hidden');
  } else {
    optionsContainer.classList.add('hidden');
  }
  
}

const updateJoinView = (newPlayerCount, players) => {
  joinList.setAttribute('data-players', newPlayerCount);
  joinList.innerHTML = players.map((player, index) => 
    (`<div class="player-join">
        <span class="player-index">${index+1}</span>
        <span class="player-name">${player.name}</span>
      </div>`))
    .join('');
}

socket.on(hostActions.resetGame, () => {
  joinList.setAttribute('data-players', 0);
});

socket.on(hostActions.updateAudienceView, (viewState) => {
  const { screen, currentQuestion, options, showOptions, answers, results, scores, players } = viewState;
  switch (screen) {
    case screens.initial:
      showContainer(initialContainer);
      break;
    case screens.join:
      const currentPlayerCount = parseInt(joinList.getAttribute('data-players'));
      const newPlayerCount = players.filter((player) => player.name !== 'JOIN').length;
      if (currentPlayerCount < newPlayerCount) {
        audio.fffAnswer1.currentTime = 0;
        audio.fffAnswer1.play();
        updateJoinView(newPlayerCount, players);
      } else {
        if (currentPlayerCount === 0) {
          updateJoinView(0, players);
        }
        audio.scoreboard.currentTime = 0;
        audio.mainTheme.play();
        audio.mainTheme.volume = 0.6;
        showContainer(joinContainer);
      }
      break;
    case screens.start:
      audio.mainTheme.pause();
      audio.mainTheme.currentTime = 0;
      audio.start.play();
      showContainer(startContainer);
      break;
    case screens.question:
      showContainer(questionContainer);
      question.innerText = currentQuestion;
      if (showOptions) {
        audio.fffQuestion.pause();
        audio.fffQuestion.currentTime = 0;
        audio.fffStart.play();
        showButtonOptions(options, true);
      } else {
        audio.start.pause();
        audio.start.currentTime = 0;
        audio.fffQuestion.play();
        showButtonOptions(options, false);
      }
      break;
    case screens.answer:
      showContainer(answerContainer);
      answerQuestion.innerText = currentQuestion;
      answersDiv.forEach((answer, i) => {
        if (answers.length <= i ) {
          answer.firstChild.firstChild.innerText = '';
          answer.firstChild.classList.remove('answer-visible');
          answer.classList.add('hiddenWithSpace');
          
        } else {
          answer.firstChild.firstChild.innerText = answers[i];
          answer.firstChild.classList.add('answer-visible');
          answer.classList.remove('hiddenWithSpace');
          
        }
      });
      if (answers.length <= 1) {
        audio.fffStart.pause();
        audio.fffStart.currentTime = 0;
        audio.backgroundFff.play();
      } else {
        audio[`fffAnswer${answers.length-1}`].pause();
        // audio[`fffAnswer${answers.length-1}`].currentTime = 0;
        audio[`fffAnswer${answers.length}`].currentTime = 0;
      }
      audio[`fffAnswer${answers.length}`].play();
      break;
    case screens.results:
      audio[`fffAnswer${answers.length}`].pause();
      audio[`fffAnswer${answers.length}`].currentTime = 0;
      audio.backgroundFff.pause();
      audio.backgroundFff.currentTime = 0;
      audio.results.currentTime = 0;
      audio.results.play();
        
      showContainer(resultsContainer);
      resultList.innerHTML = results.map(result => 
        (`<div class="centre-line result-container">
            <div class="option-box border ${result.correct ? 'option-correct' : ''}">
              <p class="option">${result.player.name} - time: ${result.time}</p>
            </div>
          </div>`))
        .join('');
      break;
    case screens.scoreboard:
      audio.scoreboard.currentTime = 0;
      audio.scoreboard.play();
      showContainer(scoreboardContainer);
      scoresList.innerHTML = scores.map(score =>
        (`<div class="centre-line result-container">
            <div class="option-box border">
              <p class="option">${score.name} - score: ${score.score}</p>
            </div>
          </div>`))
      .join([])
      break;
    case screens.end:
      audio.scoreboard.pause();
      audio.scoreboard.currentTime = 0;
      audio.mainTheme.play();
      showContainer(endContainer);
      break;
  }
});
