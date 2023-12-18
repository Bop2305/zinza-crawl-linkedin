import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Index(['job_type', 'experience_level', 'required_skills'])
export class JobDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: true })
    job_position: string

    @Column({ nullable: true })
    company_name: string

    @Column({ nullable: true })
    company_link: string

    @Column({ nullable: true })
    job_type: string

    @Column({ nullable: true })
    work_schedule: string

    @Column({ nullable: true })
    experience_level: string

    @Column({ nullable: true })
    job_description: string

    @Column({ nullable: true })
    required_skills: string

    @Column({ nullable: true })
    linkedin_url: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    modified_at: Date
}