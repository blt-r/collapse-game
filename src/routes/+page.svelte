<script lang="ts">
  import Cell from "$lib/components/Cell.svelte";
  import FullscreenButton from "$lib/components/FullscreenButton.svelte";
  import PlayerDisplay from "$lib/components/PlayerDisplay.svelte";
  import RestartButton from "$lib/components/RestartButton.svelte";
  import { HEIGHT, WIDTH } from "$lib/game.svelte.ts";
</script>

<div class="fixed inset-0">
  <main
    class="@container-[size] mx-auto flex aspect-video max-h-dvh items-stretch overflow-hidden"
  >
    <div class="grid grid-cols-10">
      {#each { length: HEIGHT } as _, y (y)}
        {#each { length: WIDTH } as _, x (x)}
          <div class="aspect-square h-[calc(100cqh/8)] p-[.3cqw]">
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
