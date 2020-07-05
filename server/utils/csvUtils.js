import csvtojson from 'csvtojson';
import request from 'request';
import 'dotenv/config.js';
// const request = require('request');

const getQuestionCSV = async (req) => { // TODO: white list
  const questions = [];
  return new Promise((resolve, reject) => {
    csvtojson()
      .fromStream(request.get(process.env.CSV_IMPORT_URL))
      .subscribe((json)=>{
        questions.push(json);
        resolve(questions);
    });
  },onError,onComplete);
}

const onError = (error) => {
  console.log(error);
}

const onComplete = (x) => {
  console.log('complete');
}

export default {
  getQuestionCSV,
}