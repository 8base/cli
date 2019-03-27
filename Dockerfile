FROM node:11

WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm install
RUN mkdir prj

CMD ["npm", "run", "jest"]
