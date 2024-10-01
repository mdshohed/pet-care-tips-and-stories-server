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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const config_1 = __importDefault(require("./app/config"));
const http_status_1 = __importDefault(require("http-status"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: [config_1.default.client_url],
}));
// parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// application routes
app.use("/api/v1", routes_1.default);
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    Promise.reject();
});
app.get('/', (req, res, next) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Welcome to the Lost And Found API',
    });
});
app.use(globalErrorhandler_1.default);
app.use(notFound_1.default);
exports.default = app;
