const canvas = document.querySelector('canvas')

console.log(canvas)

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.width = 30
        this.height = 30
    }


    draw() {
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player()
player.draw()