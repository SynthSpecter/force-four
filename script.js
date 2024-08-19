// Attendre que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function () {
  // Définition des constantes pour la taille de la grille
  const COLUMNS = 7
  const ROWS = 6

  // Sélection de l'élément grille dans le DOM
  const grid = document.querySelector('.grid')

  // Création dynamique des cellules de la grille
  const cells = Array.from({ length: COLUMNS * ROWS }, (_, index) => {
    const cell = document.createElement('div')
    cell.classList.add('cell', 'empty')
    cell.dataset.column = index % COLUMNS
    cell.dataset.row = Math.floor(index / COLUMNS)
    grid.appendChild(cell)
    return cell
  })

  // Sélection de l'élément d'affichage du joueur actuel
  const playerDisplay = document.getElementById('player-display')

  // Définition des joueurs
  const players = ['player1', 'player2']

  // Variables d'état du jeu
  let currentPlayerIndex = 0
  let isVsComputer = false
  let isGameActive = true
  let isProcessingMove = false

  // Chargement des effets sonores
  // const clickSound = new Audio('./clic.mp3')
  // const winSound = new Audio('./victory.mp3')
  // const drawSound = new Audio('./nul.mp3')

  // Gestion des événements pour les boutons de démarrage
  document.getElementById('toggle-computer').addEventListener('click', () => {
    startGame(true)
  })

  document.getElementById('start-button').addEventListener('click', () => {
    startGame(false)
  })

  // Fonction pour démarrer le jeu
  function startGame(vsComputer) {
    document.getElementById('start-menu').style.display = 'none'
    document.querySelector('.board').style.display = 'flex'
    resetGame()
    isVsComputer = vsComputer
    document.getElementById('toggle-computer').textContent = vsComputer
      ? 'Jouer à 2 joueurs'
      : "Jouer contre l'ordinateur"
  }

  // Initialisation des scores
  let scores = { player1: 0, player2: 0 }

  // Ajout de l'écouteur d'événements pour les clics sur la grille
  grid.addEventListener('click', handleCellClick)

  // Fonction principale pour gérer les clics sur les cellules
  function handleCellClick(event) {
    if (
      !isGameActive ||
      isProcessingMove ||
      !event.target.classList.contains('cell')
    )
      return

    isProcessingMove = true
    // clickSound.play()

    const clickedCell = event.target
    const column = parseInt(clickedCell.dataset.column)

    const emptyCellsInColumn = cells.filter(
      (cell) =>
        parseInt(cell.dataset.column) === column &&
        cell.classList.contains('empty')
    )

    if (emptyCellsInColumn.length > 0) {
      const lastEmptyCell = emptyCellsInColumn[emptyCellsInColumn.length - 1]
      lastEmptyCell.classList.remove('empty')
      lastEmptyCell.classList.add(players[currentPlayerIndex])
      lastEmptyCell.style.animation = 'dropToken 0.5s'

      lastEmptyCell.addEventListener(
        'animationend',
        () => {
          lastEmptyCell.style.animation = ''

          if (checkForWin(lastEmptyCell)) {
            endGame(`${players[currentPlayerIndex]} wins!`)
            return
          }

          if (cells.every((cell) => !cell.classList.contains('empty'))) {
            endGame('Match nul!')
            return
          }

          switchPlayer()
          isProcessingMove = false

          if (isVsComputer && players[currentPlayerIndex] === 'player2') {
            setTimeout(computerPlay, 500)
          } else {
            isProcessingMove = false
          }
        },
        { once: true }
      )
    } else {
      isProcessingMove = false
    }
  }

  // Fonction pour le jeu de l'ordinateur
  function computerPlay() {
    if (!isGameActive || isProcessingMove) return

    setTimeout(() => {
      const emptyCells = cells.filter((cell) =>
        cell.classList.contains('empty')
      )
      if (emptyCells.length > 0) {
        const randomCell =
          emptyCells[Math.floor(Math.random() * emptyCells.length)]
        handleCellClick({ target: randomCell })
      }
    }, 500)
  }

  // Fonction pour vérifier s'il y a un gagnant
  function checkForWin(cell) {
    const column = parseInt(cell.dataset.column)
    const row = parseInt(cell.dataset.row)
    const currentPlayer = cell.classList.contains('player1')
      ? 'player1'
      : 'player2'
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ]

    for (const [dx, dy] of directions) {
      let count = 1
      const winningCells = [cell]

      // Vérification dans une direction
      for (let i = 1; i < 4; i++) {
        const nextCell = cells.find(
          (c) =>
            parseInt(c.dataset.column) === column + i * dx &&
            parseInt(c.dataset.row) === row + i * dy
        )

        if (nextCell && nextCell.classList.contains(currentPlayer)) {
          count++
          winningCells.push(nextCell)
        } else {
          break
        }
      }

      // Vérification dans la direction opposée
      for (let i = 1; i < 4; i++) {
        const nextCell = cells.find(
          (c) =>
            parseInt(c.dataset.column) === column - i * dx &&
            parseInt(c.dataset.row) === row - i * dy
        )

        if (nextCell && nextCell.classList.contains(currentPlayer)) {
          count++
          winningCells.push(nextCell)
        } else {
          break
        }
      }

      if (count >= 4) {
        winningCells.forEach((cell) => cell.classList.add('winner'))
        return true
      }
    }
    return false
  }

  // Fonction pour terminer le jeu
  function endGame(message) {
    isGameActive = false
    isProcessingMove = false
    if (message.includes('wins')) {
      // winSound.play()
      scores[players[currentPlayerIndex]]++
      document.getElementById(
        `score-${players[currentPlayerIndex]}`
      ).textContent = scores[players[currentPlayerIndex]]
    } else {
      // drawSound.play()
    }
    setTimeout(() => alert(message), 100)
  }

  // Fonction pour changer de joueur
  function switchPlayer() {
    currentPlayerIndex = 1 - currentPlayerIndex
    playerDisplay.textContent =
      players[currentPlayerIndex] === 'player1' ? 'Player 1' : 'Player 2'
  }

  // Ajout de l'écouteur d'événements pour le bouton de réinitialisation
  document.getElementById('reset-button').addEventListener('click', resetGame)

  // Fonction pour réinitialiser le jeu
  function resetGame() {
    cells.forEach((cell) => {
      cell.className = 'cell empty'
    })
    currentPlayerIndex = 0
    playerDisplay.textContent = 'Player 1'
    isGameActive = true
    isProcessingMove = false
  }
})
