// src/routes/api/post.js
const response = require('../../response');
const { Fragment } = require('../../model/fragment');
require('dotenv').config();
const logger = require('../../logger');
const url = process.env.API_URL;
module.exports = async (req, res) => {
  try {
    logger.debug(`POST /v1/fragments called`);
    if (!Buffer.isBuffer(req.body)) {
      logger.warn(`POST /v1/fragments - Body requires correct data that is supported`);
      return res
        .status(415)
        .json(
          response.createErrorResponse(
            415,
            'Unsupported Media Type: Body requires correct fragment data that is supported'
          )
        );
    }
    logger.debug(`POST /v1/fragments - Body received`);
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
    });
    logger.debug(`POST /v1/fragments - Fragment created`);
    await fragment.save();
    await fragment.setData(req.body);
    logger.debug(`POST /v1/fragments - Fragment saved`);
    res.setHeader('Location', url + '/v1/fragments/' + fragment.id);
    logger.debug(`POST /v1/fragments - Location header set`);
    return res.status(201).json(
      response.createSuccessResponse({
        status: 'ok',
        fragment: fragment,
      })
    );
  } catch (err) {
    logger.error(`POST /v1/fragments - Internal Server Error: ${err}`);
    return res.status(500).json(response.createErrorResponse(500, 'Internal Server Error in POST'));
  }
};
