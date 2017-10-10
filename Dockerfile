FROM node
WORKDIR /usr/src/app
ENV PORT= CORSURLS="" DBHOST="" DBPORT=
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE ${PORT}
CMD ["npm", "start"]
