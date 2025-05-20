import sequelize from '@/app/lib/sequelize';

import UserFactory from './user.js';
import WithdrawalHistoryFactory from './withdrawalhistory.js';
import AssetsFactory from './assets.js';
import WithdrawalPasswordFactory from './withdrawalpassword.js';
import DepositHistoryFactory from './deposithistory.js';
import WithdrawalAddressFactory from './withdrawaladdress.js';
import WithdrawalRequestFactory from './withdrawalrequest.js';

let initialized = false;
let models;

export function initModels() {
  if (!initialized) {
    const User = UserFactory(sequelize);
    const WithdrawalHistory = WithdrawalHistoryFactory(sequelize);
    const Assets = AssetsFactory(sequelize);
    const WithdrawalPassword = WithdrawalPasswordFactory(sequelize);
    const DepositHistory = DepositHistoryFactory(sequelize);
    const WithdrawalAddress = WithdrawalAddressFactory(sequelize);
    const WithdrawalRequest = WithdrawalRequestFactory(sequelize);

    models = {
      User,
      WithdrawalHistory,
      Assets,
      WithdrawalPassword,
      DepositHistory,
      WithdrawalAddress,
      WithdrawalRequest,
    };

    Object.values(models).forEach((model) => {
      if (typeof model.associate === 'function') {
        model.associate(models);
      }
    });

    initialized = true;
  }

  return models;
}
