import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { environment } from './src/environments/ha-environment';
import { EnumChangefreq, SitemapItem, SitemapStream, streamToPromise } from 'sitemap';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import { HaMetadataNamesConfig } from './src/app/ha-core/ha-model/ha-config/ha-metadata-names.config';
import { HaRouterService } from './src/app/ha-core/ha-service/ha-router.service';
import { CommonEngine } from '@angular/ssr/node';
import { REQUEST } from '@angular/core';
import compression from 'compression';

environment.settings = {
  apiUrl: process?.env['API_URL'] || 'http://localhost:3333',
  constellabApiUrl: process?.env['CONSTELLAB_API_URL'] || 'https://api.preconstellab.com',
  constellabFrontUrl: process?.env['CONSTELLAB_FRONT_URL'] || 'https://preconstellab.com',
  communityFrontUrl: process?.env['COMMUNITY_FRONT_URL'] || 'http://localhost:4200',
  captchaSiteKey: process?.env['CAPTCHA_SITE_KEY'] || '123465',
  googleAnalyticsId: process?.env['GOOGLE_ANALYTICS_ID'] || 'eazeaze',
  discordLink: process?.env['DISCORD_LINK'] || 'https://discord.com/invite/7nmH5qKM',
  algoliaAppId: process?.env['ALGOLIA_APP_ID'] || 'S233I3C24Z',
  algoliaSearchKey: process?.env['ALGOLIA_SEARCH_KEY'] || '8fd4e2048efc6363ff0dca169b6522af',
  algoliaIndexName: process?.env['ALGOLIA_INDEX_NAME'] || 'Community Preprod',
  algoliaSiteVerificationKey: process?.env['ALGOLIA_SITE_VERIFICATION_KEY'] || null,
  difyChatbotToken: process?.env['DIFY_CHATBOT_TOKEN'] || '22bhCqCeaaGiVEhr',
};

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.use(compression());

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  const securityHeadersMiddleware = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (environment.production) {
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Xss-Protection', '1; mode=block');
      // TODO: CHECK IF THERE IS A BETTER WAY
      const defaultSrc = "default-src 'self' *.constellab.community";
      //'unsafe-hashes' 'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc=' is for the inline script in the index.html
      // script-src : https://www.google.com, https://www.gstatic.com
      // eslint-disable-next-line max-len
      const scriptSrc =
        "script-src 'self' 'unsafe-hashes' 'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc=' *.constellab.community https://www.google.com https://www.gstatic.com *.googletagmanager.com *.udify.app data:";
      // frame-src https://www.google.com/' is for the recaptcha
      // eslint-disable-next-line max-len
      const frameSrc =
        "frame-src 'self' *.gencovery.com *.constellab.community *.gencovery.io *.constellab.app youtube.com www.youtube.com https://www.google.com";
      const workerSrc = "worker-src  *.gencovery.com *.constellab.community data: 'self' blob:";
      const styleSrc =
        "style-src 'self' 'unsafe-inline' *.gencovery.com *.constellab.community https://fonts.googleapis.com";
      const fontSrc = "font-src 'self' data: http: https: fonts.googleapis.com fonts.gstatic.com";
      const imgSrc =
        "img-src 'self' blob: data: http: https: *.gencovery.com *.constellab.community http://www.w3.org";
      // https://cdn.jsdelivr.net/npm/@emoji-mart/data is used to allow the emoji-mart data
      // eslint-disable-next-line max-len
      const connectSrc =
        "connect-src 'self' *.gencovery.com *.constellab.community https://fonts.googleapis.com https://fonts.gstatic.com *.google-analytics.com *.googletagmanager.com *.algolianet.com *.algolia.net https://cdn.jsdelivr.net/npm/@emoji-mart/data https://api.github.com";
      // eslint-disable-next-line max-len
      const mediaSrc = "media-src 'self' https://storage.sbg.cloud.ovh.net";

      res.setHeader(
        'Content-Security-Policy',
        `${defaultSrc}; ${scriptSrc}; ${frameSrc}; ${workerSrc}; ${styleSrc}; ${imgSrc}; ${fontSrc}; ${connectSrc}; ${mediaSrc}`
      );

      res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');

      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

      res.setHeader(
        'Feature-Policy',
        // eslint-disable-next-line max-len
        "accelerometer 'none'; autoplay 'none'; camera 'none'; encrypted-media 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'self'; midi 'none'; payment 'none'"
      );
    }

    next();
  };

  server.use(securityHeadersMiddleware);
  server.use(cookieParser());

  server.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Disallow:
