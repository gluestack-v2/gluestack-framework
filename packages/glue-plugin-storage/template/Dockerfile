FROM node:14

# Install MinIO client
RUN wget https://dl.minio.io/client/mc/release/linux-amd64/mc
RUN chmod +x mc
RUN mv mc /usr/bin

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose port 10310
EXPOSE 10310
