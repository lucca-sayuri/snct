const canvas = document.querySelector("#canvas")
const game = document.querySelector("#game")
const menu = document.querySelector("#menu")
const menuButton = document.querySelector("#menuButton")
const ctx = canvas.getContext('2d')
const play = document.querySelector("#play")
const enemies = []
const defeatedEnemies = 0
const spawnedEnemies = 0
const maxEnemies = 10
canvas.width = 1480
canvas.height = 840

play.addEventListener("click", () => {
    game.classList.remove("hidden")
    menu.classList.add("hidden")
})
menuButton.addEventListener("click", () => {
    game.classList.add("hidden")
    menu.classList.remove("hidden")
})

class InputHandler {
    constructor() {
        this.keys = []
        document.addEventListener('keydown', e => {
            if (this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key)
            }
        })
        document.addEventListener('keyup', e => {
            keys.splice(this.keys.indexOf(e.key), 1)
            console.log(this.keys)
        })
    }
}

const input = new InputHandler

class Player {
    constructor() {
        this.width = 400,
        this.height = 400,
        this.x = canvas.width * 0.1,
        this.y = canvas.height * 0.5,
        this.frameX = 0,
        this.frameY = 0,
        this.maxFrameX = 7,
        this.fps = 4,
        this.frameInterval = 1000 / 4,
        this.frameTimer = 0,
        this.idle = true,
        this.sprite = document.querySelector("#playerSprite")
    }
    attack() {
        this.idle = false
        setTimeout(() => {
            this.frameX = 0
            this.frameY = 0
            this.maxFrameX = 7
            this.idle = true
        }, 500)
        this.frameX = 0
        this.frameY = 1
        this.maxFrameX = 1
    }
    update(deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frameX < this.maxFrameX) this.frameX++
            else if (this.idle === true) {
                this.frameX = 0
            }
        } else {
            this.frameTimer += deltaTime
        }
    }
    draw() {
        ctx.drawImage(player.sprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height)
    }
}

class Enemy {
    randomWord() {
        const words = ["planta", "folha", "reciclar", "reusar", "repensar", "árvore", "flor", "reduzir", "repassar", "conservar", "ambiente", "eco", "energia", "mudança"]
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

const player = new Player

function spawnEnemy() {
    const enemy = new Enemy
    enemies.push(enemy)
    console.log(enemy.array)
}

setInterval(spawnEnemy, 4000)

function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.update(deltaTime)
    player.draw()
    for (const enemy of enemies) {
        enemy.draw()
        enemy.update(deltaTime)
    }
    requestAnimationFrame(animate)
}
for (const enemy of enemies) {
    console.log(enemy.array)
}
animate(0)