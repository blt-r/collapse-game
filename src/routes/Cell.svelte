<script lang="ts">
  import { processMove, game } from "./game.svelte.ts";
  import Pebble from "./Pebble.svelte";

  let { x, y }: { x: number; y: number } = $props();
  let cell = $derived(game.board[y][x]);
</script>

<button
  class="block size-full rounded-[17.5%] bg-gray-100 p-[.6cqw]"
  onclick={() => processMove(x, y)}
>
  {#if cell.player !== null}
    <Pebble player={cell.player} dots={cell.dots} />
  {/if}
</button>
