// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
require('dotenv').config();
var MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();
/**
 * Get a list of fragments for the current user
 */
let fragment, fragmentM;
module.exports = {
  get: async (req, res) => {
    if (req.user) {
      if (req.query) {
        if (req.params.id) {
          let fragmentId = req.params.id.toString().split('.');
          try {
            fragmentM = await Fragment.byId(req.user, fragmentId[0]);
            fragment = await fragmentM.getData();
            if (fragmentId.length > 1) {
              let ext = fragmentId[1];
              if (ext == 'html') {
                if (fragmentM.type == 'text/markdown') {
                  res.set('Content-Type', 'text/html');
                  var result = md.render(fragment.toString());
                  res.status(200).send(result);
                  logger.info({ targetType: ext }, `successfully convert to ${ext}`);
                } else {
                  res
                    .status(415)
                    .json(createErrorResponse(415, `fragment cannot be returned as a ${ext}`));
                }
              }
            } else {
              res.set('Content-Type', fragmentM.type);
              res.status(200).send(fragment);
              logger.info(
                { fragmentData: fragment, contentType: fragmentM.type },
                `successfully get fragment data`
              );
            }
          } catch (err) {
            res
              .status(404)
              .json(createErrorResponse(404, `id does not represent a known fragment`));
          }
        } else {
          try {
            fragment = await Fragment.byUser(req.user, req.query.expand);
          } catch (err) {
            res.status(404).json(createErrorResponse(404, 'no such user'));
          }
          res.status(200).json(createSuccessResponse({ fragments: fragment }));
          logger.info({ fragmentList: fragment }, `successfully get fragment list`);
        }
      }
    }
  },
  info: async (req, res) => {
    if (req.query) {
      if (req.params.id) {
        try {
          fragment = await Fragment.byId(req.user, req.params.id);
          res.status(200).json(fragment);
          logger.info({ fragmentInfo: fragment }, `successfully get fragment meta data`);
        } catch (err) {
          res
            .status(404)
            .json(createErrorResponse(404, 'unable to find fragment metadata with that id'));
        }
      }
    }
  },
};
