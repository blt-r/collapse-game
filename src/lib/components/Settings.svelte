<script lang="ts">
  import { PLAYER_NAMES, settings } from "$lib/game.svelte.ts";
</script>

<div class="text-[2cqw]">
  {#each settings.players as _, p (p)}
    <label
      class="flex cursor-pointer items-center gap-[.8cqw] rounded-[1cqw] p-[.5cqw]"
    >
      <input
        type="checkbox"
        bind:checked={settings.players[p]}
        class="size-[2cqw] accent-player-2"
      />
      {PLAYER_NAMES[p]} Player
    </label>
  {/each}
</div>
