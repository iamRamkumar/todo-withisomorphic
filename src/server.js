import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import App from './components/app';
import About_us from './components/About_us';
import IndexPage from './components/IndexPage';
import NotFoundPage from './components/NotFoundPage';

// initialize the server and configure support for ejs templates
const appl = new Express();
const server = new Server(appl);
appl.set('view engine', 'ejs');
appl.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
appl.use(Express.static(path.join(__dirname, 'static')));


// universal routing and rendering
appl.get('*', (req, res) => {
  match(
    { routes, location: req.url },
    (err, redirectLocation, renderProps) => {
      // in case of error display the error message
      if (err) {
        return res.status(500).send(err.message);
      }
      // in case of redirect propagate the redirect to the browser
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }
      // generate the React markup for the current route
      let markup;
   if(renderProps.location.error){
        // otherwise we can render a 404 page
        markup = renderToString(<NotFoundPage/>);
        res.status(404);
     } else {
           // if the current route matched we have renderProps
          markup = renderToString(<RouterContext {...renderProps}/>);
       }

      // render the index template with the embedded React markup
      return res.render('index', { markup });
    }
  );
});

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});
