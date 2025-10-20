<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="logo.svg" />
  <link rel="manifest" href="manifest.json" />
  <title>Collapse</title>
</svelte:head>

{@render children?.()}
