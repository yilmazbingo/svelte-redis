User Repository will be central access point for somehow into the user's table and fething data, updating data. Each of repository methods are designed to be used by one of our different route handlers. `GET /users` will use `find()`, `GET /users/:id` will use `findById`. Our User Repository migh have extra methods attached to it as well, like `count`,`validate` etc.