import questionModel from '../models/questionModel.js';
import csvUtils from '../utils/csvUtils.js'
import { categories } from '../enums.js';

async function getRandom(numberOfQs, category) {
  let questions;
  if (category === categories.all) {
    questions = await questionModel.findAll();
  } else {
    questions = await questionModel.find(category);
  }
  shuffleArray(questions);
  const filteredQs = questions.slice(0, numberOfQs);
  return filteredQs.map((question) => {
    const options = question.options.map((option, i) => {
      return { letter: (i+10).toString(36).toUpperCase(), text: option };
    });
    const answers = question.answers.map((answer, i) => {
      const index = options.map((option) => option.text === answer).indexOf(true);
      return { letter: (index+10).toString(36).toUpperCase(), text: answer };
    });
    return {...question, options, answers};
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

async function updateQuestions(req) {
  const questionsCSV = await csvUtils.getQuestionCSV(req);

  const questions = questionsCSV.map((question) => (
    { 
      question: question.Question,
      options: [question.OptionA, question.OptionB, question.OptionC, question.OptionD],
      answers: [question.Answer1, question.Answer2, question.Answer3, question.Answer4].filter(Boolean),
      categories: [question.Category1, question.Category2, question.Category3].filter(Boolean),
    }) )
  questions.forEach(question => {
    questionModel.create(question);
  });
}



export default {
  getRandom,
  updateQuestions,
};
