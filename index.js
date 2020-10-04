/* --- GLOBAL VARIABLES --- */
let comTurn = false;
let gameOver = false;
let playerWin = false;
let comWin = false;
let playerTurns = 0;
let xHorizontalWin = -1;
let xVerticalWin = -1;
let xDiagdWin = -1;
let yHorizontalWin = -1;
let yVerticalWin = -1;
let yDiagWin = -1;

let gameboard = [
    ['_', '_', '_'],
    ['_', '_', '_'],
    ['_', '_', '_']
];

let columns = [
    ['_', '_', '_'],
    ['_', '_', '_'],
    ['_', '_', '_']
];
let diags = [
    ['_', '_', '_'],
    ['_', '_', '_']
];

/* --- CLICK FUNCTIONS --- */
$('.board-col').click(function () {
    let id = $(this).attr('id');
    logPlayerChoice(id);
    playerTurns++;
    checkForGameOver();
    if (gameOver || playerTurns === 5) {
        handleGameOver();
    } else {
        setTimeout(function() { 
            computerMove();
            checkForGameOver();
            if (gameOver) handleGameOver();
        }, 500);    
    }
});

$('#play-again-btn').click(() => location.reload()); 

/* --- PLAYER FUNCTIONS --- */
function logPlayerChoice(input) {
    let regex = /[\d]/g;
    let playerRowCol = input.match(regex);
    updateGameboard(playerRowCol[0], playerRowCol[1], 'X');
}

function updateGameboard(row, col, input) {
    gameboard[row][col] = input;
    convertGameboardToColumns(gameboard);
    convertGameboardToDiags(gameboard);
    let selectedElement = $(`#row-${row}-col-${col}`);
    $(selectedElement).html(`<h2 class="tic-tac-toe-letter">${input}</h2>`);
    $(selectedElement).off();
}

/* --- COMPUTER FUNCTIONS --- */
function computerMove () {
    comTurn = true;
    checkBoard('O');
    if (comTurn) {
        checkBoard('X');
        if (comTurn) {
            comRandomTurn();
        }
    }
}

//looks for two occurences of X or O in a row to either try to win on the next move, or block opponent
function checkBoard(input) {
    let openRow = findOccurences(gameboard, input, lookForOpenSpace);
    let openCol = findOccurences(columns, input, lookForOpenSpace);
    let openDiag = findOccurences(diags, input, lookForOpenSpace);

    if (openRow >= 0)  {
        let openCol = gameboard[openRow].indexOf('_');
        updateGameboard(openRow, openCol, 'O');
    } else if (openCol >= 0) {
        let openRow = columns[openCol].indexOf('_');
        updateGameboard(openRow, openCol, 'O');
    } else if (openDiag === 0) {
        let openSpace = diags[openDiag].indexOf('_');
        updateGameboard(openSpace, openSpace, 'O');
    } else if (openDiag === 1) {
        let openSpace = diags[openDiag].indexOf('_');
        updateGameboard(2 - openSpace, openSpace, 'O');
    }
    comTurn = (openRow >= 0 || openCol >= 0 || openDiag >= 0) ? false : true;
}

function comRandomTurn() {
    let row = Math.floor(Math.random() * 3);
    let col = Math.floor(Math.random() * 3);

    if (gameboard[row][col] === '_') {
        gameboard[row][col] = 'O';
        updateGameboard(row, col, 'O');
        comTurn = false;
    } else {
        comRandomTurn();
    }
}

/* --- END GAME FUNCTIONS --- */
function checkForGameOver () {
    xHorizontalWin = findOccurences(gameboard, 'X', checkFor3InARow);
    xVerticalWin = findOccurences(columns, 'X', checkFor3InARow);
    xDiagdWin = findOccurences(diags, 'X', checkFor3InARow); 
    yHorizontalWin = findOccurences(gameboard, 'O', checkFor3InARow);
    yVerticalWin = findOccurences(columns, 'O', checkFor3InARow);
    yDiagWin = findOccurences(diags, 'O', checkFor3InARow); 

    if (xHorizontalWin >= 0 || xVerticalWin >= 0 || xDiagdWin >= 0) {
        playerWin = true;
        gameOver = true;
    } else if (yHorizontalWin >= 0 || yVerticalWin >= 0 || yDiagWin >= 0) {
        comWin = true;
        gameOver = true;
    }
}

function handleGameOver () {
    $('.board-col').off();
    $('.result-window').removeClass('invisible');
    let result = '';
    if (playerWin) result = `Game Over, You Win!`;
    else if (comWin) result = `Game Over, Computer Wins.`;
    else result = `Game Over, Tie.`;
    $('.result-window-text').html(result); 
}

/* --- UTILITY FUNCTIONS --- */
function findOccurences(array, input, func) {
    for (let i = 0; i < array.length; i++) {
        if (func(array[i], input)) {
            return i;
        }
    }
    return -1;
}

function lookForOpenSpace(array, input) {
    let filterArr = array.filter(item => item === input);
    return (filterArr.length === 2 && array.includes('_')) ? true : false;
}

function checkFor3InARow (array, input) {
    let filteredArr = array.filter(item => item === input);
    return (filteredArr.length === 3) ? true : false;
}

function convertGameboardToColumns(array) {
    let newArr = [];
    let tempArr = [];

    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length; j++) {
            tempArr.push(array[j][i]);
        }
        newArr.push(tempArr);
        tempArr = [];
    }
    columns = newArr;
}

function convertGameboardToDiags(array) {
    let tempArr1 = [];
    let tempArr2 = [];

    for (let i = 0; i < array.length; i++) {
        tempArr1.push(array[i][i]);
        tempArr2.push(array[2 - i][i]);
    }
    diags = [
        [...tempArr1],
        [...tempArr2]
    ];
}