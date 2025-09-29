const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext('2d')
canvas.width = 1480
canvas.height = 840

const player = {
    width: 400,
    height: 400,
    x: canvas.width * 0.1,
    y: canvas.height * 0.5,
    frameX: 0,
    frameY: 0,
    maxFrameX: 7,
    sprite: document.querySelector("#playerSprite"),
    draw() {
        ctx.drawImage(player.sprite, player.width * player.frameX, 0, player.width, player.height, player.x, player.y, player.width, player.height)
        if (this.frameX < this.maxFrameX) {
            this.frameX++
        } else {
            this.frameX = 0
        }
    }
} 

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    player.draw()
    requestAnimationFrame(animate)
}
animate()