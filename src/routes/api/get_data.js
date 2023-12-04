const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const path = require('path');
// src/routes/api/get_data.js

/**
 * Get a list of fragments for the current user
 */
let fragment, fragmentM, result;
module.exports = {
  get_data: async (req, res) => {
    let q = path.parse(req.params.id);
    let ext = q.ext.split('.').pop();
    try {
      fragmentM = await Fragment.byId(req.user, q.name);
      ext = fragmentM.extConvert(ext);
      fragment = await fragmentM.getData();
      if (q.ext == '' || fragmentM.type.endsWith(ext)) {
        res.setHeader('Content-Type', fragmentM.type);
        res.status(200).send(Buffer.from(fragment));
        logger.info(
          { fragmentData: fragment, contentType: fragmentM.type },
          `successfully get fragment data`
        );
      } else {
        try {
          if (fragmentM.isText || fragmentM.type == 'application/json') {
            result = await fragmentM.txtConvert(ext);
            res.setHeader('Content-Type', 'text/' + ext);
            res.status(200).send(Buffer.from(result));
            logger.info({ targetType: ext }, `successfully convert to ${ext}`);
          } else {
            result = await fragmentM.imgConvert(ext);
            res.setHeader('Content-Type', 'image/' + ext);
            res.status(200).send(result);
            logger.info({ targetType: ext }, `successfully convert to ${ext}`);
          }
        } catch (err) {
          res.status(415).json(createErrorResponse(415, `fragment cannot be returned as a ${ext}`));
        }
      }
    } catch (err) {
      res.status(404).json(createErrorResponse(404, `id does not represent a known fragment`));
    }
  },
};
