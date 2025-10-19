<script lang="ts">
  import { fade } from "svelte/transition";
  import { processMove, state } from "$lib/game.svelte.ts";
  import Pebble from "$lib/components/Pebble.svelte";

  let { x, y }: { x: number; y: number } = $props();
  let cell = $derived(state.board[y][x]);
</script>

<button
  class="block size-full rounded-[1cqw] bg-gray-100 p-[.6cqw]"
  onclick={() => processMove(x, y)}
>
  {#if cell.player !== null}
    <Pebble player={cell.player} dots={cell.dots} />
  {/if}
</button>
