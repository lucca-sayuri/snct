const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext('2d')
canvas.width = 1480
canvas.height = 840

const player = {
    width: 400,
    height: 400,
    x: canvas.width * 0.1,
    y: canvas.height - 400,
    frameX: 0,
    frameY: 0,
    maxFrameX: 7,
    sprite: document.querySelector("#playerSprite"),
    draw() {
        ctx.drawImage(player.sprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height)
        if (this.frameX < this.maxFrameX) {
            this.frameX++
        } else {
            this.frameX = 0
        }
    }
} 

//enemy class
class Enemy {
    randomWord() {
        const words = ["planta", "folha", "reciclar", "reusar", "repensar", "árvore", "flor", "sustentável", "reduzir", "repassar", "conservar", "ambiente", "eco", "energia", "mudança"]
        let rNumber = Math.floor(Math.random() * words.length)
        return(words[rNumber])
    }
    constructor() {
        this.word = this.randomWord()
        this.array = this.word.split("")
        this.width = 350
        this.height = 350
        this.x = canvas.width
        this.y = canvas.height - 350
        this.image = document.querySelector("#placeholder")
    }
    update() {
        this.x--
    }
    draw() {
        ctx.fillStyle = "red"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const enemy = new Enemy

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    enemy.draw()
    enemy.update()
    requestAnimationFrame(animate)
}
animate()