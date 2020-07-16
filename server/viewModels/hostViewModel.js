import { states, hostScreens, categories } from '../enums.js';

const readableState = (state) => {
  return state.toLowerCase().replace('_', ' ');
}

const initialHostViewState = {
  screen: hostScreens.initial,
  currentState: { current: readableState(states.initial), next: readableState(states.start) },
  currentQuestion: '', 
  players: [], 
  results: [],
  categories: Object.values(categories)
};

export const setState = (current, next) => {
  hostViewState.currentState = { current: readableState(current), next: readableState(next) };
}

export const showContainer = (screen) => {
  hostViewState.screen = screen;
}

export const showJoin = () => {
  showContainer(hostScreens.join);
}

export const showInitial = () => {
  showContainer(hostScreens.initial);
}

export const showMain = () => {
  showContainer(hostScreens.main);
}

export const showQuestion = (data, currentQuestion) => {
  hostViewState.currentQuestion = data.questions[currentQuestion].question;
}

export const setResults = (results) => {
  hostViewState.results = results;
}

export const setPlayers = (players) => {
  hostViewState.players = players;
}


export const getViewState = () => {
  return hostViewState;
};

export const setIntitalState = () => {
  hostViewState = Object.assign({}, initialHostViewState);
}

export const resetGame = () => {
  setIntitalState();
}

let hostViewState;
setIntitalState();

export default {
  setState,
  showInitial,
  showMain,
  showJoin,
  showQuestion,
  setPlayers,
  setResults,
  getViewState,
  setIntitalState,
  resetGame,
};