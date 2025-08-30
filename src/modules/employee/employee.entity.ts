import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Department } from "@modules/department/department.entity";
import { Gender } from "./enums/gender.enum";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;

  @Column({ type: "varchar", nullable: false, name: "first_name" })
  public firstName: string;

  @Column({ type: "varchar", nullable: false, name: "last_name" })
  public lastName: string;

  @Column({ type: "varchar", nullable: false })
  public email: string;

  @Column({ type: "varchar", nullable: false, name: "phone_number" })
  public phoneNumber: string;

  @Column({ type: "date", nullable: false, name: "date_of_birth" })
  public dateOfBirth: Date;

  @Column({ type: "enum", enum: Gender, nullable: false })
  public gender: Gender;

  @Column({ type: "varchar", nullable: false, name: "job_title" })
  public jobTitle: string;

  @Column({ type: "text", nullable: false, name: "image_url" })
  public imageUrl: string;

  @Column({ type: "text", nullable: false })
  public address: string;

  @Column({ type: "date", nullable: false, name: "date_of_employment" })
  public dateOfEmployment: Date;

  @ManyToOne(() => Department, (department) => department.employees, {
    onDelete: "RESTRICT",
    nullable: false,
  })
  @JoinColumn({ name: "department_id" })
  public department: Department;
}
