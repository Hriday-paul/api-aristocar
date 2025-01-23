"use strict";
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
const socket_io_1 = require("socket.io");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("./app/error/AppError"));
const getUserDetailsFromToken_1 = __importDefault(require("./app/helpers/getUserDetailsFromToken"));
const initializeSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        },
    });
    // Online users
    const onlineUser = new Set();
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        console.log('connected', socket === null || socket === void 0 ? void 0 : socket.id);
        try {
            //----------------------user token get from front end-------------------------//
            const token = ((_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) || ((_b = socket.handshake.headers) === null || _b === void 0 ? void 0 : _b.token);
            //----------------------check Token and return user details-------------------------//
            const user = yield (0, getUserDetailsFromToken_1.default)(token);
            if (!user) {
                // io.emit('io-error', {success:false, message:'invalid Token'});
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token');
            }
            socket.join((_c = user === null || user === void 0 ? void 0 : user._id) === null || _c === void 0 ? void 0 : _c.toString());
            //----------------------user id set in online array-------------------------//
            onlineUser.add((_d = user === null || user === void 0 ? void 0 : user._id) === null || _d === void 0 ? void 0 : _d.toString());
            socket.on('check', (data, callback) => {
                callback({ success: true });
            });
            //-----------------------Disconnect------------------------//
            socket.on('disconnect', () => {
                var _a;
                onlineUser.delete((_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString());
                io.emit('onlineUser', Array.from(onlineUser));
                console.log('disconnect user ', socket.id);
            });
        }
        catch (error) {
            console.error('-- socket.io connection error --', error);
        }
    }));
    return io;
};
exports.default = initializeSocketIO;
