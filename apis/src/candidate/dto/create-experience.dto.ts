import { IsOptional, IsString } from "class-validator"

export class CreateExperienceDto {
    @IsString()
    @IsOptional()
    role?: string

    @IsString()
    @IsOptional()
    company_name?: string

    @IsString()
    @IsOptional()
    duration?: string

    @IsString()
    @IsOptional()
    location?: string

    @IsString()
    candidate: string
}