import { print, askQuestion } from "./io.mjs"
import { debug, DEBUG_LEVELS } from "./debug.mjs";
import { ANSI } from "./ansi.mjs";
import DICTIONARY from "./language.mjs";
import showSplashScreen from "./splash.mjs";
import pretty from "./makePretty.mjs";


const GAME_BOARD_SIZE = 3;
const PLAYER_1 = 1;
const PLAYER_2 = -1;

const MENU_CHOICES = {
    MENU_CHOICE_START_GAME: 1,
    MENU_CHOICE_SHOW_SETTINGS: 2,
    MENU_CHOICE_EXIT_GAME: 3
}

const NO_CHOICE = -1;

const LANGUAGE_CHOICES = {
    ENGLISH: 1,
    NORWEGIAN: 2,
}

const GAME_MODE = {
        PVP: 1,
        PVC: 2,
    }

let languageChoice = [DICTIONARY.en, DICTIONARY.no];
let language = languageChoice[0];
let gameboard;
let currentPlayer;


clearScreen();
showSplashScreen();
setTimeout(start, 2500); 

//#region game functions -----------------------------

async function start() {

    do { 

        let chosenAction = NO_CHOICE;
        chosenAction = await showMenu();

        if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_GAME) {
            await runGame();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS) {
            await chooseLanguage();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_EXIT_GAME) {
            clearScreen();
            process.exit();
        }

    } while (true)

}

async function runGame() {

    let isPlaying = true;
    while (isPlaying) { 
        initializeGame(); 
        isPlaying = await modeSelection();
    }
}

async function showMenu() {

    let choice = -1; 
    let validChoice = false;    

    while (!validChoice) {
        clearScreen();
        print(ANSI.COLOR.YELLOW + language.MENU + ANSI.RESET);
        print(language.PLAY_GAME);
        print(language.SETTINGS);
        print(language.EXIT_GAME);

        choice = await askQuestion(pretty.EMPTY);

        if ([MENU_CHOICES.MENU_CHOICE_START_GAME, MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS, MENU_CHOICES.MENU_CHOICE_EXIT_GAME].includes(Number(choice))) {
            validChoice = true;
        }
    }

    return choice;
}

async function chooseLanguage() {
    let choice = -1;
    let validChoice = false;
    while (!validChoice) {
        clearScreen();
        print(ANSI.COLOR.YELLOW + language.CHOOSE_LANGUAGE + ANSI.RESET);
        print(language.ENGLISH);
        print(language.NORWEGIAN);
    
        choice = await askQuestion(pretty.EMPTY);

        if ([LANGUAGE_CHOICES.ENGLISH, LANGUAGE_CHOICES.NORWEGIAN].includes(Number(choice))) {
            language = languageChoice[choice - 1];
            validChoice = true;
        }
    }
}

async function chooseMode() {
    let choice = -1;
    let validChoice = false;

    while(!validChoice) {
        clearScreen();
        print(ANSI.COLOR.YELLOW + language.CHOOSE_GAME_MODE + ANSI.RESET);
        print(language.PVP);
        print(language.PVC);

        choice = await askQuestion(pretty.EMPTY);

        if ([GAME_MODE.PVP, GAME_MODE.PVC].includes(Number(choice))) {
            validChoice = true;
        } 
    }
    return choice;
}

async function modeSelection() {
    let gameMode;
    let choice = await chooseMode();
    if (choice == GAME_MODE.PVP) {
        gameMode = playGamePvP();
    } else if (choice == GAME_MODE.PVC) {
        gameMode = playGamePvC();
    }
    return gameMode;
}

async function playGamePvP() {
    let outcome;
    do {
        clearScreen();
        showGameBoardWithCurrentState();
        showHUD();
        let move = await getGameMoveFromCurrentPlayer();
        updateGameBoardState(move);
        outcome = evaluateGameState();
        changeCurrentPlayer();
    } while (outcome == 0)

    showGameSummary(outcome);

    return await askWantToPlayAgain();
}

async function playGamePvC() {
    let outcome;
    do {
      clearScreen();
      showGameBoardWithCurrentState();
      showHUD();
      let move;
      if (currentPlayer == PLAYER_1) {
        move = await getGameMoveFromCurrentPlayer();
      } else if (currentPlayer == PLAYER_2) {
        move = computerMove();
        while (isValidPositionOnBoard(move) == false) {
          move = computerMove();
        }
    }
      updateGameBoardState(move);
      outcome = evaluateGameState(); 
      changeCurrentPlayer();
    } while (outcome == 0)
  
    showGameSummary(outcome);
    
    return await askWantToPlayAgain();
  }

  function computerMove() {
    let row = Math.floor(Math.random() * GAME_BOARD_SIZE);
    let col = Math.floor(Math.random() * GAME_BOARD_SIZE);
    let move = [row, col];
    return move;
  }


