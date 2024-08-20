document.addEventListener('DOMContentLoaded', function () {
  // Constants
  const COLUMNS = 7
  const ROWS = 6
  const PLAYER_1 = 'player1'
  const PLAYER_2 = 'player2'
  const EMPTY_CELL = 'empty'
  const WINNER_CLASS = 'winner'

  // DOM Elements
  const grid = document.querySelector('.grid')
  const playerDisplay = document.getElementById('player-display')
  const startMenu = document.getElementById('start-menu')
  const gameContainer = document.getElementById('game-container')
  const toggleComputerButton = document.getElementById('toggle-computer')
  const startButton = document.getElementById('start-button')
  const resetButton = document.getElementById('reset-button')
  const backToMenuButton = document.getElementById('back-to-menu')
  const player1NameInput = document.getElementById('player1-name')
  const player2NameInput = document.getElementById('player2-name')

  // Game state
  let cells,
    currentPlayerIndex,
    isVsComputer,
    isGameActive,
    isProcessingMove,
    scores
  let player1Name = 'Player 1'
  let player2Name = 'Player 2'

  // Fonction pour retourner au menu
  function backToMenu() {
    gameContainer.style.display = 'none'
    startMenu.style.display = 'block'
  }

  function updatePlayerDisplay() {
    playerDisplay.textContent =
      getCurrentPlayer() === PLAYER_1 ? player1Name : player2Name
  }

  // Initialize game
  function initGame() {
    cells = createGrid()
    currentPlayerIndex = 0
    isVsComputer = false
    isGameActive = true
    isProcessingMove = false
    scores = { [PLAYER_1]: 0, [PLAYER_2]: 0 }
    updateScoreDisplay()
    gameContainer.style.display = 'none'
  }

  // Create grid cells
  function createGrid() {
    grid.innerHTML = ''
    return Array.from({ length: COLUMNS * ROWS }, (_, index) => {
      const cell = document.createElement('div')
      cell.classList.add('cell', EMPTY_CELL)
      cell.dataset.column = index % COLUMNS
      cell.dataset.row = Math.floor(index / COLUMNS)
      grid.appendChild(cell)
      return cell
    })
  }

  // Start game
  function startGame(vsComputer) {
    player1Name = player1NameInput.value || 'Joueur 1'
    player2Name = vsComputer
      ? 'Ordinateur'
      : player2NameInput.value || 'Joueur 2'
    startMenu.style.display = 'none'
    gameContainer.style.display = 'flex'
    document.querySelector('.board').style.display = 'block'
    resetGame()
    isVsComputer = vsComputer
    toggleComputerButton.textContent = vsComputer
      ? 'Jouer à 2 joueurs'
      : "Jouer contre l'ordinateur"
    updatePlayerDisplay()
    updateScoreDisplay()
  }

  // Handle cell click
  function handleCellClick(event) {
    if (
      !isGameActive ||
      isProcessingMove ||
      !event.target.classList.contains('cell')
    )
      return

    isProcessingMove = true
    const column = parseInt(event.target.dataset.column)
    const emptyCell = findLowestEmptyCell(column)

    if (emptyCell) {
      dropToken(emptyCell)
    } else {
      isProcessingMove = false
    }
  }

  // Find lowest empty cell in a column
  function findLowestEmptyCell(column) {
    return cells
      .filter(
        (cell) =>
          parseInt(cell.dataset.column) === column &&
          cell.classList.contains(EMPTY_CELL)
      )
      .pop()
  }

  // Drop token animation and game logic
  function dropToken(cell) {
    cell.classList.remove(EMPTY_CELL)
    cell.classList.add(getCurrentPlayer())
    cell.style.animation = 'dropToken 0.5s'

    cell.addEventListener(
      'animationend',
      () => {
        cell.style.animation = ''
        if (checkForWin(cell)) {
          endGame(`${getCurrentPlayer()} wins!`)
          return
        }
        if (isBoardFull()) {
          endGame('Match nul!')
          return
        }
        switchPlayer()
        isProcessingMove = false
        if (isVsComputer && getCurrentPlayer() === PLAYER_2) {
          setTimeout(computerPlay, 500)
        }
      },
      { once: true }
    )
  }

  // Computer play logic
  function computerPlay() {
    if (!isGameActive || isProcessingMove) return

    const emptyCells = cells.filter((cell) =>
      cell.classList.contains(EMPTY_CELL)
    )
    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)]
      handleCellClick({ target: randomCell })
    }
  }

  // Check for win condition
  function checkForWin(cell) {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ]
    const currentPlayer = getCurrentPlayer()

    return directions.some(([dx, dy]) => {
      let count = 1
      const winningCells = [cell]

      for (const direction of [1, -1]) {
        for (let i = 1; i < 4; i++) {
          const nextCell = findCell(
            parseInt(cell.dataset.column) + i * dx * direction,
            parseInt(cell.dataset.row) + i * dy * direction
          )
          if (nextCell && nextCell.classList.contains(currentPlayer)) {
            count++
            winningCells.push(nextCell)
          } else {
            break
          }
        }
      }

      if (count >= 4) {
        winningCells.forEach((cell) => cell.classList.add(WINNER_CLASS))
        return true
      }
      return false
    })
  }

  // Find cell by column and row
  function findCell(column, row) {
    return cells.find(
      (cell) =>
        parseInt(cell.dataset.column) === column &&
        parseInt(cell.dataset.row) === row
    )
  }

  // Check if board is full
  function isBoardFull() {
    return cells.every((cell) => !cell.classList.contains(EMPTY_CELL))
  }

  // End game
  function endGame(message) {
    isGameActive = false
    isProcessingMove = false
    if (message.includes('wins')) {
      const winner = getCurrentPlayer() === PLAYER_1 ? player1Name : player2Name
      scores[getCurrentPlayer()]++
      updateScoreDisplay()
      message = `${winner} gagne !`
    }
    showModal(message)
  }

  function showModal(message) {
    const modal = document.getElementById('end-game-modal')
    const modalMessage = document.getElementById('modal-message')
    modalMessage.textContent = message
    modal.style.display = 'block'
  }

  function hideModal() {
    const modal = document.getElementById('end-game-modal')
    modal.style.display = 'none'
  }

  function playAgain() {
    hideModal()
    resetGame()
  }

  function returnToMenu() {
    hideModal()
    backToMenu()
  }

  function backToMenu() {
    gameContainer.style.display = 'none'
    startMenu.style.display = 'block'
    resetGame()
  }

  // Switch player
  function switchPlayer() {
    currentPlayerIndex = 1 - currentPlayerIndex
    playerDisplay.textContent =
      getCurrentPlayer() === PLAYER_1 ? 'Player 1' : 'Player 2'
  }

  // Amélioration de l'IA de l'ordinateur
  function computerPlay() {
    if (!isGameActive || isProcessingMove) return

    function findWinningMove(player) {
      for (let col = 0; col < COLUMNS; col++) {
        const cell = findLowestEmptyCell(col)
        if (cell) {
          // Simuler le coup
          cell.classList.add(player)

          // Vérifier si ce coup est gagnant
          if (checkForWin(cell)) {
            // Annuler la simulation
            cell.classList.remove(player)
            return cell
          }

          // Annuler la simulation
          cell.classList.remove(player)
        }
      }
      return null
    }

    // Vérifier s'il y a une possibilité de gagner
    const winningMove = findWinningMove(PLAYER_2)
    if (winningMove) {
      handleCellClick({ target: winningMove })
      return
    }

    // Bloquer un coup gagnant de l'adversaire
    const blockingMove = findWinningMove(PLAYER_1)
    if (blockingMove) {
      handleCellClick({ target: blockingMove })
      return
    }

    // Trouver le meilleur coup
    const bestMove = findBestMove()
    if (bestMove) {
      handleCellClick({ target: bestMove })
      return
    }

    // Si aucun bon coup n'est trouvé, jouer aléatoirement
    const emptyCells = cells.filter((cell) =>
      cell.classList.contains(EMPTY_CELL)
    )
    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)]
      handleCellClick({ target: randomCell })
    }
  }

  function findBestMove() {
    const moves = []
    for (let col = 0; col < COLUMNS; col++) {
      const cell = findLowestEmptyCell(col)
      if (cell) {
        const score = evaluateMove(cell, PLAYER_2)
        moves.push({ cell, score })
      }
    }
    moves.sort((a, b) => b.score - a.score)
    return moves.length > 0 ? moves[0].cell : null
  }

  function evaluateMove(cell, player) {
    let score = 0
    const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1

    // Vérifier les alignements possibles
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ]
    for (const [dx, dy] of directions) {
      score += evaluateDirection(cell, player, dx, dy)
      score += evaluateDirection(cell, opponent, dx, dy) // Bloquer l'adversaire
    }

    // Bonus pour les colonnes centrales
    const col = parseInt(cell.dataset.column)
    if (col === 3) score += 3
    else if (col === 2 || col === 4) score += 2
    else if (col === 1 || col === 5) score += 1

    return score
  }

  function evaluateDirection(cell, player, dx, dy) {
    let count = 1
    let openEnds = 0
    const col = parseInt(cell.dataset.column)
    const row = parseInt(cell.dataset.row)

    for (const direction of [1, -1]) {
      for (let i = 1; i < 4; i++) {
        const nextCell = findCell(
          col + i * dx * direction,
          row + i * dy * direction
        )
        if (!nextCell) {
          break
        }
        if (nextCell.classList.contains(player)) {
          count++
        } else if (nextCell.classList.contains(EMPTY_CELL)) {
          openEnds++
          break
        } else {
          break
        }
      }
    }

    if (count >= 4) return 100
    if (count === 3 && openEnds > 0) return 50
    if (count === 2 && openEnds === 2) return 10
    return 0
  }

  // Get current player
  function getCurrentPlayer() {
    return currentPlayerIndex === 0 ? PLAYER_1 : PLAYER_2
  }

  // Update score display
  function updateScoreDisplay() {
    document.getElementById(
      'score-player1'
    ).textContent = `${player1Name}: ${scores[PLAYER_1]}`
    document.getElementById(
      'score-player2'
    ).textContent = `${player2Name}: ${scores[PLAYER_2]}`
  }

  // Reset game
  function resetGame() {
    cells = createGrid()
    cells.forEach((cell) => {
      cell.className = 'cell ' + EMPTY_CELL
    })
    currentPlayerIndex = 0
    playerDisplay.textContent = 'Player 1'
    isGameActive = true
    isProcessingMove = false
  }

  // Event listeners
  grid.addEventListener('click', handleCellClick)
  toggleComputerButton.addEventListener('click', () => startGame(true))
  startButton.addEventListener('click', () => startGame(false))
  resetButton.addEventListener('click', resetGame)
  backToMenuButton.addEventListener('click', backToMenu)
  document.getElementById('play-again').addEventListener('click', playAgain)
  document
    .getElementById('return-to-menu')
    .addEventListener('click', returnToMenu)

  // Initialize game
  initGame()
})
