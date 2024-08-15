FROM node:latest as build-step
WORKDIR /app
COPY package.json ./
RUN npm install -f
COPY . .
EXPOSE 4200
CMD npm run start