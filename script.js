const canvas = document.querySelector("#canvas")
const game = document.querySelector("#game")
const menu = document.querySelector("#menu")
const menuButton = document.querySelector("#menuButton")
const levels = document.querySelector("#levels")
const level1 = document.querySelector("#fase1")
const level2 = document.querySelector("#fase2")
const level3 = document.querySelector("#fase3")
const creditsButton = document.querySelector("#creditsButton")
const credits = document.querySelector("#credits")
const facts = document.querySelector("#facts")
const finalPoints = document.querySelector("#finalPoints")
const perfect = document.querySelector("#perfectText")
const ctx = canvas.getContext('2d')
const play = document.querySelector("#play")
const factText = document.querySelector("#factText")
const factImg = document.querySelector("#factImg")
const background = document.querySelector("#background")
const enemies = []
let level = 0
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

creditsButton.addEventListener("click", () => {
    menu.classList.add("hidden")
    credits.classList.remove("hidden")
    menuButton.classList.remove("hidden")
})

play.addEventListener("click", () => {
    menu.classList.add("hidden")
    levels.classList.remove("hidden")
    menuButton.classList.remove("hidden")
})

level1.addEventListener('click', () => {
    levels.classList.add("hidden")
    game.classList.remove("hidden")
    maxEnemies = 2
    background.classList.add("opacity-45")
    level = 1
    setTimeout(() => {
        enemySpawner(3)
    }, 2000);
})

level2.addEventListener('click', () => {
    levels.classList.add("hidden")
    game.classList.remove("hidden")
    maxEnemies = 20
    background.classList.add("opacity-45")
    level = 2
    setTimeout(() => {
        enemySpawner(2)
    }, 1500);
})

level3.addEventListener('click', () => {
    levels.classList.add("hidden")
    game.classList.remove("hidden")
    maxEnemies = 25
    background.classList.add("opacity-45")
    level = 3
    setTimeout(() => {
        enemySpawner(1)
    }, 1000);
})

