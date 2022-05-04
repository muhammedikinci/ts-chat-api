<br />
<p align="center">
  <h3 align="center">Chat API</h3>
  <p align="center">
    Chat API project with RabbmiMQ, MongoDB, SocketIO and TypeScript
    <br />
    <br />
  </p>
</p>

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#installation-without-docker">Installation Without Docker</a></li>
      </ul>
    </li>
    <li><a href="#api-reference">API Reference</a></li>
    <li><a href="#test">Test</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## Getting Started

### Prerequisites

* node & npm & npx & typescript
* Docker

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/muhammedikinci/ts-chat-api
   cd ./ts-chat-api
   ```
2. Run docker compose file (with data)
   ```sh
   docker compose -p "chat" up -d
   ```

- API can be restarted many times until RabbitMQ and MongoDB is ready to accept the connection
  ```yaml
  restart: on-failure
  ```

- Frontend project https://github.com/muhammedikinci/chat-client

### Installation Without Docker

This action needs the installation of RabbitMQ and MongoDB manually.

1. Clone the repo
   ```sh
   git clone https://github.com/muhammedikinci/ts-chat-api
   cd ./ts-chat-api
   ```
2. Install dependencies
   ```sh
   npm install -g typescript
   npm install -g ts-node
   npm install
   ```

3. Start RabbitMQ and MongoDB Services

4. Build typescript
   ```sh
   npm run build
   ```

5. Start
   ```sh
   npm run start
   ```

## API Reference

### POST /register

```sh
curl --request POST \
  --url http://localhost:8291/api/register \
  --header 'Content-Type: application/json' \
  --data '{
	"username":"muhammed",
	"password":"123456789"
    }'
```

### POST /login

```sh
curl --request POST \
  --url http://localhost:8291/api/login \
  --header 'Content-Type: application/json' \
  --data '{
	"username":"muhammed",
	"password":"123456789"
    }'
```

## Test
```sh
npm run test
```

## Contact

Muhammed İKİNCİ - muhammedikinci@outlook.com