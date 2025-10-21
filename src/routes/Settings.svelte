<script lang="ts">
  import Pebble from "./Pebble.svelte";
  import XIcon from "@lucide/svelte/icons/x";
  import PlayIcon from "@lucide/svelte/icons/play";
  import {
    MAX_HEIGHT,
    MAX_WIDTH,
    MIN_HEIGHT,
    MIN_WIDTH,
    PLAYER_NAMES,
    settings,
  } from "./game.svelte.ts";
  import Button from "./Button.svelte";

  let can_dec_width = $derived(settings.width > MIN_WIDTH);
  let can_inc_width = $derived(settings.width < MAX_WIDTH);
  let can_dec_height = $derived(settings.height > MIN_HEIGHT);
  let can_inc_height = $derived(settings.height < MAX_HEIGHT);

  const dec_width = () => can_dec_width && settings.width--;
  const inc_width = () => can_inc_width && settings.width++;
  const dec_height = () => can_dec_height && settings.height--;
  const inc_height = () => can_inc_height && settings.height++;
</script>

<div class="text-[2.3cqw]">
  <p>Select Players:</p>
  <div class="mx-[2cqw] grid grid-cols-3 gap-[.5cqw]">
    {#each settings.players as _, p (p)}
      <label
        class={[
          "block aspect-square cursor-pointer rounded-[1cqw] p-[.5cqw] transition-colors delay-10 duration-150",
          settings.players[p] ? "bg-green-200" : "bg-gray-100 [&>*]:opacity-25",
        ]}
        aria-label="Enable {PLAYER_NAMES[p]} Player"
      >
        <input
          type="checkbox"
          bind:checked={settings.players[p]}
          class="hidden"
        />
        <Pebble player={p} dots={settings.players[p] ? 3 : 1} />
      </label>
    {/each}
  </div>

  <p class="mt-[.8cqw]">Board Size:</p>
  <div class="flex items-center">
    <Button
      aria-label="Increase"
      class="rounded-[.7cqw] p-[.75cqw]"
      disabled={!can_dec_width}
      onclick={dec_width}
    >
      <PlayIcon class="size-[2.1cqw] rotate-180" />
    </Button>
    <span class="w-[4cqw] text-center">{settings.width}</span>
    <Button
      aria-label="Decrease"
      class="rounded-[.7cqw] p-[.75cqw]"
      disabled={!can_inc_width}
      onclick={inc_width}
    >
      <PlayIcon class="size-[2.1cqw]" />
    </Button>
    <XIcon class="inline size-[2.1cqw]" />
    <Button
      aria-label="Increase"
      class="rounded-[.7cqw] p-[.75cqw]"
      disabled={!can_dec_height}
      onclick={dec_height}
    >
      <PlayIcon class="size-[2.1cqw] rotate-180" />
    </Button>
    <span class="w-[4cqw] text-center">{settings.height}</span>
    <Button
      aria-label="Decrease"
      class="rounded-[.7cqw] p-[.75cqw]"
      disabled={!can_inc_height}
      onclick={inc_height}
    >
      <PlayIcon class="size-[2.1cqw]" />
    </Button>
  </div>

  <p class="mt-[.8cqw]">Borderless Mode:</p>
  <label
    class="flex w-fit cursor-pointer items-center gap-[1cqw] select-none"
    aria-label="Enable Borderless Mode"
  >
    <input
      type="checkbox"
      bind:checked={settings.borderless}
      class="size-[2.5cqw]"
    />
    Enable
  </label>
</div>
