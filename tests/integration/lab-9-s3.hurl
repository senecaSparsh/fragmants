
# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# 1. We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
# 19 is the length of our fragment data: 'This is a fragment!'
jsonpath "$.fragment.size" == 19
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# GET the fragment you just created using the url as an authorized user.
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 200, that the type of the fragment is text/plain, and that the body is equal to Hello S3!
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "This is a fragment!"

# DELETE the fragment using the url as an authorized user.
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Try to GET the fragment again using the url as an authorized user.
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 404, since the fragment should be deleted.
HTTP/1.1 404
