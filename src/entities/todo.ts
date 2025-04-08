import typeorm, {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { z } from "zod";
import { User } from "./user";

@Entity("todos")
export class Todo {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "boolean", default: false })
  completed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.todos, {
    onDelete: "CASCADE",
  })
  user!: typeorm.Relation<User>;

  @Column({ type: "uuid" })
  userId!: string;
}

export const TodoSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  completed: z.boolean(),
  userId: z.string().uuid(),
  createdAt: z.date(),
});

export type TodoType = z.infer<typeof TodoSchema>;
