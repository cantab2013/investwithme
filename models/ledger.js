// ledgers.js

function Ledger(sequelize, DataTypes){

    /* sequelize.define(modelName, attributes, options);
create a model like `post`
with attributes like `body` and `title`
*/
    var ledger = sequelize.define('ledger',{
      ticker: DataTypes.STRING,
      quantity: DataTypes.FLOAT,
      price: DataTypes.FLOAT,
      userId: DataTypes.INTEGER
    },
      {
        classMethods: {
          associate: function(db) {
            ledger.belongsTo(db.user);
          }
        }
      })
   return ledger;
}

module.exports = Ledger;