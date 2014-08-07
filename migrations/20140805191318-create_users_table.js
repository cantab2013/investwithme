module.exports = {
  up: function(migration, DataTypes, done) {
    console.log("Running migration for users");
    // add altering commands here, calling 'done' when finished
    migration.createTable('users',
      {id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isAdmin: {
      	type: DataTypes.BOOLEAN,
      	defaultValue: false
      },
      curBalance: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      cumEarning: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      dailyRate: {
        type: DataTypes.FLOAT,
        defaultValue: 0.04
      }
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished

    migration.dropTable('users')
      .complete(done);
  }
};
