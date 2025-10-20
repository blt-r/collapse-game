<script lang="ts">
  import { PLAYER_COLORS, PLAYER_NAMES, game } from "$lib/game.svelte.ts";

  const enabledPlayers: [boolean, number][] = $derived(
    game.alivePlayers.flatMap((status, p) =>
      status === null ? [] : [[status, p]],
    ),
  );
</script>

<ul
  class={[
    "flex flex-col",
    enabledPlayers.length <= 6
      ? "gap-[.8cqw] text-[3cqw] [&>li]:p-[.8cqw]"
      : enabledPlayers.length <= 8
        ? "gap-[.7cqw] text-[2cqw] [&>li]:p-[.7cqw]"
        : "gap-[.7cqw] text-[1.8cqw] [&>li]:p-[.7cqw]",
  ]}
>
  {#each enabledPlayers as [alive, p] (p)}
    <li
      style:background-color={PLAYER_COLORS[p]}
      class={[
        "rounded-[1cqw] font-bold outline-[.5cqw] transition-colors duration-150",
        !alive && "opacity-25",
        game.currentPlayer === p && !game.inAnimation
          ? "outline-indigo-800"
          : "outline-transparent",
      ]}
    >
      {PLAYER_NAMES[p]} Player
    </li>
  {/each}
</ul>
