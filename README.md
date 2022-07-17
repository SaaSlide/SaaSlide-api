# Comment lancer le back ?

Clone la branche main et lancer votre docker

A la racine créer un .env

- `NAME_APP=SAASLIDE`
- `PORT=4000`
- `SOCKET_PORT=4001`
- `FRONT_URL=http://localhost:3000`
- `NAME_DB=lucasmoreno`
- `PASSWORD_DB=lucasmoreno`
- `JWT_SIGN_SECRET=iegzjpfp0993NjPDjdfjnjkzfjkzfnndond3D3JNdonnoD3D3`
- `AWSAccessKeyId=AKIA3YK3WRKMVHVPWT5Y`
- `AWSSecretKey=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`
- `bucketName=saaslide-test-charles`

A la racine lancer le docker

### `docker-compose up --build`
