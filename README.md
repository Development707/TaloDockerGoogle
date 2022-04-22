# 1 Docker local

## Tao Dockerfile

## Tao .dockerignore

node_modules
\*.md
.git
.gitignore
Dockerfile
.env

## Build Docker

-   `docker build -t talonoreply/api-talo:v1 .`
    -   -t name (tên docker hub / tên images)

## View images

-   docker images
-   Extension docker để check
-   Docker desktop tren win

## Run images

-   `docker run -p 4000:5000 talonoreply/api-talo:v1`
    -   -p: port docker (4000) port api (5000)
-   `docker run -it --rm --name api-talo -p 5000:5000 talonoreply/api-talo:v1`
    -   -it có thể tương tác lên terminal run
    -   -rm tự động xóa container
    -   --name đặc tên cho container (api-talo)

## Action images

Docker destop tương tác cho mau

-   `docker ps`
    -   Xem các container nào đang chạy
-   `docker ps -a`
    -   Xem tất cả các container
-   `docker stop name`
    -   name: tên lấy từ danh sách ở trên
-   `docker rm name`
    -   xóa theo name
-   `docker rm $(docker ps -q)`
    -   xóa tất cả các container
-   `docker rmi id`
    -   xóa các id theo tên

# 2 Public Docker Hub

Nên thêm .env vào dockerignore
Xem file bằng docker extension

-   `docker build -t talonoreply/api-talo:v2 .`
-   `docker run -it --rm --name api-talo --env-file .env -p 5000:5000 talonoreply/api-talo:v2`

## Push - Pull

-   `docker push talonoreply/api-talo:v2`
-   `docker pull talonoreply/api-talo:v2`

# 3 Docker Compose

-   `docker-compose -f docker-compose.yml up --build`

## Background

-   `docker-compose -f docker-compose.yml up --build -d`

## Chọn Service để restart

-   `docker-compose -f docker-compose.yml up talo-nodejs`

## Xóa các images rác NONE

-   `docker rmi $(docker images -f dangling=true -q)`

# 4 Docker Nginx

## Origination

-   `localhost`: talo_react
-   `localhost:3000`: talo_react
-   `localhost:3001`: talo_login
-   `localhost:5000`: talo_nodejs

## Component

-   `/`: talo_react
-   `/firebase/auth`: talo_login
-   `/api`: talo_nodejs
-   `/sockjs-node`: talo_nodejs/socket.io

# 5 CI CD Digital Ocean

0. Connect CMD

    - `ssh root@IPV4`
        - IP v4: example: 128.199.255.170

1. Download the binary for your system

    - `sudo curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64`

2. Give it permissions to execute

    - `sudo chmod +x /usr/local/bin/gitlab-runner`

3. Create a GitLab CI user

    - `sudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash`

4. Install and run as service

    - `sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner`
    - `sudo gitlab-runner start`

5. Register a runner

    - `sudo gitlab-runner register --url https://gitlab.com/ --registration-token "registration_token"`

6. Add gitlab-runner to the docker group

    - `sudo usermod -aG docker gitlab-runner`

7. Grant sudo permissions to the gitlab-runner user.

    - `sudo nano /etc/sudoers`
    - `gitlab-runner ALL=(ALL) NOPASSWD: ALL`

8. Fix bug.

    - `sudo nano /home/gitlab-runner/.bash_logout`

# 6 CI CD Google Cloud

-   `sudo -s`
    -   Vao quyen root
-   `apt-get update`
-   `apt install docker.io`
-   `apt install docker-compose`
-   Làm theo `bước 5: 1->8`
-   Tạo SSH key hết nối git lab
    `ssh-keygen -t rsa -f ~/.ssh/[KEY_FILENAME] -C [USERNAME]`
    `cd ~/.ssh`
    `chmod 400 [KEY_FILENAME]`
    `cat [KEY_FILENAME]`
-   Xem user: `sudo su - gitlab-runner`

## Nếu lỗi permision

-   `Cd ..` : Khi nào dến thư mục gốc `/`
-   Vào quyền root
-   `sudo nano /etc/gitlab-runner/config.toml`
-   Thêm sau [RUNNER]
    -   `pre_clone_script = "sudo chown -R gitlab-runner:gitlab-runner ."`

## Fix lỗi CORS

-   Tạo file: `cros-config.json`
    [
    {
    "origin": ["https://example.com"],
    "method": ["GET"],
    "responseHeader": ["Access-Control-Allow-Origin"],
    "maxAgeSeconds": 3600
    }
    ]
-   `gsutil cors set cros-config.json gs://name-bucket`

# 7 Remote database

-   `docker ps` : Xem các container đang chạy (Phần 1.4 ở trên)

-   `docker exec -it fb73e187194c6ae2915f266bc586454c10d5a2590026931b616082054b82691e bash <`
-   `docker exec -it fb73e187194c6ae2915f266bc586454c10d5a2590026931b616082054b82691e /bin/bash`
    -   fb73... là name
-   `mongo`: run terminal mongo
    -   `mongo --help`
-   `export PATH=$PATH:/usr/local/mongodb/bin`: Thêm path mongo nếu lỗi.

## Sau khi Run terminal mongo

-   `show dbs`
-   `use talo`
-   `show collections`

## Action collections

https://www.mongodb.com/docs/manual/reference/method/js-collection/

-   Find
    -   `db.users.find()`
    -   `db.users.aggregate()`
-   Insert
    -   `db.collection.insertOne()`
    -   `db.collection.insertMany()`
-   Update
    -   `db.collection.updateOne()`
    -   `db.collection.updateMany()`
    -   `db.collection.replaceOne()`
-   Delete
    -   `db.collection.deleteOne()`
    -   `db.collection.deleteMany()`
-   Drop
    -   `db.collection.drop()`

# 9 Fix Password Login Google Nodejs

-   Stackoverflow
    -   `https://stackoverflow.com/questions/60701936/error-invalid-login-application-specific-password-required`
-   Google doc
    -   `https://support.google.com/mail/answer/185833?hl=en#zippy=%2Cwhy-you-may-need-an-app-password`
    -   1. `https://myaccount.google.com/`
    -   2. Bảo mật
    -   3. Đăng nhập Google -> Mật khẩu ứng dụng
    -   4. Ứng dụng Thư , Thiết bị khác
    -   5. Copy pass thêm bào file .env
