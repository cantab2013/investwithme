module.exports = {
  up: function(migration, DataTypes, done) {
    console.log("Running migration for ledgers");
    // add altering commands here, calling 'done' when finished
    migration.createTable('ledgers',
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
      quantity: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      price: {
        type: DataTypes.FLOAT,
        defaultValue: 0
      },
      userId: {
        type: DataTypes.INTEGER,
      	foreignKey: true,
        allowNull: false
      }
    })
    .complete(done);
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished

    migration.dropTable('ledgers')
      .complete(done);
  }
};