menuButton.addEventListener("click", () => {
    enemies.splice(0)
    credits.classList.add("hidden")
    game.classList.add("hidden")
    levels.classList.add("hidden")
    menuButton.classList.add("hidden")
    menu.classList.remove("hidden")
    facts.classList.add("hidden")
    player.points = 0
    defeatedEnemies = 0
    spawnedEnemies = 0
    player.hearts = ["good", "good", "good"]
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
        this.width = 600,
            this.height = 400,
            this.x = (canvas.width / 2) - (this.width / 2),
            this.y = (canvas.height * 0.95) - this.height
        this.frameX = 0,
            this.frameY = 0,
            this.maxFrameX = 7,
            this.fps = 4,
            this.frameInterval = 1000 / 4,
            this.frameTimer = 0,
            this.idle = true
        this.sprite = document.querySelector("#playerSprite")
        this.hearts = ["good", "good", "good"]
        this.heartWidth = 100
        this.heartHeight = 100
        this.goodHeart = document.querySelector("#heart")
        this.rottenHeart = document.querySelector("#rottenHeart")
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
            this.idle = true
        }, 500);
        this.frameX = 0
        this.frameY = 2
        this.maxFrameX = 1
    }
    hurt() {
        this.idle = false
        setTimeout(() => {
            this.frameX = 0
            this.frameY = 0
            this.maxFrameX = 7
            this.idle = true
        }, 250);
        this.frameX = 0
        this.frameY = 3
        this.maxFrameX = 0
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
                spawnedEnemies = 0
                defeatedEnemies = 0
                this.hearts = ["good", "good", "good"]
                this.alive = true
                gameoverTimeout = true
                game.classList.add("hidden")
                facts.classList.remove("hidden")
                finalPoints.textContent = `Pontuação Final: ${this.points} pontos.`
                if (this.points === 25 * maxEnemies) perfect.classList.remove("hidden")
                enemies.splice(0)
                enemySpawner(0)
                switch (level) {
                    case 1:
                        factText.textContent = "A superfície de nosso planeta é cerca de 70% água, enquanto o resto é composto por terra. Pode parecer muito, porém somente uma pequena parcela dessa água, aproximadamente 2,5%, é água doce potável. E não é só: desses 2,5%, a maior parte, 69%, está nas geleiras (que dificulta seu acesso), 30% são águas subterrâneas e 1% se encontra em rios."
                        factImg.src = "assets/agua.webp"
                        factImg.alt = "água"
                        break

                    case 2:
                        factText.textContent = "Você sabia que a água é essencial para a vida? Em média, 70% do corpo de um ser humano adulto é composto de água, podendo ser um número ainda maior dependendo de quão jovem é./n Além disso, a água é basicamente a razão da vida poder existir em nosso planeta. Os primeiros seres vivos surgiram em nossos grandes oceanos, e levou muito tempo para chegarem a pisar fora da água. Um outro fato é que, para procurar vida extraterreste, uma das grandes pistas que pesquisadores usam é a existência de água no planeta. Imagem: sopa primordial."
                        factImg.src = "assets/sopa.webp"
                        factImg.alt = "sopa primordial"
                        break

                    case 3:
                        factText.textContent = "O maior aquífero do mundo, isso é, o maior armazém de água subterrâneo do mundo, está localizado bem aqui, na América do Sul, e seu nome é Grande Amazônia. Seu volume de água é aproximadamente 162.000km³, e possui extensão de cerca de 1.3 milhões de km². De acordo com pesquisadores da UFPA, o aquífero abasteceria o mundo inteiro por 250 anos, considerando que cada indivíduo consuma uma média de 150 litros de água por dia e possui uma expectativa de vida de 60 anos. Segue um mapa que compara o aquífero Grande Amazônia com outro grande aquífero, chamado Guarani."
                        factImg.src = "assets/grandeamazonia.webp"
                        factImg.alt = "grande amazonia aquifero"
                }
            }, 2000);
        }
        if (this.hearts.includes("good") === false && gameoverTimeout === true) {
            gameoverTimeout = false
            this.alive = false
            canvas.classList.add("opacity-65")
            setTimeout(() => {
                maxEnemies = 0
                spawnedEnemies = 0
                defeatedEnemies = 0
                player.points = 0
                this.hearts = ["good", "good", "good"]
                this.alive = true
                gameoverTimeout = true
                game.classList.add("hidden")
                menuButton.classList.add("hidden")
                menu.classList.remove('hidden')
                background.classList.remove("opacity-45")
                canvas.classList.remove("opacity-65")
                enemies.splice(0)
                enemySpawner(0)
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
        if (this.hearts.includes("good") === false) {
            ctx.fillStyle = "crimson"
            ctx.font = "35px grover"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText("Derrota. . .", canvas.width / 2, canvas.height / 3)
        }
        ctx.font = "20px fira"
        ctx.textAlign = "left"
        ctx.textBaseline = "top"

        this.hearts.forEach((heart, index) => {
            if (this.hearts[index] === "good") {
                ctx.drawImage(player.goodHeart, 0, 0, player.heartWidth, player.heartHeight, (((canvas.width / 2) - 175) + (player.heartWidth + 20) * index), 5, player.heartWidth, player.heartHeight)
            } else {
                ctx.drawImage(player.rottenHeart, 0, 0, player.heartWidth, player.heartHeight, (((canvas.width / 2) - 175) + (player.heartWidth + 20) * index), 5, player.heartWidth, player.heartHeight)
            }
        });

        ctx.drawImage(player.sprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height)
        ctx.fillStyle = "gold"
        ctx.fillText(this.pointDisplay, 75, 5)
    }
}

class Enemy {
    constructor() {
        this.colors = ["black", "darkblue", "mediumblue", "steelblue", "rebeccapurple", "darkmagenta", "darkorchid", "darkslateblue", "hotpink", "indigo", "midnightblue", "navy", "red", "purple", "gray", "rosybrown", "fuchsia", "deeppink", ""]
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
        this.sWidth = 400
        this.sHeight = 400
        this.pos = this.position()
        this.array = this.randomArray()
        this.fps = 4
        this.frameX = 0
        this.frameY = 0
        this.maxFrameX = 2
        this.frameInterval = 1000 / 4,
        this.frameTimer = 0

        if (this.pos === "left") {
            this.dWidth = 125 * (1 + (((Math.random() * 5) + 1) / 10))
            this.sprite = document.querySelector("#reverseEnemySprites")
            this.dHeight = this.dWidth
            this.y = (canvas.height * 0.95) - this.dHeight
            this.x = 0 - this.dWidth
            this.speed = 1.15
            this.arrows = this.convertArrows()
            this.textY = this.y - (this.dHeight * 0.725)
        } else {
            this.x = canvas.width
            this.sprite = document.querySelector("#enemySprites")
            this.dHeight = 22 * this.array.length
            this.y = (canvas.height * 0.95) - this.dHeight
            this.dWidth = 22 * this.array.length
            if (this.dHeight <= 88) {
                this.textY = this.y - (this.dHeight * 3.6)
            } else {
                this.textY = this.y - (this.dHeight * 1.2)
            }
            if (this.array.join("") === "eco") {
                this.textY = this.y - (this.dHeight * 2.2)
            }
            this.speed = 1.4 - (this.array.length / 10)
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
        return (arrows)
    }
    update(deltaTime) {
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frameX < this.maxFrameX) this.frameX++
            else this.frameX = 0
        } else {
            this.frameTimer += deltaTime
        }

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
                if (this.pos === "left") {
                    player.attackLeft()
                } else {
                    player.attackRight()
                }
            }
            if ((enemy.pos === "left" && enemy.x > (canvas.width / 2) - (player.width / 2)) ||
                (enemy.pos === "right" && enemy.x < (canvas.width / 2) + (player.width / 4))) {
                switch (true) {
                    case (player.hearts[0] === "good" && player.hearts[1] === "good"):
                        player.hearts[0] = "rotten"
                        break

                    case (player.hearts[0] === "rotten" && player.hearts[1] === "good"):
                        player.hearts[1] = "rotten"
                        break

                    case (player.hearts[1] === "rotten" && player.hearts[2] === "good"):
                        player.hearts[2] = "rotten"
                        break
                }
                enemies.splice(index, 1)
                defeatedEnemies++
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
            ctx.fillText(this.arrows, this.x + (this.dWidth / 2), this.textY)
        } else {
            ctx.font = "40px grover"
            ctx.fillText(this.word, this.x + (this.dWidth / 2), this.textY)
        }
        ctx.drawImage(this.sprite, this.frameX * this.sWidth, this.frameY * this.sHeight, this.sWidth, this.sHeight, this.x, this.y, this.dWidth, this.dHeight)
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