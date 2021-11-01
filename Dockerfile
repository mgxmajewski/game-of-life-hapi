FROM node

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
#RUN apk add --no-cache make gcc g++ python && \
#  npm install && \
#  npm rebuild bcrypt --build-from-source && \
#  apk del make gcc g++ python
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]