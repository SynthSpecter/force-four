document.addEventListener('DOMContentLoaded', function () {
  const grid = document.querySelector('.grid')
  const cells = Array.from({ length: 42 }, (_, index) => {
    const cell = document.createElement('div')
    cell.classList.add('cell', 'empty')
    cell.dataset.column = index % 7
    cell.dataset.row = Math.floor(index / 7)
    grid.appendChild(cell)
    return cell
  })

  let currentPlayer = 'player1'

  cells.forEach((cell) => cell.addEventListener('click', handleCellClick))

  function handleCellClick(event) {
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
      lastEmptyCell.classList.add(currentPlayer)

      if (checkForWin(lastEmptyCell)) {
        cells.forEach((cell) =>
          cell.removeEventListener('click', handleCellClick)
        )
        setTimeout(() => alert(`${currentPlayer} wins!`), 100)
        return
      }

      currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1'
    }
  }

  function checkForWin(cell) {
    const column = parseInt(cell.dataset.column)
    const row = parseInt(cell.dataset.row)
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ]

    for (const [dx, dy] of directions) {
      let count = 1

      for (let i = 1; i < 4; i++) {
        const nextCell = cells.find(
          (c) =>
            parseInt(c.dataset.column) === column + i * dx &&
            parseInt(c.dataset.row) === row + i * dy
        )

        if (nextCell && nextCell.classList.contains(currentPlayer)) {
          count++
        } else {
          break
        }
      }

      for (let i = 1; i < 4; i++) {
        const nextCell = cells.find(
          (c) =>
            parseInt(c.dataset.column) === column - i * dx &&
            parseInt(c.dataset.row) === row - i * dy
        )

        if (nextCell && nextCell.classList.contains(currentPlayer)) {
          count++
        } else {
          break
        }
      }

      if (count >= 4) {
        return true
      }
    }

    return false
  }
})
