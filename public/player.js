import { playerActions, hostActions } from './sharedActions.js';
const socket = io()
const body = document.querySelector('.js-body');
const form = document.querySelector('.js-join');
const joined = document.querySelector('.js-joined');
const buttons = document.querySelectorAll('.js-button');
const joinedInfo = document.querySelector('.js-joined-info');
const question = document.querySelector('.js-joined-question');

let user = {}

const getUserInfo = () => {
  user = JSON.parse(localStorage.getItem('user')) || {}
  if (user.name) {
    form.querySelector('[name=name]').value = user.name;
    // form.querySelector('[name=team]').value = user.team
  }
}
const saveUserInfo = () => {
  localStorage.setItem('user', JSON.stringify(user));
}

const clearUser = () => {
  localStorage.removeItem('user');
}

const clearAnswer = () => {
  answerArray = [];
}

let answerArray = [];

const resetButtons = () => {
  buttons.forEach((button, i) => {
    button.disabled = true;
    button.firstChild.innerText = (i+10).toString(36).toUpperCase();
  });
}

const showButtonOptions = (options, disabled) => {
  // Start timer
  buttons.forEach((button, i) => {
    button.disabled = disabled;
    button.firstChild.innerText = options[i].text;
    button.setAttribute('data-key', options[i].key);
  });
}


socket.on(hostActions.clearUsersAnswers, (answers) => {
  console.log('user cleared', answers);
  clearAnswer();
});

socket.on(hostActions.resetGame, () => {
  console.log('game reset');
  clearUser();
  resetButtons();
  user = {};
  answerArray = [];
  form.querySelector('[name=name]').value = '';
  question.innerText = '';
  joinedInfo.innerText = '';
  form.classList.remove('hidden');
  joined.classList.add('hidden');
  body.classList.remove('buzzer-mode');
  alert('Game reset');
});

const emitAnswer = (button) => {
  const option = button.getAttribute('data-key');
  const noOfAnswers = parseInt(question.getAttribute('data-noOfAnswers'));
  if (!answerArray.includes(option)){
    button.disabled = true;
    answerArray.push(option);
    console.log(option, answerArray);
    if (answerArray.length === noOfAnswers) {
      buttons.forEach((b) => {
        b.disabled = true;
        b.firstChild.innerText = '-';
      });      
      // Stop timer
      console.log('buzz');
      socket.emit(playerActions.buzz, { user, answerArray});
      clearAnswer();
    }
  }
}

const hasAnswered = (answered) => {
  return !!answered.find(u => user.id)
}

buttons.forEach((button) => {
  button.addEventListener('click', (e) => {
    emitAnswer(button);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  user.name = form.querySelector('[name=name]').value;
  // user.team = form.querySelector('[name=team]').value;
  user.team = Math.round(Math.random() * 10000); // added random team number so temp fix
  if (!user.id) {
    user.id = Math.floor(Math.random() * new Date());
  }
  socket.emit(playerActions.join, user);
  saveUserInfo();
  joinedInfo.innerText = `Player: ${user.name}`; // on Team ${user.team}`; // removed team for now
  form.classList.add('hidden');
  joined.classList.remove('hidden');
  body.classList.add('buzzer-mode');
})


socket.on(hostActions.updatePlayerView, (viewState) => {
  const { questionText, showOptions, options, answered, noOfAnswers } = viewState;
  question.setAttribute('data-noOfAnswers', noOfAnswers);
  question.innerText = questionText;
  if (showOptions && !hasAnswered(answered)) {
    showButtonOptions(options, false);
  } else if (showOptions && hasAnswered) {
    showButtonOptions(options, true);
  } else {
    resetButtons();
  }
});

getUserInfo();
