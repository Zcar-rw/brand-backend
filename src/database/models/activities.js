
export default (sequelize, DataTypes) => {
  const Activity = sequelize.define(
    'Activity',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(
          'USER REGISTRATION',
          'CAR REGISTRATION',
          'DRIVER REGISTRATION',
          'WALLET TOPUP',
          'RIDE CREATION',
          'RIDE REQUEST',
          'ENTER CAR',
          'RIDE COMPLETED',
          'DRIVER PAYOUT',
          'USER LOGIN',
          'PASSWORD RESET',
        ),
        allowNull: false,
      },
      timestamp: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM('SUCCESS', 'FAILURE'),
        allowNull: false,
        defaultValue: 'SUCCESS'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );
  Activity.associate = (models) => {
    Activity.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };
  return Activity;
};
