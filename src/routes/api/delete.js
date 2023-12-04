// src/routes/api/delete.js
// Our response handlers
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = (req, res) => {
  logger.info(`GET v1/fragments request received`);

  // Route without id, returns getByUser
  logger.debug(`DELETE v1/fragments - Attempting to delete fragment with ID: ${req.param.id}`);
  deleteFragment(req.user, req.params.id)
    .then(() => {
      res.status(200).json(
        response.createSuccessResponse({
          status: 'ok',
        })
      );
    })
    .catch((e) => {
      res.status(400).json(
        response.createErrorResponse({
          message: `The id was not found for fragment: ${e}`,
          code: 404,
        })
      );
    });
};

async function deleteFragment(user, fragmentId) {
  let fragment = Fragment;

  fragment = await Fragment.delete(user, fragmentId);
  return fragment;
}
