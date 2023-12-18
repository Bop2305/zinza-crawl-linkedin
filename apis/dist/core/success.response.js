"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatedSuccessResponse = exports.OKSuccessResponse = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
})(StatusCode || (StatusCode = {}));
var Message;
(function (Message) {
    Message["OK"] = "OK";
    Message["CREATED"] = "Created";
})(Message || (Message = {}));
class SuccessResponse {
    constructor({ statusCode = StatusCode.OK, message = Message.OK, metadata = {} }) {
        this.statusCode = statusCode;
        this.message = message;
        this.metadata = metadata;
    }
    async send(res) {
        return res.status(this.statusCode).json({
            statusCode: this.statusCode,
            metadata: this.metadata
        });
    }
}
class OKSuccessResponse extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}
exports.OKSuccessResponse = OKSuccessResponse;
class CreatedSuccessResponse extends SuccessResponse {
    constructor({ statusCode = StatusCode.CREATED, message = Message.CREATED, metadata }) {
        super({ statusCode, message, metadata });
    }
}
exports.CreatedSuccessResponse = CreatedSuccessResponse;
//# sourceMappingURL=success.response.js.map