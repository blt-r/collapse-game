export const WIDTH = 10;
export const HEIGHT = 8;

export type Cell = { player: number | null; dots: number };
export type Board = Cell[][];
export type Point = { x: number; y: number };

export const PLAYER_COLORS = [
  "#F87171",
  "#657FFF",
  "#34D399",
  "#FFCB4A",
  "#FF8DD0",
  "#FF9E4A",
  "#985DC5",
  "#50DCF2",
  "#AC7F5E",
];

export const PLAYER_NAMES = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Pink",
  "Orange",
  "Purple",
  "Cyan",
  "Brown",
];

export type Settings = {
  players: boolean[];
};

export const settings: Settings = $state({
  players: PLAYER_COLORS.map((_, i) => i < 4), // default to 4 players
});

export type GameState = {
  board: Board;
  currentPlayer: number;
  firstMove: boolean;
  inAnimation: boolean;
  alivePlayers: (boolean | null)[];
  settings: Settings;
};

export const initialState = (): GameState => ({
  board: Array.from({ length: HEIGHT }, () =>
    Array.from({ length: WIDTH }, () => ({ player: null, dots: 0 })),
  ),
  currentPlayer: settings.players.findIndex((enabled) => enabled),
  firstMove: true,
  inAnimation: false,
  alivePlayers: settings.players.map((enabled) => (enabled ? true : null)),
  settings: Object.assign({}, settings),
});

export const state: GameState = $state(initialState());

const nextPlayer = (player: number): number => {
  let next = (player + 1) % state.alivePlayers.length;
  while (!state.alivePlayers[next]) {
    next = (next + 1) % state.alivePlayers.length;
  }
  return next;
};

export const processMove = async (x: number, y: number) => {
  if (state.inAnimation) return;

  if (state.firstMove) {
    if (state.board[y][x].player === null) {
      state.inAnimation = true;

      state.board[y][x] = {
        player: state.currentPlayer,
        dots: 3,
      };
      const next = nextPlayer(state.currentPlayer);
      if (next <= state.currentPlayer) state.firstMove = false;
      state.currentPlayer = next;

      await waitToAppear(); // wait for the appear animation
      state.inAnimation = false;
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
  await waitToAnimate(); // wait for the dot animation

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

    if (exploded.length === 0) break;

    await waitToAnimate(); // wait for the explode animation

    for (const { x, y } of exploded) {
      for (const { x: nx, y: ny } of neighbors({ x, y })) {
        state.board[ny][nx].dots += 1;
        state.board[ny][nx].player = state.currentPlayer;
      }
    }

    killPlayers();

    await waitToAnimate(); // wait for the dot animation
  }

  state.inAnimation = false;
  state.currentPlayer = nextPlayer(state.currentPlayer);
};

const killPlayers = () => {
  const alive: (boolean | null)[] = state.alivePlayers.map((status) =>
    status === null ? null : false,
  );

  for (const cell of state.board.flat()) {
    if (cell.player !== null) {
      alive[cell.player] = true;
    }
  }

  state.alivePlayers = alive;
};

const waitToAnimate = () => new Promise((resolve) => setTimeout(resolve, 150));
const waitToAppear = () => new Promise((resolve) => setTimeout(resolve, 75));

const neighbors = ({ x, y }: Point): Point[] =>
  [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ].filter(({ x, y }) => x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT);

export const restartGame = () => {
  Object.assign(state, initialState());
};

export const cancelSettings = () => {
  Object.assign(settings, state.settings);
};

export const applySettings = () => {
  // validate settings

  if (settings.players.every((enabled) => !enabled)) {
    settings.players[0] = true;
  }

  restartGame();
};
