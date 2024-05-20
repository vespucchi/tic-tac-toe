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
    console.log('Starting the game');

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
    const getPlayerTurn = () => playerTurn['name'];

    // get board
    const gameboard = boardController();
    const getBoard = gameboard.getBoard();

    // rounds counter
    let counter = 0;
    const getCounter = () => counter;

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

        counter++;

        if(checkForOutcome.includes(3) || checkForOutcome.includes(-3) || counter === 9) {
            return true;
        }

        playerTurn === players[0] ? playerTurn = players[1] : playerTurn = players[0];
        return false;
    };

    return { playRound, getBoard, getCounter, getPlayerTurn };
};


function screenController() {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.turn');
    const grid = document.querySelector('.grid');    
    
    function updateBoard() {
        // with each click, remove grid content
        grid.textContent = '';

        // and append grid with updated board
        game.getBoard.forEach((cell, index) => {

            const btn = document.createElement('button');
            btn.dataset.index = index;
            btn.classList.add('cell');
            if(cell.getCellValue() == 1) {
                btn.textContent = "O";
            } else if (cell.getCellValue() == -1) {
                btn.textContent = "X";
            }
            
            grid.appendChild(btn);
        })

        // save new buttons aka cells
        const cells = document.querySelectorAll('.cell');

        cells.forEach(cell => cell.addEventListener('click', (e) => {
            const cellIndex = e.target.dataset.index;
            console.log(cellIndex);
            if(game.playRound(cellIndex) === true) {
                updateBoard();
                return game.getCounter() === 9 ? showOutcome("tie") : showOutcome(game.getPlayerTurn());
            } else {
                updateBoard();
            };
        }))
    }

    function showOutcome(state) {
        
    }

    // initialize board
    updateBoard();
}

screenController();