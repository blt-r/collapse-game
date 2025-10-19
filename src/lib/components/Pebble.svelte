<script lang="ts">
  import { PLAYER_COLORS } from "$lib/game.svelte";
  import { fade } from "svelte/transition";

  const { player, dots }: { player: number; dots: number } = $props();
</script>

<div
  class={["size-full rounded-[100dvh] transition-colors duration-150", "Dots"]}
  style:background-color={PLAYER_COLORS[player]}
  data-dots={dots}
  transition:fade={{ duration: 75 }}
>
  <span class="Dot1"></span>
  <span class="Dot2"></span>
  <span class="Dot3"></span>
  <span class="Dot4"></span>
  <span class="Dot5"></span>
</div>

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
