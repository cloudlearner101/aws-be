FROM node:16-alpine 

WORKDIR /app

COPY package.json ./
COPY fetchData.js/ ./fetchData.js
RUN npm i

# Set environment variables for your MySQL connection and port
ENV DB_HOST=database-1.cvggbeh9khty.ap-south-1.rds.amazonaws.com \
    DB_USER=admin \
    DB_PASSWORD=cloud101 \
    DB_DATABASE=demo \
    DB_CONNECTION_LIMIT=10 \
    PORT=9000

EXPOSE $PORT

CMD ["node", "fetchData.js"]
