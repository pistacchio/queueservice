FROM mhart/alpine-node

COPY . /src
WORKDIR /src

RUN ["npm", "install"]

EXPOSE 3000

CMD ["/usr/local/bin/node", "server.js"]

# docker build -t queueservice .
# docker run -it -p 3000:3000 -e MAX_PROCESSES=3 queueservice /bin/bash
# docker run -p 3000:3000 -e MAX_PROCESSES=3 queueservice