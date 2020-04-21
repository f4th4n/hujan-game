## Installation

### Create key and cert for starting server

```
$ cd ./excluded
$ openssl genrsa 2048 > key.pem
$ openssl req -x509 -days 1000 -new -key key.pem -out cert.pem
```

### Development

In index.html line 22 set script src="dist/app.js"
In index.html line 23 set script src="dist/vendor.js"

```
terminal 1
$ yarn start

terminal 2
$ yarn watch
```

#### Test with facebook API

https://www.facebook.com/embed/instantgames/{GAME_ID}/player?game_url=https%3A%2F%2Flocalhost%3A8080

#### Test without facebook API

https://localhost:8080

### Publish

#### Windows

In index.html line 22 set script src="dist/app.min.js"
In index.html line 23 set script src="dist/vendor.min.js"

```
npm run build-js
```

Zip all files, then upload to facebook

#### Linux

```
$ yarn build-project
```

Upload project-direct.zip to facebook
