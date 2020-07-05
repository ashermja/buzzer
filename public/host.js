import { hostActions } from './sharedActions.js';
import { hostScreens } from './enums.js';
const socket = io();

const initialContainer = document.querySelector('.initial.body-container');
const joinContainer = document.querySelector('.join.body-container');
const mainContainer = document.querySelector('.main.body-container');
const containers = document.querySelectorAll('.body-container');


const activeText = document.querySelector('.js-active');
const joinedPlayerStatusText = document.querySelector('.js-join-players-status');
const currentQuestionText = document.querySelector('.js-currentQuestion');
const currentStateText = document.querySelector('.js-currentState');
const resultList = document.querySelector('.js-results');
const category = document.querySelector('#category');
const numberOfQs = document.querySelector('#noQuestions');
const clear = document.querySelector('.js-clear');
const reset = document.querySelectorAll('.js-reset');
// const previous = document.querySelector('.js-previous');
const next = document.querySelector('.js-next');
const hostGame = document.querySelector('.js-hostGame');
const startGame = document.querySelector('.js-startGame');

const showContainer = (container) => {
  containers.forEach((container) => {
    container.classList.add('hidden');
  });
  container.classList.remove('hidden');
};

socket.on(hostActions.updateHostView, (viewState) => {
  const { currentState, currentQuestion, players, results, screen } = viewState;
  switch (screen) {
    case hostScreens.initial:
      showContainer(initialContainer);
      break;
      case hostScreens.join:
        showContainer(joinContainer);
        joinedPlayerStatusText.innerText = players.length === 0 ? 'Waiting for players...' 
          : `${players.length} Joined`;
        joinedPlayerStatusText.setAttribute('data-players', players.length);
        break;
    case hostScreens.main:
      showContainer(mainContainer);
      activeText.innerText = `${players.length} joined`;
      currentStateText.innerText = `Current step: ${currentState.current}`;
      currentQuestionText.innerText = currentQuestion;
      next.firstChild.innerText = `Show ${currentState.next}`;
      resultList.innerHTML = results
        .map(result => `<li>${result.player.name} - correct: ${result.correct} - time: ${result.time}</li>`)
        .join('');
        break;
  }
});

clear.addEventListener('click', () => {
  socket.emit(hostActions.clear);
})


reset.forEach((button) => {
  button.addEventListener('click', (e) => {
    if (confirm('Are you sure you want to reset the game?')) {
      socket.emit(hostActions.reset);
    currentQuestionText.innerText = '';
    }
  });
});


hostGame.addEventListener('click', () => {
  socket.emit(hostActions.nextState, { category: category.value, numberOfQs: parseInt(numberOfQs.value)  });
});

next.addEventListener('click', () => {
  socket.emit(hostActions.nextState);
});

startGame.addEventListener('click', () => {
  const currentPlayerCount = parseInt(joinedPlayerStatusText.getAttribute('data-players'));
  if (currentPlayerCount === 0) {
    alert('Please wait for players to join');
  } else {
    if (confirm(`Has everybody join? Currently there ${currentPlayerCount === 1 ? 'is' : 'are'} ${currentPlayerCount} player${currentPlayerCount === 1 ? '' : 's'}`)) {
      socket.emit(hostActions.nextState);
    }
  }
})


