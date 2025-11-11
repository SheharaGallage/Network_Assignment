# Chat Backend (Java WSS server)

This module implements a simple secure WebSocket (WSS) server using Jetty.

Quick start

1. Generate a Java keystore (example):

```bash
keytool -genkeypair -alias chatserver -keyalg RSA -keysize 2048 -keystore keystore.jks -validity 3650
# when prompted, use password: changeit (or set a custom one and pass it via -Dkeystore.pass)
```

2. Build and run with Maven:

```bash
cd backend
mvn package
mvn -Dkeystore.path=./keystore.jks -Dkeystore.pass=changeit exec:java
```

Server will start on https WSS port 8443 and host a WebSocket endpoint at `/chat`.

Application protocol

- JSON messages with `type` field: `join`, `message`, `private`, `note`, `theme`, `file`, `list`.
- Examples:
  - { "type": "join", "username": "alice" }
  - { "type": "message", "content": "Hello" }
  - { "type": "private", "to": "bob", "content": "hi" }

Notes

- This is a minimal reference implementation intended for educational / demo purposes.
- For production, add authentication, input validation, rate limiting, better error handling and persistence.
