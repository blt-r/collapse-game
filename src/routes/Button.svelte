<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    children,
    class: cls,
    size = "big",
    ...rest
  }: {
    children: Snippet;
    size?: "big" | "small";
  } & HTMLButtonAttributes = $props();
</script>

<button
  {...rest}
  class={[
    "block cursor-pointer bg-gray-200",
    "disabled:cursor-default disabled:opacity-30",
    "transition-colors duration-150",
    size === "small" && "rounded-[.7cqw] p-[.75cqw] [&>svg]:size-[2.1cqw]",
    size === "big" && "rounded-[1cqw] p-[1.2cqw] [&>svg]:size-[4.1cqw]",
    cls,
  ]}
>
  {@render children()}
</button>
