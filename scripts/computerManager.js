// Computer player logic
// Logique du joueur ordinateur

import {
  PLAYER_1,
  PLAYER_2,
  EMPTY_CELL,
  COLUMNS,
  cells,
  isGameActive,
  isProcessingMove,
  getCurrentPlayer,
} from './gameState.js'
import { findLowestEmptyCell, findCell, checkForWin } from './boardManager.js'
import { handleCellClick } from './gameState.js'

// Computer play logic
// Logique de jeu de l'ordinateur
export function computerPlay() {
  if (!isGameActive || isProcessingMove) return

  const winningMove = findWinningMove(PLAYER_2)
  if (winningMove) {
    handleCellClick({ target: winningMove })
    return
  }

  const blockingMove = findWinningMove(PLAYER_1)
  if (blockingMove) {
    handleCellClick({ target: blockingMove })
    return
  }

  const bestMove = findBestMove()
  if (bestMove) {
    handleCellClick({ target: bestMove })
    return
  }

  const emptyCells = cells.filter((cell) => cell.classList.contains(EMPTY_CELL))
  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    handleCellClick({ target: randomCell })
  }
}

// Find winning move for a player
// Trouver un coup gagnant pour un joueur
function findWinningMove(player) {
  for (let col = 0; col < COLUMNS; col++) {
    const cell = findLowestEmptyCell(col)
    if (cell) {
      cell.classList.add(player)
      if (checkForWin(cell)) {
        cell.classList.remove(player)
        return cell
      }
      cell.classList.remove(player)
    }
  }
  return null
}

// Find best move for computer
// Trouver le meilleur coup pour l'ordinateur
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

// Evaluate move score
// Évaluer le score d'un coup
function evaluateMove(cell, player) {
  let score = 0
  const opponent = player === PLAYER_1 ? PLAYER_2 : PLAYER_1
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]
  for (const [dx, dy] of directions) {
    score += evaluateDirection(cell, player, dx, dy)
    score += evaluateDirection(cell, opponent, dx, dy)
  }
  const col = parseInt(cell.dataset.column)
  if (col === 3) score += 3
  else if (col === 2 || col === 4) score += 2
  else if (col === 1 || col === 5) score += 1
  return score
}

// Evaluate direction score
// Évaluer le score d'une direction
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
