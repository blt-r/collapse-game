<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    children,
    class: cls,
    ...rest
  }: { children: Snippet } & HTMLButtonAttributes = $props();
</script>

<button
  {...rest}
  class={[
    "block cursor-pointer bg-gray-200",
    "disabled:cursor-default disabled:opacity-30",
    "active:enabled:scale-95 active:enabled:bg-gray-300",
    "transition-[opacity,background-color,transform] duration-150",
    cls,
  ]}
>
  {@render children()}
</button>
