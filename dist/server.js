"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const http_1 = require("http");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const socket_1 = __importDefault(require("./socket"));
const defaultTask_1 = require("./app/utils/defaultTask");
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars
const colors = require('colors');
let server;
exports.io = (0, socket_1.default)((0, http_1.createServer)(app_1.default));
// export const io = initializeSocketIO(createServer(app));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            (0, defaultTask_1.defaultTask)();
            server = app_1.default.listen(Number(config_1.default.port), config_1.default.ip, () => {
                //@ts-ignore
                console.log(`app is listening on ${config_1.default.ip}:${config_1.default.port}`.green.bold);
            });
            exports.io.listen(Number(config_1.default.socket_port));
            console.log(
            //@ts-ignore
            `Socket is listening on port ${config_1.default.ip}:${config_1.default.socket_port}`.yellow
                .bold);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            global.socketio = exports.io;
        }
        catch (err) {
            console.error(err);
        }
    });
}
main();
process.on('unhandledRejection', err => {
    console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on('uncaughtException', () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
});
