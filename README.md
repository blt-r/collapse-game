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

This will build the website as an SPA and output it to the `build` directory.

## Build the android app

After steps above run:

```sh
pnpm android:sync
pnpm android:assets
```

This will copy the build artifacts from `build` to the Android Studio project in
`android` directory and generate static assets for the android app.

Then open the `android` directory in Android Studio and build the app from there.
