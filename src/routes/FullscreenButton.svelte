<script lang="ts">
  import ExpandIcon from "@lucide/svelte/icons/expand";
  import ShrinkIcon from "@lucide/svelte/icons/shrink";
  import Button from "./Button.svelte";

  let fsElement: Element | null = $state(null);
  let isFullscreen = $derived(Boolean(fsElement));

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen({ navigationUI: "hide" });
    }
  };

  $effect(() => {
    if (isFullscreen) {
      if ("lock" in screen.orientation) {
        (
          screen.orientation as {
            lock: (orientation: "landscape") => Promise<void>;
          }
        ).lock("landscape");
      }
    }
  });
</script>

<svelte:document bind:fullscreenElement={fsElement} />

<Button aria-label="Toggle Fullscreen" onclick={toggleFullscreen}>
  {#if !isFullscreen}
    <ExpandIcon />
  {:else}
    <ShrinkIcon />
  {/if}
</Button>
