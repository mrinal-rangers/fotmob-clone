import { z } from "zod";
import {
  LeagueType,
  MatchStatus,
  EventType,
  PlayerPosition,
  TransferType,
  NewsCategory,
  AdminRole,
} from "@prisma/client";

export type {
  League,
  Team,
  Player,
  Match,
  MatchEvent,
  Standing,
  PlayerStats,
  Transfer,
  News,
  Admin,
  LeagueType,
  MatchStatus,
  EventType,
  PlayerPosition,
  TransferType,
  NewsCategory,
  AdminRole,
} from "@prisma/client";

export const CreateLeagueSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().url().optional(),
  country: z.string().min(1),
  type: z.nativeEnum(LeagueType).default(LeagueType.LEAGUE),
  season: z.string().min(1),
});

export const CreateTeamSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().optional(),
  logoUrl: z.string().url().optional(),
  country: z.string().optional(),
  stadium: z.string().optional(),
  foundedYear: z.number().int().optional(),
});

export const CreatePlayerSchema = z.object({
  name: z.string().min(1),
  position: z.nativeEnum(PlayerPosition),
  nationality: z.string().optional(),
  dateOfBirth: z.string().datetime().optional(),
  height: z.number().int().optional(),
  weight: z.number().int().optional(),
  shirtNumber: z.number().int().optional(),
  photoUrl: z.string().url().optional(),
  teamId: z.string().uuid().optional(),
});

export const CreateMatchSchema = z.object({
  homeTeamId: z.string().uuid(),
  awayTeamId: z.string().uuid(),
  leagueId: z.string().uuid(),
  round: z.number().int().optional(),
  date: z.string().datetime(),
});

export const CreateMatchEventSchema = z.object({
  teamId: z.string().uuid(),
  playerId: z.string().uuid().optional(),
  assistPlayerId: z.string().uuid().optional(),
  type: z.nativeEnum(EventType),
  minute: z.number().int().min(0).max(120),
  extraMinute: z.number().int().optional(),
  detail: z.string().optional(),
});

export const UpdateMatchStatusSchema = z.object({
  status: z.nativeEnum(MatchStatus),
});

export const CreateTransferSchema = z.object({
  playerId: z.string().uuid(),
  fromTeamId: z.string().uuid().optional(),
  toTeamId: z.string().uuid(),
  date: z.string().datetime(),
  fee: z.number().optional(),
  feeDisplay: z.string().optional(),
  type: z.nativeEnum(TransferType).default(TransferType.PERMANENT),
});

export const CreateNewsSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  imageUrl: z.string().url().optional(),
  category: z.nativeEnum(NewsCategory).default(NewsCategory.GENERAL),
  leagueId: z.string().uuid().optional(),
  publishedAt: z.string().datetime().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const SearchSchema = z.object({
  q: z.string().min(1),
  type: z.enum(["players", "teams", "leagues"]).optional(),
});
