const canvas = document.querySelector("#canvas")
canvas.width = 1480
canvas.height = 840

export class Enemy {
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
        this.x = canvas.width - this.width
        this.y = canvas.height * 0.5
        this.image = document.querySelector("#placeholder")
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height)
    }
}
