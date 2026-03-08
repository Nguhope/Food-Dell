# Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

# Clean install dependencies
RUN npm ci

# Install nodemon globally
RUN npm install -g nodemon

# Copy all source files
COPY . .

# Rebuild native modules for Linux
RUN npm rebuild bcrypt --build-from-source

EXPOSE 4000

CMD ["nodemon", "server.js"]