import utils from './utils.js'
import RNA from './RNA.js'
import controls from './controls.js'

const SAMPLES = 20 // número de amostras no Algoritmo Genético

const game = Runner.instance_; // instância do jogo

let dinoList = [] // lista de dinossauros
let dinoIndex = 0 //índice do dino atual na lista

let bestScore = 0 // melhor pontuação durante o treinamento
let bestRNA = null // melhor RNA encontrada durante o treinamento

function fillDinoList(){
    for (let i=0; i < SAMPLES; i++){
        dinoList[i] = new RNA(3, [10, 10, 2]) // criação de um dino com uma RNA de 3 camadas
        dinoList[i].load(bestRNA) // carrega a melhor RNA encontrada
        if (i > 0) dinoList[i].mutate(0.5) // mutação na RNA, exceto o primeiro
    }

    console.log('Lista de dinossauros criada')
}

setTimeout(() => {
    fillDinoList()
    controls.dispatch('jump')
}, 1000)

setInterval(() => {
    if (!game.activated) return

    const dino = dinoList[dinoIndex] // seleciona o dino atual

    if (game.crashed) {
        if (dino.score > bestScore){
            bestScore = dino.score
            bestRNA = dino.save()
            console.log('Melhor pontuação: ', bestScore)
        }
        dinoIndex++

        if (dinoIndex === SAMPLES) { // se todos os dinos foram avaliados, preenche novamente a lista
            fillDinoList()
            dinoIndex = 0
            bestScore = 0
        }
    
        game.restart()
    }

    const{ tRex, horizon, currentSpeed, distanceRan, dimensions } = game
    dino.score = distanceRan - 2000

    const player = {
        x: tRex.xPos,
        y: tRex.yPos,
        speed: currentSpeed
    }

    const [obstacle] = horizon.obstacles
        .map((obstacle) => {
        return {
            x: obstacle.xPos,
            y: obstacle.yPos
          }
        })
        .filter((obstacle) => obstacle.x > player.x)

    if (obstacle) {
        const distance = 1 - (utils.getDistance(player, obstacle) / dimensions.WIDTH)
        const speed = player.speed / 6
        const height = Math.tanh(105 - obstacle.y)

        const [jump, crouch] = dino.compute([
            distance,
            speed,
            height
        ])

        if (jump === crouch) return
        if (jump) controls.dispatch('jump')
        if (crouch) controls.dispatch('crouch')
    }

}, 100)

/* const s = document.createElement('script')
s.type = 'module'
s.src = 'http://localhost:5500/script.js'
document.body.appendChild(s) */