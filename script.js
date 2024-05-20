function boardController() {
    // need to initialize board
        // board index is row
        // board index value is col
    const boardCells = 9;
    const boardGrid = [];

    // create 2D array with nested array
    for(let i = 0; i < boardCells; i++) {
        boardGrid.push(boardCell());
    }

    // player plays the round in gameController, we have to update the board
    const playerSelectCell = (selectedCell, player) => {
        // first check if the selected cell was already selected in prev rounds
        if(boardGrid[selectedCell].getCellValue() !== 0) {
            // ignore the click
            console.log('not avail');
            return;
        } else {
            console.log('avail');
            return boardGrid[selectedCell].updateCellValue(player);
        }
    };

    const getBoard = () => boardGrid;

    return { playerSelectCell, getBoard };
};


function boardCell() {
    let value = 0;

    const getCellValue = () => value;

    const updateCellValue = (player) => value = player;

    return { getCellValue, updateCellValue };
};


function gameController() {
    // need array of objects of players
    const players = [
        {
            name: 'playerOne',
            value: 1,
        },
        {
            name: 'playerTwo',
            value: -1,
        }
    ]

    // player turns
    let playerTurn = players[0];

    // get board
    const gameboard = boardController();
    const getBoard = gameboard.getBoard();

    // rounds counter
    let counter = 0;

    // play round
    const playRound = (selectedCell) => {
        console.log(`${playerTurn['name']} is playing the round`);

        if(!!gameboard.playerSelectCell(selectedCell, playerTurn['value']) === false) return;

        const winPossibilities = [ 
            [0, 1, 2], 
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [6, 4, 2]
        ];

        const possibilitiesToValues = winPossibilities.map(function(scenario) {
                return scenario.map(cell => cell = getBoard[cell].getCellValue());
            });

        const checkForOutcome = possibilitiesToValues.map(scenario => scenario.reduce((acc, item) => {
            return acc + item;
        }, 0));

        if(checkForOutcome.includes(3 || -3) || counter === 9) {
            return true;
        }

        counter++;

        return false;
    };

    return { playRound, getBoard };
};


const game = gameController();

