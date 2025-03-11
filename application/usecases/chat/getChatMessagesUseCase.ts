import { MessageRepository } from '@/domain/repositories/MessageRepository';
import { ChatMessageDto } from './dto/chatMessageDto';

export const getChatMessagesUseCase = async (
  repository: MessageRepository,
  gameId: string
): Promise<ChatMessageDto[]> => {
  if (!gameId) throw new Error('Invalid gameId');
  const messages = await repository.getMessageByGameId(gameId);
  if (!messages) {
    return [];
  }
  const newMessages = messages.map((msg) => ({
    gameId,
    userNickname: msg.user.nickname,
    message: msg.message,
  }));

  return newMessages;
};
