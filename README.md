## Millionaire Fastest Finger First


A who wants to be a millionaire style fastest finger quiz game, similar to a jackbox game. Perfect for playing over zoom, any video conferencing software, works just as well locally. Uses websockets to sent messages.

This code is based on [buzzer](https://github.com/bufferapp/buzzer) which is a great app for hosting a buzz in style quiz, using your phone as a buzzer, please check in out.

## Running the app

You'll need [Node.js](https://nodejs.org) or [Docker](https://www.docker.com/) to run this
application. For Node:

```
npm install
node index.js
```

For Docker:

```
docker build -t millionaire .
docker run -p 8090:8090 millionaire
```

In addition you'll need mongodb which is used for storing the questions.

Create a .env file and point `MONGODB_URI` to your mongodb database
The .env also requires `CSV_IMPORT_URL` which should point to a csv file that can be used to update the questions. Dropbox works well as long as the file is publicly accessable (make sure to include &dl=1 on the url)


Open http://localhost:8090 in your browser to start! (obviously if you want to play this remotely you'll need to publish it to the cloud, heroku works well)

## How to use

Each game requires a host, and players there is also a "TV View" that both hosts and player can use. 


**The host**

The host goes to (`http://localhost:8090/`) and choose "Host", the host view is perfect for a mobile device. The host chooses a category and number of questions and then chooses "Host game". The host must then wait for the players to join before pressing "Start game". The host is repsonsible moving through the game from question to question just like a real gameshow host would.


**The players**

Players go to (`http://localhost:8090/`) on their phones enter and name and choose "Join". They then wait for the host to start the game. When the game starts questions will appear on the screen with 4 options. The player must choose the options in the right order as fast as possible. 2 points are award for the fastest correct answer and 1 point for anyone else that gets a correct answer. After the questions have been answered a scoreboard is displayed the results.

**The TV view**

The TV view is accessed by going to (http://localhost:8090/) and choosing "TV View" and is best used on a laptop or computer monitor. I had hoped that it would work on smart tv browsers but it seems they have limited javascript support so it didn't work properly at least on my LG TV. If you think of this like a jackbox game, the TV view is where the game is displayed and played out and the player uses the "Join" on their phone to answer the questions.


Host view                | Player view                 | TV view                  |
:-------------------------:|:-------------------------:|:-------------------------:|
<img width="250px" src="https://github.com/ashermja/millionaire/blob/master/screenshots/host.png?raw=true" alt="Host game"/> | <img width="250px" src="https://github.com/ashermja/millionaire/blob/master/screenshots/player.png?raw=true" alt="Play game"/> | <img width="250px" src="https://github.com/ashermja/millionaire/blob/master/screenshots/audience.png?raw=true" alt="TV view"/>

## Assets
Dummy assets are included for images and audio (the mp3 files are blank), for the best experience replace these with your own examples.

## Updating the questions
Added questions to a csv file and run http://localhost:8090/updateQuestions. Duplicate questions will be ignored.

See examples/fffQuestions.csv for how the csv file should be structured and some sample questions

## License

MIT
