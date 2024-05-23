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

    // variable for outcome
    let outcome = 0;

    console.log(`${playerTurn.name} turn`);

    // method for playing rounds, it takes cell number as an arg
    const playRound = (cellIndex) => {
        // call boardController to update cell value if condition is met, returns bool
        const moveSuccess = board.selectCell(cellIndex, playerTurn.value);
        
        // check if move was successful
        if(!moveSuccess) {
            // if cell is already occupied, end the round and return false value
            return moveSuccess;
        }

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
            return checkOutcome(1);
        } else if(!sumOfScenarioCells.includes(0)) {
            // 2 === tie
            return checkOutcome(2);
        }

        // if no condition is met, there's no outcome yet, swap playerTurn
        playerTurn === player[0] ? playerTurn = player[1] : playerTurn = player[0];

        // 0 === no outcome
        return checkOutcome(0);
    }

    // every round check outcome
    function checkOutcome(outcome) {
        if(outcome === 1) {
            return console.log(`${playerTurn.name} won the game!`);
        } else if(outcome === 2) {
            return console.log('Game is tied!');
        } else {
            console.log('No winner yet');
            return console.log(`${playerTurn.name} proceed with next round`);
        }
    }
    

    return { playRound };
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
