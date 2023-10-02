// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const { readFragmentData } = require('../../model/data');

require('dotenv').config();
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  let fragment;
  const api = process.env.API_URL;

  if (req.user) {
    if (req.query) {
      if (req.params.id) {
        console.log(req.params);
        res.location(`${api}/${req.params.id}`);
        fragment = await readFragmentData(req.user, req.params.id);
        res.status(200).json(createSuccessResponse({ fragments: fragment.toString() }));
      } else {
        res.location(`${api}/${req.user.id}`);
        fragment = await Fragment.byUser(req.user, req.query.expand);
        res.status(200).json(createSuccessResponse({ fragments: fragment }));
      }
    } else {
      res.location(`${api}/${req.user.id}`);
      fragment = await Fragment.byUser(req.user);
      res.status(200).json(createSuccessResponse({ fragment }));
    }
  } else {
    res.status(401).json(createErrorResponse(401, 'something went wrong'));
  }
};
