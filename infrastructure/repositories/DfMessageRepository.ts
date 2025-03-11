import { PrismaClient, Message } from '@prisma/client';
import {
  MessageRepository,
  MessageWithNickname,
} from '@/domain/repositories/MessageRepository';
import { prisma } from '@/utils/prisma';

export class DfMessageRepository implements MessageRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async getMessageByGameId(
    gameId: string
  ): Promise<MessageWithNickname[] | null> {
    try {
      const messages = await prisma.message.findMany({
        where: { gameId },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          user: {
            select: {
              nickname: true,
            },
          },
        },
      });
      return messages;
    } catch (error) {
      console.log(error);
      throw new Error('메시지 데이터 불러오기 실패');
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async createMessage(message: Message): Promise<void> {
    try {
      await prisma.message.create({
        data: {
          gameId: message.gameId,
          userId: message.userId,
          message: message.message,
        },
      });
    } catch (error) {
      throw new Error('메시지 데이터 생성 실패');
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
