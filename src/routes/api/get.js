// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const { readFragmentData, readFragment } = require('../../model/data');
const logger = require('../../logger');
require('dotenv').config();
var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();
/**
 * Get a list of fragments for the current user
 */
let fragment;
module.exports = {
  get: async (req, res) => {
    if (req.user) {
      if (req.query) {
        if (req.params.id) {
          let fragmentId = req.params.id.toString().split('.');
          if (fragmentId.length > 1) {
            let ext = fragmentId[1];
            if (ext == 'html') {
              fragment = await readFragmentData(req.user, fragmentId[0]);
              res.set('Content-Type', 'text/html');
              var result = md.render(fragment.toString());
              res.status(200).send(result);
              logger.info({ targetType: ext }, `successfully convert to ${ext}`);
            }
          } else {
            fragment = await readFragmentData(req.user, fragmentId[0]);
            let fragmentM = await readFragment(req.user, fragmentId[0]);
            res.set('Content-Type', fragmentM.type);
            res.status(200).send(fragment);
            logger.info(
              { fragmentData: fragment, contentType: fragmentM.type },
              `successfully get fragment data`
            );
          }
        } else {
          fragment = await Fragment.byUser(req.user, req.query.expand);
          res.status(200).json(createSuccessResponse({ fragments: fragment }));
          logger.info({ fragmentList: fragment }, `successfully get fragment list`);
        }
      }
    } else {
      res.status(401).json(createErrorResponse(401, 'unauthorized user'));
    }
  },
  info: async (req, res) => {
    if (req.query) {
      if (req.params.id) {
        fragment = await readFragment(req.user, req.params.id);
        res.status(200).json(fragment);
        logger.info({ fragmentInfo: fragment }, `successfully get fragment meta data`);
      }
    }
  },
};
