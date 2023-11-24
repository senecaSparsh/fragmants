const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...

  if (req.params.id) {
    try {
      await Fragment.delete(req.user, req.params.id);
      logger.info(`successfully deleted fragment`);
      res.status(200).json(createSuccessResponse());
    } catch (err) {
      res.status(404).json(404, 'fragment with that id is not found');
    }
  } else {
    res.status(404).json(createErrorResponse(404, 'invalid id'));
    logger.info(`needs to provide an id for delete request`);
  }
};
