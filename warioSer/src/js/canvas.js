import platform from '../../platform.png'
import platformSmallTall from '../../platformSmallTall.png'
import background from '../../background.png'
import hills from '../../hills.png'
import spriteStandRight from '../../spriteStandRight.png'
import spriteStandLeft from '../../spriteStandLeft.png'
import spriteRunRight from '../../spriteRunRight.png'
import spriteRunLeft from '../../spriteRunLeft.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.5

class Player {
  constructor() {
    this.speed = 10
    this.position = {
      x: 100,
      y: 100
    }
    this.velocity = {
      x: 0,
      y: 1
    }
    this.width = 66
    this.height = 150

    this.image = createImage(spriteStandRight)
    this.frames = 0

    this.sprites = {
      stand: {
        right: this.image,
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875
      }
    }

    this.currentSprite = this.sprites.run.right
    this.currentCropWidth = this.sprites.run.cropWidth
    this.width = this.sprites.run.width
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update() {
    this.frames++
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprites.stand.right ||
        this.currentSprite === this.sprites.stand.left)
    ) {
      this.frames = 0
    } else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprites.run.right ||
        this.currentSprite === this.sprites.run.left)
    ) {
      this.frames = 0
    }

    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = { x, y }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = { x, y }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

const platformImage = createImage(platform)
const platformSmallTallImage = createImage(platformSmallTall)

const mouse = { x: 0, y: 0 }
addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect()
  mouse.x = event.clientX - rect.left
  mouse.y = event.clientY - rect.top
})

let player
let platforms
let genericObjects
let scrollOffset
let winThreshold

function init() {
  player = new Player()

  platforms = [
    new Platform({
      x: platformImage.width * 4 + 600 - 2 - platformSmallTallImage.width,
      y: 270,
      image: platformSmallTallImage
    }),
    new Platform({
      x: platformImage.width * 9 + 1400 - 2 - platformSmallTallImage.width,
      y: 270,
      image: platformSmallTallImage
    }),
    new Platform({ x: -1, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width * 2 + 100, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width * 3 + 300 - 2, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width * 4 + 600 - 2, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width * 5 + 700 - 2, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width * 6 + 900 - 2, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width * 7 + 900 - 2, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width * 8 + 1200 - 2, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width * 9 + 1400 - 2, y: 470, image: platformImage }),
    new Platform({ x: platformImage.width * 10 + 1500 - 2, y: 470, image: platformImage })
  ]

  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: createImage(background) }),
    new GenericObject({ x: -1, y: -1, image: createImage(hills) })
  ]

  scrollOffset = 0
  winThreshold = platforms[platforms.length - 1].position.x - 400
}

function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  genericObjects.forEach(genericObject => {
    genericObject.draw()
  })

  platforms.forEach(platform => {
    platform.draw()
  })

  player.update()

  const deadZone = 20
  const playerCenterX = player.position.x + player.width / 2
  let direction
  if (Math.abs(mouse.x - playerCenterX) < deadZone) {
    direction = 'stop'
  } else if (mouse.x > playerCenterX) {
    direction = 'right'
  } else {
    direction = 'left'
  }

  if (direction === 'right') {
    if (player.currentSprite !== player.sprites.run.right) {
      player.currentSprite = player.sprites.run.right
      player.currentCropWidth = player.sprites.run.cropWidth
      player.width = player.sprites.run.width
    }
  } else if (direction === 'left') {
    if (player.currentSprite !== player.sprites.run.left) {
      player.currentSprite = player.sprites.run.left
      player.currentCropWidth = player.sprites.run.cropWidth
      player.width = player.sprites.run.width
    }
  } else {
    const facingRight =
      player.currentSprite === player.sprites.run.right ||
      player.currentSprite === player.sprites.stand.right
    if (facingRight && player.currentSprite !== player.sprites.stand.right) {
      player.currentSprite = player.sprites.stand.right
      player.currentCropWidth = player.sprites.stand.cropWidth
      player.width = player.sprites.stand.width
    } else if (!facingRight && player.currentSprite !== player.sprites.stand.left) {
      player.currentSprite = player.sprites.stand.left
      player.currentCropWidth = player.sprites.stand.cropWidth
      player.width = player.sprites.stand.width
    }
  }

  if (direction === 'right' && player.position.x < 400) {
    player.velocity.x = player.speed
  } else if (
    direction === 'left' &&
    (player.position.x > 100 || (scrollOffset === 0 && player.position.x > 0))
  ) {
    player.velocity.x = -player.speed
  } else {
    player.velocity.x = 0

    if (direction === 'right') {
      scrollOffset += player.speed
      platforms.forEach(platform => {
        platform.position.x -= player.speed
      })
      genericObjects.forEach(genericObject => {
        genericObject.position.x -= player.speed * 0.66
      })
    } else if (direction === 'left' && scrollOffset > 0) {
      scrollOffset -= player.speed
      platforms.forEach(platform => {
        platform.position.x += player.speed
      })
      genericObjects.forEach(genericObject => {
        genericObject.position.x += player.speed * 0.66
      })
    }
  }

  platforms.forEach(platform => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >= platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0
    }
  })

  if (scrollOffset > winThreshold) {
    console.log('you win')
  }

  if (player.position.y > canvas.height) {
    init()
  }
}

init()
animate()

addEventListener('keydown', ({ keyCode }) => {
  if (keyCode === 32) {
    player.velocity.y -= 20
  }
})