<script lang="ts">
  import Button from "./Button.svelte";
  import ExpandIcon from "@lucide/svelte/icons/expand";
  import ShrinkIcon from "@lucide/svelte/icons/shrink";

  let fsElement = $state(null);
  let isFullscreen = $derived(fsElement !== null);

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen({ navigationUI: "hide" });
    }
  };
</script>

<svelte:document bind:fullscreenElement={fsElement} />

<Button
  aria-label="Toggle Fullscreen"
  class="rounded-[1cqw] p-[1.2cqw]"
  onclick={toggleFullscreen}
>
  {#if !isFullscreen}
    <ExpandIcon size="100%" />
  {:else}
    <ShrinkIcon size="100%" />
  {/if}
</Button>
