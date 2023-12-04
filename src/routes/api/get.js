const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
let fragment;
module.exports = {
  get: async (req, res) => {
    fragment = await Fragment.byUser(req.user, req.query.expand);

    res.status(200).json(createSuccessResponse({ fragments: fragment }));
    logger.info({ fragmentList: fragment }, `successfully get fragment list`);
  },
};
