(function domController() {
    // initialize a new game
    const game = gameController();

    // create overlay
    const overlay = document.querySelector('.overlay');
    overlay.textContent = '';

    createElement('.overlay', 'div', undefined, 'winner', 'hide');
    createElement('.winner', 'p', 'Winner is', 'win-title', 'hide');
    createElement('.winner', 'p', 'X', 'playerOne', 'hide');
    createElement('.winner', 'p', 'O', 'playerTwo', 'hide');
    createElement('.overlay', 'div', undefined, 'tie', 'hide');
    createElement('.tie', 'p', 'Tie!', 'tie-title', 'hide');
    createElement('.overlay', 'button', 'Restart', 'restart', 'hide');


    // save board grid which is needed for appending buttons
    const boardGrid = document.querySelector('.boardGrid');
    boardGrid.textContent = '';

    // create cells (buttons) and append them to boardGrid
    for(let i = 0; i < 9; i++) {
        const cellBtn = createElement('.boardGrid', 'button', undefined, 'cell');
        cellBtn.dataset.index = i;
    }

    // save these buttons (cells)
    const cells = document.querySelectorAll('.cell');

    // add event listeners for these buttons
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const playerTurn = game.getPlayerTurn();

            const roundSuccess = game.playRound(cell.dataset.index);
            if(roundSuccess) {
                playerTurn.value === 1 ? cell.textContent = 'X' : cell.textContent = 'O';
                const outcome = game.checkOutcome();

                if(outcome === 1) {
                    toggleElement('.overlay');
                    toggleElement('.winner');
                    toggleElement('.win-title');
                    toggleElement(`.${playerTurn.name}`);
                    toggleElement('.restart');
                } else if(outcome === 2) {
                    toggleElement('.overlay');
                    toggleElement('.tie');
                    toggleElement('.tie-title');
                    toggleElement('.restart');
                }

            }
        })
    })

    // function for toggling outcome elements
    function toggleElement(elementClass) {
        const element = document.querySelector(elementClass);
        element.classList.toggle('hide');
    };

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

    // restart button element & event listener
    const restartBtn = document.querySelector('.restart');
    return restartBtn.addEventListener('click', () => {
        overlay.classList.toggle('hide');
        return domController();
    })
})();


function gameController() {
    // get boardController methods
    const board = boardController();

    // define 2 players as objects and save in array
    const player = [
        {
            name: 'playerOne',
            value: 1,
        },
        {
            name: 'playerTwo',
            value: -1,
        }
    ]

    // initialize playerTurn to the first player
    let playerTurn = player[0];
    const getPlayerTurn = () => playerTurn;

    // variable for counting rounds
    let roundCounter = 0;

    // method for playing rounds, it takes cell number as an arg
    const playRound = (cellIndex) => {
        // call boardController to update cell value if condition is met, returns bool
        const moveSuccess = board.selectCell(cellIndex, playerTurn.value);
        
        // check if move was successful
        if(!moveSuccess) {
            // if cell is already occupied, end the round and 
            //  return false = unsuccessful round & there's no playerTurn switch
            return false;
        }

        // if move was successful, swap player turn
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
                return cellIndex = board.getBoardGrid()[cellIndex].getCellValue();
                })
            // now reduce these inner mapped values and use outer map to save the values
                .reduce((acc, curr) => {
                    return acc + curr;
                }, 0);
            })
        // outcome is 1D array: like this (8) [0, 0, 1, 1, 0, 0, 0, 1]
        
        // now go thru this 1D array and find if there's tie or a winner
        // tie will check if all values are !== 0, it's impossible to be 0 if all 3 cells are occupied
        if(sumOfScenarioCells.includes(3) || sumOfScenarioCells.includes(-3)) {
            // 1 === winner
            return 1;
        } else if(roundCounter === 9) {
            // 2 === tie
            return 2;
        } else {
            // 0 === no outcome
            return 0;
        }
    }
    

    return { playRound, checkOutcome, getPlayerTurn };
}


function boardController() {
    // board grid is an array of cells that are type of object
    const boardGrid = [];

    // intialize the board grid
    for(let i = 0; i < 9; i++) {
        boardGrid.push(cellController());
    }

    // method for requesting board grid state
    const getBoardGrid = () => boardGrid;

    // method for updating cell if it's not already occupied
    const selectCell = (cellIndex, playerValue) => {
        if(boardGrid[cellIndex].getCellValue() !== 0) return false;
        else {
            boardGrid[cellIndex].updateCellValue(playerValue);
            return true;
        }
    };


    return { selectCell, getBoardGrid };
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
