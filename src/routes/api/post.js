const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  let fragment;

  if (Buffer.isBuffer(req.body) === true) {
    fragment = new Fragment({ ownerId: req.user, type: 'text/plain', size: req.body.length });

    await fragment.save();
    const api = process.env.API_URL;
    res.location(`${api}/${fragment.id}`);
    res.status(201).json(createSuccessResponse({ fragment }));
  } else {
    res.status(415).json(createErrorResponse(415, 'not supported type'));
  }
};
