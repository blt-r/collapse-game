<script lang="ts">
  import { PLAYER_COLORS, PLAYER_NAMES, state } from "./game.svelte.ts";
</script>

<div class="font-bold">
  {#each state.alivePlayers as alive, i}
    <div
      style="background-color: {PLAYER_COLORS[i]}"
      class={[
        "mb-[1cqw] rounded-[1cqw] p-[1cqw]",
        {
          "opacity-25": !alive,
          "outline-[.5cqw] outline-indigo-800":
            state.currentPlayer === i && !state.inAnimation,
        },
      ]}
    >
      {PLAYER_NAMES[i]} Player
    </div>
  {/each}
</div>
