<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import XIcon from "@lucide/svelte/icons/x";
  import { popSound } from "$lib/sound.ts";
  import { fade } from "svelte/transition";
  import Button from "./Button.svelte";
  import FullscreenButton from "./FullscreenButton.svelte";
  import {
    autoBoardSize,
    cloneSettings,
    defaultSettings,
    Game,
    MAX_HEIGHT,
    MAX_WIDTH,
    MIN_HEIGHT,
    MIN_WIDTH,
    normalizeSettings,
    type Settings as GameSettings,
    type GameSnapshot,
    type MovePhase,
  } from "./game.ts";
  import Pebble from "./Pebble.svelte";
  import { PLAYER_COLORS } from "./player-meta";
  import PlayerDisplay from "./PlayerDisplay.svelte";
  import Settings from "./Settings.svelte";

  let game = new Game(normalizeSettings(defaultSettings()));
  const seedSnapshot = game.getSnapshot();
  let snapshot = $state(seedSnapshot);

  let alivePlayers = $state(seedSnapshot.alivePlayers);
  let playerDeaths = $state(seedSnapshot.playerDeaths);
  let currentPlayer = $state(seedSnapshot.currentPlayer);
  let appliedSettings = $state(cloneSettings(seedSnapshot.settings));

  let h = $derived(snapshot.settings.height);
  let w = $derived(snapshot.settings.width);

  let settingsView = $state(false);
  let inAnimation = $state(false);
  let animationToken = 0;

  let draftSettings = $state<GameSettings>(
    cloneSettings(seedSnapshot.settings),
  );

  const sameArray = <T,>(a: T[], b: T[]) =>
    a.length === b.length && a.every((value, i) => value === b[i]);

  const syncPlayerState = (next: GameSnapshot) => {
    if (!sameArray(alivePlayers, next.alivePlayers)) {
      alivePlayers = next.alivePlayers;
    }

    if (!sameArray(playerDeaths, next.playerDeaths)) {
      playerDeaths = next.playerDeaths;
    }

    if (currentPlayer !== next.currentPlayer) {
      currentPlayer = next.currentPlayer;
    }
  };

  const setSnapshot = (next: GameSnapshot) => {
    snapshot = next;
    syncPlayerState(next);
  };

  const sleep = async (ms: number, token: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms));
    if (token !== animationToken) {
      throw new Error("animation cancelled");
    }
  };

  const refreshSnapshot = () => setSnapshot(game.getSnapshot());

  const resetGame = (settings: GameSettings) => {
    game = new Game(settings);
    refreshSnapshot();
  };

  const phaseDelay = (phase: MovePhase) =>
    phase.kind === "place" && phase.snapshot.firstMove ? 75 : 150;

  const playPhase = async (phase: MovePhase, token: number) => {
    if (phase.kind === "place" || phase.kind === "explode") {
      popSound();
    }

    setSnapshot(phase.snapshot);
    await sleep(phaseDelay(phase), token);
  };

  const processMove = async (x: number, y: number) => {
    if (inAnimation || settingsView) return;

    const token = ++animationToken;
    inAnimation = true;

    try {
      let result = game.playMove(x, y);
      if (!result.phase && !result.continues) return;

      while (true) {
        if (result.phase) {
          await playPhase(result.phase, token);
        }

        if (!result.continues) break;
        result = game.continueReaction();
      }
    } catch (error) {
      if (error instanceof Error && error.message === "animation cancelled") {
        return;
      }
      throw error;
    } finally {
      if (token === animationToken) {
        inAnimation = false;
      }
      refreshSnapshot();
    }
  };

  const openSettings = () => {
    draftSettings = cloneSettings(appliedSettings);
    settingsView = true;
  };

  const restart = () => {
    animationToken++;
    inAnimation = false;
    resetGame(appliedSettings);
  };

  const apply = () => {
    appliedSettings = normalizeSettings(draftSettings);
    draftSettings = cloneSettings(appliedSettings);
    animationToken++;
    inAnimation = false;
    resetGame(appliedSettings);
    settingsView = false;
  };

  const cancel = () => {
    draftSettings = cloneSettings(appliedSettings);
    settingsView = false;
  };

  const isWeb = import.meta.env.VITE_ANDROID_BUILD === undefined;
</script>

<div class="grid h-full grid-cols-[1fr_29.6875%]">
  <div
    class="@container-[size] grid size-full place-content-center"
    style:grid-template-columns="repeat({w}, auto)"
  >
    {#each { length: h } as _, y (y)}
      {#each { length: w } as _, x (x)}
        <button
          class="m-[.1rem] grid aspect-square rounded-[17.5%] bg-gray-100"
          style:height="calc(min(100cqh/{h}, 100cqw/{w}) - .2rem)"
          disabled={inAnimation || settingsView}
          onclick={() => processMove(x, y)}
          style:background-color={(() => {
            const cell = snapshot.board[y][x];
            if (cell.player === null) return "";
            const th = game.cellThreshold(x, y);
            // highlight when one more dot would trigger explosion
            if (cell.dots === th - 1) {
              // 20% opacity
              return PLAYER_COLORS[cell.player] + "33";
            }
            return "";
          })()}
        >
          <Pebble {...snapshot.board[y][x]} />
        </button>
      {/each}
    {/each}
  </div>

  <div class="grid grid-cols-[1fr] grid-rows-[1fr_auto] p-4">
    {#if !settingsView}
      <div class="col-1 row-1" transition:fade={{ duration: 150 }}>
        <PlayerDisplay
          {alivePlayers}
          {playerDeaths}
          {currentPlayer}
          {inAnimation}
        />
      </div>
    {:else}
      <div class="col-1 row-1" transition:fade={{ duration: 150 }}>
        <Settings
          bind:settings={draftSettings}
          minWidth={MIN_WIDTH}
          maxWidth={MAX_WIDTH}
          minHeight={MIN_HEIGHT}
          maxHeight={MAX_HEIGHT}
          {autoBoardSize}
        />
      </div>
    {/if}

    <div class={["flex gap-4", isWeb ? "justify-between" : "justify-end"]}>
      <Button
        aria-label={settingsView ? "Apply Settings" : "Settings"}
        onclick={settingsView ? apply : openSettings}
      >
        <SettingsIcon
          class={["absolute transition-opacity", settingsView && "opacity-0"]}
        />
        <CheckIcon
          class={["transition-opacity", !settingsView && "opacity-0"]}
        />
      </Button>

      <Button
        aria-label={settingsView ? "Cancel Settings" : "Restart"}
        onclick={settingsView ? cancel : restart}
      >
        <RotateCcwIcon
          class={["absolute transition-opacity", settingsView && "opacity-0"]}
        />
        <XIcon class={["transition-opacity", !settingsView && "opacity-0"]} />
      </Button>

      {#if isWeb}
        <FullscreenButton />
      {/if}
    </div>
  </div>
</div>
