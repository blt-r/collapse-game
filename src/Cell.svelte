<script lang="ts">
  import { fade } from "svelte/transition";
  import { PLAYER_COLORS, processMove, state } from "./game.svelte.ts";

  let { x, y }: { x: number; y: number } = $props();
  let cell = $derived(state.board[y][x]);
</script>

<button
  class="block size-full rounded-[1cqw] bg-gray-100 p-[.6cqw]"
  onclick={() => processMove(x, y)}
>
  {#if cell.player !== null}
    <div
      class={[
        "size-full rounded-[100dvh] transition-colors duration-150",
        "Dots",
      ]}
      style="background-color: {PLAYER_COLORS[cell.player]}"
      data-dots={cell.dots}
      transition:fade={{ duration: 75 }}
    >
      <span class="Dot1"></span>
      <span class="Dot2"></span>
      <span class="Dot3"></span>
      <span class="Dot4"></span>
      <span class="Dot5"></span>
    </div>
  {/if}
</button>

<style>
  .Dots {
    position: relative;
  }

  .Dots span {
    position: absolute;
    width: 26%;
    height: 26%;
    background-color: white;
    border-radius: 100dvh;
    top: 37%;
    left: 37%;
    transition: transform 150ms;
  }

  .Dots[data-dots="2"] {
    .Dot1,
    .Dot3,
    .Dot4,
    .Dot5 {
      transform: translate(-90%, 0);
    }

    .Dot2 {
      transform: translate(90%, 0);
    }
  }

  .Dots[data-dots="3"] {
    .Dot1,
    .Dot4,
    .Dot5 {
      transform: translate(0, calc(-1 * 90%));
    }

    .Dot2 {
      transform: translate(calc(-0.866 * 90%), calc(0.5 * 90%));
    }

    .Dot3 {
      transform: translate(calc(0.866 * 90%), calc(0.5 * 90%));
    }
  }

  .Dots[data-dots="4"] {
    .Dot1,
    .Dot5 {
      transform: translate(calc(-0.707 * 90%), calc(-0.707 * 90%));
    }

    .Dot2 {
      transform: translate(calc(0.707 * 90%), calc(-0.707 * 90%));
    }

    .Dot3 {
      transform: translate(calc(-0.707 * 90%), calc(0.707 * 90%));
    }

    .Dot4 {
      transform: translate(calc(0.707 * 90%), calc(0.707 * 90%));
    }
  }

  .Dots[data-dots="5"] {
    .Dot1 {
      transform: translate(calc(-0.707 * 90%), calc(-0.707 * 90%));
    }

    .Dot2 {
      transform: translate(calc(0.707 * 90%), calc(-0.707 * 90%));
    }

    .Dot3 {
      transform: translate(calc(-0.707 * 90%), calc(0.707 * 90%));
    }

    .Dot4 {
      transform: translate(calc(0.707 * 90%), calc(0.707 * 90%));
    }
  }
</style>
