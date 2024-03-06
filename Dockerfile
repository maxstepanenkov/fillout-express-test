# Use an official Node runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the application to the working directory
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Make port 3000 available to the outside of the Docker container
EXPOSE 3000

# Run the application when the Docker container launches
CMD ["npm", "start"]