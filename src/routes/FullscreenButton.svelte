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
      document.documentElement.requestFullscreen({ navigationUI: "show" });
    }
  };
</script>

<svelte:document bind:fullscreenElement={fsElement} />

<Button aria-label="Toggle Fullscreen" onclick={toggleFullscreen}>
  {#if !isFullscreen}
    <ExpandIcon size="100%" />
  {:else}
    <ShrinkIcon size="100%" />
  {/if}
</Button>
