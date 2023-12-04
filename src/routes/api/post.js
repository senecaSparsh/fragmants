const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  let fragment;
  const api = process.env.API_URL;
  try {
    fragment = new Fragment({
      ownerId: req.user,
      type: req.get('Content-Type'),
      size: req.body.length,
    });
    await fragment.save();
    await fragment.setData(req.body);
    res.location(`${api}/v1/fragments/${fragment.id}`);
    res.status(201).json(createSuccessResponse({ fragment }));
    logger.info({ fragment: fragment }, `successfully posted fragment `);
  } catch (err) {
    res.status(415).json(createErrorResponse(415, 'not supported type'));
  }
};
