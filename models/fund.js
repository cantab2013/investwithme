// fund.js

function Fund(sequelize, DataTypes){

    /* sequelize.define(modelName, attributes, options);
create a model like `post`
with attributes like `body` and `title`
*/
    var fund = sequelize.define('fund',{
      ticker: DataTypes.STRING,
      curQuantity: DataTypes.FLOAT,
      curPrice: DataTypes.FLOAT,
      cumPmt: DataTypes.FLOAT,
      dailyPmtPS: DataTypes.FLOAT
    },
      {
        classMethods: {
          associate: function(db) {
            fund.belongsTo(db.user);
          }
        }
      })
   return fund;
}

module.exports = fund;