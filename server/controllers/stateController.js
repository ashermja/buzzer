
import { hostActions } from '../sharedActions.js';
import hostViewModel from '../viewModels/hostViewModel.js';
import playerViewModel from '../viewModels/playerViewModel.js';
import audienceViewModel from '../viewModels/audienceViewModel.js';
import questionFacade from '../facade/questionFacade.js';
import { states } from '../enums.js';

const initialData = () => {
  return {
    players: [],
    questions: [
      {
        question: '',
        options: [],
        answers: [],
        results: [] // player: '', time: 0,correct: false, categories
      }
    ],
  }
}

let state = states.initial;
const statesArray = Object.values(states);

let timer;
let currentQuestion = 0;
let data = initialData();


const getData = async (numberOfQs, category) => {
  const questions = await questionFacade.getRandom(numberOfQs, category);
  setData(questions);
}


export const setData = (questions) => {
    const newQuestions = questions.map((question, i) => {
      return {...question, results: []}
    });
    if (data.questions.length === 1){
      data.questions.pop();
    }
    // add new questions to array
    data.questions.push(...newQuestions);
    // data = {...data, questions: questions.map((question, i) => {
    //   return {...question, results: []}
    // })}
}

export const setPlayers = (io, player) => {
  const exists = !!data.players.find(p => p.id === player.id);
  !exists && data.players.push(player);
  hostViewModel.setPlayers(data.players);
  io.emit(hostActions.updateHostView, hostViewModel.getViewState());

  if (exists) {
    io.emit(hostActions.updatePlayerView, playerViewModel.getViewState());
  } else {
    audienceViewModel.setPlayers(data.players);
    io.emit(hostActions.updateAudienceView, audienceViewModel.getViewState());
  }
}

export const addResult = (io, result) => {
  const userAnswers = result.answerArray;
  const correctAnswers = data.questions[currentQuestion].answers.map((answer) => answer.text);
  const correct = JSON.stringify(correctAnswers) == JSON.stringify(userAnswers);
  const time = Math.round((new Date - timer) / 10) / 100;
  const exists = data.questions[currentQuestion].results.findIndex((r) => r.player.id === result.user.id);
  const categories = data.questions[currentQuestion].categories;
  exists === -1 && data.questions[currentQuestion].results.push({ player: result.user, time, correct, categories });
  hostViewModel.setResults(data.questions[currentQuestion].results);
  playerViewModel.answered(result.user.id);
  io.emit(hostActions.updateHostView, hostViewModel.getViewState());
};

export const resetGame = (io) => {
  state = states.initial;
  currentQuestion = 0;
  data.players = [];
  data.questions = initialData().questions;
  state = emitState(state, io);
  
  io.emit(hostActions.resetGame, []);
  io.emit(hostActions.updateHostView, hostViewModel.getViewState());
  io.emit(hostActions.updateAudienceView, audienceViewModel.getViewState());
  io.emit(hostActions.clearUsersAnswers, []);
  console.log('Clear buzzes', 'Reset Game');
}

export const getNextState = (state, questions) => {
  if (state === states.results && currentQuestion < questions.length) {
    return states.question;
  }
  return statesArray[Math.min(statesArray.indexOf(state) + 1, statesArray.length - 1)];
}

export const emitPreviousState = (state, data, io) => {
  state = emitState(statesArray[Math.max(statesArray.indexOf(state) - 1, 0)], data, io);
}

export const emitNextState = (io, meta) => {
  state = emitState(getNextState(state, data.questions), data, meta, io);
}

const emitState = (state, data, meta, io) => {
  console.log(state, 'state');
  switch (state) {
    case states.initial:
      // io.emit();
      hostViewModel.setIntitalState();
      playerViewModel.setIntitalState();
      audienceViewModel.setIntitalState();
      break;
    case states.join:
      getData(meta.numberOfQs, meta.category);
      audienceViewModel.showJoin();
      hostViewModel.showJoin();
      break;
    case states.start:
      audienceViewModel.showStart();
      hostViewModel.showMain();
      // io.emit();
      break;
    case states.question:
      hostViewModel.showQuestion(data, currentQuestion);
      playerViewModel.showQuestion(data, currentQuestion);
      audienceViewModel.showQuestion(data, currentQuestion);
      io.emit(hostActions.updatePlayerView, playerViewModel.getViewState());
      break;
    case states.options:
      playerViewModel.showOptions(data, currentQuestion);
      audienceViewModel.showOptions(data, currentQuestion);
      io.emit(hostActions.updatePlayerView, playerViewModel.getViewState());
      timer = new Date();
      break;
    case states.answerQuestion:
      playerViewModel.disableOptions();
      audienceViewModel.showAnswerQuestion();
      io.emit(hostActions.updatePlayerView, playerViewModel.getViewState());
      break;
    case states.answer1:
    case states.answer2:
    case states.answer3:
    case states.answer4:
      audienceViewModel.showAnswer(data, currentQuestion);
      break;
    case states.results:
      audienceViewModel.showResults(data, currentQuestion);
      currentQuestion += 1;
      break;
    case states.scoreboard:
      audienceViewModel.showScoreboard(data);
      break;
    case states.end:
      audienceViewModel.showEnd();
      break;
    case states.playerAgain:
      state = states.initial;
      hostViewModel.showInitial();
      break;
  }
  hostViewModel.setState(state, getNextState(state, data.questions));
  if (io){
    io.emit(hostActions.updateHostView, hostViewModel.getViewState());  
    io.emit(hostActions.updateAudienceView, audienceViewModel.getViewState());
  }
  return state;
}

export default {
  setData,
  setPlayers,
  addResult,
  resetGame,
  getNextState,
  emitPreviousState,
  emitNextState,
};
