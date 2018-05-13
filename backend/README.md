### TravelApp backend
A simple CRUD-backend for TravelApp using Node.js

# Technologies
- Node.js
- Expressjs
- Rethinkdb

# Rest API
GET: /api/destination
GET: /api/destination/:id
POST: /api/destination
DELETE: /api/destination/:id

A travel destination is a JSON looking like this:
{
  id: string,
  name: string,
  country: string,
  visitTimeStamp: integer,  
  photo: array[string]
}


# Architecture
adapter/http/ -> http server + routes
adapter/db/ -> connect to RethinkDB
public/ -> static files
config/ -> configuration 
services/ -> business logic
domain/ -> domain objects
test/ -> unit + integration tests

# Inspiration
I took some inspiration from:
[https://github.com/contentful/the-example-app.nodejs](example_1)
[https://github.com/rethinkdb/rethinkdb-example-nodejs](example_2)
