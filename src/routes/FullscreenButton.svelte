<script lang="ts">
  import ExpandIcon from "@lucide/svelte/icons/expand";
  import ShrinkIcon from "@lucide/svelte/icons/shrink";
  import Button from "./Button.svelte";

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

<Button aria-label="Toggle Fullscreen" onclick={toggleFullscreen}>
  {#if !isFullscreen}
    <ExpandIcon />
  {:else}
    <ShrinkIcon />
  {/if}
</Button>
