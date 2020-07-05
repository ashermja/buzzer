import { screens } from '../enums.js';
import _ from 'lodash';

const getEmptyPlayers = () => {
  return Array(10).fill({ name: 'JOIN'});
}

const initialViewState = {
  screen: screens.initial,
  currentQuestion: '',
  playerCount: 0,
  players: getEmptyPlayers(),
  showOptions: false,
  options: [],
  answers: [], 
  results: [],
  scores:[],
};

export const showContainer = (screen) => {
  viewState.screen = screen;
}

export const showInitial = () => {
  showContainer(screens.initial);
}

export const showJoin = () => {
  showContainer(screens.join);
}

export const showStart = () => {
  showContainer(screens.start);
}

export const showQuestion = (data, currentQuestion) => {
  viewState.currentQuestion = data.questions[currentQuestion].question;
  viewState.showOptions = false;
  showContainer(screens.question);
}

export const showOptions = (data, currentQuestion) => {
  viewState.showOptions = true;
  const options = data.questions[currentQuestion].options;
  viewState.options = options.map((option) => `${option.letter}: ${option.text}`);
}

export const showAnswerQuestion = () => {
  showContainer(screens.answer);
  viewState.answers = [];
}


export const showAnswer = (data, currentQuestion) => {
  if (viewState.answers.length < data.questions[currentQuestion].answers.length) {
    const answers = data.questions[currentQuestion].answers
      .map((answer) => answer.letter + ': ' + answer.text);
    viewState.answers.push(answers[viewState.answers.length]);
  }
}

export const showResults = (data, currentQuestion) => {
  const results = data.questions[currentQuestion].results
    .sort((a, b) => a.time - b.time);
  viewState.results.splice(0, viewState.results.length, ...results);
  showContainer(screens.results);
}

export const showScoreboard = (data) => {
  const scores = data.players.map((player) => ({ name: player.name, score: 0 }));
  data.questions.forEach(question => {
    question.results.filter((result) => result.correct === true)
    .sort((a, b) => a.time - b.time).forEach((result, i) => {
        let points = 1;
        if (i===0) {
          points = 2;
        }
        const playersIndex = scores.findIndex((score) => score.name === result.player.name);
        scores[playersIndex] =
          { name: scores[playersIndex].name, score: scores[playersIndex].score + points };
    });
  });
  showContainer(screens.scoreboard);
  viewState.scores = scores.sort((a, b) => b.score - a.score);
}

export const showEnd = () => {
  showContainer(screens.end);
}

export const resetGame = () => {
  setIntitalState();
}

export const setIntitalState = () => {
  viewState = JSON.parse(JSON.stringify(initialViewState));
}

export const getViewState = () => {
  return viewState;
};

export const setPlayers = (players) => {
  // Get first available empty player slot
  const availablePlayerSlot = viewState.players.findIndex((player) => player.name === 'JOIN');
  viewState.playerCount = players.length;
  viewState.players[availablePlayerSlot] = players[players.length - 1];
}

let viewState;
setIntitalState();

export default {
  showContainer,
  showInitial,
  showJoin,
  showStart,
  showQuestion,
  showOptions,
  showAnswerQuestion,
  showAnswer,
  showResults,
  showScoreboard,
  showEnd,
  setIntitalState,
  resetGame,
  getViewState,
  setPlayers,
};