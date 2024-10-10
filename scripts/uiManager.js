// UI management
// Gestion de l'interface utilisateur

import { isVsComputer } from './gameState.js'

// Show modal
// Afficher la modal
export function showModal(message) {
  const modal = document.getElementById('end-game-modal')
  const modalMessage = document.getElementById('modal-message')
  modalMessage.textContent = message
  modal.style.display = 'block'
}

// Hide modal
// Cacher la modal
export function hideModal() {
  const modal = document.getElementById('end-game-modal')
  modal.style.display = 'none'
}

// Update computer button text
// Mettre à jour le texte du bouton ordinateur
export function updateComputerButtonText() {
  const toggleComputerButton = document.getElementById('toggle-computer')
  toggleComputerButton.textContent = isVsComputer
    ? 'Jouer à 2 joueurs'
    : "Jouer contre l'ordinateur"
}
