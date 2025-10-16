<script lang="ts">
  import Cell from "./Cell.svelte";
  import FullscreenButton from "./FullscreenButton.svelte";
  import { state } from "./game.svelte.ts";
  import PlayerDisplay from "./PlayerDisplay.svelte";
  import RestartButton from "./RestartButton.svelte";
</script>

<div class="fixed inset-0">
  <main
    class="@container-[size] mx-auto flex aspect-video max-h-dvh items-stretch overflow-hidden"
  >
    <div class="grid grid-cols-10">
      {#each state.board as row, y}
        {#each row as _, x}
          <div class="h-[calc(100cqh / 8)] aspect-square p-[.3cqw]">
            <Cell {x} {y} />
          </div>
        {/each}
      {/each}
    </div>

    <div class="flex grow flex-col justify-between p-[3cqw] text-[3cqw]">
      <PlayerDisplay />

      <div class="flex justify-end gap-[1cqw]">
        <RestartButton />
        <FullscreenButton />
      </div>
    </div>
  </main>
</div>
