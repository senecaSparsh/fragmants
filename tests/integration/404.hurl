# Health Check Test
GET http://localhost:8080/no-such-route

# We should get back an HTTP 1.1 404 response
HTTP/1.1 404

# Extra checks to perform against the response
[Asserts]
# We expect to get back a JSON response error message 
jsonpath "$.error.message" == "not found"
# We expect to get back a JSON response with a error code 404
jsonpath "$.error.code" == 404 
# We expect to get back a JSON with a status error
# jsonpath "$.status" == "error" 
