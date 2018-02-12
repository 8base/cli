import * as express from "express";
import * as http from "http";
import * as bodyParser from 'body-parser';
import * as _ from "lodash";
import { debug } from '../../../../common';
import * as logger from 'morgan';
import { Routes } from './routes';


export class LocalServerExpress {

    port: number;

    app: any;

    server: http.Server;

    constructor(port: number) {
        this.port = port;
    }

    start() {
        if (this.app) {
            return;
        }

        this.app = express();
        this.middleware();
        this.routes();

        this.server = http.createServer(this.app);

        this.server.listen(this.port);
        this.server.on('error', LocalServerExpress.onError);

        debug("server start on port " + this.port);
    }

    private middleware() {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private routes(): void {

        let router = express.Router();

        router.post('/cli', Routes.cli);

        this.app.use('/', router);
    }

    static onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') throw error;
        switch(error.code) {
            case 'EACCES':
                debug(`requires elevated privileges`);
                process.exit(1);
            break;
            case 'EADDRINUSE':
                debug(`port is already in use`);
                process.exit(1);
            break;
            default:
                throw error;
        }
    }
}