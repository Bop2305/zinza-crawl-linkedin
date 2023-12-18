import { EnumOrderBy } from "src/enums/order-by.enum"

export interface PaginationResponseDto<T> {
    data?: T[]
    totalPage?: number
    perPage?: number
    currentPage?: number
    orderBy?: EnumOrderBy
}