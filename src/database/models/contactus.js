
export default (sequelize, DataTypes) => {
  const ContactUs = sequelize.define(
    'ContactUs',
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
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAtLeast10Characters(value) {
            if (value.length < 10) {
              throw new Error('Message must be at least 10 characters long');
            }
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('general', 'bug', 'rides', 'payments', 'others'),
        defaultValue: 'general'
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
  )
  ContactUs.associate = (models) => {
    ContactUs.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    })
  }
  return ContactUs
}
