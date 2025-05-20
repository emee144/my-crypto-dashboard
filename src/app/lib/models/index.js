// src/app/lib/models/index.js
import {
  sequelize,
  User,
  Assets,
  WithdrawalPassword,
  WithdrawalHistory,
  DepositHistory,
  WithdrawalAddress,
  WithdrawalRequest,
} from '@/lib/sequelize.js';

let initialized = false;
let models;

export function initModels() {
  if (!initialized) {
    models = {
      User,
      Assets,
      WithdrawalPassword,
      WithdrawalHistory,
      DepositHistory,
      WithdrawalAddress,
      WithdrawalRequest,
    };

    Object.values(models).forEach((model) => {
      if (typeof model.associate === 'function') {
        model.associate(models); // ✅ run only once
      }
    });

    initialized = true;
  }

  return models;
}
