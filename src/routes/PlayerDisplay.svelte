<script lang="ts">
  import { flip } from "svelte/animate";
  import { PLAYER_COLORS, PLAYER_NAMES, game } from "./game.svelte.ts";

  const players = $derived([
    ...game.alivePlayers.flatMap((alive, p) => (alive ? [{ alive, p }] : [])),
    ...game.playerDeaths.map((p) => ({ alive: false, p })),
  ]);
</script>

<ul
  class={[
    "flex flex-col",
    players.length <= 6
      ? "gap-[.8cqw] text-[3cqw] [&>li]:p-[.8cqw]"
      : players.length <= 8
        ? "gap-[.7cqw] text-[2cqw] [&>li]:p-[.7cqw]"
        : "gap-[.7cqw] text-[1.8cqw] [&>li]:p-[.7cqw]",
  ]}
>
  {#each players as { alive, p } (p)}
    <li
      style:background-color={PLAYER_COLORS[p]}
      class={[
        "rounded-[1cqw] font-bold outline-[.5cqw] transition-[outline-color,opacity] duration-150",
        !alive && "opacity-25",
        game.currentPlayer === p && !game.inAnimation
          ? "outline-indigo-800"
          : "outline-transparent",
      ]}
      animate:flip={{ duration: 300 }}
    >
      {PLAYER_NAMES[p]} Player
    </li>
  {/each}
</ul>
