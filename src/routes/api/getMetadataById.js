module.exports = async function getMetadataById(req, res) {
  // src/routes/api/getByIdInfo.js  const { createErrorResponse } = require('../../response');
  const { Fragment } = require('../../model/fragment');
  const { createErrorResponse, createSuccessResponse } = require('../../response');
  const logger = require('../../logger');
  try {
    logger.debug(`getMetadataById called'`);
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.debug(`getMetadataById got fragment'`);
    res.status(200).json(createSuccessResponse({ fragment }));
  } catch (error) {
    logger.warn('invalid fragment id');
    res.status(404).json(createErrorResponse(404, error));
  }
};
