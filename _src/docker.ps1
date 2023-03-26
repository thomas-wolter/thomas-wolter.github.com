#docker run --rm -it --platform linux/amd64 $(docker build  --platform linux/amd64 -q .) bash
# docker build --platform linux/amd64 -t thomaswolter.de .
# docker run --rm -it --platform linux/amd64 thomaswolter.de bash
# docker rmi thomaswolter.de

docker build --platform linux/amd64 -t thomaswolter.de .
docker create --name thomaswolter-build thomaswolter.de
# docker run --rm -it --platform linux/amd64 thomaswolter.de bash
docker cp thomaswolter-build:/dist/. ../.
docker rm thomaswolter-build
docker rmi thomaswolter.de