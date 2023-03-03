# blog-api

### This API you can create posts and add comments once you are registered to our API after signing in you will receive a jsonwebtoken for authorization you should store it in a safe place because in each DELETE and POST request you must supply it in the authorization header as a Bearer < token > and send the data as JSON object, note that the token expires after 2 weeks of it's creation.

---

### The paths you are going to use are:

##### The domain isn't supplied yet when it's supplied you should be able to use it:

- http://domain/login for POST request you should send the 'username', 'password' in the body of the request to get your token back and supply it in each POST, DELETE requests.

- http://domain/signup for POST request you should send the 'firstName', 'lastName', 'email', 'username', password in the body of the request to create a user the login.

- http://domain/posts for GET request you should get all of the posts.

- http://domain/posts/"postId" for a GET request you should get the post the you supplied the postId with.

- http://domain/posts for a POST request to create a post and you should supply the token that you have received, you should supply the 'title', 'text' of the post in the body of request.

- http://domain/posts/"postId"/comments for a POST request to create a comment on the supplied postId post.

- http://domain/posts/"postId" for a DELETE request to delete the post that you have supplied it's id with.

- http://domain/posts/"postId"/comments/"commentId" for a DELETE request to delete the supplied commentId.
