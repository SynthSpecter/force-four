// Board management
// Gestion du plateau de jeu

import {
  COLUMNS,
  ROWS,
  EMPTY_CELL,
  cells,
  getCurrentPlayer,
  WINNER_CLASS,
} from './gameState.js'

// Create grid cells
// Création des cellules de la grille
export function createGrid() {
  const grid = document.querySelector('.grid')
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

// Find lowest empty cell in a column
// Trouver la cellule vide la plus basse dans une colonne
export function findLowestEmptyCell(column) {
  return cells
    .filter(
      (cell) =>
        parseInt(cell.dataset.column) === column &&
        cell.classList.contains(EMPTY_CELL)
    )
    .pop()
}

// Check for win condition
// Vérifier la condition de victoire
export function checkForWin(cell) {
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
// Trouver une cellule par colonne et ligne
export function findCell(column, row) {
  return cells.find(
    (cell) =>
      parseInt(cell.dataset.column) === column &&
      parseInt(cell.dataset.row) === row
  )
}

// Check if board is full
// Vérifier si le plateau est plein
export function isBoardFull() {
  return cells.every((cell) => !cell.classList.contains(EMPTY_CELL))
}
