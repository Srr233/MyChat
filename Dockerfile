FROM node

WORKDIR /node/chat

COPY package.json /node/chat

RUN npm install

COPY . /node/chat

EXPOSE 3000

CMD ["node", "src/index.js"]