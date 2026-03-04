export type Cell = { player: number | null; dots: number };
export type Board = Cell[][];
export type Point = { x: number; y: number };

export const MIN_WIDTH = 5;
export const MIN_HEIGHT = 5;
export const MAX_WIDTH = 16;
export const MAX_HEIGHT = 12;

export type Settings = {
  players: boolean[];
  width: number;
  height: number;
  borderless: boolean;
  customSize: boolean;
};

export type GameSnapshot = {
  board: Board;
  currentPlayer: number;
  firstMove: boolean;
  alivePlayers: boolean[];
  playerDeaths: number[];
  settings: Settings;
};

export type MovePhase = {
  kind: "place" | "explode" | "distribute";
  snapshot: GameSnapshot;
};

export type MoveResult = {
  phase: MovePhase | null;
  continues: boolean;
};

const PLAYER_SLOTS = 9;

export const autoBoardSize = (
  playerCount: number,
): { width: number; height: number } => {
  if (playerCount <= 2) return { width: 6, height: 8 };
  if (playerCount === 3) return { width: 7, height: 9 };
  if (playerCount === 4 || playerCount === 5) return { width: 8, height: 10 };
  return { width: 9, height: 11 };
};

export const defaultSettings = (): Settings => ({
  players: Array.from({ length: PLAYER_SLOTS }, (_, i) => i < 4),
  width: 10,
  height: 8,
  borderless: false,
  customSize: false,
});

export const cloneSettings = (settings: Settings): Settings => ({
  players: [...settings.players],
  width: settings.width,
  height: settings.height,
  borderless: settings.borderless,
  customSize: settings.customSize,
});

export const normalizeSettings = (input: Settings): Settings => {
  const settings = cloneSettings(input);

  if (settings.players.every((enabled) => !enabled)) {
    settings.players[0] = true;
  }

  if (!settings.customSize) {
    const count = settings.players.filter(Boolean).length;
    const { width, height } = autoBoardSize(count);
    settings.width = width;
    settings.height = height;
  }

  if (settings.width < settings.height) {
    [settings.width, settings.height] = [settings.height, settings.width];
  }

  if (settings.width < MIN_WIDTH) settings.width = MIN_WIDTH;
  if (settings.width > MAX_WIDTH) settings.width = MAX_WIDTH;
  if (settings.height < MIN_HEIGHT) settings.height = MIN_HEIGHT;
  if (settings.height > MAX_HEIGHT) settings.height = MAX_HEIGHT;

  return settings;
};

const cloneBoard = (board: Board): Board =>
  board.map((row) => row.map((cell) => ({ ...cell })));

export class Game {
  #board: Board = [];
  #currentPlayer = 0;
  #firstMove = true;
  #alivePlayers: boolean[] = [];
  #playerDeaths: number[] = [];
  #settings: Settings;
  #pendingExploded: Point[] | null = null;
  #reactionPending = false;

