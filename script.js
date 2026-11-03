// Pega o canvas e o "pincel" 2D, que é quem desenha nele
const canvas = document.querySelector('.board');
const context = canvas.getContext('2d');

// Cada casa tem 24 px, e o tabuleiro tem 20 casas de cada lado
const cellSize = 24;
const gridSize = 20;

// A cobra é uma lista de casas; a primeira é a cabeça
const snake = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 }
];

// Pinta uma casa: a coordenada em casas vira pixels na hora de desenhar
const drawCell = (cell, color) => {
  context.fillStyle = color;
  context.fillRect(cell.x * cellSize + 1, cell.y * cellSize + 1, cellSize - 2, cellSize - 2);
};

// Desenha o tabuleiro inteiro: as casas vazias e, por cima, a cobra
const drawBoard = () => {
  for (let y = 0; y < gridSize; y = y + 1) {
    for (let x = 0; x < gridSize; x = x + 1) {
      drawCell({ x: x, y: y }, '#15181c');
    }
  }

  snake.forEach((cell, index) => {
    drawCell(cell, index === 0 ? '#d9f99d' : '#65a30d');
  });
};

drawBoard();
