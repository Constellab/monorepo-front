import 'zone.js/dist/zone-node';

import {APP_BASE_HREF} from '@angular/common';
import {ngExpressEngine} from '@nguniversal/express-engine';
import * as express from 'express';
import {existsSync} from 'fs';
import {join} from 'path';

import {AppServerModule} from './src/main.server';
import {environment} from './src/environments/ha-environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/apps/ha-hub/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  const securityHeadersMiddleware = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {

    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Xss-Protection", "1; mode=block");
    if(environment.production) {
      // TODO: CHECK IF THERE IS A BETTER WAY
      //'unsafe-hashes' 'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc=' is for the inline script in the index.html
      // eslint-disable-next-line max-len
      res.setHeader("Content-Security-Policy", "default-src 'self' *.gencovery.com *.constellab.community; script-src 'self' 'unsafe-hashes' 'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc=' *.gencovery.com *.constellab.community data:; frame-src 'self' *.gencovery.com *.constellab.community *.gencovery.io *.constellab.app youtube.com www.youtube.com; worker-src *.gencovery.com *.constellab.community data: 'self' blob:; style-src 'self' 'unsafe-inline' *.gencovery.com *.constellab.community https://fonts.googleapis.com; img-src 'self' blob: data: http: https: *.gencovery.com *.constellab.community; font-src 'self' data: http: https: fonts.googleapis.com; connect-src 'self' *.gencovery.com *.constellab.community https://fonts.googleapis.com https://fonts.gstatic.com");
    }
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");

    res.setHeader(
      "Feature-Policy",
      // eslint-disable-next-line max-len
      "accelerometer 'none'; autoplay 'none'; camera 'none'; encrypted-media 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; midi 'none'; payment 'none'"
    );

    next();
  };


  server.use(securityHeadersMiddleware);

  server.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Disallow:
Sitemap: ${environment.settings.communityFrontUrl}/sitemap.xml`);
  });

  server.get('/sitemap.xml', (req, res) => {
    res.type('text/xml');
    const distFolder = join(process.cwd(), 'dist/apps/ha-hub/server');
    const filePath = join(distFolder, 'sitemap.xml');
    res.sendFile(filePath);
  });

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.use((req, res, next) => {
    // Set the cache control headers for specific file types
    if (req.url.match(/(dark-theme\.css|light-theme\.css|\.json)$/)) {
      res.setHeader('Cache-Control', 'no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }

    if (req.url.match(/\.html$/)) {
      res.setHeader('Cache-Control', 'no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    }

    next();
  });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  environment.settings = {
    apiUrl: process.env['API_URL'] || 'http://localhost:3333',
    constellabApiUrl: process.env['CONSTELLAB_API_URL'] || 'https://api.preconstellab.com',
    constellabFrontUrl: process.env['CONSTELLAB_FRONT_URL'] || 'https://preconstellab.com',
    communityFrontUrl: process.env['COMMUNITY_FRONT_URL'] || 'http://localhost:4200'
  };


  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
