const canvas = document.querySelector('#canvas1')
const canvas2 = document.querySelector('#canvas2')
const context = canvas.getContext('2d')
const context2 = canvas2.getContext('2d')

const $sprite = document.querySelector('#sprite')
const $bricks = document.querySelector('#bricks')


canvas.width = 448
canvas.height = 400

canvas2.width = 200
canvas2.height = 100

//variables de mi juego
// VAR BALL
const ballRadius = 3;
//ball position
let x = canvas.width / 2
let y = canvas.height - 30
//ball speed
let dx = -2
let dy = -2
//VAR PADDLE
const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = (canvas.height - paddleHeight - 10)

let rightPressed = false
let leftPressed = false
//VAR BRICKS
const bricksRowsCount = 6;
const bricksColumnCount = 13;
const bricksWidth = 32;
const bricksHeight = 16;
const bricksPadding = 0;
const bricksOffsetTop = 80;
const bricksOffsetLeft = 15;

const bricks = [];

const BRICKS_STATUS = {
    ACTIVE: 1,
    DESTROYED: 0
}
/* En cada columna voy a estar multiplicando
cuanto ocupa cada ladrillo + el espacio que tiene que dejar
con el siguiente ladrillo+ mas el margen que hemos dejado al inicio*/
for (let c = 0; c < bricksColumnCount; c++) {
    bricks[c] = [] //Inicio con un array vacío
    for (let r = 0; r < bricksRowsCount; r++) {
        const bricksX = c * (bricksWidth + bricksPadding) +
            bricksOffsetLeft
        const bricksY = r * (bricksHeight + bricksPadding) +
            bricksOffsetTop
        // Asignar color rand a brick
        const random = Math.floor(Math.random() * 8)//Este truco hay que tenerlo en la memoria
        //Guardamos informacion de cada ladrillo
        bricks[c][r] = {
            x: bricksX,
            y: bricksY,
            status: BRICKS_STATUS.ACTIVE,
            color: random
        }
    }

}

//VAR SCORE
let score = 0


const PADDLE_SENSITIVITY = 8

function drawBall() {
    cleanCanvas()
    //indicar que empezamos a dibujar
    context.beginPath()
    context.arc(x, y, ballRadius, 0, Math.PI * 2)
    context.fillStyle = '#fff'
    context.fill()
    //indicar que terminamos de dibujar
    context.closePath()
}
function drawBricks() {
    for (let c = 0; c < bricksColumnCount; c++) {
        for (let r = 0; r < bricksRowsCount; r++) {
            const currentBrick = bricks[c][r]
            if (currentBrick.status == BRICKS_STATUS.DESTROYED)
                continue;



            const clipX = currentBrick.color * 32

            context.drawImage(
                $bricks,
                clipX,
                1,
                32,
                14,
                currentBrick.x,
                currentBrick.y,
                bricksWidth,
                bricksHeight

            )
        }
    }
}

function drawPaddle() {
    context.drawImage(
        $sprite, //imagen
        29,//clipY(cordenadas de recorte) 
        174,//clipX(cordenadas de recorte)
        paddleWidth, // tamaño del recorte
        paddleHeight,// tamaño del recorte
        paddleX, //posición X del dibujo
        paddleY, //posición Y del dibujo
        paddleWidth, //ancho del dibujo
        paddleHeight //alto del dibujo
    )

}
function collisionDetection() {
    for (let c = 0; c < bricksColumnCount; c++) {
        for (let r = 0; r < bricksRowsCount; r++) {
            const currentBrick = bricks[c][r]
            if (currentBrick.status == BRICKS_STATUS.DESTROYED) continue;

            const isBallSameXAsBricks =
                x > currentBrick.x &&
                x < currentBrick.x + bricksWidth

            const isBallSameYAsBricks =
                y > currentBrick.y &&
                y < currentBrick.y + bricksHeight

            if (isBallSameXAsBricks && isBallSameYAsBricks) {
                dy = -dy
                currentBrick.status = BRICKS_STATUS.DESTROYED;
                score++;
                if (score == bricksRowsCount * bricksColumnCount) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                  }
        
                
            }

        }
    }
    
}

function drawScore() {
    context2.font = "22px 'Press Start 2P'"; // Asegúrate de usar comillas para el nombre de la fuente
    context2.fillStyle = "#e74c3c";
    context2.fillText("Score: " + score, 10, 60);
}

 
function ballMovement() {
    //rebotar las pelotas en los laterales
    if (
        x + dx > canvas.width - ballRadius || //pared derecha
        x + dx < ballRadius                  //pared izquierda
    ) {
        dx = -dx
    }
    //rebotar pelota arriba
    if (
        y + dy < ballRadius
    ) {
        dy = -dy
    }

    //la pelota toca la pala
    const isBallSameXAsPaddle =
        x > paddleX &&
        x < paddleX + paddleWidth

    const isBallTouchingPaddle =
        y + dy > paddleY
    if (isBallSameXAsPaddle && isBallTouchingPaddle) {
        dy = -dy //cambiar dirección de la pelota
    }
    //game over, pelota toca el suelo
    else if (
        y + dy > canvas.height - ballRadius
    ) {

        document.location.reload()
    }
    //mover  la pelota
    x += dx
    y += dy
}
function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += PADDLE_SENSITIVITY //SENSITIVITY
    } else if (leftPressed && paddleX > 0) {
        paddleX -= PADDLE_SENSITIVITY //SENSITIVITY
    }
}


function cleanCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context2.clearRect(0, 0, canvas2.width, canvas2.height)
}

function initEvents() {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event) {
        const { key } = event
        if (key == 'Right' || key == 'ArrowRight') {
            rightPressed = true
        } else if (key == 'Left' || key == 'ArrowLeft') {
            leftPressed = true
        }

    }

    function keyUpHandler(event) {
        const { key } = event
        if (key == 'Right' || key == 'ArrowRight') {
            rightPressed = false
        } else if (key == 'Left' || key == 'ArrowLeft') {
            leftPressed = false
        }
    }
}

// BASE PARA CUALQUIER JUEGO (loop infinito, cuando termina programa el siguiente)
function draw() {

    //limpiar canvas
    cleanCanvas()
    //dibujar elementos
    drawBall()
    drawBricks()
    drawPaddle()
    drawScore()
    //colisiones y movimientos
    collisionDetection()
    ballMovement()
    paddleMovement()
 
    //  aqui haré mis dibujos y checks de colisiones
    window.requestAnimationFrame(draw)
}
draw()
initEvents()