  constructor(settings: Settings = defaultSettings()) {
    this.#settings = normalizeSettings(settings);
    this.#board = Array.from({ length: this.#settings.height }, () =>
      Array.from({ length: this.#settings.width }, () => ({
        player: null,
        dots: 0,
      })),
    );
    this.#currentPlayer = this.#settings.players.findIndex(Boolean);
    this.#firstMove = true;
    this.#alivePlayers = [...this.#settings.players];
    this.#playerDeaths = [];
    this.#pendingExploded = null;
    this.#reactionPending = false;
  }

  getSnapshot(): GameSnapshot {
    return {
      board: cloneBoard(this.#board),
      currentPlayer: this.#currentPlayer,
      firstMove: this.#firstMove,
      alivePlayers: [...this.#alivePlayers],
      playerDeaths: [...this.#playerDeaths],
      settings: cloneSettings(this.#settings),
    };
  }

  cellThreshold(x: number, y: number): number {
    return this.#neighbors({ x, y }).length;
  }

  playMove(x: number, y: number): MoveResult {
    if (this.#reactionPending) {
      return { phase: null, continues: true };
    }

    if (!this.#inBounds(x, y)) {
      return { phase: null, continues: false };
    }

    if (this.#firstMove) {
      if (this.#board[y][x].player !== null) {
        return { phase: null, continues: false };
      }

      this.#board[y][x] = { player: this.#currentPlayer, dots: 1 };
      const next = this.#nextPlayer(this.#currentPlayer);
      if (next <= this.#currentPlayer) {
        this.#firstMove = false;
      }
      this.#currentPlayer = next;

      return {
        phase: { kind: "place", snapshot: this.getSnapshot() },
        continues: false,
      };
    }

    if (this.#board[y][x].player !== this.#currentPlayer) {
      return { phase: null, continues: false };
    }

    this.#board[y][x].dots += 1;
    this.#reactionPending = true;
    this.#pendingExploded = null;

    return {
      phase: {
        kind: "place",
        snapshot: this.getSnapshot(),
      },
      continues: true,
    };
  }

  continueReaction(): MoveResult {
    if (!this.#reactionPending) {
      return { phase: null, continues: false };
    }

    if (this.#pendingExploded === null) {
      const exploded = this.#collectExplosions();
      if (exploded.length === 0) {
        this.#reactionPending = false;
        this.#currentPlayer = this.#nextPlayer(this.#currentPlayer);
        return { phase: null, continues: false };
      }

      this.#pendingExploded = exploded;
      return {
        phase: { kind: "explode", snapshot: this.getSnapshot() },
        continues: true,
      };
    }

    for (const { x: ex, y: ey } of this.#pendingExploded) {
      for (const { x: nx, y: ny } of this.#neighbors({ x: ex, y: ey })) {
        this.#board[ny][nx].dots += 1;
        this.#board[ny][nx].player = this.#currentPlayer;
      }
    }

    this.#killPlayers();
    this.#pendingExploded = null;

    const continues = this.#hasExplodableCells();
    if (!continues) {
      this.#reactionPending = false;
      this.#currentPlayer = this.#nextPlayer(this.#currentPlayer);
    }

    return {
      phase: { kind: "distribute", snapshot: this.getSnapshot() },
      continues,
    };
  }

  #collectExplosions(): Point[] {
    const exploded: Point[] = [];

    for (let by = 0; by < this.#settings.height; by++) {
      for (let bx = 0; bx < this.#settings.width; bx++) {
        const threshold = this.cellThreshold(bx, by);
        if (this.#board[by][bx].dots < threshold) {
          continue;
        }

        this.#board[by][bx].dots -= threshold;
        if (this.#board[by][bx].dots === 0) {
          this.#board[by][bx].player = null;
        }

        exploded.push({ x: bx, y: by });
      }
    }

    return exploded;
  }

  #hasExplodableCells(): boolean {
    for (let by = 0; by < this.#settings.height; by++) {
      for (let bx = 0; bx < this.#settings.width; bx++) {
        if (this.#board[by][bx].dots >= this.cellThreshold(bx, by)) {
          return true;
        }
      }
    }
    return false;
  }

  #nextPlayer(player: number): number {
    let next = (player + 1) % this.#alivePlayers.length;
    while (!this.#alivePlayers[next]) {
      next = (next + 1) % this.#alivePlayers.length;
    }
    return next;
  }

  #killPlayers(): void {
    const alive: boolean[] = this.#settings.players.map(() => false);

    for (const cell of this.#board.flat()) {
      if (cell.player !== null) {
        alive[cell.player] = true;
      }
    }

    const newDeaths: number[] = [];
    for (let p = 0; p < alive.length; p++) {
      if (this.#alivePlayers[p] && !alive[p]) {
        newDeaths.push(p);
      }
    }

    if (newDeaths.length > 0) {
      this.#alivePlayers = alive;
      this.#playerDeaths = [...newDeaths, ...this.#playerDeaths];
    }
  }

  #neighbors({ x, y }: Point): Point[] {
    const neighbors = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ];

    if (this.#settings.borderless) {
      return neighbors.map((p) => ({
        x: (p.x + this.#settings.width) % this.#settings.width,
        y: (p.y + this.#settings.height) % this.#settings.height,
      }));
    }

    return neighbors.filter((p) => this.#inBounds(p.x, p.y));
  }

  #inBounds(x: number, y: number): boolean {
    return (
      x >= 0 && x < this.#settings.width && y >= 0 && y < this.#settings.height
    );
  }
}
