import { UserRepository } from "../repositories/UserRepository";
import { UserFollowRepository } from "../repositories/UserFollowRepository";
import { User, UserFollow, FollowEntityType } from "@prisma/client";

export class UserService {
  private userRepo = new UserRepository();
  private followRepo = new UserFollowRepository();

  async syncUser(data: {
    clerkId: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  }): Promise<User> {
    const existing = await this.userRepo.findByClerkId(data.clerkId);
    if (existing) {
      return this.userRepo.update(existing.id, {
        email: data.email,
        name: data.name,
        avatarUrl: data.avatarUrl,
      });
    }
    return this.userRepo.create({
      clerkId: data.clerkId,
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
    });
  }

  async getUser(userId: string): Promise<User | null> {
    return this.userRepo.findById(userId);
  }

  async getUserByClerkId(clerkId: string): Promise<User | null> {
    return this.userRepo.findByClerkId(clerkId);
  }

  async updatePreferences(
    userId: string,
    prefs: {
      theme?: string;
      language?: string;
      unitSystem?: string;
      timezone?: string;
    }
  ): Promise<User> {
    return this.userRepo.update(userId, prefs);
  }

  async getFollows(userId: string): Promise<UserFollow[]> {
    return this.followRepo.findByUser(userId);
  }

  async getFollowsByType(
    userId: string,
    entityType: FollowEntityType
  ): Promise<UserFollow[]> {
    return this.followRepo.findByUserAndType(userId, entityType);
  }

  async follow(
    userId: string,
    entityType: FollowEntityType,
    entityId: string
  ): Promise<UserFollow> {
    const existing = await this.followRepo.findExisting(
      userId,
      entityType,
      entityId
    );
    if (existing) return existing;
    return this.followRepo.create({
      user: { connect: { id: userId } },
      entityType,
      entityId,
    });
  }

  async unfollow(userId: string, followId: string): Promise<void> {
    await this.followRepo.delete(followId);
  }

  async unfollowEntity(
    userId: string,
    entityType: FollowEntityType,
    entityId: string
  ): Promise<void> {
    await this.followRepo.deleteByEntity(userId, entityType, entityId);
  }
}
