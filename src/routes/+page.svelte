<script lang="ts">
  import Cell from "./Cell.svelte";
  import FullscreenButton from "./FullscreenButton.svelte";
  import PlayerDisplay from "./PlayerDisplay.svelte";
  import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import CheckIcon from "@lucide/svelte/icons/check";
  import XIcon from "@lucide/svelte/icons/x";
  import {
    applySettings,
    cancelSettings,
    restartGame,
    game,
  } from "./game.svelte.ts";
  import Button from "./Button.svelte";
  import Settings from "./Settings.svelte";
  import { Capacitor } from "@capacitor/core";
  import { fade, fly, slide } from "svelte/transition";

  let h = $derived(game.settings.height);
  let w = $derived(game.settings.width);

  let sidebarView: "players" | "settings" = $state("players");

  const isWeb = Capacitor.getPlatform() === "web";
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

    <div class="flex flex-col p-[2.5cqw]">
      <div class="relative grow">
        {#if sidebarView === "players"}
          <div class="absolute size-full" transition:fade={{ duration: 150 }}>
            <PlayerDisplay />
          </div>
        {:else if sidebarView === "settings"}
          <div class="absolute size-full" transition:fade={{ duration: 150 }}>
            <Settings />
          </div>
        {/if}
      </div>

      <div
        class={[
          "flex h-[6.5cqw] gap-[2.5cqw]",
          isWeb ? "justify-between" : "justify-end",
        ]}
      >
        {#if sidebarView === "players"}
          <Button
            aria-label="Settings"
            class="rounded-[1cqw] p-[1.2cqw]"
            onclick={() => (sidebarView = "settings")}
          >
            <SettingsIcon size="100%" />
          </Button>

          <Button
            aria-label="Restart Game"
            class="rounded-[1cqw] p-[1.2cqw]"
            onclick={restartGame}
          >
            <RotateCcwIcon size="100%" />
          </Button>
        {:else if sidebarView === "settings"}
          <Button
            aria-label="Apply Settings"
            class="rounded-[1cqw] p-[1.2cqw]"
            onclick={() => {
              sidebarView = "players";
              applySettings();
            }}
          >
            <CheckIcon size="100%" />
          </Button>

          <Button
            aria-label="Cancel Settings"
            class="rounded-[1cqw] p-[1.2cqw]"
            onclick={() => {
              sidebarView = "players";
              cancelSettings();
            }}
          >
            <XIcon size="100%" />
          </Button>
        {/if}

        {#if isWeb}
          <FullscreenButton />
        {/if}
      </div>
    </div>
  </main>
</div>
