import { TransferRepository } from "../repositories/TransferRepository";

export class TransferService {
  private transferRepo = new TransferRepository();

  async createTransfer(data: {
    playerId: string;
    fromTeamId?: string;
    toTeamId: string;
    date: string;
    fee?: number;
    feeDisplay?: string;
    type: "PERMANENT" | "LOAN" | "FREE_TRANSFER";
  }) {
    const createData: any = {
      player: { connect: { id: data.playerId } },
      toTeam: { connect: { id: data.toTeamId } },
      date: new Date(data.date),
      type: data.type,
    };
    if (data.fromTeamId) {
      createData.fromTeam = { connect: { id: data.fromTeamId } };
    }
    if (data.fee !== undefined) createData.fee = data.fee;
    if (data.feeDisplay) createData.feeDisplay = data.feeDisplay;
    return this.transferRepo.create(createData);
  }

  async listTransfers(filters?: { teamId?: string; playerId?: string }) {
    return this.transferRepo.findAll(filters);
  }
}
