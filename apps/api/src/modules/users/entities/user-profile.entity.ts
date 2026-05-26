import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { AppBaseEntity } from "../../../common/entities";
import { numericTransformer } from "../../../common/transformers";
import { UserEntity } from "./user.entity";

@Entity({ name: "user_profiles" })
export class UserProfileEntity extends AppBaseEntity {
  @Column({ name: "user_id", type: "uuid", unique: true })
  userId!: string;

  @Column({ name: "nickname", type: "varchar", length: 40, nullable: true })
  nickname!: string | null;

  @Column({ name: "avatar_url", type: "varchar", length: 500, nullable: true })
  avatarUrl!: string | null;

  @Column({
    name: "height_cm",
    type: "numeric",
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: numericTransformer
  })
  heightCm!: number | null;

  @Column({
    name: "initial_weight_kg",
    type: "numeric",
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: numericTransformer
  })
  initialWeightKg!: number | null;

  @Column({
    name: "target_weight_kg",
    type: "numeric",
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: numericTransformer
  })
  targetWeightKg!: number | null;

  @Column({ name: "onboarding_completed", type: "boolean", default: false })
  onboardingCompleted!: boolean;

  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;
}
