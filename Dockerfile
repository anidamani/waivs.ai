# Use the official Google Cloud SDK image
FROM google/cloud-sdk:slim as build-stage

# Set the working directory in the container
WORKDIR /usr/app

# Install ffmpeg (as you need it in your build)
RUN apt-get update && apt-get install -y ffmpeg

# Set the environment variables for Google Cloud authentication
ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/app/vertex-key.json

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .

# Fetch the service account key from Secret Manager and save it in the container
RUN gcloud secrets versions access latest --secret="vertex-key" > /usr/app/vertex-key.json

# Build the React app
RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000

# Specify the command to run your application
CMD ["npm", "start"]