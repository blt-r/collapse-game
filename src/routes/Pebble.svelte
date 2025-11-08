<script lang="ts">
  import { PLAYER_COLORS } from "./game.svelte";

  const { player, dots }: { player: number | null; dots: number } = $props();
</script>

<div
  class="inset-[10%] size-[80%] rounded-full transition-[background-color,opacity] duration-150"
  class:opacity-0={player === null}
  style:background-color={player === null ? "" : PLAYER_COLORS[player]}
  data-dots={dots}
>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>

<style>
  div {
    position: relative;
  }

  span {
    position: absolute;
    inset: 37%;
    background-color: white;
    border-radius: 100dvh;
    transition: translate 150ms;
    translate: calc(cos(var(--angle)) * 90%) calc(sin(var(--angle)) * -90%);
  }

  [data-dots="2"] {
    span:nth-of-type(1),
    span:nth-of-type(3),
    span:nth-of-type(4),
    span:nth-of-type(5) {
      --angle: 180deg;
    }

    span:nth-of-type(2) {
      --angle: 0deg;
    }
  }

  [data-dots="3"] {
    span:nth-of-type(1),
    span:nth-of-type(4),
    span:nth-of-type(5) {
      --angle: 90deg;
    }

    span:nth-of-type(2) {
      --angle: 210deg;
    }

    span:nth-of-type(3) {
      --angle: 330deg;
    }
  }

  [data-dots="4"] {
    span:nth-of-type(1),
    span:nth-of-type(5) {
      --angle: 135deg;
    }

    span:nth-of-type(2) {
      --angle: 45deg;
    }

    span:nth-of-type(3) {
      --angle: 225deg;
    }

    span:nth-of-type(4) {
      --angle: 315deg;
    }
  }

  [data-dots="5"] {
    span:nth-of-type(1) {
      --angle: 135deg;
    }

    span:nth-of-type(2) {
      --angle: 45deg;
    }

    span:nth-of-type(3) {
      --angle: 225deg;
    }

    span:nth-of-type(4) {
      --angle: 315deg;
    }
  }
</style>
