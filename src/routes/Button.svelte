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
    "block bg-gray-200 enabled:cursor-pointer",
    "disabled:bg-gray-100 disabled:text-gray-400",
    "transition-[background_scale] duration-75",
    "active:enabled:scale-95 active:enabled:bg-gray-300",
    size === "small" && "rounded-[.7cqw] p-[.75cqw] [&>svg]:size-[2.1cqw]",
    size === "big" && "rounded-[1cqw] p-[1.2cqw] [&>svg]:size-[4.1cqw]",
    cls,
  ]}
>
  {@render children()}
</button>
