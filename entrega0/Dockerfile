# We use alpine for a lightweight (less memory) image
FROM node:12-alpine 
RUN apk add --no-cache python2 g++ make

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN ls -a

RUN yarn install

COPY . .

CMD [ "sh", "-c", "yarn nodemon src/index.js" ]

EXPOSE 3000