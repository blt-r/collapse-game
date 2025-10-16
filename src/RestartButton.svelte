<script lang="ts">
  import { initialState, state } from "./game.svelte.ts";

  const restartGame = () => {
    Object.assign(state, initialState());
  };
</script>

<button
  class="block size-[6.5cqw] cursor-pointer rounded-[1cqw] bg-gray-200 p-[1.2cqw]"
  aria-label="Restart Game"
  onclick={restartGame}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="lucide lucide-rotate-ccw-icon lucide-rotate-ccw"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
</button>
