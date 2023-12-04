// src/routes/api/getById.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

var md = require('markdown-it')();
const path = require('path');
/** * Get a list of fragments for the current user */
module.exports = async (req, res) => {
  try {
    logger.debug(`getById called'`);
    let id = req.params.id;
    if (req.params.id.includes('html')) {
      const ext = path.extname(req.params.id);
      id = req.params.id.replace(ext, '');
    }
    const fragment = await Fragment.byId(req.user, id);
    logger.debug(`getById got fragment'`);
    const fragmentData = await fragment.getData();
    // Set the content type to the fragment's type
    if (req.params.id.includes('html') && fragment.type === 'text/markdown') {
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(md.render(fragmentData.toString()));
    } else {
      res.setHeader('Content-Type', fragment.type);
      res.status(200).send(fragmentData);
    }
  } catch (error) {
    logger.warn('invalid fragment id');
    res.status(404).json(createErrorResponse(404, error));
  }
};
