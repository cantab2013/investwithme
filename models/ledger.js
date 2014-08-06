// ledgers.js

function Ledger(sequelize, DataTypes){

    /* sequelize.define(modelName, attributes, options);
create a model like `post`
with attributes like `body` and `title`
*/
    var ledger = sequelize.define('ledger',{
      curBalance: DataTypes.FLOAT,
      dailyRate: DataTypes.FLOAT,
      cumEarning: DataTypes.FLOAT,
      dailyLedger: DataTypes.ARRAY(DataTypes.FLOAT),
      userID: DataTypes.INTEGER
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