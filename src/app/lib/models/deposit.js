// models/deposit.js
import { DataTypes } from 'sequelize';
import sequelize from '@/app/lib/sequelize';  // Import your sequelize instance

const Deposit = sequelize.define('deposits', {
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
      model: 'Users',  // Reference to the Users table
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

export default Deposit;
