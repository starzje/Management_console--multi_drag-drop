import helmet  from "helmet";
import { Express } from 'express';

const setupHelmet = (app:Express) => {
    // app.use(helmet.contentSecurityPolicy()); <-- ne mogu koristiti zato jer u nekim skriptama postoji `eval`
    // app.use(helmet.dnsPrefetchControl()); <-- povećava privatnost ALI smanjuje performanse 
    app.use(helmet.expectCt());
    app.use(helmet.frameguard()); // sprječava da web stranica bude umetnuta u <iframe> na tuđoj stranici
    app.use(helmet.hidePoweredBy());
    // app.use(helmet.hsts()); <-- ovo kaže da umjesto HTTP-a treba koristiti HTTPS, što već radi CloudFlare
    app.use(helmet.ieNoOpen()); // neka pizdarija vezana za IE8
    app.use(helmet.noSniff());
    app.use(helmet.permittedCrossDomainPolicies());
    app.use(helmet.referrerPolicy()); // ovo sprječava da "Referer" bude dodan GET zahtjevu za link smješten na našoj stranici
    app.use(helmet.xssFilter());
};

export default setupHelmet;
