const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
// src/routes/api/get_meta_data.js

/**
 * Get a metadata of fragments for the given fragment id
 */
let fragment;
module.exports = {
  info: async (req, res) => {
    try {
      fragment = await Fragment.byId(req.user, req.params.id);
      res.status(200).json(fragment);
      logger.info({ fragmentInfo: fragment }, `successfully get fragment meta data`);
    } catch (err) {
      res
        .status(404)
        .json(createErrorResponse(404, 'unable to find fragment metadata with that id'));
    }
  },
};
