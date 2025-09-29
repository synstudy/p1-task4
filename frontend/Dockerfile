FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Install a simple web server to serve static files
RUN npm install -g serve

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]