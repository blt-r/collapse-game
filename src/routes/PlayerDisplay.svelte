<script lang="ts">
  import { flip } from "svelte/animate";
  import { game, PLAYER_COLORS, PLAYER_NAMES } from "./game.svelte.ts";

  const players = $derived([
    ...game.alivePlayers.flatMap((alive, p) => (alive ? [{ alive, p }] : [])),
    ...game.playerDeaths.map((p) => ({ alive: false, p })),
  ]);
</script>

<ul
  class={[
    " flex flex-col [&>li]:px-5",
    players.length <= 6
      ? "gap-4 text-6xl [&>li]:py-7"
      : players.length === 7
        ? "gap-3.5 text-5xl [&>li]:py-7"
        : players.length === 8
          ? "gap-3.5 text-4xl [&>li]:py-6"
          : "gap-3.5 text-4xl [&>li]:py-5",
  ]}
>
  {#each players as { alive, p } (p)}
    <li
      style:background-color={PLAYER_COLORS[p]}
      class={[
        "rounded-3xl font-bold outline-[calc(var(--spacing)*2.5)] transition-[outline-color,opacity] duration-150",
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
