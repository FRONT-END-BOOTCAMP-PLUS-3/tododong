import { Message } from '@prisma/client';

export interface MessageWithNickname extends Message {
  user: { nickname: string };
}

export interface MessageRepository {
  getMessageByGameId: (gameId: string) => Promise<MessageWithNickname[] | null>;
  createMessage(message: Partial<Message>): Promise<void>; //Partial: Message중 일부만 사용해도 됨
}
