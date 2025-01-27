import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  JoinColumn
} from "typeorm";
import {
  Field,
  ObjectType,
  registerEnumType,
  Int,
  InputType
} from "type-graphql";
import { User } from "./User";

@ObjectType()
export class PaperRecording {
  constructor({
    userId,
    device,
    lastId
  }: {
    userId: string;
    device: string;
    lastId: number;
  }) {
    this.userId = userId;
    this.device = device;
    this.lastId = lastId;
  }
  @Field()
  userId: string;
  @Field()
  device: string;
  @Field(() => Int)
  lastId: number;
}

@ObjectType()
@Entity()
export class Paper extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.papers)
  @JoinColumn({ name: "ownerId" })
  owner: User;
  @Field()
  @Column()
  ownerId: string;

  @Field(() => [PaperPermission])
  @OneToMany(() => PaperPermission, permission => permission.paper)
  permissions: PaperPermission[];

  @Field(() => [PaperPath])
  @OneToMany(() => PaperPath, path => path.paper)
  paths: PaperPath[];

  @Field()
  @CreateDateColumn()
  createdDate: Date;

  @Field(() => [PaperRecording])
  @Column("jsonb", { default: '[]' })
  recording: PaperRecording[];

  @Field(() => Int)
  @Column("integer", { default: "0" })
  sequenceNumber: number;
}

export enum PaperPermissionType {
  "READ" = "READ",
  "WRITE" = "WRITE",
  "ADMIN" = "ADMIN"
}
registerEnumType(PaperPermissionType, { name: "PaperPermissionType" });

@ObjectType()
@Entity()
@Index(["user", "paper"], { unique: true })
export class PaperPermission extends BaseEntity {
  @Field(() => User)
  @ManyToOne(() => User, user => user.permissions)
  @JoinColumn({ name: "userId" })
  user: User;
  @Field()
  @PrimaryColumn()
  userId: string;

  @Field(() => Paper)
  @ManyToOne(() => Paper, paper => paper.permissions)
  @JoinColumn({ name: "paperId" })
  paper: Paper;
  @Field()
  @PrimaryColumn()
  paperId: string;

  @Field(() => PaperPermissionType)
  @Column()
  type: PaperPermissionType;
}

@ObjectType()
@InputType("PaperPathDataInput")
export class PaperPathData {
  @Field(() => [Int])
  x: number[];
  @Field(() => [Int])
  y: number[];
  @Field(() => [Int])
  t: number[];
}

@ObjectType()
@Entity()
@Index(["paper", "id", "device", "user"], { unique: true })
export class PaperPath extends BaseEntity {
  @Field(() => String)
  @ManyToOne(() => Paper, paper => paper.paths)
  @JoinColumn({ name: "paperId" })
  paper: Paper;
  @Field()
  @PrimaryColumn()
  paperId: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;
  @Field()
  @PrimaryColumn()
  userId: string;

  @Field()
  @PrimaryColumn()
  device: string;

  @Field(() => Int)
  @PrimaryColumn({ unsigned: true })
  id: number;

  @Field(() => PaperPathData, { nullable: true })
  @Column("jsonb", { nullable: true })
  data: PaperPathData | null;

  @Field(() => Int)
  @Column("integer")
  sequenceNumber: number;
}
