import Grid from "./classes/Grid.js";
import Invader from "./classes/Invader.js";
import Player from "./classes/Player.js";
import Projectile from "./classes/Projectile.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.imageSmoothingEnabled = false;

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6);

const playerProjectiles = [];
const invaderProjectiles = [];


const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true,
    }
};

const drawProjectiles = () => {
    const projectTiles = [...playerProjectiles, ...invaderProjectiles];

    projectTiles.forEach((projectile) => {
        projectile.draw(ctx);
        projectile.update();
    });
}

const clearPorjectiles = () => {
    playerProjectiles.forEach((projectile, index) => {
        if (projectile.position.y <= 0) {
            playerProjectiles.splice(index, 1);
        }
    });
}

const gameLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawProjectiles();
    clearPorjectiles();

    grid.draw(ctx);
    // grid.update();
    
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
}, 1000)

gameLoop();