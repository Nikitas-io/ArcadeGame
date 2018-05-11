
/**
 * A class for commonly used parameters and methods by all charachters.
 * @param {*} x A charachter's x coordinates.
 * @param {*} y A charachter's x coordinates
 * @param {*} charachter The sprite used for a charachter.
 */
function Charachter(x, y, charachter) {
    this.x = x;
    this.y = y;
    this.sprite = charachter;
}

/**
 * Draw the player and the enemies on the screen (required method for game).
 */
Charachter.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Enemies the player must avoid.
 * @param {*} x An enemy's x coordinates.
 * @param {*} y An enemy's y coordinates.
 * @param {*} charachter The sprite used for an enemy.
 */
function Enemy(x, y, charachter) {
    // The image/sprite for the enemies, this uses
    // a helper to easily load images.
    Charachter.call(this, x, y, charachter);
    this.speed = this.handleSpeed();
    this.width = 60;
    this.height = 20;
};
Enemy.prototype = Object.create(Charachter.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * Update the enemy's position, required method for game.
 * @param {*} dt A time delta between ticks.
 */
Enemy.prototype.update = function (dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 505) {
        this.initialLocation();
    }
};
/**
 * Set the location and speed of the enemies once they cross the screen.
 */
Enemy.prototype.initialLocation = function () {
    // Respawn enemy position & set speed
    this.x = brain.enemyXcoordinates();
    this.y = brain.enemyYcoordinates();
    this.speed = this.handleSpeed();
}
/**
 * Handle the player's collisions with an enemy.
 */
Enemy.prototype.checkCollisions = function () {
    if (this.x + this.width > player.x && this.x - this.width < player.x &&
        this.y + this.height > player.y && this.y - this.height < player.y) {
        // The player died, hide him off screen till respawn.
        player.x = 1000;
        player.y = 1000;
        // Respawn player.
        setTimeout(() => {
            player.initialLocation();
        }, 500);
    }
}
/**
 * Handle the speed of the enemies.
 */
Enemy.prototype.handleSpeed = function () {
    let speed = Math.floor((Math.random() * 150) + 100); //Return a random number between 100 and 150.
    console.log(speed);
    return speed;
}


/**
 * This class handles the input, positioning, and updating of the player.
 * @param {*} x The x coordinates of the player.
 * @param {*} y The y coordinates of the player.
 * @param {*} charachter The sprite used for the player.
 */
function Player(x, y, charachter) {
    Charachter.call(this, x, y, charachter);
    this.died = false;
}
Player.prototype = Object.create(Charachter.prototype);
Player.prototype.constructor = Player;

/**
 * Update the players location.
 */
let firstTime = true; //Show the modal only once if the player steps through the finish line.
Player.prototype.update = function () {
    if (this.y < 45) {
        //Open the results module.
        const modal = document.querySelector('.modal');
        if (firstTime) {
            popup = document.getElementsByClassName('popup');
            popup[0].style.display = 'block';
            firstTime = false;
        }
    }
}
/**
 * Set the player to his initial location.
 */
Player.prototype.initialLocation = function () {
    this.x = 200;
    this.y = 380;
}
/**
 * A function that handles the player's movement 
 * @param {*} keyCode The key the user pressed.
 */
Player.prototype.handleInput = function (keyCode) {
    switch (keyCode) {
        case 'up':
            this.y < 0 ? this.y = this.y : this.y -= 82;
            break;
        case 'down':
            this.y > 300 ? this.y = this.y : this.y += 82;
            break;
        case 'left':
            this.x < 0 ? this.x = this.x : this.x -= 102;
            break;
        case 'right':
            this.x > 380 ? this.x = this.x : this.x += 102;
            break;
    }
}

/**
 * MotherBrain handles the creating and positioning of the enemies.
 */
function MotherBrain() {
    // The y coordinates where the bugs can appear.
    this.yCoordinates = [45, 130, 215, 300];
    // Function to return the enemy's x coordinates.
    this.enemyXcoordinates = () => -(Math.floor((Math.random() * 500) + 100)); //Return a random number between -100 and -500.;
    // Get a random item from the yCoordinates array and return it. (Source from: https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array)
    this.enemyYcoordinates = () => this.yCoordinates[Math.floor(Math.random() * this.yCoordinates.length)];
}

/**
 * Spawn new bugs.
 * @param {*} totalEnemies The number of bugs that will spawn.
 */
MotherBrain.prototype.spawnBugs = function (totalEnemies) {
    // Create all the enemies.
    for (let i = 0; i < totalEnemies; i++) {
        let enemy = new Enemy(this.enemyXcoordinates(), this.enemyYcoordinates(), 'images/enemy-bug.png');
        allEnemies.push(enemy);
    }
}


// Place all enemy objects in an array called allEnemies.
// Place the player object in a variable called player.
let player = new Player(200, 380, 'images/char-horn-girl.png');
let brain = new MotherBrain();
let allEnemies = [];
/**
 * Spawn bugs once game starts.
 */
(function startGame() {
    brain.spawnBugs(8);
})();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Play again button.
const playAgain = document.getElementsByClassName('playAgain');
playAgain[0].addEventListener('click', function (e) {
    popup = document.getElementsByClassName('popup');

    // Reinitialise the player's location.
    player.initialLocation();
    // Hide the modal.
    popup[0].style.display = 'none';
    // Reset the firstTime flag.
    firstTime = true;
    e.preventDefault();
});

/*
//Testing the modal
const test = document.getElementById('test');
test.addEventListener('click', function(){
    popup=document.getElementsByClassName('popup');
    popup[0].style.display='block';
});
*/