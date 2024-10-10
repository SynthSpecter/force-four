// Player management
// Gestion des joueurs

import {
  currentPlayerIndex,
  player1Name,
  player2Name,
  scores,
  PLAYER_1,
  PLAYER_2,
  setCurrentPlayerIndex,
} from './gameState.js'

// Update player display
// Mise à jour de l'affichage du joueur
export function updatePlayerDisplay() {
  const playerDisplay = document.getElementById('player-display')
  playerDisplay.textContent =
    currentPlayerIndex === 0 ? player1Name : player2Name
}

// Update score display
// Mise à jour de l'affichage du score
export function updateScoreDisplay() {
  document.getElementById(
    'score-player1'
  ).textContent = `${player1Name}: ${scores[PLAYER_1]}`
  document.getElementById(
    'score-player2'
  ).textContent = `${player2Name}: ${scores[PLAYER_2]}`
}
