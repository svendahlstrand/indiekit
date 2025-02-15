import express from 'express';
import frontend from '@indiekit/frontend';
import * as assetsController from './controllers/assets.js';
import * as homepageController from './controllers/homepage.js';
import * as sessionController from './controllers/session.js';
import * as statusController from './controllers/status.js';
import {authenticate} from './middleware/authentication.js';

const {assetsPath} = frontend;
const router = express.Router(); // eslint-disable-line new-cap

export const routes = indiekitConfig => {
  const {application, publication} = indiekitConfig;

  // Prevent pages from being indexed
  router.use((request, response, next) => {
    response.setHeader('X-Robots-Tag', 'noindex');
    next();
  });

  // Homepage
  router.get('/', homepageController.viewHomepage);

  // Prevent pages from being crawled
  router.get('/robots.txt', (request, response) => {
    response.type('text/plain');
    response.send('User-agent: *\nDisallow: /');
  });

  // Status
  router.get('/status', authenticate, statusController.viewStatus);

  // Assets
  router.use('/assets', express.static(assetsPath));
  router.get('/assets/app.css', assetsController.getStyles);

  // Syndicator assets
  for (const target of publication.syndicationTargets) {
    if (target.assetsPath) {
      router.use(`/assets/${target.id}`, express.static(target.assetsPath));
    }
  }

  // Session
  router.get('/session/login', sessionController.login);
  router.post('/session/login', sessionController.authenticate);
  router.get('/session/auth', sessionController.authenticationCallback);
  router.get('/session/logout', sessionController.logout);

  // Endpoints
  for (const route of application.routes) {
    router.use(route.mountPath, route.routes());
  }

  return router;
};
