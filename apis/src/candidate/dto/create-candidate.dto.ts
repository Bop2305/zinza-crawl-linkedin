import { IsOptional, IsString } from "class-validator"

export class CreateCandidateDto {
    @IsString()
    @IsOptional()
    fullname?: string

    @IsString()
    @IsOptional()
    intro?: string

    @IsString()
    @IsOptional()
    countries?: string

    @IsString()
    @IsOptional()
    contact?: string

    @IsString()
    @IsOptional()
    skills?: string
}