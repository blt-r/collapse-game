<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="collapse-game.svg" />
  <link rel="manifest" href="manifest.json" />
  <title>Collapse</title>
</svelte:head>

{@render children?.()}
