const canvas = document.querySelector("#canvas")
const game = document.querySelector("#game")
const menu = document.querySelector("#menu")
const menuButton = document.querySelector("#menuButton")
const levels = document.querySelector("#levels")
const level1 = document.querySelector("#fase1")
const level2 = document.querySelector("#fase2")
const level3 = document.querySelector("#fase3")
const ctx = canvas.getContext('2d')
const play = document.querySelector("#play")
const background = document.querySelector("#background")
const enemies = []
let gameoverTimeout = true
const chewy = new FontFace('chewy', 'url(assets/Chewy-Regular.ttf)')
const fira = new FontFace('fira', 'url(assets/FiraCode-SemiBold.ttf')
const grover = new FontFace('grover', 'url(assets/IrishGrover-Regular.ttf')

chewy.load().then(function (font) {
    document.fonts.add(font)
})
fira.load().then(function (font) {
    document.fonts.add(font)
})
grover.load().then(function (font) {
    document.fonts.add(font)
})

let defeatedEnemies = 0
let spawnedEnemies = 0
let maxEnemies = 0
canvas.width = 1480
canvas.height = 720

play.addEventListener("click", () => {
    menu.classList.add("hidden")
    levels.classList.remove("hidden")
    menuButton.classList.remove("hidden")
})

level1.addEventListener('click', () => {
    levels.classList.add("hidden")
    game.classList.remove("hidden")
    maxEnemies = 12
    background.classList.add("opacity-45")
    setTimeout(() => {
        enemySpawner(3)
    }, 5);
})

level2.addEventListener('click', () => {
    levels.classList.add("hidden")
    game.classList.remove("hidden")
    maxEnemies = 20
    background.classList.add("opacity-45")
    setTimeout(() => {
        enemySpawner(2)
    }, 5);
})

level3.addEventListener('click', () => {
    levels.classList.add("hidden")
    game.classList.remove("hidden")
    maxEnemies = 25
    background.classList.add("opacity-45")
    setTimeout(() => {
        enemySpawner(1)
    }, 5);
})

menuButton.addEventListener("click", () => {
    enemies.splice(0)
    game.classList.add("hidden")
    levels.classList.add("hidden")
    menuButton.classList.add("hidden")
    menu.classList.remove("hidden")
    player.points = 0
    defeatedEnemies = 0
    spawnedEnemies = 0
    player.hearts = 3
    background.classList.remove("opacity-45")
    enemySpawner(0)
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
        this.points = 0
        this.pointDisplay = `Pontos: ${this.points}`
        this.alive = true
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
        this.pointDisplay = `Pontos: ${this.points}`
        if (maxEnemies === defeatedEnemies && maxEnemies != 0 && gameoverTimeout === true) {
            gameoverTimeout = false
                setTimeout(() => {
                maxEnemies = 0
                spawnedEnemies = 0 
                defeatedEnemies = 0
                player.points = 0
                this.hearts = 3
                this.alive = true
                gameoverTimeout = true
                game.classList.add("hidden")
                menuButton.classList.add("hidden")
                menu.classList.remove("hidden")
                background.classList.remove("opacity-45")
            }, 2000);
        }
        if (this.hearts === 0) {
            gameoverTimeout = false
            this.alive = false
            canvas.classList.add("opacity-45")
            setTimeout(() => {
                maxEnemies = 0
                spawnedEnemies = 0
                defeatedEnemies = 0
                player.points = 0
                this.alive = true
                this.hearts = 3
                gameoverTimeout = true
                game.classList.add("hidden")
                menuButton.classList.add("hidden")
                menu.classList.remove('hidden')
                background.classList.remove("opacity-45")
                canvas.classList.remove("opacity-65")
            }, 2000);
        }
    }
    draw() {
        if (maxEnemies === defeatedEnemies && maxEnemies != 0) {
                ctx.fillStyle = "yellow"
                ctx.font = "50px grover"
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"
                ctx.fillText("V I T Ó R I A !", canvas.width / 2, canvas.height / 3)
        }
        if (this.hearts === 0) {
            ctx.fillStyle = "crimson"
            ctx.font = "35px grover"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText("Derrota. . .", canvas.width / 2, canvas.height / 3)
        }
        ctx.font = "20px fira"
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.drawImage(player.sprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height)
        ctx.fillStyle = "gold"
        ctx.fillText(this.pointDisplay, 30, 5)
    }
}

