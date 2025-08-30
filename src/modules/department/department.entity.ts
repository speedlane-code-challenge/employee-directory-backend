import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

import { Employee } from "@modules/employee/employee.entity";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ name: "created_at" })
  public createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  public updatedAt: Date;

  @Column({ type: "varchar", nullable: false })
  public name: string;

  @Column({ type: "text", nullable: false })
  public description: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  public employees: Employee[];
}
