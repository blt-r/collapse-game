<script lang="ts">
  import FullscreenButton from "./FullscreenButton.svelte";
  import PlayerDisplay from "./PlayerDisplay.svelte";
  import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import CheckIcon from "@lucide/svelte/icons/check";
  import XIcon from "@lucide/svelte/icons/x";
  import {
    applySettings,
    cancelSettings,
    restartGame,
    game,
    processMove,
  } from "./game.svelte.ts";
  import Button from "./Button.svelte";
  import Settings from "./Settings.svelte";
  import { fade } from "svelte/transition";
  import Pebble from "./Pebble.svelte";

  let h = $derived(game.settings.height);
  let w = $derived(game.settings.width);

  let settingsView = $state(false);

  const settings = () => {
    settingsView = true;
  };

  const restart = () => {
    restartGame();
  };

  const apply = () => {
    settingsView = false;
    applySettings();
  };

  const cancel = () => {
    settingsView = false;
    cancelSettings();
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
          class="m-[.5cqh] grid aspect-square rounded-[17.5%] bg-gray-100"
          style:height="calc(min(100cqh/{h}, 100cqw/{w}) - 1cqh)"
          onclick={() => processMove(x, y)}
        >
          <Pebble {...game.board[y][x]} />
        </button>
      {/each}
    {/each}
  </div>

  <div class="grid grid-cols-[1fr] grid-rows-[1fr_auto] p-[2.5cqw]">
    {#if !settingsView}
      <div class="col-[1/2] row-[1/2]" transition:fade={{ duration: 150 }}>
        <PlayerDisplay />
      </div>
    {:else}
      <div class="col-[1/2] row-[1/2]" transition:fade={{ duration: 150 }}>
        <Settings />
      </div>
    {/if}

    <div
      class={["flex gap-[2.5cqw]", isWeb ? "justify-between" : "justify-end"]}
    >
      <Button
        aria-label={settingsView ? "Apply Settings" : "Settings"}
        onclick={settingsView ? apply : settings}
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
