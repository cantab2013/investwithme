module.exports = {
  up: function(migration, DataTypes, done) {
    console.log("Running migration for adminBS");
    // add altering commands here, calling 'done' when finished
    migration.createTable('adminBS',
      {id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      curCash: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      curFundAsset: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      curLiability: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      curEquity: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished

    migration.dropTable('adminBS')
      .complete(done);
  }
};
