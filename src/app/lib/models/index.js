// src/app/lib/models/index.js
import {
  sequelize,
  User,
  Assets,
  WithdrawalPassword,
  WithdrawalHistory,
  DepositHistory,
  TransferHistory,
  WithdrawalAddress,
  WithdrawalRequest,
  Conversation,
  Message,
} from '@/lib/sequelize.js';

export function initModels() {
  const models = {
    User,
    Assets,
    WithdrawalPassword,
    WithdrawalHistory,
    DepositHistory,
    TransferHistory,
    WithdrawalAddress,
    WithdrawalRequest,
    Conversation,
    Message,
  };

  // Call each model's associate method once, if it exists
  Object.values(models).forEach((model) => {
    if (typeof model.associate === 'function') {
      model.associate(models);
    }
  });
 
  return models;
}
