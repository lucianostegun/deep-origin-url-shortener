# Dockerfile
# Use Node.js image as the base image
FROM node:22-alpine3.20

# Set the environment to development
ENV NODE_ENV development

# Create a directory for the app
WORKDIR /application

# Set Locale
ENV TZ=UTC
ENV LC_ALL=en_US.UTF-8
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# change default shell from ash to bash
RUN apk update && apk upgrade && apk add bash nano
RUN sed -i -e "s/bin\/ash/bin\/bash/" /etc/passwd

# Install dependencies
COPY ./docker/app/start-container.sh /usr/local/bin/start-container
RUN chmod +x /usr/local/bin/start-container

# Expose the port the app runs on
EXPOSE 80

# Start the application
ENTRYPOINT ["start-container"]
