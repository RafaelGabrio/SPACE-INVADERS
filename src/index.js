import Grid from "./classes/Grid.js";
import Invader from "./classes/Invader.js";
import Obstacle from "./classes/Obstacle.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/Player.js";
import Projectile from "./classes/Projectile.js";
import { GameState } from "./utils/constants.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentState = GameState.PLAYING;

ctx.imageSmoothingEnabled = false;

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6);

const playerProjectiles = [];
const invaderProjectiles = [];
const particles = [];
const obstacles = [];

const initObstacles = () => {
    const x = canvas.width / 2 - 50;
    const y = canvas.height - 250;
    const offSet = canvas.width * 0.15;
    const color = "crimson";

    const obstacle1 = new Obstacle({x: x - offSet, y}, 100, 20, color);
    const obstacle2 = new Obstacle({x: x + offSet, y}, 100, 20, color);

    obstacles.push(obstacle1);
    obstacles.push(obstacle2);
}

initObstacles();


const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true,
    }
};

const drawObstacles = () => {
    obstacles.forEach((obstacle) => obstacle.draw(ctx));
}

const drawProjectiles = () => {
    const projectTiles = [...playerProjectiles, ...invaderProjectiles];

    projectTiles.forEach((projectile) => {
        projectile.draw(ctx);
        projectile.update();
    });
}

const clearProjectiles = () => {
    playerProjectiles.forEach((projectile, index) => {
        if (projectile.position.y <= 0) {
            playerProjectiles.splice(index, 1);
        }
    });
}

const clearParticles = () => {
    particles.forEach((particle, i) => {
        if (particle.opacity <= 0) {
            particles.splice(i, 1);
        }
    });
}

/**
 * 
 * @param {object} position 
 * @param {number} position.x
 * @param {number} position.y
 * @param {number} size 
 * @param {string} color 
 */
const createExplosion = (position, size, color) => {
    for (let index = 0; index < size; index++) {
        const particle = new Particle(
            { 
                x: position.x, 
                y: position.y 
            },
            { 
                x: Math.random() - 0.5 * 1.5, 
                y: Math.random() - 0.5 * 1.5
            }, 
            2, 
            color
        );
        particles.push(particle);
    }
}

const drawParticles = () => {
    particles.forEach((particle) => {
        particle.draw(ctx);
        particle.update();
    })
}

const checkShootInvaders = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if (invader.hit(projectile)) {
                createExplosion(
                    {
                        x: invader.position.x + invader.width / 2,
                        y: invader.position.y + invader.height / 2
                    },
                    10,
                    "#941CFF"
                );
                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);
            }
        });
    });
}

const checkShootPlayer = () => {
    invaderProjectiles.some((projectile, i) => {
        if (player.hit(projectile)) {
            invaderProjectiles.splice(i ,1);
            gameOver();
        }
    }); 
}

const checkShootObstacles = () => {
    obstacles.forEach((obstacle) => {
        playerProjectiles.some((projectile, i) => {
            if (obstacle.hit(projectile)) {
                playerProjectiles.splice(i ,1);
            }
        });

        invaderProjectiles.some((projectile, i) => {
            if (obstacle.hit(projectile)) {
                invaderProjectiles.splice(i ,1);
            }
        });
    });
}

const spawnGrid = () => {
    if (grid.invaders.length === 0) {
        grid.rows = Math.round(Math.random() * 9 + 1);
        grid.cols = Math.round(Math.random() * 9 + 1);
        grid.restart();
    }
}

const gameOver = () => {
    createExplosion(
        {
            x: player.position.x + player.width / 2, y: player.position.y + player.height / 2
        }, 
        10, 
        "white"
    );
    createExplosion(
        {
            x: player.position.x + player.width / 2, y: player.position.y + player.height / 2
        }, 
        10, 
        "#4D9BE6"
    );
    createExplosion(
        {
            x: player.position.x + player.width / 2, y: player.position.y + player.height / 2
        }, 
        10, 
        "crimson"
    );

    currentState = GameState.GAME_OVER;
    player.alive = false;
}


const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentState == GameState.PLAYING) {
        spawnGrid();
    
        drawProjectiles();
        drawParticles();
        drawObstacles();

        clearProjectiles();
        clearParticles();
    
        checkShootPlayer();
        checkShootInvaders();
        checkShootObstacles();
    
        grid.draw(ctx);
        grid.update(player.alive);
        
        ctx.save();
    
        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        )
    
        if (keys.shoot.pressed && keys.shoot.released) {
            player.shoot(playerProjectiles); 
            keys.shoot.released = false;
            console.log(playerProjectiles);
        }
    
        if (keys.left && player.position.x >= 0) {
            player.moveLeft();
            ctx.rotate(-0.15);
        }
    
        if (keys.right && (player.position.x <= canvas.width - player.width)) {
            player.moveRight();
            ctx.rotate(0.15);
        }
    
        ctx.translate(
            - player.position.x - player.width / 2,
            - player.position.y - player.height / 2
        )
    
        player.draw(ctx);
    
        ctx.restore();
    }

    if (currentState == GameState.GAME_OVER) {
        checkShootObstacles();

        drawParticles();
        drawProjectiles();
        drawObstacles();

        clearProjectiles();
        clearParticles();

        grid.draw(ctx);
        grid.update(player.alive);
    }

    window.requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
    const key = event.key.toLocaleLowerCase();

    if ( key === "a" ) keys.left = true;
    if ( key === "d" ) keys.right = true;
    if ( key === "enter" ) keys.shoot.pressed = true;
});

window.addEventListener("keyup", (event) => {
    const key = event.key.toLocaleLowerCase();

    if ( key === "a" ) keys.left = false;
    if ( key === "d" ) keys.right = false;
    if ( key === "enter" ) {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

setInterval(() => {
    const invader = grid.getRandomInvander();

    if (invader) {
        invader.shoot(invaderProjectiles);
    }
}, 1000);

gameLoop();