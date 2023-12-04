const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  let fragment;
  const api = process.env.API_URL;

  try {
    fragment = await Fragment.byId(req.user, req.params.id);
    if (req.get('content-type') != fragment.type) {
      res
        .status(400)
        .json(
          createErrorResponse(400, 'A fragment’s type can not be changed after it is created.')
        );
    } else {
      await fragment.setData(req.body);
      res.location(`${api}/v1/fragments/${fragment.id}`);
      res.status(200).json(createSuccessResponse({ fragment }));
      logger.info({ fragment: fragment }, `successfully update fragment data`);
    }
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'unable to find fragment with given id'));
  }
};
