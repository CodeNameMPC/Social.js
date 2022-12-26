# Social.js
A social media backend framework


## Background
I was working on a social media site for creators called Triiipod. Soon into the project I realized I am not too great at front end stuff. Because of this,
I decided to table Triiipod, take the backend server I was working for it, and split it out into its own project for others to use. This is still very early stages and 
I am NOT a professional JS programmer, so bare with me. 

Please note that this is still very early stages and sloppy

## Installation
1. Pull down repository.
2. Run the following command to install needed depedencies

```
$npm install
```

3. Start up a mongoDB database instance
4. Create a JWT secret toke. This will be uses for user authentication. I ran the below command to generate one
```
$ node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```
5. Change the .env variables
```
PORT = "PORT"
CONNECTION_URL = "MONGO URL STRING"
JWT_SECRET = "JWT SECRET TOKEN"
```

6. Hook your front-end up to the backend and start using! 

## TODO
- [ ]Documentation
- [ ] Posts
  - [ ] Create a Post
  - [ ] Retreive A Post
  - [ ] Retrieve posts based on users following list
  - [ ] Media Attachment
  - [ ] Embedded Items
    - [ ] URLs
    - [ ] Tags 
    - [ ] Users
- [ ] Users
  - [x] Create Sign up
  - [x] User Sign in 
  - [ ] Follow Users
  - [ ] Unfollow Users
- [ ] Database
  - [ ] Model Creation
  - [ ] Large Media Upload (GridFS)
  - [ ] Implement other DB types
    - [ ] MySQL
    - [ ] Sql Lite
