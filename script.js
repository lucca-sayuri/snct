const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext('2d')
canvas.width = 1480
canvas.height = 840

window.addEventListener('keydown', e => {
    if (e.key === enemy.array[0]) {
        enemy.array.splice(0, 1)
        console.log(enemy.array)
        player.attack()
    }
}) 

const player = {
    width: 400,
    height: 400,
    x: canvas.width * 0.1,
    y: canvas.height * 0.5,
    frameX: 0,
    frameY: 0,
    maxFrameX: 7,
    fps: 4,
    frameInterval: 1000 / 4,
    frameTimer: 0,
    sprite: document.querySelector("#playerSprite"),
    attack() {
        this.frameX = 0
        this.frameY = 1
        this.maxFrameX = 1
        
    },
    update(deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frameX < this.maxFrameX) this.frameX++
            else this.frameX = 0
        } else {
            this.frameTimer += deltaTime
        }
    },
    draw() {
        ctx.drawImage(player.sprite, player.width * player.frameX, 0, player.width, player.height, player.x, player.y, player.width, player.height)
    }
}

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
        this.fps = 4
        this.x = canvas.width - this.width
        this.y = canvas.height * 0.5
        this.image = document.querySelector("#placeholder")
    }
    update(deltaTime) {
        this.x--
    }
    draw() {
        ctx.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
    }
}

let lastTime = 0
const enemy = new Enemy

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update(deltaTime)
    player.draw()
    enemy.draw()
    enemy.update(deltaTime)
    requestAnimationFrame(animate)
}
console.log(enemy.array)
animate(0)