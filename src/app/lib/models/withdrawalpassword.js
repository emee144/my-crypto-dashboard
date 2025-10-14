import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class WithdrawalPassword extends Model {  // Capitalize 'WithdrawalPassword'
    static associate(models) {
      WithdrawalPassword.belongsTo(models.User, {  // Capitalize 'User' here
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  WithdrawalPassword.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // one withdrawal password per user
    },
    withdrawalPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'WithdrawalPassword',  // Capitalize here as well
    tableName: 'withdrawalpasswords',
    timestamps: true,
  });

  return WithdrawalPassword;
};
