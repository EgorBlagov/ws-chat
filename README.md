# **Simple** Chat

Simple traning project, that implements usable websocket chat, with rooms support. In this project I was experimenting with Grid CSS,
Bootstrap, and CSS layout at all, I tried to make responsive layout. Also, I did some experiments with Socket.io, typing declarations between server and client, and
also tried to implement some custom React Hooks.

## Built with

-   React.js
-   Socket.io
-   Express.js
-   Typescript
-   Webpack
-   Docker, Docker Compose
-   Prettier, TSLint
-   Bootstrap

## Getting Started

`.env` file is required, check `.env.template` for more information. The repository has Makefile, that already contains commands to bringup Docker images for development and production.

```bash
#!/bin/bash

make dev # start development server
make prod # builds and starts production image
make clean # teardowns dev and prod Docker instances

```

## Authors

-   **Egor Blagov** - _All work_ - [github](https://github.com/EgorBlagov), [mail](mailto:e.m.blagov@gmail.com)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
