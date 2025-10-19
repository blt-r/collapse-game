<script lang="ts">
  import { PLAYER_NAMES, state } from "$lib/game.svelte.ts";

  const enabledPlayers: [boolean, number][] = $derived(
    state.alivePlayers.flatMap((status, p) =>
      status === null ? [] : [[status, p]],
    ),
  );
</script>

<ul
  class={[
    "flex flex-col gap-[.8cqw]",
    {
      "text-[3cqw]": enabledPlayers.length <= 6,
      "text-[2cqw]": enabledPlayers.length > 6,
    },
  ]}
>
  {#each enabledPlayers as [alive, p] (p)}
    <li
      style:background-color="var(--color-player-{p})"
      class={[
        "rounded-[1cqw] p-[.8cqw] font-bold outline-[.5cqw] transition-colors duration-150",
        !alive && "opacity-25",
        state.currentPlayer === p && !state.inAnimation
          ? "outline-indigo-800"
          : "outline-transparent",
      ]}
    >
      {PLAYER_NAMES[p]} Player
    </li>
  {/each}
</ul>
