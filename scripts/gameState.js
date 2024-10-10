// Game state management
// Gestion de l'état du jeu

import {
  createGrid,
  checkForWin,
  isBoardFull,
  findLowestEmptyCell,
} from './boardManager.js'
import { updatePlayerDisplay, updateScoreDisplay } from './playerManager.js'
import { computerPlay } from './computerManager.js'
import { showModal, hideModal, updateComputerButtonText } from './uiManager.js'

// Constants
// Constantes
export const COLUMNS = 7
export const ROWS = 6
export const PLAYER_1 = 'player1'
export const PLAYER_2 = 'player2'
export const EMPTY_CELL = 'empty'
export const WINNER_CLASS = 'winner'

// Game state variables
// Variables d'état du jeu
export let cells, isVsComputer, isGameActive, isProcessingMove, scores
export let currentPlayerIndex = 0
export let player1Name = 'Joueur 1'
export let player2Name = 'Joueur 2'

// DOM Elements
// Éléments du DOM
const gameContainer = document.getElementById('game-container')
const startMenu = document.getElementById('start-menu')
const player1NameInput = document.getElementById('player1-name')
const player2NameInput = document.getElementById('player2-name')

// Initialize game
// Initialisation du jeu
export function initGame() {
  cells = createGrid()
  currentPlayerIndex = 0
  isVsComputer = false
  isGameActive = true
  isProcessingMove = false
  scores = { [PLAYER_1]: 0, [PLAYER_2]: 0 }
  updateScoreDisplay()
  gameContainer.style.display = 'none'
}

// Start game
// Démarrage du jeu
export function startGame(vsComputer) {
  isVsComputer = vsComputer
  updatePlayerNames()
  startMenu.style.display = 'none'
  gameContainer.style.display = 'flex'
  document.querySelector('.board').style.display = 'block'
  resetGame()
  updateComputerButtonText()
  updatePlayerDisplay()
  updateScoreDisplay()
}

// Update player names
// Mise à jour des noms des joueurs
function updatePlayerNames() {
  player1Name = player1NameInput.value.trim() || 'Joueur 1'
  player2Name = isVsComputer
    ? 'Ordinateur'
    : player2NameInput.value.trim() || 'Joueur 2'
  updatePlayerDisplay()
  updateScoreDisplay()
}

// Handle cell click
// Gestion du clic sur une cellule
export function handleCellClick(event) {
  if (
    !isGameActive ||
    isProcessingMove ||
    !event.target.classList.contains('cell')
  ) {
    return
  }
  isProcessingMove = true
  const column = parseInt(event.target.dataset.column)
  const emptyCell = findLowestEmptyCell(column)
  if (emptyCell) {
    dropToken(emptyCell)
  } else {
    isProcessingMove = false
  }
}

// Drop token animation and game logic
// Animation de chute du jeton et logique du jeu
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

// End game
// Fin du jeu
export function endGame(message) {
  isGameActive = false
  isProcessingMove = false
  if (message.includes('wins')) {
    const winner = getCurrentPlayer() === PLAYER_1 ? player1Name : player2Name
    scores[getCurrentPlayer()]++
    updateScoreDisplay()
    message = `${winner} gagne!`
  }
  showModal(message)
}

// Reset game
// Réinitialisation du jeu
export function resetGame() {
  cells.forEach((cell) => {
    cell.className = 'cell ' + EMPTY_CELL
  })
  setCurrentPlayerIndex(0)
  updatePlayerDisplay()
  isGameActive = true
  isProcessingMove = false
}

// Back to menu
// Retour au menu
export function backToMenu() {
  gameContainer.style.display = 'none'
  startMenu.style.display = 'block'
  isVsComputer = false
  updateComputerButtonText()
}

// Get current player
// Obtenir le joueur actuel
export function getCurrentPlayer() {
  return currentPlayerIndex === 0 ? PLAYER_1 : PLAYER_2
}

// Set current player index
// Définir l'index du joueur actuel
export function setCurrentPlayerIndex(index) {
  currentPlayerIndex = index
}

// Switch player
// Changer de joueur
export function switchPlayer() {
  setCurrentPlayerIndex(1 - currentPlayerIndex)
  updatePlayerDisplay()
}

// Play again
// Rejouer
function playAgain() {
  hideModal()
  resetGame()
}

// Return to menu
// Retour au menu
function returnToMenu() {
  hideModal()
  backToMenu()
}

// Set up event listeners
// Configuration des écouteurs d'événements
export function setupEventListeners() {
  const grid = document.querySelector('.grid')
  const startButton = document.getElementById('start-button')
  const toggleComputerButton = document.getElementById('toggle-computer')
  const resetButton = document.getElementById('reset-button')
  const backToMenuButton = document.getElementById('back-to-menu')
  const playAgainButton = document.getElementById('play-again')
  const returnToMenuButton = document.getElementById('return-to-menu')

  grid.addEventListener('click', handleCellClick)
  startButton.addEventListener('click', () => startGame(false))
  toggleComputerButton.addEventListener('click', () => startGame(true))
  resetButton.addEventListener('click', resetGame)
  backToMenuButton.addEventListener('click', backToMenu)
  playAgainButton.addEventListener('click', playAgain)
  returnToMenuButton.addEventListener('click', returnToMenu)
}
