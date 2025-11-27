class Obstacle {
    /**
     * 
     * @param {object} position
     * @param {number} position.x
     * @param {number} position.y 
     * @param {number} width 
     * @param {number} height 
     * @param {string} color 
     */
    constructor(position, width, height, color) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    hit(projectTile) {
        const projectilePositionY = projectTile.velocity < 0 
            ? projectTile.position.y : projectTile.position.y + projectTile.height;
        return (
            projectTile.position.x >= this.position.x &&
            projectTile.position.x <= this.position.x + this.width &&
            projectilePositionY >= this.position.y &&
            projectilePositionY <= this.position.y + this.height
        );
    }
}

export default Obstacle;