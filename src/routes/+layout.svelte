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

{@render children?.()}
