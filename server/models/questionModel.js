import mongoose from 'mongoose';
import { connect } from '../db.js';

const DUPILCATE_KEY_ERROR_CODE = 11000;

const schema = new mongoose.Schema(
  {
    question: { type: String, require: true, unique: true },
    options:{ type: [], require: true },
    answers: { type: [], require: true },
    categories: { type: [], require: true },
  }
);

const QuestionModel = connect().model('questions', schema);

function findAll(query = {}) {
  return QuestionModel
    .find(query)
    .lean()
    .exec();
}

async function find(category) {
  return QuestionModel.find( {  categories: category }).lean().exec();
}

// async function getRandom(numberOfQs, category) {
//   const questions = await QuestionModel.find( {  categories: category });
//   shuffleArray(questions);
//   return questions.slice(0, Math.min(numberOfQs, questions.length));
//     // .aggregate([ { $sample: { size: numberOfQs } } ]);
// }


async function create(question) {
  try {
    return await QuestionModel.create({...question});
  } catch (error) {
    if (error.code === DUPILCATE_KEY_ERROR_CODE) {
      console.log('Duplicate record', question);
    } else {
      throw error;
    }
  }
}

export default {
  findAll,
  find,
  create,
};
