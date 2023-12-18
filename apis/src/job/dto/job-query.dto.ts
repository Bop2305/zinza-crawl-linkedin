import { IsEnum, IsOptional, IsString } from "class-validator";
import { EnumExperienceLevel } from "src/enums/experience-level.enum";
import { EnumJobType } from "src/enums/job-type.enum";

export class JobQueryDto {
    @IsEnum(EnumExperienceLevel)
    @IsOptional()
    experienceLevel?: EnumExperienceLevel.ENTRY_LEVEL

    @IsEnum(EnumJobType)
    @IsOptional()
    jobType?: EnumJobType.HYBRID

    @IsString()
    @IsOptional()
    keywords?: string
}