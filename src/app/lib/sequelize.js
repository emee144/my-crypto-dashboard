// lib/sequelize.js
import { Sequelize, DataTypes, Model } from 'sequelize';
import dotenv from 'dotenv';
import mysql2 from 'mysql2';  // Directly importing mysql2

dotenv.config({ path: process.cwd() + '/.env.local' });

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST = 'localhost',
  DB_PORT = 3306,
  JWT_SECRET,
  
  DB_DIALECT = 'mysql',
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD) {
  console.error('❌ Missing essential database environment variables.');
  process.exit(1);
}

// Create Sequelize instance with specified dialect
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  dialectModule: mysql2,
  port: Number(DB_PORT),
  logging: console.log,
});

// ✅ User Model
const User = sequelize.define('User', { // Updated model name to 'User'
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referralcode: {
    type: DataTypes.STRING(8),
    allowNull: false,
    unique: true,
  },
  referral: {
    type: DataTypes.STRING(8),
    allowNull: true, // because it's optional
  },
  ethAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tronAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  
});

const Assets = sequelize.define('Assets', { // Updated model name to 'Assets'
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User', // Reference to 'User' model (capitalized)
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  exchange: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  perpetual: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  trade: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0,
  },
  assetType: {
    type: DataTypes.STRING,  // Define assetType column here
    allowNull: false,        // Set as required (or true if optional)
  },
  assetName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Assets.belongsTo(User, { foreignKey: 'userId' }); // Define association
const Deposit = sequelize.define('Deposit', { // Updated model name to 'Deposit'
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',  // Reference to 'User' model (capitalized)
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  exchange: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
  },
  trade: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
  },
  perpetual: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'deposits',
});

const WithdrawalAddress = sequelize.define('WithdrawalAddress', { // Updated model name to 'WithdrawalAddress'
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User', // Reference to 'User' model (capitalized)
      key: 'id',
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  network: {
    type: DataTypes.ENUM('erc20', 'trc20'),
    allowNull: false,
  },
}, {
  tableName: 'withdrawaladdresses',
  timestamps: true,
});

// Association
WithdrawalAddress.belongsTo(User, { foreignKey: 'userId' });

// ✅ Connect Function
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err);
    process.exit(1);
  }
};

const WithdrawalPassword = sequelize.define('WithdrawalPassword', { // Updated model name to 'WithdrawalPassword'
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User', // Reference to 'User' model (capitalized)
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  withdrawalPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'withdrawalpasswords',
});

// Association
WithdrawalPassword.belongsTo(User, { foreignKey: 'userId' });

const WithdrawalRequest = sequelize.define('WithdrawalRequest', { // Updated model name to 'WithdrawalRequest'
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User', // Reference to 'User' model (capitalized)
      key: 'id',
    },
  },
  network: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  withdrawalAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amountRequested: {
    type: DataTypes.DECIMAL(20, 4),
    allowNull: false,
  },
  handlingFee: {
    type: DataTypes.DECIMAL(20, 4),
    allowNull: false,
  },
  amountAfterFee: {
    type: DataTypes.DECIMAL(20, 4),
    allowNull: false,
  },
  withdrawalPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

const DepositHistory = sequelize.define('DepositHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User', // Reference to 'User' model (capitalized)
      key: 'id',
    },
  },
  
  amount: {
    type: DataTypes.DECIMAL(20, 6),  // 6 decimal places for the deposit amount
    allowNull: false,
  },
  chainName: {
    type: DataTypes.STRING,  // 'ERC20', 'TRC20', etc.
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,  // 'USDT', 'BTC', 'ETH', etc.
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,  // 'Pending', 'Completed', 'Failed'
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,  // Automatically sets the current timestamp
  },
}, {
  modelName: 'DepositHistory',
  tableName: 'deposithistories',
  timestamps: true,  // Enable default createdAt/updatedAt fields
});
DepositHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const WithdrawalHistory = sequelize.define('WithdrawalHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User', // Reference to 'User' model (capitalized)
      key: 'id',
    },
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amountAfterFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  chainName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  withdrawalAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'rejected'), // Updated ENUM values
    allowNull: false,
    defaultValue: 'pending', // Default value set to 'pending'
  },
}, {
  modelName: 'WithdrawalHistory',
  tableName: 'withdrawalhistories',
  timestamps: true,
});
WithdrawalHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });
export { sequelize, User, Assets, Model, WithdrawalPassword, WithdrawalHistory, DepositHistory, WithdrawalAddress, WithdrawalRequest, connectDB };

