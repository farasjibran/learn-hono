import typeorm, {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  QueryRunner,
} from "typeorm";
import { z } from "zod";
import { Todo } from "./todo";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Todo, (todo: any) => todo.user)
  todos!: typeorm.Relation<Todo[]>;

  static async insertDummyUsers(queryRunner: QueryRunner): Promise<void> {
    const dummyUsers = [
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        email: "admin@example.com",
        password:
          "$2a$12$e8/KijUmOuaR7rm/lZtib.DtZaWSQxFi.fBI1x/JZSuMtOB7jf8Mq",
      },
    ];

    for (const user of dummyUsers) {
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          id: user.id,
          email: user.email,
          password: user.password,
          createdAt: new Date(),
        })
        .execute();
    }
  }
}

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string().min(8),
  createdAt: z.date(),
});

export type UserType = z.infer<typeof UserSchema>;
