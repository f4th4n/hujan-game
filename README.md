## Installation

### Create key and cert for starting server

```
$ cd ./excluded
$ openssl genrsa 2048 > key.pem
$ openssl req -x509 -days 1000 -new -key key.pem -out cert.pem
$ yarn start
$ yarn watch
```

#### Test with facebook API

https://www.facebook.com/embed/instantgames/{GAME_ID}/player?game_url=https%3A%2F%2Flocalhost%3A8080

#### Test without facebook API

https://localhost:8080

### Publish

```
$ yarn build
```

- zip all files, then upload to facebook
