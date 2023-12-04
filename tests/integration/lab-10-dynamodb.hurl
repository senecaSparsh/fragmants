# tests/integration/lab-10-dynamodb.hurl
# 1. Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a json fragment
Content-Type: application/json
# user1@email.com:password1
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
{ "service": "DynamoDB" }

# 1.1. We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check 
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragment.id" matches "^[A-Za-z0-9_-]+$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"

# Capture the Location URL into a variable named `url`
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"


# 1.2. We can now GET the fragment metadata we just created
GET {{fragment1_url}}/info
# user1@email.com:password1
[BasicAuth]
user1@email.com:password1
# We expect to get back an HTTP 200
HTTP/1.1 200
[Asserts]
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.id" == "{{fragment1_id}}"
jsonpath "$.fragment.type" == "application/json"

# 2. Authenticated POST Markdown to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending a json fragment
Content-Type: text/markdown
# user1@email.com:password1
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`DynamoDB is **great**`

# 2.1. We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check 
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
# Capture the Location URL into a variable named `url`
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# 2.2. Try to GET the fragment we just posted by its URL
GET {{fragment2_url}}/info
# user1@email.com:password1
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragment.id" == "{{fragment2_id}}"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"

# 3. GET All fragments
GET http://localhost:8080/v1/fragments
# user1@email.com:password1
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragments" includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"


# 4. Try to Delete the first fragment
DELETE {{fragment1_url}}
# user1@email.com:password1
[BasicAuth]
user1@email.com:password1

# 4.1. We expect to get back an HTTP 200
HTTP/1.1 200

# 4.2 Try to GET the fragment we just removed by its URL
GET {{fragment1_url}}/info
# user1@email.com:password1
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

# 5. GET All fragments
GET http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
# Our fragment ids use https://www.npmjs.com/package/nanoid
jsonpath "$.fragments" not includes "{{fragment1_id}}"
jsonpath "$.fragments" includes "{{fragment2_id}}"
