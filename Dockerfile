# Use an official Node.js runtime as the base image for the build stage
FROM node:12 as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json from the Angular app directory to the container
COPY ./package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Install the Ionic CLI globally
RUN npm install -g ionic

# Build the Ionic app
 RUN ionic build

# Expose the port that the app will run on (if necessary)
EXPOSE 4200

# Use the CMD instruction to specify the command to run when starting the container
CMD ["npm", "start"]
