const grid = document.querySelector('.grid');
const width = 15; // (class .grid) width divided by (class .grid div) width
// start at bottom middle
let currentShooterIndex = width * (width - 1) + Math.floor(width / 2);
let score = 0
const squares = [];

// create grid
// add children to grid element, store as array in squares
for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
    squares.push(square);
}

// add the shooter class to the player to draw it
squares[currentShooterIndex].classList.add('shooter');

// create invaders: edit for different configurations (i.e. levels)
function createAlienInvaders(rows, cols, startRow, gridWidth) {
    const invaders = [];
    for (let row = startRow; row < startRow + rows; row++) {
        for (let col = 0; col < cols; col++) {
            invaders.push(row * gridWidth + col);
        }
    }
    return invaders;
}

const alienInvaders = createAlienInvaders(3, 10, 0, width);

// draw invaders by giving them invader attribute
function drawInvaders() {
    alienInvaders.forEach(invader => {
        squares[invader].classList.add('invader');
    });
}

drawInvaders();


let direction = 1; // direction the aliens will move: 1 for right, -1 for left
let movingDown = false; // flag to track if aliens are moving down

function moveInvaders() {

    // remove 'invader' class from all invaders before updating their positions
    alienInvaders.forEach(invader => squares[invader].classList.remove('invader'));

    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

    // move invaders down and change direction
    if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
        direction = -direction; // change direction
        movingDown = true; // set flag to move down
    }

    if (movingDown) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width; // move each invader down one row
        }
        movingDown = false; // reset flag
    } else {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction; // move each invader left or right
        }
    }

    // Check for Game Over conditions
    if (alienInvaders.includes(currentShooterIndex)) {
        // Invader has reached the shooter's position
        document.querySelector('#score').textContent = 'GAME OVER';
        clearInterval(invadersId);
    }

    alienInvaders.forEach(invader => {
        if (invader >= width * width) {
            // Invader has reached the bottom of the grid
            document.querySelector('#score').textContent = 'GAME OVER';
            clearInterval(invadersId);
        }
    });
    
    // re-render
    drawInvaders();
}

// set an interval to move the invaders: adjust difficulty
const gameSpeed = 200
setInterval(moveInvaders, gameSpeed);

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter'); 
    // de-render current shooter position

    if (e.key === 'ArrowLeft' && currentShooterIndex % width !== 0) {
        currentShooterIndex -= 1; // move left
    } else if (e.key === 'ArrowRight' && currentShooterIndex % width < width - 1) {
        currentShooterIndex += 1; // move right
    }
    squares[currentShooterIndex].classList.add('shooter'); 
    // render new shooter position
}

document.addEventListener('keydown', moveShooter);

function shoot(e) {
    if (e.key === 'ArrowUp') {
        let laserId;
        let currentLaserIndex = currentShooterIndex;
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width; // move laser up
            squares[currentLaserIndex].classList.add('laser');
            
            // logic for hitting an invader
            if (squares[currentLaserIndex].classList.contains('invader')) {

                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');
                
                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300);
                clearInterval(laserId);

                const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
                alienInvaders.splice(alienRemoved, 1); // Remove hit invader from array
                score++;
                document.querySelector('#score').textContent = score; // Update score display
            }
            if (currentLaserIndex < width) {
                clearInterval(laserId);
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
            }
        }
        laserId = setInterval(moveLaser, 100);
    }
}

document.addEventListener('keydown', shoot);

