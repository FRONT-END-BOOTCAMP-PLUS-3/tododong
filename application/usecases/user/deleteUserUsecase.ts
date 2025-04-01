import UserRepository from '@/domain/repositories/UserRepository';

export const deleteUserUsecase = async (
  userRepository: UserRepository,
  userId: string
) => {
  await userRepository.updateOne({
    id: userId,
    deletedAt: new Date(),
  });
};
