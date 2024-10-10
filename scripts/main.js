// Main entry point for the Connect Four game
// Point d'entrée principal pour le jeu Puissance 4

import { initGame, setupEventListeners } from './gameState.js'

document.addEventListener('DOMContentLoaded', function () {
  initGame()
  setupEventListeners()
})
