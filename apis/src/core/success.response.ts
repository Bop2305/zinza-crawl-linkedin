import { Response } from "express"

enum StatusCode {
    OK = 200,
    CREATED = 201,
}

enum Message {
    OK = 'OK',
    CREATED = 'Created',
}

interface SuccessResponseDto<T extends {}> {
    statusCode?: number,
    message?: string,
    metadata?: T
}

class SuccessResponse<T extends {}> {
    statusCode: number
    message: string
    metadata: T

    constructor({ statusCode = StatusCode.OK, message = Message.OK, metadata = {} as T }: SuccessResponseDto<T>) {
        this.statusCode = statusCode
        this.message = message
        this.metadata = metadata
    }

    async send(res: Response): Promise<Response> {
        return res.status(this.statusCode).json({
            statusCode: this.statusCode,
            metadata: this.metadata
        })
    }
}

class OKSuccessResponse<T> extends SuccessResponse<T> {
    constructor({ message, metadata }: SuccessResponseDto<T>) {
        super({ message, metadata })
    }
}

class CreatedSuccessResponse<T> extends SuccessResponse<T> {
    constructor({ statusCode = StatusCode.CREATED, message = Message.CREATED, metadata }: SuccessResponseDto<T>) {
        super({ statusCode, message, metadata })
    }
}

export {
    OKSuccessResponse,
    CreatedSuccessResponse
}