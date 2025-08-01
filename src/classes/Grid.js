import Invader from "./Invader.js";

class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        this.direction = "right";
        this.moveDown = false;

        this.invadersVelocity = 1;
        this.invaders = this.init();
    }

    init() {
        const array = [];

        for (let row = 0; row < this.rows; row += 1) {
            
            for (let col = 0; col < this.cols; col += 1) {
                const invader = new Invader(
                    this.invadersVelocity,
                    {
                        x: col * 50 + 20,
                        y: row * 37 + 20,
                    }
                );

                array.push(invader);
            }

        }

        return array;
    }

    draw(ctx) {
        this.invaders.forEach(invader => invader.draw(ctx));
    }

    update() {
        if (this.reachedRightBoundary()) {
            this.direction = "left";
            this.moveDown = true;
        } else if (this.reachedLeftBoundary()) {
            this.direction = "right";
            this.moveDown = true;
        }

        this.invaders.forEach(invader => {
            if (this.moveDown) {
                invader.moveDown();
                invader.incrementVelocity(0.1);
                this.invadersVelocity = invader.velocity;
            }

            if (this.direction === "right") invader.moveRight();
            if (this.direction === "left") invader.moveLeft();    
            
        });

        this.moveDown = false;
    }

    reachedRightBoundary() {
        return this.invaders.some(
            (invader) => invader.position.x + invader.width >= window.innerWidth
        );
    }

    reachedLeftBoundary() {
        return this.invaders.some(
            (invader) => invader.position.x <= 0
        );
    }

    getRandomInvander() {
        const index = Math.floor(Math.random() * this.invaders.length);
        return this.invaders[index];
    }
}

export default Grid;