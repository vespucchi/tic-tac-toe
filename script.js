(function domController() {
    // initialize the game
    const game = gameController();
    const playerOneScore = document.querySelector('#score1-score');
    const playerTwoScore = document.querySelector('#score2-score');
    const tieScore = document.querySelector('#score0-score');
    let playerTurn = game.getPlayerTurn();
    let outcome = 0;

    game.initializeBoardGrid();

    // create cells (buttons) and append them to boardGrid
    for(let i = 0; i < 9; i++) {
        // create new buttons
        const cellDiv = createElement('.boardGrid', 'div', undefined, 'cellDiv');
        const cellBtn = document.createElement('button');
        cellBtn.classList.add('cell');
        cellBtn.dataset.index = i;

        cellDiv.appendChild(cellBtn);
    }

    // create cells & save these buttons (cells)
    let cells = document.querySelectorAll('.cell');

    // add event listeners for these buttons
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if(outcome === 0) {
                playerTurn = game.getPlayerTurn()

                const roundSuccess = game.playRound(cell.dataset.index);

                if(roundSuccess) {
                    playerTurn.value === 1 ? cell.textContent = 'X' : cell.textContent = 'O';
                    cell.animate([
                        // keyframes
                        { transform: 'scale(0.1)' },  
                        { transform: 'scale(1)'}
                    ], { 
                        // timing options
                        duration: 50,
                        
                    });

                    outcome = game.checkOutcome();

                    if(outcome === 0) {
                        if(game.getPlayMode() === 1) {
                            const randomizedCell = game.randomizePlay();
                            const randCell = document.querySelector(`button[data-index="${randomizedCell}"]`);
    
                            setTimeout(() => randCell.textContent = 'O', 100);
                            outcome = game.checkOutcome();

                            if(outcome !== 0) {
                                outcomeDisplay(outcome);
                            }
                        }
                    } else {
                        outcomeDisplay(outcome);
                    }
                }
            } 
            else {
                // reset player turn
                game.setPlayerTurn(0);

                // reset round counter
                game.resetRoundCounter();

                // reset outcome
                outcome = 0;

                // reset grid values
                game.initializeBoardGrid();

                // reset cells value
                cells.forEach(cell => {
                    cell.textContent = '';
                    cell.style.color = '#FFFFFF';
                });
            }
        }
    )})

    function outcomeDisplay(outcome) {
        if(typeof outcome === 'object') {
            cells.forEach(cellColor => {
                cellColor.style.color = '#818181';
            })

            outcome.forEach(value => {
                const scenarioCell = document.querySelector(`.cell[data-index="${value}"`);
                scenarioCell.style.color = '#FFFFFF';

                scenarioCell.animate([
                    // keyframes
                    { transform: 'scale(0.1)' },  
                    { transform: 'scale(1)'},
                    { transform: 'scale(0.1)'},
                    { transform: 'scale(1)'},
                    { transform: 'scale(0.1)'},
                    { transform: 'scale(1)'},
                    ], { 
                    // timing options
                    duration: 1000,
                });
            })

            if(game.getPlayMode() === 1) {
                playerOneScore.textContent = game.getPlayerScore(0, 'win1');
                playerTwoScore.textContent = game.getPlayerScore(2, 'win');
            }
            else {
                playerOneScore.textContent = game.getPlayerScore(0, 'win2');
                playerTwoScore.textContent = game.getPlayerScore(1, 'win');
            }
            
            return;

        } else if (outcome == 1) {
            const gridBorders = document.querySelectorAll('.cellDiv');
            cells.forEach(cellColor => {
                cellColor.style.color = '#818181';
            });

            gridBorders.forEach(border => {
                border.animate([
                    // keyframes
                    { opacity: '0.1' },  
                    { opacity: '1'},
                    { opacity: '0.1' },  
                    { opacity: '1'},
                    { opacity: '0.1' },  
                    { opacity: '1'},
                    ], { 
                    // timing options
                    duration: 1000,
                });
            });

            if(game.getPlayMode() === 1) {
                tieScore.textContent = game.getPlayerScore(2, 'tie');
            }
            else {
                tieScore.textContent = game.getPlayerScore(1, 'tie');
            }

            return;
        }
    }

    function createElement(parentElement, childElement, text = '', ...elementClass) {
        const parent = document.querySelector(parentElement);
        const child = document.createElement(childElement);
        child.textContent = text;

        for(let i = 0; i < elementClass.length; i++) {
            child.classList.add(elementClass[i]);
        }

        parent.appendChild(child);

        return child;
    }
})();