Sitemap: ${environment.settings.communityFrontUrl}/sitemap.xml`);
  });
  let lastSiteMapUpdate: Date = null;
  let siteMap: string = null;

  server.get('/sitemap.xml', async (req, res) => {
    res.header('Content-Type', 'application/xml');

    try {
      const now = new Date();
      const oneDayInMs = 24 * 60 * 60 * 1000; // 1 day in milliseconds

      if (lastSiteMapUpdate === null || now.getTime() - lastSiteMapUpdate.getTime() > oneDayInMs) {
        const smStream = new SitemapStream({ hostname: environment.settings.communityFrontUrl });

        const urls = [
          { url: '/', changefreq: EnumChangefreq.MONTHLY, priority: 1 },
          { url: HaRouterService.getStoriesListRoute(), changefreq: EnumChangefreq.MONTHLY, priority: 1 },
          { url: HaRouterService.getBrickListRoute(), changefreq: EnumChangefreq.MONTHLY, priority: 1 },
          { url: HaRouterService.getAgentsListRoute(), changefreq: EnumChangefreq.MONTHLY, priority: 1 },
          { url: HaRouterService.getLoginRoute(), changefreq: EnumChangefreq.MONTHLY, priority: 1 },
          { url: HaRouterService.getIconsRoute(), changefreq: EnumChangefreq.MONTHLY, priority: 1 },
          {
            url: HaRouterService.getCommunityAppListRoute(),
            changefreq: EnumChangefreq.MONTHLY,
            priority: 1,
          },
        ];

        const dynamicBricksUrls = await fetchBricksMap();
        const dynamicStoriesUrls = await fetchStoriesMap();
        const dynamicAgentsUrls = await fetchAgentsMap();
        const dynamicProfilesUrls = await fetchProfilesMap();
        const dynamicAppsUrls = await fetchAppsMap();
        const dynamicUrls = [
          ...dynamicAppsUrls,
          ...dynamicBricksUrls,
          ...dynamicStoriesUrls,
          ...dynamicAgentsUrls,
          ...dynamicProfilesUrls,
        ];
        const allUrls = [...urls, ...dynamicUrls];

        allUrls.forEach((url) => smStream.write(url));
        smStream.end();

        // Save the sitemap to disk or to a database
        siteMap = await streamToPromise(smStream).then((sm) => sm.toString());
        lastSiteMapUpdate = now;
      }

      res.send(siteMap);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

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
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.html',
    })
  );

  // All regular routes use the Angular engine
  server.get('*', async (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine
      .render({
        bootstrap: bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          // provide the request object to the DI so it can be access in SSR
          // check if this is still useful with new hydrate method
          // TODO check if this is really useful once app built
          { provide: REQUEST, useValue: req },
        ],
      })
      .then((html: any) => {
        res.setHeader('Content-Type', 'text/html');
        // Check for redirection
        const metaTagRedirect = getMetaTagContent(html, HaMetadataNamesConfig.REDIRECT_URL);

        if (metaTagRedirect != null) {
          return res.redirect(302, metaTagRedirect);
        }

        // Check if 404
        const metaTag404 = getMetaTagContent(html, HaMetadataNamesConfig.NOT_FOUND_URL);

        if (metaTag404 != null) {
          res.status(404);
        }

        res.send(html);
      })
      .catch((err: any) => {
        console.error(err);
        next(err);
      });
  });
  return server;
}

// Method to get dynamically bricks part sitemap
async function fetchBricksMap(): Promise<SitemapItem[]> {
  try {
    const response = await axios.get(`${environment.settings.apiUrl}/brick/all-map`);
    return response.data;
  } catch (error) {
    console.error('Error fetching bricks URLs:', error);
    return [];
  }
}

async function fetchStoriesMap(): Promise<SitemapItem[]> {
  try {
    const response = await axios.get(`${environment.settings.apiUrl}/story/all-map`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stories URLs:', error);
    return [];
  }
}

async function fetchAgentsMap(): Promise<SitemapItem[]> {
  try {
    const response = await axios.get(`${environment.settings.apiUrl}/agent/all-map`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agents URLs:', error);
    return [];
  }
}

async function fetchAppsMap(): Promise<SitemapItem[]> {
  try {
    const response = await axios.get(`${environment.settings.apiUrl}/app/all-map`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agents URLs:', error);
    return [];
  }
}

async function fetchProfilesMap(): Promise<SitemapItem[]> {
  try {
    const response = await axios.get(`${environment.settings.apiUrl}/user/all-map`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profiles URLs:', error);
    return [];
  }
}

function getMetaTagContent(html: string, tagName: string): string {
  const regex = new RegExp(`<meta\\s+name="${tagName}"\\s+content="(.+)"\\s*\\/?>`, 'i');
  const match = html.match(regex);
  const content = match ? match[1] : null;
  return content?.split('"')[0];
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  // Start up the Node server
  const server = app();

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
