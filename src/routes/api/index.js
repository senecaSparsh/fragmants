// src/routes/api/index.js
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const { get } = require('./get.js');
const { info } = require('./get_meta_data.js');
const { get_data } = require('./get_data.js');
// Create a router on which to mount our API endpoints
const router = express.Router();
// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
router.post('/fragments', rawBody(), require('./post'));

// Define GET routes, which will be: GET /v1/fragments
router.get('/fragments', get);
router.get('/fragments/?expand', get);
router.get('/fragments/:id/info', info);
router.get('/fragments/:id', get_data);

// Define PUT route
router.put('/fragments/:id', rawBody(), require('./put_data'));

// Define DELETE route
router.delete('/fragments/:id', require('./delete'));

module.exports = router;
