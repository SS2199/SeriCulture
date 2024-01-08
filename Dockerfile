# Use an official Node.js runtime as the base image for the build stage
FROM node:16 as build

# Set the working directory in the container
WORKDIR /src

# Copy the package.json and package-lock.json from the Angular app directory to the container
COPY ./package*.json./

# Install app dependencies
RUN npm install

# Install the Ionic CLI globally
RUN npm install -g ionic

# Copy the rest of the application code to the working directory
COPY . .

# Build the Ionic app
RUN ionic build

# Expose the port that the app will run on (if necessary)
EXPOSE 4200

# Use the CMD instruction to specify the command to run when starting the container
CMD ["ionic", "serve", "--host=0.0.0.0", "--disable-host-check"]