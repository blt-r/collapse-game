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
    size === "small" && "rounded-2xl p-3.5 [&>svg]:size-10",
    size === "big" && "rounded-3xl p-5.5 [&>svg]:size-20",
    cls,
  ]}
>
  {@render children()}
</button>
