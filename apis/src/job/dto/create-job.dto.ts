import { IsOptional, IsString } from "class-validator"

export class CreateJobDto {
    @IsString()
    @IsOptional()
    job_position?: string

    @IsString()
    @IsOptional()
    company_name?: string

    @IsString()
    @IsOptional()
    company_link?: string

    @IsString()
    @IsOptional()
    job_type?: string

    @IsString()
    @IsOptional()
    work_schedule?: string

    @IsString()
    @IsOptional()
    experience_level?: string

    @IsString()
    @IsOptional()
    job_description?: string

    @IsString()
    @IsOptional()
    required_skills?: string

    @IsString()
    @IsOptional()
    linkedin_url?: string
}