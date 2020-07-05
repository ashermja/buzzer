const initialViewState = {
  questionText: '',
  showOptions: false,
  options: [],
  answered:[],
};

export const showQuestion = (data, currentQuestion) => {
  viewState.questionText = data.questions[currentQuestion].question;
  viewState.answered = [];
}

export const hideQuestion = () => {
  viewState.questionText = '';
}

export const showOptions = (data, currentQuestion) => {
  viewState.showOptions = true;
  const options = data.questions[currentQuestion].options;
  viewState.options = options.map((option) => ({ key: option.text, text: `${option.letter}: ${option.text}`}));
}

export const disableOptions = () => {
  viewState.showOptions = false;
}

export const answered = (player) => {
  const exist = viewState.answered.findIndex((p) => p = player);
  exist === -1 && viewState.answered.push(player);
};

export const getViewState = () => {
  return viewState;
};

export const setIntitalState = () => {
  viewState = JSON.parse(JSON.stringify(initialViewState));
}


export const resetGame = () => {
  setIntitalState();
}

let viewState;
setIntitalState();

export default {
  showQuestion,
  showOptions,
  disableOptions,
  answered,
  getViewState,
  setIntitalState,
  resetGame,
};