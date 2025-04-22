# Build stage
FROM node:20 as build-stage

# Set the working directory in the container
WORKDIR /usr/app

# Install dependencies
RUN apt-get update && apt-get install -y ffmpeg curl

# Install Google Cloud SDK to fetch the secret from Secret Manager
RUN curl -sSL https://sdk.cloud.google.com | bash && \
    /root/google-cloud-sdk/bin/gcloud components install secret-manager

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --force

# Copy the rest of the application code to the working directory
COPY . .

# Fetch the service account key from Secret Manager and save it in the container
# Ensure your Cloud Build service account has Secret Manager Secret Accessor role
RUN /root/google-cloud-sdk/bin/gcloud secrets versions access latest --secret="vertex-key" > /usr/app/vertex-key.json

# Set the environment variable for Google Cloud SDK
ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/app/vertex-key.json

# Build the React app
RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000

# Specify the command to run your application
CMD ["npm", "start"]