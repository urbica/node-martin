FROM node:7-onbuild
MAINTAINER Stepan Kuzmin <to.stepan.kuzmin@gmail.com>

ENV NODE_ENV=production
ENV NPM_CONFIG_COLOR=false
ENV NPM_CONFIG_LOGLEVEL=warn

RUN echo 'deb http://ftp.us.debian.org/debian testing main contrib non-free' >> /etc/apt/sources.list.d/testing.list \
  && echo 'Package: *\nPin: release a=testing\nPin-Priority: 100' >> /etc/apt/preferences.d/testing \
  && apt-get -yqq update \
  && apt-get install -yqq -t testing gcc

EXPOSE 4000
ENTRYPOINT ["index.js", "--"]
