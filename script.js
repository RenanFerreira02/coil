// Pega o canvas e o "pincel" 2D, que é quem desenha nele
const canvas = document.querySelector('.board');
const context = canvas.getContext('2d');
const startButton = document.querySelector('.start-button');
const pointsValue = document.querySelector('.points-value');
const statusBox = document.querySelector('.status');
const statusTitle = document.querySelector('.status-title');
const statusText = document.querySelector('.status-text');

// Cada casa tem 24 px, e o tabuleiro tem 20 casas de cada lado
const cellSize = 24;
const gridSize = 20;

// Tempo entre um passo e outro da cobra, em milissegundos (8 passos por segundo)
const stepDelay = 125;

// O momento do último passo, em milissegundos desde que a página abriu
let lastStepTime = 0;

// O número do próximo quadro pedido ao navegador; serve para cancelar o loop
let animationId = 0;

// A cobra do começo da partida: três casas no meio, com a cabeça à direita
const createSnake = () => {
  return [
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 }
  ];
};

// A cobra é uma lista de casas; a primeira é a cabeça
let snake = createSnake();

// Para onde a cobra anda: começa indo uma casa para a direita a cada passo
let direction = { x: 1, y: 0 };

// Cada tecla aponta para uma direção. No canvas, o y cresce para baixo
const directions = {
  arrowup: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  arrowdown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  arrowleft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  arrowright: { x: 1, y: 0 },
  d: { x: 1, y: 0 }
};

// Sorteia uma casa qualquer do tabuleiro
const randomCell = () => {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };
};

// Diz se a casa está ocupada por alguma parte da cobra
const isOnSnake = (cell) => {
  return snake.some((part) => part.x === cell.x && part.y === cell.y);
};

// Sorteia de novo até cair numa casa livre
const placeFood = () => {
  let cell = randomCell();

  while (isOnSnake(cell)) {
    cell = randomCell();
  }

  return cell;
};

// A fruta nasce numa casa livre
let food = placeFood();

// Cada fruta comida vale um ponto
let points = 0;

// Diz se a casa está fora do tabuleiro
const isOutside = (cell) => {
  return cell.x < 0 || cell.y < 0 || cell.x >= gridSize || cell.y >= gridSize;
};

// Troca o título e o texto da caixa de mensagens
const showStatus = (title, text) => {
  statusTitle.textContent = title;
  statusText.textContent = text;
};

// Pinta uma casa: a coordenada em casas vira pixels na hora de desenhar
const drawCell = (cell, color) => {
  context.fillStyle = color;
  context.fillRect(cell.x * cellSize + 1, cell.y * cellSize + 1, cellSize - 2, cellSize - 2);
};

// A fruta é um círculo no centro da casa: arc desenha o contorno e fill pinta
const drawFood = () => {
  context.fillStyle = '#ff9f43';
  context.beginPath();
  context.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, 8, 0, Math.PI * 2);
  context.fill();
};

// Desenha o tabuleiro inteiro: as casas vazias e, por cima, a fruta e a cobra
const drawBoard = () => {
  for (let y = 0; y < gridSize; y = y + 1) {
    for (let x = 0; x < gridSize; x = x + 1) {
      drawCell({ x: x, y: y }, '#15181c');
    }
  }

  drawFood();

  snake.forEach((cell, index) => {
    drawCell(cell, index === 0 ? '#d9f99d' : '#65a30d');
  });
};

// Um passo: nasce uma cabeça nova na frente, e a ponta da cauda sai
const moveSnake = () => {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // A cabeça nova sairia do tabuleiro ou cairia no corpo: a cobra bateu
  if (isOutside(head) || isOnSnake(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  // Colisão é comparar coordenadas: cabeça na casa da fruta
  if (head.x === food.x && head.y === food.y) {
    // Comeu: a cauda fica (a cobra cresce), soma um ponto e a fruta muda de lugar
    points = points + 1;
    pointsValue.textContent = points;
    food = placeFood();
  } else {
    snake.pop();
  }
};

// O game loop: o navegador chama esta função a cada quadro (uns 60 por segundo)
// e passa o timestamp, a hora daquele quadro em milissegundos
const gameLoop = (timestamp) => {
  // O próximo quadro é pedido logo no começo: assim o fim de jogo consegue cancelá-lo
  animationId = requestAnimationFrame(gameLoop);

  // A cobra só anda quando já passou o tempo de um passo desde o último
  if (timestamp - lastStepTime >= stepDelay) {
    lastStepTime = timestamp;
    moveSnake();
    drawBoard();
  }
};

// Bateu: o loop para e Começar vira "Jogar de novo"
const endGame = () => {
  cancelAnimationFrame(animationId);
  showStatus('Fim de jogo', `Bateu! Pontos: ${points}.`);
  statusBox.classList.add('is-over');
  startButton.textContent = 'Jogar de novo';
  startButton.disabled = false;
};

// Começa a partida do zero: cobra nova, direção, fruta e pontos
const startGame = () => {
  snake = createSnake();
  direction = { x: 1, y: 0 };
  food = placeFood();
  points = 0;
  pointsValue.textContent = points;
  statusBox.classList.remove('is-over');
  showStatus('Jogando', 'Coma as frutas e não bata em nada.');
  startButton.disabled = true;
  animationId = requestAnimationFrame(gameLoop);
};

drawBoard();

startButton.addEventListener('click', startGame);

// Setas e WASD mudam a direção da cobra
document.addEventListener('keydown', (event) => {
  const newDirection = directions[event.key.toLowerCase()];

  // Outra tecla qualquer: não é com a cobra
  if (newDirection === undefined) {
    return;
  }

  // As setas também rolam a página; aqui elas só guiam a cobra
  event.preventDefault();
  direction = newDirection;
});