async function askWantToPlayAgain() {
    let answer = await askQuestion(language.PLAY_AGAIN_QUESTION);
    let playAgain = true;
    if (answer && answer.toLowerCase()[0] != language.CONFIRM) {
        playAgain = false;
    }
    return playAgain;
}

function showGameSummary(outcome) {
    clearScreen();
    if (outcome == 0.5) {
        print(language.DRAW);
    } else {
      let winningPlayer = (outcome > 0) ? language.PLAYER_1 : language.PLAYER_2;  
    print(language.WINNER_IS + winningPlayer);
    }
    showGameBoardWithCurrentState();
    print(language.GAME_OVER);
}

function changeCurrentPlayer() {
    currentPlayer *= -1;
}

function evaluateGameState() {
    let sum = 0;
    let state = 0;
    for (let row = 0; row < GAME_BOARD_SIZE; row++) {

        for (let col = 0; col < GAME_BOARD_SIZE; col++) {
            sum += gameboard[row][col];
        }

        if (Math.abs(sum) == GAME_BOARD_SIZE) {
            state = sum;
        }
        sum = 0;
    }

    for (let col = 0; col < GAME_BOARD_SIZE; col++) {

        for (let row = 0; row < GAME_BOARD_SIZE; row++) {
            sum += gameboard[row][col];
        }

        if (Math.abs(sum) == GAME_BOARD_SIZE) {
            state = sum;
        }

        sum = 0;
    }


    { for (let row = 0, col = 0; row, col < GAME_BOARD_SIZE; row++, col++) {
        sum += gameboard[row][col];
        }

        if (Math.abs(sum) == GAME_BOARD_SIZE) {
            state = sum;
        }

        sum = 0;
    }
    
    { for (let row = 0, col = GAME_BOARD_SIZE - 1; row < GAME_BOARD_SIZE && col >= 0; row++, col--) {
        sum += gameboard[row][col];
        }

        if (Math.abs(sum) == GAME_BOARD_SIZE) {
        state = sum;
        }

        sum = 0;
    }

    let draw = true;
    for (let row = 0; row < GAME_BOARD_SIZE; row++) {
        for (let col = 0; col < GAME_BOARD_SIZE; col++) {
            if (gameboard[row][col] == 0) {
                draw = false;
            }
        }
    }

    if (state == 0 && draw) {
        return 0.5;
    }

    let winner = state / GAME_BOARD_SIZE;
    return winner; 
}

function updateGameBoardState(move) {
    const ROW_ID = 0;
    const COLUMN_ID = 1;
    gameboard[move[ROW_ID]][move[COLUMN_ID]] = currentPlayer;
}

async function getGameMoveFromCurrentPlayer() {
    let position = null;
    do {
        let rawInput = await askQuestion(language.PLACE_MARK);
        position = rawInput.split(pretty.SPACE).map(Number);
        position[0] = position[0] - 1;
        position[1] = position[1] - 1;
    } while (isValidPositionOnBoard(position) == false)

    return position
}

function isValidPositionOnBoard(position) {

    if (position.length !== 2) {
        return false;
    }

    if (position[0] * 1 !== position[0] || position[1] * 1 !== position[1]) {
        return false;

    } else if (position[0] < 0 || position[1] < 0 || position[0] >= GAME_BOARD_SIZE || position[1] >= GAME_BOARD_SIZE) {
        return false;
     
    } else if (gameboard[position[0]][position[1]] !== 0) {
        return false;  
    } 

}

function showHUD() {
    let playerDescription = language.PLAYER_1;
    if (PLAYER_2 == currentPlayer) {
        playerDescription = language.PLAYER_2;
    }
    print(language.PLAYER + playerDescription + language.YOUR_TURN);
}

function showGameBoardWithCurrentState() {
    const PLAYER_X = ANSI.COLOR.GREEN + "X " + ANSI.RESET;
    const PLAYER_O = ANSI.COLOR.RED + "O " + ANSI.RESET;
    
    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let rowOutput = pretty.EMPTY;
        for (let currentCol = 0; currentCol < GAME_BOARD_SIZE; currentCol++) {
            let cell = gameboard[currentRow][currentCol];
            if (cell == 0) {
                rowOutput += (pretty.UNDERSCORE + pretty.SPACE);
            }
            else if (cell > 0) {
                rowOutput += PLAYER_X;
            } else {
                rowOutput += PLAYER_O;
            }
        }
        print(rowOutput);
    }
}

function initializeGame() {
    gameboard = createGameBoard();
    currentPlayer = PLAYER_1;
}

function createGameBoard() {

    let newBoard = new Array(GAME_BOARD_SIZE);

    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let row = new Array(GAME_BOARD_SIZE);
        for (let currentColumn = 0; currentColumn < GAME_BOARD_SIZE; currentColumn++) {
            row[currentColumn] = 0;
        }
        newBoard[currentRow] = row;
    }

    return newBoard;

}

function clearScreen() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME, ANSI.RESET);
}


//#endregion

