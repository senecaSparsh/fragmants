# tests/integration/lab-9-s3.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user1@email.com:password1
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
# We're sending a plain text fragment
Content-Type: text/plain
`Hello S3!`

HTTP/1.1 201
[Captures]
url: header "Location"

# Try to GET the fragment we just posted by its URL
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

# Confirm that the server returns a 200.
HTTP/1.1 200
Content-Type: text/plain
`Hello S3!`

# Try to DELETE the fragment we just posted by its URL
DELETE {{url}}

Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

# Try to GET the fragment we just posted by its URL again
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 404
