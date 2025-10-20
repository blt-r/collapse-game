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
    restartGame,
    game,
  } from "$lib/game.svelte.ts";
  import Button from "$lib/components/Button.svelte";
  import Settings from "$lib/components/Settings.svelte";

  let h = $derived(game.settings.height);
  let w = $derived(game.settings.width);

  let sidebarView: "players" | "settings" = $state("players");
</script>

<div class="grid h-full place-items-center">
  <main
    class="@container-[size] grid aspect-[16/9] h-[min(100dvh,100dvw/16*9)] grid-cols-[1fr_29.6875%] overflow-hidden"
  >
    <div class="@container-[size] grid size-full place-items-center">
      <div
        class="grid"
        style:grid-template-columns="repeat({w}, minmax(0, 1fr))"
      >
        {#each { length: h } as _, y (y)}
          {#each { length: w } as _, x (x)}
            <div
              class="aspect-square p-[.5cqh]"
              style:height="min(100cqh/{h}, 100cqw/{w})"
            >
              <Cell {x} {y} />
            </div>
          {/each}
        {/each}
      </div>
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

<style>
  :global {
    html,
    body {
      height: 100%;
    }
  }
</style>
