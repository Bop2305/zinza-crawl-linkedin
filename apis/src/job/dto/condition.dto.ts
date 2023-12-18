import { IsEnum, IsOptional } from "class-validator";
import { EnumExperienceLevel } from "src/enums/experience-level.enum";
import { EnumJobType } from "src/enums/job-type.enum";

export class ConditionDto {
    @IsEnum(EnumExperienceLevel)
    @IsOptional()
    experienceLevel?: EnumExperienceLevel.ENTRY_LEVEL

    @IsEnum(EnumJobType)
    @IsOptional()
    jobType?: EnumJobType.HYBRID
}