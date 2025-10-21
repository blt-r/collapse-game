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

export const MIN_WIDTH = 5;
export const MIN_HEIGHT = 5;
export const MAX_WIDTH = 16;
export const MAX_HEIGHT = 12;

export type Settings = {
  players: boolean[];
  width: number;
  height: number;
  borderless: boolean;
};

export const settings: Settings = $state({
  players: PLAYER_COLORS.map((_, i) => i < 4), // default to 4 players
  width: 10,
  height: 8,
  borderless: false,
});

let gameId = 0;

export type GameState = {
  board: Board;
  currentPlayer: number;
  firstMove: boolean;
  inAnimation: boolean;
  alivePlayers: (boolean | null)[];
  settings: Settings;
};

export const initialState = (): GameState => ({
  board: Array.from({ length: settings.height }, () =>
    Array.from({ length: settings.width }, () => ({ player: null, dots: 0 })),
  ),
  currentPlayer: settings.players.findIndex((enabled) => enabled),
  firstMove: true,
  inAnimation: false,
  alivePlayers: settings.players.map((enabled) => (enabled ? true : null)),
  settings: Object.assign({}, settings),
});

export const game: GameState = $state(initialState());

const nextPlayer = (player: number): number => {
  let next = (player + 1) % game.alivePlayers.length;
  while (!game.alivePlayers[next]) {
    next = (next + 1) % game.alivePlayers.length;
  }
  return next;
};

export const processMove = async (x: number, y: number) => {
  try {
    await processMoveInternal(x, y);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "game reset during animation"
    ) {
      return;
    }
    throw error;
  }
};

const processMoveInternal = async (x: number, y: number) => {
  if (game.inAnimation) return;

  if (game.firstMove) {
    if (game.board[y][x].player === null) {
      game.inAnimation = true;

      game.board[y][x] = {
        player: game.currentPlayer,
        dots: 3,
      };
      const next = nextPlayer(game.currentPlayer);
      if (next <= game.currentPlayer) game.firstMove = false;
      game.currentPlayer = next;

      await waitAnimation(75); // wait for the appear animation
      game.inAnimation = false;
    }

    return;
  }

  if (game.board[y][x].player === game.currentPlayer) {
    await addDot(x, y);
  }
};

const addDot = async (x: number, y: number) => {
  game.inAnimation = true;

  game.board[y][x].dots += 1;
  await waitAnimation(150); // wait for the dot animation

  while (true) {
    const exploded: Point[] = [];

    for (let y = 0; y < game.settings.height; y++) {
      for (let x = 0; x < game.settings.width; x++) {
        if (game.board[y][x].dots < 4) {
          continue;
        }

        game.board[y][x].dots -= 4;
        if (game.board[y][x].dots === 0) {
          game.board[y][x].player = null;
        }

        exploded.push({ x, y });
      }
    }

    if (exploded.length === 0) break;

    await waitAnimation(150); // wait for the explode animation

    for (const { x, y } of exploded) {
      for (const { x: nx, y: ny } of neighbors({ x, y })) {
        game.board[ny][nx].dots += 1;
        game.board[ny][nx].player = game.currentPlayer;
      }
    }

    killPlayers();

    await waitAnimation(150); // wait for the dot animation
  }

  game.inAnimation = false;
  game.currentPlayer = nextPlayer(game.currentPlayer);
};

const killPlayers = () => {
  const alive: (boolean | null)[] = game.alivePlayers.map((status) =>
    status === null ? null : false,
  );

  for (const cell of game.board.flat()) {
    if (cell.player !== null) {
      alive[cell.player] = true;
    }
  }

  game.alivePlayers = alive;
};

const waitAnimation = async (ms: number) => {
  const currentGame = gameId;
  await new Promise((resolve) => setTimeout(resolve, ms));
  if (gameId != currentGame) {
    throw new Error("game reset during animation");
  }
  return;
};

const neighbors = (p: Point): Point[] =>
  game.settings.borderless
    ? simpleNeighbors(p).map(({ x, y }) => ({
        x: (x + game.settings.width) % game.settings.width,
        y: (y + game.settings.height) % game.settings.height,
      }))
    : simpleNeighbors(p).filter(
        ({ x, y }) =>
          x >= 0 &&
          x < game.settings.width &&
          y >= 0 &&
          y < game.settings.height,
      );

const simpleNeighbors = ({ x, y }: Point): Point[] => [
  { x: x - 1, y },
  { x: x + 1, y },
  { x, y: y - 1 },
  { x, y: y + 1 },
];

export const restartGame = () => {
  gameId++;

  Object.assign(game, initialState());
};

export const cancelSettings = () => {
  Object.assign(settings, game.settings);
};

export const applySettings = () => {
  // validate settings

  if (settings.players.every((enabled) => !enabled)) settings.players[0] = true;

  if (settings.width < settings.height) {
    [settings.width, settings.height] = [settings.height, settings.width];
  }

  if (settings.width < MIN_WIDTH) settings.width = MIN_WIDTH;
  if (settings.width > MAX_WIDTH) settings.width = MAX_WIDTH;
  if (settings.height < MIN_HEIGHT) settings.height = MIN_HEIGHT;
  if (settings.height > MAX_HEIGHT) settings.height = MAX_HEIGHT;

  restartGame();
};
