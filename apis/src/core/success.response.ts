import { Response } from "express"
import { EnumOrderBy } from "src/enums/order-by.enum"

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
            message: this.message,
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

class PaginationResponse<T> {
    data: T[]
    totalPage: number
    perPage: number
    currentPage: number
    orderBy: EnumOrderBy

    constructor({ data = [], totalPage = 1, perPage = 20, currentPage = 1, orderBy = EnumOrderBy.ASC }) {
        this.data = data
        this.totalPage = totalPage
        this.perPage = perPage
        this.currentPage = currentPage
        this.orderBy = orderBy
    }

    async send(res: Response): Promise<Response> {
        return res.status(StatusCode.OK)
            .json({
                message: Message.OK,
                statusCode: StatusCode.OK,
                metadata: {
                    totalPage: this.totalPage,
                    currentPage: this.currentPage,
                    perPage: this.perPage,
                    orderBy: this.orderBy,
                    data: this.data
                }
            })
    }
}

export {
    OKSuccessResponse,
    CreatedSuccessResponse,
    PaginationResponse
}