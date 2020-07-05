import stateController from './server/controllers/stateController.js';
import questionFacade from './server/facade/questionFacade.js';
import hostViewModel from './server/viewModels/hostViewModel.js';
import audienceViewModel from './server/viewModels/audienceViewModel.js';
import { playerActions, hostActions } from './server/sharedActions.js';
import { screens, hostScreens } from './server/enums.js'
import http from 'http';
import express from 'express';
import socketio from 'socket.io';

const app = express();
const server = http.Server(app);
const io = socketio(server);

const title = 'Who wants to be a millionaire';

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('choice', {}));
app.get('/audience', (req, res) => res.render('audience', Object.assign({ title, req }, { ...audienceViewModel.getViewState(), screens })));
app.get('/host', (req, res) => res.render('host', Object.assign({ title }, { ...hostViewModel.getViewState(), screens: hostScreens }))); // TODO// pass currnet question here
app.get('/join', (req, res) => res.render('player', { title }));
app.get('/updatequestions', (req, res) => {
  questionFacade.updateQuestions(req);
  return res.send('done');
});

io.on('connection', async (socket) => {  
  socket.on(playerActions.join, (player) => {
    stateController.setPlayers(io, player);
  })

  socket.on(playerActions.buzz, (result) => {
    stateController.addResult(io, result);
  })

  // socket.on(playerActions.clear, () => { // todo: this is wrong
  //   stateController.initialData();
  //   io.emit(hostActions.results, [...data.buzzes]);
  //   io.emit(hostActions.clearUsersAnswers, []);
  //   console.log(`Clear buzzes`);
  // })

  socket.on(hostActions.reset, () => {
    stateController.resetGame(io);
  })
  socket.on(hostActions.nextState, async (meta) => {
    stateController.emitNextState(io, meta);
  });
});


const PORT = process.env.PORT || 8090;
server.listen(PORT, () => console.log('Listening on 8090'));
