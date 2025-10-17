<script lang="ts">
  import { PLAYER_COLORS, PLAYER_NAMES, state } from "./game.svelte.ts";
</script>

<div>
  {#each state.alivePlayers as alive, i}
    <div
      style:background-color={PLAYER_COLORS[i]}
      class={[
        "mb-[1cqw] rounded-[1cqw] p-[1cqw] font-bold outline-[.5cqw] transition-colors duration-150",
        !alive && "opacity-25",
        state.currentPlayer === i && !state.inAnimation
          ? "outline-indigo-800"
          : "outline-transparent",
      ]}
    >
      {PLAYER_NAMES[i]} Player
    </div>
  {/each}
</div>
