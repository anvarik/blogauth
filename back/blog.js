var express = require('express')
    , app = express()
    , jwt = require('express-jwt')
    , secret = require('./config/secret');

var posts = require('./route/posts.js');
var users = require('./route/users.js');

app.use(express.json());
app.use(express.urlencoded());
app.use('/blog', express.static(__dirname + '/../front'));

app.get('/post', posts.list); // get all published posts
app.get('/post/all', jwt({secret: secret.secretToken}), posts.listAll); // get all posts
app.get('/post/:id', posts.read); // Get an existing post. Require url
app.get('/tag/:tagName', posts.listByTag); // Get posts by tag
app.post('/login', users.login); // Login
app.get('/logout', jwt({ secret: secret.secretToken }), users.logout); // Logout
app.post('/post', jwt({ secret: secret.secretToken }), posts.create); // Create a new post. Require data
app.put('/post', jwt({ secret: secret.secretToken }), posts.update); // Update an existing post. Require id
app.delete('/post/:id', jwt({ secret: secret.secretToken }), posts.delete); // Delete an existing post. Require id

console.log('Blog Backend is starting on port 3001');
app.listen(3001);