class Enemy {
    constructor() {
        this.colors = ["black", "darkblue", "mediumblue", "steelblue", "rebeccapurple", "darkmagenta", "darkorchid", "darkslateblue", "hotpink", "indigo", "midnightblue", "navy", "red", "purple", "gray", "rosybrown", "fuchsia", "deeppink", ""]
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
        this.pos = this.position()
        this.array = this.randomArray()
        this.fps = 4
        if (this.pos === "left") {
            this.width = 125 * (1 + (((Math.random() * 5) + 1) / 10))
            this.height = this.width
            this.y = (canvas.height * 0.95) - this.height
            this.x = 0 - this.width
            this.speed = 1
            this.arrows = this.convertArrows()
            this.textY = this.y - (this.height * 0.725)
        } else {
            this.x = canvas.width
            this.height = 22 * this.array.length
            this.y = (canvas.height * 0.95) - this.height
            this.width = 22 * this.array.length
            if (this.height <= 88) {
                this.textY = this.y - (this.height * 3.6)
            } else {
                this.textY = this.y - (this.height * 1.2)
            }
            if (this.array.join("") === "eco") {
                this.textY = this.y - (this.height * 4.2)
            }
            this.speed = 1.2 - (this.array.length / 10)
            this.word = this.array.join("")
        }

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
            for (let i = 0; i < 4; i++) {
                rNumberArrow = Math.floor(Math.random() * arrowArray.length)
                arrows.push(arrowArray[rNumberArrow])
                arrowArray.splice(rNumberArrow, 1)
            }
            return (arrows)
        } else {
            const words = ["planta", "folha", "bio", "fauna", "flora", "floresta", "mata", "ecologia", "habitat", "bioma", "solo", "atmosfera", "reciclar", "reusar", "repensar", "flor", "reduzir", "repassar", "conservar", "ambiente", "eco", "energia", "mudança"]
            let rNumberWord = Math.floor(Math.random() * words.length)
            let word = words[rNumberWord]
            let wordArray = word.split("")
            return (wordArray)
        }
    }
    convertArrows() {
        let array = []
        let arrows = ""
        this.array.forEach((arrow, index) => {
            switch (true) {
                case (this.array[index] === "ArrowLeft"):
                    array.push("←")
                    break

                case (this.array[index] === "ArrowRight"):
                    array.push("→")
                    break

                case (this.array[index] === "ArrowDown"):
                    array.push("↓")
                    break

                case (this.array[index] === "ArrowUp"):
                    array.push("↑")
                    break
            }
            arrows = array.join(" ")
        });
        return(arrows)
    }
    update(deltaTime) {
        if (this.pos === "left") {
            this.arrows = this.convertArrows()
        } else {
            this.word = this.array.join("")
        }
        if (input.keys.includes(this.array[0]) === true) {
            this.array.splice(0, 1)
        }
        enemies.forEach((enemy, index) => {
            if (enemy.array.length === 0) {
                defeatedEnemies++
                player.points += 25
                enemies.splice(index, 1)
                player.attackRight()
            }
            if ((enemy.pos === "left" && enemy.x > (canvas.width / 2) - (player.width / 2)) ||
                (enemy.pos === "right" && enemy.x < (canvas.width / 2) + (player.width / 4))) {
                enemies.splice(index, 1)
                player.points -= 15
                player.hurt()
            }
        });
        if (this.pos === "left" && player.alive === true) {
            this.x += this.speed
        }
        if (this.pos === "right" && player.alive === true) {
            this.x -= this.speed
        }
        if (player.points < 0) player.points = 0
    }
    draw() {
        ctx.fillStyle = this.color
        ctx.textAlign = "center"
        if (this.pos === "left") {
            ctx.font = "bold 48px fira"
            ctx.fillText(this.arrows, this.x + (this.width / 2), this.textY)
        } else {
            ctx.font = "40px grover"
            ctx.fillText(this.word, this.x + (this.width / 2), this.textY)
        }
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
    }
}

function enemySpawner(diff) {
    const enemySpawn = setInterval(() => {
        spawnEnemy()
    }, 1000 * diff);
    if (diff === 0) {
        clearInterval(enemySpawn)
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
animate(0)