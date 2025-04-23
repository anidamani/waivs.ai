# Build stage
FROM node:20 as build-stage

# Set the working directory in the container
WORKDIR /usr/app

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
# Assuming the secret is mounted under /vertex-key/vertex-key as in your configuration
ENV GOOGLE_APPLICATION_CREDENTIALS=/vertex-key/vertex-key

# Log the value of GOOGLE_APPLICATION_CREDENTIALS
RUN echo "GOOGLE_APPLICATION_CREDENTIALS is set to: $GOOGLE_APPLICATION_CREDENTIALS"

# Log the content of the credential file
RUN cat /vertex-key/vertex-key || echo "Failed to read the credential file."

# Expose port 3000 for the application
EXPOSE 3000

# Specify the command to run your application
CMD ["npm", "start"]