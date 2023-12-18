import { Response } from "express";
interface SuccessResponseDto<T extends {}> {
    statusCode?: number;
    message?: string;
    metadata?: T;
}
declare class SuccessResponse<T extends {}> {
    statusCode: number;
    message: string;
    metadata: T;
    constructor({ statusCode, message, metadata }: SuccessResponseDto<T>);
    send(res: Response): Promise<Response>;
}
declare class OKSuccessResponse<T> extends SuccessResponse<T> {
    constructor({ message, metadata }: SuccessResponseDto<T>);
}
declare class CreatedSuccessResponse<T> extends SuccessResponse<T> {
    constructor({ statusCode, message, metadata }: SuccessResponseDto<T>);
}
export { OKSuccessResponse, CreatedSuccessResponse };
