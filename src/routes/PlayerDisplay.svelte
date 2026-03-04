<script lang="ts">
  import { flip } from "svelte/animate";
  import { PLAYER_COLORS, PLAYER_NAMES } from "./player-meta";

  let {
    alivePlayers,
    playerDeaths,
    currentPlayer,
    inAnimation,
  }: {
    alivePlayers: boolean[];
    playerDeaths: number[];
    currentPlayer: number;
    inAnimation: boolean;
  } = $props();

  const players = $derived([
    ...alivePlayers.flatMap((alive, p) => (alive ? [{ alive, p }] : [])),
    ...playerDeaths.map((p) => ({ alive: false, p })),
  ]);
</script>

<ul
  class={[
    "flex flex-col [&>li]:px-1.75",
    players.length <= 6
      ? "gap-1.25 text-xl [&>li]:py-1.5"
      : players.length === 7
        ? "gap-1 text-lg [&>li]:py-1"
        : players.length === 8
          ? "gap-1 text-base [&>li]:py-0.75"
          : "gap-0.75 text-sm [&>li]:py-1",
  ]}
>
  {#each players as { alive, p } (p)}
    <li
      style:background-color={PLAYER_COLORS[p]}
      class={[
        "rounded-lg font-bold outline-[calc(var(--spacing)*.75)] transition-[outline-color,opacity] duration-150",
        !alive && "opacity-25",
        currentPlayer === p && !inAnimation
          ? "outline-indigo-800"
          : "outline-transparent",
      ]}
      animate:flip={{ duration: 300 }}
    >
      {PLAYER_NAMES[p]} Player
    </li>
  {/each}
</ul>
