// ledgers.js

function Ledger(sequelize, DataTypes){

    /* sequelize.define(modelName, attributes, options);
create a model like `post`
with attributes like `body` and `title`
*/
    var Ledger = sequelize.define('ledger',{
      curBalance: DataTypes.FLOAT,
      dailyRate: DataTypes.FLOAT,
      cumEarning: DataTypes.FLOAT,
      dailyLedger: DataTypes.ARRAY(DataTypes.FLOAT),
      userID: DataTypes.INTEGER
    },
      {
        classMethods: {
          associate: function(db) {
            Ledger.belongsTo(db.user);
          }
        }
      })
   return Ledger;
}

module.exports = Ledger;