<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import PlayIcon from "@lucide/svelte/icons/play";
  import XIcon from "@lucide/svelte/icons/x";
  import { clickSound } from "$lib/sound.ts";
  import Button from "./Button.svelte";
  import {
    autoBoardSize,
    MAX_HEIGHT,
    MAX_WIDTH,
    MIN_HEIGHT,
    MIN_WIDTH,
    PLAYER_NAMES,
    settings,
  } from "./game.svelte.ts";
  import Pebble from "./Pebble.svelte";

  let playerCount = $derived(settings.players.filter(Boolean).length);
  let autoSize = $derived(autoBoardSize(playerCount));

  let can_dec_width = $derived(
    settings.customSize && settings.width > MIN_WIDTH,
  );
  let can_inc_width = $derived(
    settings.customSize && settings.width < MAX_WIDTH,
  );
  let can_dec_height = $derived(
    settings.customSize && settings.height > MIN_HEIGHT,
  );
  let can_inc_height = $derived(
    settings.customSize && settings.height < MAX_HEIGHT,
  );

  // update dimensions automatically when customSize is off
  $effect(() => {
    if (!settings.customSize) {
      settings.width = autoSize.width;
      settings.height = autoSize.height;
    }
  });

  const dec_width = () => can_dec_width && settings.width--;
  const inc_width = () => can_inc_width && settings.width++;
  const dec_height = () => can_dec_height && settings.height--;
  const inc_height = () => can_inc_height && settings.height++;
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
        disabled={!can_dec_width}
        onclick={dec_width}
      >
        <PlayIcon class="rotate-180" />
      </Button>
      <span class="w-6 text-center">{settings.width}</span>
      <Button
        aria-label="Increase width"
        size="small"
        disabled={!can_inc_width}
        onclick={inc_width}
      >
        <PlayIcon />
      </Button>
      <XIcon class="size-3" />
      <Button
        aria-label="Decrease height"
        size="small"
        disabled={!can_dec_height}
        onclick={dec_height}
      >
        <PlayIcon class="rotate-180" />
      </Button>
      <span class="w-6 text-center">{settings.height}</span>
      <Button
        aria-label="Increase height"
        size="small"
        disabled={!can_inc_height}
        onclick={inc_height}
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
