const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    await Fragment.delete(req.user, req.params.id);
    logger.info(`successfully deleted fragment`);
    res.status(200).json(createSuccessResponse(200, 'successfully deleted fragment'));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'fragment with that id is not found'));
  }
};
