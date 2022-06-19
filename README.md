# Ulmus Desktop [WIP]

A framework for building cross-platform desktop applications entirely in Elm! It uses electron under the hood.


## Getting started with the template

You can clone/fork the template to get started quickly
```sh
git clone https://github.com/phenax/ulmus-desktop-example.git my-ulmus-app
cd my-ulmus-app
yarn

yarn dev # To start application in dev mode
```


## CLI

* Run your application in dev mode
```sh
ulmus run
```

* Run an optimized build of the application
```sh
ulmus run --disable-dev
```

* Bundle your app for the host platform
```sh
ulmus bundle
```

* Bundle your app for linux, windows and macos platforms
```sh
ulmus bundle --platform linux win32 darwin
```

