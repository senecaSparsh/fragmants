// src/routes/api/get.js
// Our response handlers
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
module.exports = (req, res) => {
  logger.info(`GET v1/fragments request received`);
  // Route without id, returns getByUser
  logger.debug(`GET v1/fragments - Query: ${req.query.expand ? 'expand' : 'no expand'}`);
  getFragmentByUserId(req.user, req.query?.expand)
    .then((fragments) => {
      res.status(200).json(
        response.createSuccessResponse({
          status: 'ok',
          fragments: fragments,
        })
      );
    })
    .catch((e) => {
      res.status(400).json(
        response.createErrorResponse({
          message: `Something went wrong trying to get fragments for user by id: ${e}`,
          code: 400,
        })
      );
    });
};
async function getFragmentByUserId(user, expand) {
  logger.info(`API - get.js>getFragmentByUserId: Attempting to get fragments by user`);
  let fragments = await Fragment.byUser(user, expand);
  logger.info(`API - get.js>getFragmentByUserId: Returned fragments: ${JSON.stringify(fragments)}`);
  return fragments;
}
