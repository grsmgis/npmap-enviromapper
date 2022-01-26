FROM ubuntu:bionic

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=America/New_York

RUN apt-get update && apt-get install -y \
    vim \
    git \
    wget \
    bc \
    build-essential \
    python3 \
    python3-pip \
    openjdk-8-jdk \
    parallel \
    unzip \
    software-properties-common

RUN add-apt-repository -y ppa:ubuntugis/ppa && apt-get update && apt-get install -y gdal-bin libgdal-dev sqlite3

RUN apt-get install -y libvips libvips-dev libtiff5 optipng pngquant

RUN pip3 install gdal==2.4.2

RUN pip3 install mapbox mapboxcli gdal2mbtiles docopt

RUN apt-get install -y dos2unix

ENV GDAL_CACHEMAX=10000

RUN mkdir -p /app/data

RUN mkdir -p /root/.ssh
COPY to_mbgov_rsa.pem /root/.ssh
COPY to_mbproxy_rsa.pem /root/.ssh

RUN mkdir -p /app/data/tmp
# ENTRYPOINT ["/app/npmap-species/dockerrun.sh"]
