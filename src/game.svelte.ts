export const WIDTH = 10;
export const HEIGHT = 8;

export type Player = 0 | 1 | 2 | 3;
export type Cell = { player: Player | null; dots: number };
export type Board = Cell[][];
export type Point = { x: number; y: number };

export const PLAYER_NAMES = ["Red", "Blue", "Green", "Yellow"];
export const PLAYER_COLORS = ["#f87171", "#60a5fa", "#34d399", "#fcca4c"];

export type GameState = {
  board: Board;
  currentPlayer: Player;
  firstMove: boolean;
  inAnimation: boolean;
  alivePlayers: boolean[];
};

export const initialState = (): GameState => ({
  board: Array.from({ length: HEIGHT }, () =>
    Array(WIDTH).fill({ player: null, dots: 0 }),
  ),
  currentPlayer: 0,
  firstMove: true,
  inAnimation: false,
  alivePlayers: [true, true, true, true],
});

export let state: GameState = $state(initialState());

const nextPlayer = (player: Player): Player => {
  let next = (player + 1) % 4;
  while (!state.alivePlayers[next as Player]) {
    next = (next + 1) % 4;
  }
  return next as Player;
};

export const processMove = async (x: number, y: number) => {
  console.log(x, y);

  if (state.inAnimation) return;

  if (state.firstMove) {
    if (state.board[y][x].player === null) {
      state.board[y][x] = {
        player: state.currentPlayer,
        dots: 3,
      };
      state.currentPlayer = nextPlayer(state.currentPlayer);
      if (state.currentPlayer === 0) state.firstMove = false;
    }

    return;
  }

  if (state.board[y][x].player === state.currentPlayer) {
    await addDot(x, y);
  }
};

const addDot = async (x: number, y: number) => {
  state.inAnimation = true;

  state.board[y][x].dots += 1;
  await wait(); // wait for the dot animation

  while (true) {
    const exploded: Point[] = [];

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        if (state.board[y][x].dots < 4) {
          continue;
        }

        state.board[y][x].dots -= 4;
        if (state.board[y][x].dots === 0) {
          state.board[y][x].player = null;
        }

        exploded.push({ x, y });
      }
    }

    await wait(); // wait for the explode animation

    if (exploded.length === 0) break;

    for (const { x, y } of exploded) {
      for (const { x: nx, y: ny } of neighbors({ x, y })) {
        state.board[ny][nx].dots += 1;
        state.board[ny][nx].player = state.currentPlayer;
      }
    }

    killPlayers();

    await wait(); // wait for the dot animation
  }

  state.inAnimation = false;
  state.currentPlayer = nextPlayer(state.currentPlayer);
};

const killPlayers = () => {
  const alive = [false, false, false, false];

  for (const cell of state.board.flat()) {
    if (cell.player !== null) {
      alive[cell.player] = true;
    }
  }

  state.alivePlayers = alive;
};

const wait = () => new Promise((resolve) => setTimeout(resolve, 150));

const neighbors = ({ x, y }: Point): Point[] =>
  [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ].filter(({ x, y }) => x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT);
