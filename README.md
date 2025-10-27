# A strategy game for multiple players

## Build the website

Install the dependencies with pnpm:

```sh
pnpm install
```

Build the project:

```sh
pnpm build
```

This will build the static website and output it to the `build` directory.

## Build the android app

After steps above run:

```sh
pnpm android
```

This will setup sources for the android build of the website in the `android` directory.

Then, open the `android` directory in Android Studio and build the app from there.
