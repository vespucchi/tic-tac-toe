function boardController() {
    // need to initialize board
        // board index is row
        // board index value is col
    const boardCols = 3;
    const boardRows = 3;
    const boardGrid = [];

    // create 2D array with nested array
    for(let i = 0; i < boardCols; i++) {
        boardGrid[i] = [];
        for(let j = 0; j < boardRows; j++) {
            // populate grid cells with objects / boardCell methods
            boardGrid[i].push(boardCell());
        }
    }

    // player plays the round in gameController, we have to update the board
    const playerSelectCell = (selectedRow, selectedCol, player) => {
        // first check if the selected cell was already selected in prev rounds
        if(boardGrid[selectedRow][selectedCol].getCellValue() !== 0) {
            // ignore the click
            console.log('not avail');
            return;
        } else {
            console.log('avail');
            return boardGrid[selectedRow][selectedCol].updateCellValue(player);
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
            value: 2,
        }
    ]

    // player turns
    let playerTurn = players[0];

    // get board
    const gameboard = boardController();

    // play round
    const playRound = (selectedRow, selectedCol) => {
        console.log(`${playerTurn['name']} is playing the round`);

        if(!!gameboard.playerSelectCell(selectedRow, selectedCol, playerTurn['value']) === false) return;

        playerTurn === players[0] ? playerTurn = players[1] : playerTurn = players[0];
    }

    const getBoard = gameboard.getBoard;

    return { playRound, getBoard };
};


const game = gameController();

