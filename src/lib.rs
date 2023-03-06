use wasm_bindgen::prelude::*;
use wee_alloc::WeeAlloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = WeeAlloc::INIT;

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(name); 
}

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[derive(PartialEq)]
enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction
}

impl Snake {
    fn new(spawn_idx: usize) -> Snake {
        Snake {
            body: vec!(SnakeCell(spawn_idx)),
            direction: Direction::UP
        }
    }
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    snake: Snake
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, snake_pos: usize) -> World {
        World {
            width,
            snake: Snake::new(snake_pos)
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn update(&mut self) -> bool {
        let snake_idx = self.snake_head_idx();
        let (row, col) = self.index_to_cell(snake_idx);

        let (next_row, next_col) = match self.snake.direction {
            Direction::RIGHT => {
                (row, (col + 1) % self.width)
            },
            Direction::LEFT => {
                let new_col = if col == 0 as usize {
                    self.width - 1
                } else {
                    (col - 1) % self.width
                };
                (row, new_col)
            },
            Direction::UP => {
                let new_row = if row == 0 as usize {
                    self.width - 1
                } else {
                    (row - 1) % self.width
                };
                (new_row, col)
            },
            Direction::DOWN => {
                ((row + 1) % self.width, col)
            },
        };

        self.set_snake_body(self.cell_to_index(next_row, next_col));
        col == 0 as usize
    }

    fn set_snake_body(&mut self, idx:usize) {
        self.snake.body[0].0 = idx;
    }

    fn index_to_cell(&self, idx:usize) -> (usize, usize) {
        (idx / self.width, idx % self.width)
    }

    fn cell_to_index(&self, row:usize, col:usize) -> usize {
        (row * self.width) + col
    }
}

//wasm-pack build --target web