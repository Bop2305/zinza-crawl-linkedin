import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Index(['fullname', 'contact'])
export class Candidate {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: true })
    fullname: string

    @Column({ nullable: true })
    intro: string

    @Column({ nullable: true })
    countries: string

    @Column({ nullable: true })
    contact: string

    @Column({ nullable: true })
    skills: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    modified_at: Date
}

@Entity()
export class Experience {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ nullable: true })
    role: string

    @Column({ nullable: true })
    company_name: string

    @Column({ nullable: true })
    duration: string

    @Column({ nullable: true })
    location: string

    @ManyToOne(() => Candidate, candidate => candidate.id, {onDelete: 'CASCADE'})
    @Column({ name: 'candidate' })
    candidate: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    modified_at: Date
}