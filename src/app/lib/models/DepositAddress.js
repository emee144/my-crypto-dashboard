import { DataTypes } from 'sequelize';
import sequelize from '@/app/lib/sequelize'; // adjust this path if needed

const DepositAddress = sequelize.define('DepositAddress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  network: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'DepositAddresses',
  timestamps: true,
});

export default DepositAddress;