# blog-api

### This API you can create posts and add comments once you are registered to our API after signing in you will receive a jsonwebtoken for authorization you should store it in a safe place because in each DELETE and POST request you must supply it in the authorization header as a Bearer < token > and send the data as JSON object, note that the token expires after 2 weeks of it's creation.

---

### The paths you are going to use are:

- https://blog-api-production-23bb.up.railway.app/login for POST request you should send the 'username', 'password' in the body of the request to get your token back and supply it in each POST, DELETE requests.

- https://blog-api-production-23bb.up.railway.app/signup for POST request you should send the 'firstName', 'lastName', 'email', 'username', password in the body of the request to create a user the login.

- https://blog-api-production-23bb.up.railway.app/posts for GET request you should get all of the posts.

- https://blog-api-production-23bb.up.railway.app/posts/"postId" for a GET request you should get the post the you supplied the postId with.

- https://blog-api-production-23bb.up.railway.app/posts/user for a GET request you should get the all the posts for that particular user.

- https://blog-api-production-23bb.up.railway.app/posts for a POST request to create a post and you should supply the token that you have received, you should supply the 'title', 'text' of the post in the body of request.

- https://blog-api-production-23bb.up.railway.app/posts/"postId"/comments for a POST request to create a comment on the supplied postId post.

- https://blog-api-production-23bb.up.railway.app/posts/"postId" for a DELETE request to delete the post that you have supplied it's id with.

- https://blog-api-production-23bb.up.railway.app/posts/"postId"/comments/"commentId" for a DELETE request to delete the supplied commentId.
