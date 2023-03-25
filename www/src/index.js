import init, { World, Direction } from "snake_game";
import { rnd } from "./random";

init().then((wasm) => {
  const WORLD_WIDTH = 4;
  const SNAKE_POS = rnd(WORLD_WIDTH * WORLD_WIDTH);
  const SNAKE_SIZE = 3;

  const world = World.new(WORLD_WIDTH, SNAKE_POS, SNAKE_SIZE);
  const worldWidth = world.width();
  const canvas = document.getElementById("snake");
  const ctx = canvas?.getContext("2d");

  const gameStatus = document.getElementById("game-status");
  const gameButton = document.getElementById("game-btn");
  const gamePoints = document.getElementById("game-points");

  const CellSize = 10;

  canvas.height = worldWidth * CellSize;
  canvas.width = worldWidth * CellSize;

  gameButton.addEventListener("click", () => {
    if (world.game_status() !== undefined) {
      location.reload();
    } else {
      gameButton.textContent = "Playing...";
      world.play();
      play();
    }
  });

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
    const snakeCells = new Uint32Array(
      wasm.memory.buffer,
      world.snake_cells(),
      world.snake_body_length()
    );

    snakeCells
      .filter((snakeCellIdx, i) => !(i > 0 && snakeCellIdx === snakeCells[0]))
      .forEach((snakeCellIdx, i) => {
        const col = snakeCellIdx % worldWidth;
        const row = Math.floor(snakeCellIdx / worldWidth);

        ctx.fillStyle = i === 0 ? "#7878db" : "#000000";

        ctx.beginPath();

        ctx.fillRect(col * CellSize, row * CellSize, CellSize, CellSize);

        ctx.stroke();
      });
  };

  const drawReward = () => {
    const idx = world.reward_cell();
    const col = idx % worldWidth;
    const row = Math.floor(idx / worldWidth);

    ctx.fillStyle = "#ff0000";

    ctx.beginPath();

    ctx.fillRect(col * CellSize, row * CellSize, CellSize, CellSize);

    ctx.stroke();
  };

  const monitorMovement = () => {
    window.addEventListener("keydown", (event) => {
      const direction = event.key;
      switch (direction) {
        case "ArrowUp":
          world.update_direction(Direction.UP);
          break;
        case "ArrowDown":
          world.update_direction(Direction.DOWN);
          break;
        case "ArrowLeft":
          world.update_direction(Direction.LEFT);
          break;
        case "ArrowRight":
          world.update_direction(Direction.RIGHT);
          break;
      }
    });
  };

  function paint() {
    drawWorld();
    drawSnake();
    drawReward();
    gameStatus.textContent = getStatus();
    gamePoints.textContent = world.points();
  }

  function getStatus() {
    switch (world.game_status()) {
      case 0:
        return "Playing";
      case 1:
        return "Won";
      case 2:
        return "Lost";
      default:
        return "None";
    }
  }

  function play() {
    switch (world.game_status()) {
      case 1:
      case 2:
        gameButton.textContent = "Replay";
        return;
    }

    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.step();
      paint();
      requestAnimationFrame(play);
    }, 400);
  }

  paint();
  monitorMovement();
});
