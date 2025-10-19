<script lang="ts">
  import Cell from "$lib/components/Cell.svelte";
  import FullscreenButton from "$lib/components/FullscreenButton.svelte";
  import PlayerDisplay from "$lib/components/PlayerDisplay.svelte";
  import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import CheckIcon from "@lucide/svelte/icons/check";
  import XIcon from "@lucide/svelte/icons/x";
  import {
    applySettings,
    cancelSettings,
    HEIGHT,
    restartGame,
    WIDTH,
  } from "$lib/game.svelte.ts";
  import Button from "$lib/components/Button.svelte";
  import Settings from "$lib/components/Settings.svelte";

  let sidebarView: "players" | "settings" = $state("players");
</script>

<div class="fixed inset-0">
  <main
    class="@container-[size] relative mx-auto flex aspect-video max-h-dvh overflow-hidden"
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

    <div class="flex grow flex-col justify-between p-[2.5cqw]">
      <div class={[sidebarView === "players" || "hidden"]}>
        <PlayerDisplay />
      </div>

      <div class={[sidebarView === "settings" || "hidden"]}>
        <Settings />
      </div>

      <div class="flex justify-between">
        <Button
          aria-label="Settings"
          class={[sidebarView === "settings" && "hidden"]}
          onclick={() => (sidebarView = "settings")}
        >
          <SettingsIcon size="100%" />
        </Button>

        <Button
          aria-label="Restart Game"
          class={[sidebarView === "settings" && "hidden"]}
          onclick={restartGame}
        >
          <RotateCcwIcon size="100%" />
        </Button>

        <Button
          aria-label="Apply Settings"
          class={[sidebarView !== "settings" && "hidden"]}
          onclick={() => {
            sidebarView = "players";
            applySettings();
          }}
        >
          <CheckIcon size="100%" />
        </Button>

        <Button
          aria-label="Cancel Settings"
          class={[sidebarView !== "settings" && "hidden"]}
          onclick={() => {
            sidebarView = "players";
            cancelSettings();
          }}
        >
          <XIcon size="100%" />
        </Button>

        <FullscreenButton />
      </div>
    </div>
  </main>
</div>
