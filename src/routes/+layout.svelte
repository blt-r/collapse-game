<script lang="ts">
  import { dev } from "$app/environment";
  import "../app.css";

  $effect(() => {
    if (!dev && navigator.serviceWorker) {
      navigator.serviceWorker.register("/service-worker.js");
    }
  });

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="logo.svg" />
  <link rel="manifest" href="manifest.json" />
  <title>Collapse</title>
</svelte:head>

<div class="grid h-full place-items-center">
  <main
    class="@container-[size] aspect-video h-[min(100dvh,100dvw/16*9)] overflow-hidden **:select-none"
  >
    {@render children?.()}
  </main>
</div>
