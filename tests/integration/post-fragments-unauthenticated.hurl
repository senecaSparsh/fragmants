# tests/integration/post-fragments.hurl
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# user3@email.com:password3
Authorization: Basic dXNlcjNAZW1haWwuY29tOnBhc3N3b3JkMw==
# We're sending a plain text fragment
Content-Type: text/plain
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# We expect to get back an HTTP 401
HTTP/1.1 401
