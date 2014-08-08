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
      cash: {
        type: DataTypes.FLOAT,
        defaultValue: 100000
      },
      portfolio: {
        type: DataTypes.FLOAT,
        defaultValue: 0
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
