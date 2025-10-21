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
    "block size-[6.5cqw] cursor-pointer rounded-[1cqw] bg-gray-200 p-[1.2cqw]",
    cls,
  ]}
>
  {@render children()}
</button>
