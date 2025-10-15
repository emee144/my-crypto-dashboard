// src/app/lib/models/index.js
import {sequelize} from '@/app/lib/sequelize.js';

// Import model definition functions
import defineUserModel from './user.js';
import defineAssetsModel from './assets.js';
import defineWithdrawalPasswordModel from './withdrawalpassword.js';
import defineWithdrawalHistoryModel from './withdrawalhistory.js';
import defineDepositHistoryModel from './deposithistory.js';
import defineTransferHistoryModel from './transferhistory.js';
import defineWithdrawalAddressModel from './withdrawaladdress.js';
import defineWithdrawalRequestModel from './withdrawalrequest.js';
import defineConversationModel from './conversation.js';
import defineMessageModel from './message.js';

// Initialize models
const User = defineUserModel(sequelize);
const Assets = defineAssetsModel(sequelize);
const WithdrawalPassword = defineWithdrawalPasswordModel(sequelize);
const WithdrawalHistory = defineWithdrawalHistoryModel(sequelize);
const DepositHistory = defineDepositHistoryModel(sequelize);
const TransferHistory = defineTransferHistoryModel(sequelize);
const WithdrawalAddress = defineWithdrawalAddressModel(sequelize);
const WithdrawalRequest = defineWithdrawalRequestModel(sequelize);
const Conversation = defineConversationModel(sequelize);
const Message = defineMessageModel(sequelize);

// Associate models
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

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize };
export default models; // ✅ export your models object

