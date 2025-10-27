import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { type Config } from "@sveltejs/kit";

const configWeb: Config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    serviceWorker: {
      register: false,
    },
  },
};

export const configAndroid: Config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: "./android/app/src/main/assets/public",
    }),
    serviceWorker: {
      register: false,
    },
    output: {
      bundleStrategy: "single",
    },
  },
};

export default process.env.VITE_ANDROID_BUILD ? configAndroid : configWeb;
