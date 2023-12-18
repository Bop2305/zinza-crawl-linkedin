import { Type } from 'class-transformer';
import { IsEnum, IsOptional, Max, Min } from 'class-validator';
import { EnumOrderBy } from 'src/enums/order-by.enum';

export class PaginationParams {
    @IsEnum(EnumOrderBy)
    @IsOptional()
    orderBy?: EnumOrderBy = EnumOrderBy.ASC

    @Type(() => Number)
    @IsOptional()
    @Min(1)
    page?: number = 1

    @Type(() => Number)
    @IsOptional()
    @Min(1)
    @Max(50)
    perpage?: number = 20
}