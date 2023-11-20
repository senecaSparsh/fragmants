#!/bin/sh

# Run all .hurl files under tests/integration.
# Make sure hurl is installed, see https://hurl.dev
hurl --test --glob "tests/integration/**/*.hurl"
