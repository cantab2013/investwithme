module.exports = {
  up: function(migration, DataTypes, done) {
    console.log("Running migration for funds");
    // add altering commands here, calling 'done' when finished
    migration.createTable('funds',
      {id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      ticker: {
        type: DataTypes.STRING,
        allowNull: false
      },
      curQuantity: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      curPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      cumPmt: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      dailyPmtPS: {
        type: DataTypes.FLOAT
      }
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished

    migration.dropTable('funds')
      .complete(done);
  }
};
