<script lang="ts">
  import { clickSound } from "$lib/sound.ts";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

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
    size === "small" && "rounded-md p-1.25 [&>svg]:size-3.25",
    size === "big" && "rounded-lg p-2 [&>svg]:size-6.5",
    cls,
  ]}
>
  {@render children()}
</button>
