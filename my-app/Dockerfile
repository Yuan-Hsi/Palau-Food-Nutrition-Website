FROM node:20-bullseye-slim

WORKDIR /app

# Copy package.json AND .npmrc first
COPY package.json .npmrc ./

# Then run npm install
RUN npm install

# Copy the rest of the files
COPY . .

EXPOSE 3000

CMD ["npm","start"]
