FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
ARG PUBLIC_URL
RUN npm run build
WORKDIR /usr/src/app/dist
CMD ["npm", "run", "start"]
