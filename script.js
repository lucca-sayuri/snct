const canvas = document.querySelector("#canvas")
const game = document.querySelector("#game")
const menu = document.querySelector("#menu")
const menuButton = document.querySelector("#menuButton")
const ctx = canvas.getContext('2d')
const play = document.querySelector("#play")
const enemies = []
let spawnInterval = 100
let defeatedEnemies = 0
let spawnedEnemies = 0
const maxEnemies = 25
canvas.width = 1480
canvas.height = 720

play.addEventListener("click", () => {
    game.classList.remove("hidden")
    menu.classList.add("hidden")
    setTimeout(() => {
        const enemyInterval = setInterval(spawnEnemy, spawnInterval)
    }, 2000);
})
menuButton.addEventListener("click", () => {
    clearInterval(enemyInterval)
    enemies.splice(0)
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
            console.log(this.keys)
            this.keys.splice(this.keys.indexOf(e.key), 1)
        })
    }
}

const input = new InputHandler

class Player {
    constructor() {
        this.width = 400,
            this.height = 400,
            this.x = (canvas.width / 2) - (this.width / 2),
            this.y = (canvas.height * 0.95) - this.height
        this.frameX = 0,
            this.frameY = 0,
            this.maxFrameX = 7,
            this.fps = 4,
            this.frameInterval = 1000 / 4,
            this.frameTimer = 0,
            this.idle = true,
            this.sprite = document.querySelector("#playerSprite")
        this.hearts = 3
    }
    attackRight() {
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
    attackLeft() {
        this.idle = false
        setTimeout(() => {
            this.frameX = 0
            this.frameY = 0
            this.maxFrameX = 7
        }, 500);
        this.frameX = 0
        this.frameY = 2
        this.maxFrameX = 1
    }
    hurt() {
        this.hearts--
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
    constructor() {
        this.pos = this.position()
        this.array = this.randomArray()
        this.width = 150
        this.height = 150
        this.fps = 4

        if (this.pos === "left") {
            this.x = 0 - this.width
            this.speed = 1
        } else {
            this.x = canvas.width
            this.speed = 1.1 - (this.array.length / 10)
        }

        this.y = (canvas.height * 0.95) - this.height
    }

    position() {
        let randomPos = Math.floor(Math.random() * 2)
        if (randomPos === 0) {
            return ("left")
        } else {
            return ("right")
        }
    }

    randomArray() {
        if (this.pos === "left") {
            const arrowArray = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]
            const arrows = []
            let rNumberArrow = 0
            for (const arrow of arrowArray) {
                rNumberArrow = Math.floor(Math.random() * arrowArray.length)
                arrows.push(arrowArray[rNumberArrow])
            }
            return (arrows)
        } else {
            const words = ["planta", "folha", "reciclar", "reusar", "repensar", "arvore", "flor", "reduzir", "repassar", "conservar", "ambiente", "eco", "energia", "mudança"]
            let rNumberWord = Math.floor(Math.random() * words.length)
            let word = words[rNumberWord]
            let wordArray = word.split("")
            return (wordArray)
        }
    }
    update(deltaTime) {
        if (input.keys.includes(this.array[0]) === true) {
            this.array.splice(0, 1)
            console.log(this.array)
        }
        enemies.forEach((enemy, index) => {
            if (enemy.array.length === 0) {
                defeatedEnemies++
                enemies.splice(index, 1)
                player.attackRight()
            }
            if ((enemy.pos === "left" && enemy.x > (canvas.width / 2) - (player.width / 2)) ||
                (enemy.pos === "right" && enemy.x < (canvas.width / 2) + (player.width / 4))) {
                enemies.splice(index, 1)
                player.hurt()
            }
        });

        if (this.pos === "left") {
            this.x += this.speed
        } else {
            this.x -= this.speed
        }
    }
    draw() {
        ctx.fillStyle = "red"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let lastTime = 0

const player = new Player

function spawnEnemy() {
    const enemy = new Enemy
    if (spawnedEnemies < maxEnemies) {
        spawnedEnemies++
        enemies.push(enemy)
        console.log(enemy.array)
    }
}

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