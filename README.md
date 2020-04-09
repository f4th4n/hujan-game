## Installation

### Create key and cert for starting server

```
$ cd ./excluded
$ openssl genrsa 2048 > key.pem
$ openssl req -x509 -days 1000 -new -key key.pem -out cert.pem
$ npx http-server --ssl -c-1 -p 8080 -a 127.0.0.1
```
