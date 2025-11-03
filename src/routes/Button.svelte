<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { clickSound } from "$lib/sound.ts";

  let {
    children,
    class: cls,
    size = "big",
    onclick,
    ...rest
  }: {
    children: Snippet;
    size?: "big" | "small";
  } & HTMLButtonAttributes = $props();
</script>

<button
  {...rest}
  onclick={(e) => {
    clickSound();
    onclick?.(e);
  }}
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
