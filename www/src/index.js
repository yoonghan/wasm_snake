import init, { World } from "snake_game";

init().then((wasm) => {
  const WORLD_WIDTH = 9;
  const SNAKE_POS = Math.random() * 90;

  const world = World.new(WORLD_WIDTH, SNAKE_POS);
  const worldWidth = world.width();
  const canvas = document.getElementById("snake");
  const ctx = canvas?.getContext("2d");

  const CellSize = 10;

  canvas.height = worldWidth * CellSize;
  canvas.height = worldWidth * CellSize;

  const drawWorld = () => {
    ctx.beginPath();

    for (let x = 0; x <= worldWidth; x++) {
      ctx.moveTo(x * CellSize, 0);
      ctx.lineTo(x * CellSize, worldWidth * CellSize);
    }

    for (let y = 0; y <= worldWidth; y++) {
      ctx.moveTo(0, y * CellSize);
      ctx.lineTo(worldWidth * CellSize, y * CellSize);
    }

    ctx.stroke();
  };

  const drawSnake = () => {
    const snakeIdx = world.snake_head_idx();
    const col = snakeIdx % worldWidth;
    const row = Math.floor(snakeIdx / worldWidth);

    ctx.beginPath();

    ctx.fillRect(col * CellSize, row * CellSize, CellSize, CellSize);

    ctx.stroke();
  };

  drawWorld();
  drawSnake();

  function update() {
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.update();
      drawWorld();
      drawSnake();
      requestAnimationFrame(update);
    }, 500);
  }

  update();
});
