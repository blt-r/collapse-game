<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import PlayIcon from "@lucide/svelte/icons/play";
  import XIcon from "@lucide/svelte/icons/x";
  import { clickSound } from "$lib/sound.ts";
  import Button from "./Button.svelte";
  import type { Settings as GameSettings } from "./game";
  import Pebble from "./Pebble.svelte";
  import { PLAYER_NAMES } from "./player-meta";

  let {
    settings = $bindable(),
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    autoBoardSize,
  }: {
    settings: GameSettings;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    autoBoardSize: (playerCount: number) => { width: number; height: number };
  } = $props();

  let playerCount = $derived(settings.players.filter(Boolean).length);
  let autoSize = $derived(autoBoardSize(playerCount));

  let canDecWidth = $derived(settings.customSize && settings.width > minWidth);
  let canIncWidth = $derived(settings.customSize && settings.width < maxWidth);
  let canDecHeight = $derived(
    settings.customSize && settings.height > minHeight,
  );
  let canIncHeight = $derived(
    settings.customSize && settings.height < maxHeight,
  );

  // update dimensions automatically when customSize is off
  $effect(() => {
    if (!settings.customSize) {
      settings.width = autoSize.width;
      settings.height = autoSize.height;
    }
  });

  const adjustWidth = (delta: -1 | 1) => {
    if (delta < 0 && canDecWidth) settings.width--;
    if (delta > 0 && canIncWidth) settings.width++;
  };

  const adjustHeight = (delta: -1 | 1) => {
    if (delta < 0 && canDecHeight) settings.height--;
    if (delta > 0 && canIncHeight) settings.height++;
  };
</script>

<div class="text-sm">
  <p>Select Players:</p>
  <div class="mx-4 grid grid-cols-3 gap-0.75">
    {#each settings.players as _, p (p)}
      <button
        class={[
          "grid aspect-square cursor-pointer rounded-[17.5%] transition-colors delay-10 duration-150",
          settings.players[p] ? "bg-green-200" : "bg-gray-100 *:opacity-25",
        ]}
        aria-label="Enable {PLAYER_NAMES[p]} Player"
        role="checkbox"
        aria-checked={settings.players[p]}
        onclick={() => {
          clickSound();
          settings.players[p] = !settings.players[p];
        }}
      >
        <Pebble player={p} dots={settings.players[p] ? 3 : 1} />
      </button>
    {/each}
  </div>

  <div class="mt-2 flex flex-col">
    <label
      class="flex w-fit cursor-pointer items-center gap-1.5 select-none"
      aria-label="Custom board size"
    >
      <Button
        size="small"
        role="checkbox"
        aria-checked={settings.customSize}
        onclick={() => (settings.customSize = !settings.customSize)}
      >
        <CheckIcon
          class={[
            "scale-125 transition-opacity duration-150",
            settings.customSize || "opacity-0",
          ]}
        />
      </Button>
      Custom Board Size
    </label>

    <div class="mt-2 flex items-center justify-center">
      <Button
        aria-label="Decrease width"
        size="small"
        disabled={!canDecWidth}
        onclick={() => adjustWidth(-1)}
      >
        <PlayIcon class="rotate-180" />
      </Button>
      <span class="w-6 text-center">{settings.width}</span>
      <Button
        aria-label="Increase width"
        size="small"
        disabled={!canIncWidth}
        onclick={() => adjustWidth(1)}
      >
        <PlayIcon />
      </Button>
      <XIcon class="size-3" />
      <Button
        aria-label="Decrease height"
        size="small"
        disabled={!canDecHeight}
        onclick={() => adjustHeight(-1)}
      >
        <PlayIcon class="rotate-180" />
      </Button>
      <span class="w-6 text-center">{settings.height}</span>
      <Button
        aria-label="Increase height"
        size="small"
        disabled={!canIncHeight}
        onclick={() => adjustHeight(1)}
      >
        <PlayIcon />
      </Button>
    </div>
  </div>

  <label
    class="mt-2 flex w-fit cursor-pointer items-center gap-1.5 select-none"
    aria-label="Borderless mode"
  >
    <Button
      size="small"
      role="checkbox"
      aria-checked={settings.borderless}
      onclick={() => (settings.borderless = !settings.borderless)}
    >
      <CheckIcon
        class={[
          "scale-125 transition-opacity duration-150",
          settings.borderless || "opacity-0",
        ]}
      />
    </Button>
    Borderless Mode
  </label>
</div>
