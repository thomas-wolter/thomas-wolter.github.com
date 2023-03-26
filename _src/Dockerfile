FROM ubuntu:16.04

RUN apt update
RUN apt install -y rsync curl python3 build-essential pkg-config libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev dos2unix
RUN mkdir -p /www/app
RUN mkdir -p /dist
COPY . /www/app
WORKDIR /www/app
RUN dos2unix install_node.sh
RUN ./install_node.sh