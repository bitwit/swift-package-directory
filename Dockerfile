
FROM ubuntu:16.04

LABEL maintainer="bitwit"

# Install CURL
RUN apt-get update && \
    apt-get -y install curl && \
    rm -rf /var/lib/apt/lists/*;

# Get Vapor repo including Swift
RUN curl -sL https://apt.vapor.sh | bash;

# Installing Swift & Vapor
RUN apt-get update && \
    apt-get -y install swift vapor && \
    rm -rf /var/lib/apt/lists/*;

RUN git config --global user.email "kyle@bitwit.ca" &&\
     git config --global user.name "Kyle Newsome"

WORKDIR /vapor

COPY . .

#COPY ./Public .
#COPY ./Sources .
#COPY ./Tests .
#COPY ./Package.swift .
#COPY ./Package.resolved .
#COPY ./.build .

RUN swift build --product Run

CMD ["sh", "-c", "swift run Run --hostname 0.0.0.0 --port $PORT"]
