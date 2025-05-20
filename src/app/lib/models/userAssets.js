
import { Model, DataTypes } from 'sequelize';
import {sequelize} from '@/app/lib/sequelize'; // Adjust the path if needed

class UserAssets extends Model {

 }

UserAssets.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    assetType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assetName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'userAssets',
    tableName: 'userAssets',
    timestamps: true,
  }
);

export default UserAssets;
