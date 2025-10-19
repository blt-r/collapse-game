<script lang="ts">
  import Pebble from "$lib/components/Pebble.svelte";
  import { PLAYER_NAMES, settings } from "$lib/game.svelte.ts";
</script>

<div>
  <span class="text-[2.5cqw]">Select Players:</span>

  <div class="mt-[1cqw] grid grid-cols-3 gap-[.5cqw]">
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
</div>