function gameController() {
    // get boardController methods
    const board = boardController();

    // initialize board grid objects
    const initializeBoardGrid = () => board.createBoardGrid();

    // define 2 players as objects and save in array
    const player = [
        {
            name: 'playerOne',
            value: 1,
            win1: 0,
            win2: 0,
        },
        {
            name: 'playerTwo',
            value: -1,
            win: 0,
            tie: 0,
        },
        {
            name: 'playerAi',
            value: -1,
            win: 0,
            tie: 0,
        },
    ]
    const getPlayerScore = (index, score) => player[index][score];

    // play mode initialization
    let playMode = 1;
    const getPlayMode = () => playMode;
    const setPlayMode = (index) => playMode = index;

    // player turn initialization
    let playerTurn = player[0];
    const getPlayerTurn = () => playerTurn;
    const setPlayerTurn = (index) => playerTurn = player[index];

    // variable for counting rounds
    let roundCounter = 0;
    const resetRoundCounter = () => roundCounter = 0;

    const randomizePlay = () => {
        const freeCells = board.getBoardGrid()
        console.log(freeCells);
        while(true) {
            var randomizedCell = Math.floor(Math.random() * 10);
            if(freeCells[randomizedCell] === 0) break;
        }

        board.selectCell(randomizedCell, -1);

        playerTurn = player[0];
        roundCounter++;

        return randomizedCell;
    }


    // method for playing rounds, it takes cell number as an arg
    const playRound = (cellIndex) => {
        // call boardController to update cell value if condition is met, returns bool
        if(getPlayMode() === 1 && playerTurn === player[2]) {
            board.selectCell(cellIndex, playerTurn.value);
        } else {
            var moveSuccess = board.selectCell(cellIndex, playerTurn.value);
        }
        
        // check if move was successful
        if(!moveSuccess) {
            // if cell is already occupied, end the round and 
            //  return false = unsuccessful round & there's no playerTurn switch
            return false;
        }

        // swap turns
        playerTurn === player[0] ? playerTurn = player[1] : playerTurn = player[0];

        // increase round counter
        roundCounter++;

        // return true = successful round
        return true;
    }

    const checkOutcome = () => {
        // check if there's a winner or a tie
        const winScenarios = [
            [0, 1, 2], 
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [6, 4, 2]
        ];

        // outer map for every nested array
        const sumOfScenarioCells = winScenarios.map(scenario => {
            // inner map but this time for nested array values
            return scenario.map(cellIndex => {
                return cellIndex = board.getBoardGrid()[cellIndex];
                })
            // now reduce these inner mapped values and use outer map to save the values
                .reduce((acc, curr) => {
                    return acc + curr;
                }, 0);
            })
        // outcome is 1D array: like this (8) [0, 0, 1, 1, 0, 0, 0, 1]
        
        // now go thru this 1D array and find if there's tie or a winner
        // winner will check if array contains 3 (player 1 winner) or -3 (player 2 winner)
        // tie will check for round counter value
        // winner will return a scenario of cell values that won the game (for animation purposes)
        if(sumOfScenarioCells.includes(3)) {
            if(getPlayMode() === 1) {
                player[0]['win1']++;
            } else {
                player[0]['win2']++;
            }
            return winScenarios[sumOfScenarioCells.indexOf(3)];
        } else if(sumOfScenarioCells.includes(-3)) {
            if(getPlayMode() === 1) {
                player[2]['win']++;
            } else {
                player[1]['win']++;
            }
            return winScenarios[sumOfScenarioCells.indexOf(-3)];
        } else if(roundCounter === 9) {
            // 1 === tie
            if(getPlayMode() === 1) {
                player[2]['tie']++;
            } else {
                player[1]['tie']++;
            }
            return 1;
        } else {
            // 0 === no outcome
            return 0;
        }
    }
    

    return { playRound, checkOutcome, getPlayerTurn, setPlayerTurn, initializeBoardGrid, resetRoundCounter, getPlayerScore,
        getPlayMode, setPlayMode, randomizePlay };
}


function boardController() {
    // intialize the board grid
    let boardGrid = [];

    const createBoardGrid = () => {
        // reset board grid
        boardGrid = [];

        // board grid is an array of cells that are type of object
        for(let i = 0; i < 9; i++) {
            boardGrid.push(cellController());
        }
    }

    // method for requesting board grid state
    const getBoardGrid = () => boardGrid.map(cell => cell.getCellValue());

    // method for updating cell if it's not already occupied
    const selectCell = (cellIndex, playerValue) => {
        if(boardGrid[cellIndex].getCellValue() !== 0) return false;
        else {
            boardGrid[cellIndex].updateCellValue(playerValue);
            return true;
        }
    };


    return { selectCell, getBoardGrid, createBoardGrid };
}


function cellController() {
    // set every cell to 0
    let value = 0;

    const getCellValue = () => value;

    // update call value by calling this function
    // each boardController cell will have it's own object with methods and it's own value
    const updateCellValue = (playerValue) => value = playerValue;


    return { getCellValue, updateCellValue };
}
