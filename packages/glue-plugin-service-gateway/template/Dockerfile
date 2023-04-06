FROM node:lts

# Install your app
WORKDIR /gluestack/INSTANCENAME

COPY package*.json ./

RUN ["npm", "config", "set", "legacy-peer-deps", "true"]
RUN ["npm", "install"]

COPY . .

EXPOSE 3030 3003

# Install npm dependencies
RUN ["npm", "install"]

# Run the app
CMD ["sh", "-c", "npm run dev --workspace @project/INSTANCENAME"]

