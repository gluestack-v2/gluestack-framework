FROM node:lts

# Install your app
WORKDIR /gluestack

# Move artifacts
COPY . .

# Install dependencies
RUN npm run install-all

# Expose the port your app runs in
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start:website"]
