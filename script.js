// Pega o canvas e o "pincel" 2D, que é quem desenha nele
const canvas = document.querySelector('.board');
const context = canvas.getContext('2d');

// Um quadrado de 24 px no canto de cima à esquerda: x = 0, y = 0
context.fillStyle = '#65a30d';
context.fillRect(0, 0, 24, 24);

// Outro no canto de baixo à direita: 480 - 24 = 456
context.fillStyle = '#ff9f43';
context.fillRect(456, 456, 24, 24);
