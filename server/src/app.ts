import createError, { HttpError } from 'http-errors';
import express, { Response, Request, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import setupHelmet  from "./lib/setupHelmet";
import healthcheckRouter from './routes/healthcheckRouter';
import indexRouter from './routes/index';
import { createLogger } from './lib/logger';
import thumbRouter from './routes/thumbRouter';

const debug = createLogger('server:server');
const { BASE_PATH, NODE_ENV } = process.env as { BASE_PATH:string, NODE_ENV:string|undefined };

const app = express();

setupHelmet(app);

// u slučaju kada se server vrti iza proxy-a
// ovaj flag će natjerati Express da informacije poput
// IP adrese klijenta, protokola uzima iz X-Forward-*
// HTTP header polja, koja postavlja proxy
app.set('trust proxy', true);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Određujem cachning policy za static content:
// - produkcija = 4 sata ... tako i tako koristim cache busting
// - development = no caching ... tako da u browseru ne moramo onemogućiti caching
const maxAge = NODE_ENV === 'production' ? 14400000 : 0;

app.use(BASE_PATH as string, express.static(path.join(__dirname, 'public'), { maxAge } ));

// pripremam shared objekte koji se koriste kod svakog upita
app.use((req, res, next) => {
  res.locals.baseURL = BASE_PATH;
  res.locals.NODE_ENV = NODE_ENV;

  // za HTML stranice eksplicitno isključujem bilo kakvo keširanje
  // > ovo se ne odnosi na static ovaj kôd neće biti niti izvršen
  //   zato jer `express.static` pozvati `next()`
  res.set('cache-control', 'no-store');

  next();
});

app.use('/healthcheck', healthcheckRouter); // ovdje ne koristim `BASE_PATH` zato jer taj URL nije eksterno dostupan
app.use(`${BASE_PATH}/thumbs`, thumbRouter);

app.use(BASE_PATH, indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err:HttpError, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // `headersSent` će biti TRUE ako je router kod kojeg se dogodila greška već poslao header-e
  // > ako ih probam ponovo postaviti, to će baciti grešku i SRUŠITI SERVER (ovo nije umotano u try-catch) - to ne smijemo dopustiti
  if(!res.headersSent) {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  } else {
    // AKO nije pozvan `end` - pozovi ga i završi obradu zahtjeva
    // ... u suprotnom će konekcija ostati otvorena do timeout-a
    if(!res.writableEnded) {
        res.end();
    }
  }

  // grešku logiraj u konzolu
  debug(err);
});

export default app;
