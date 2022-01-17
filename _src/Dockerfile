FROM ubuntu:16.04

RUN apt update
RUN apt install -y rsync curl python3 build-essential pkg-config libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN mkdir -p /www/app
RUN mkdir -p /dist
COPY . /www/app
WORKDIR /www/app
RUN ./install_node.sh