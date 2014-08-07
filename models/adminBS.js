// adminBS.js

function AdminBS(sequelize, DataTypes){

    /* sequelize.define(modelName, attributes, options);
create a model like `post`
with attributes like `body` and `title`
*/
    var adminBS = sequelize.define('adminBS',{
      curCash: DataTypes.FLOAT,
      curFundAsset: DataTypes.FLOAT,
      curLiability: DataTypes.FLOAT,
      curEquity: DataTypes.FLOAT
    },
      {
        classMethods: {
          // associate: function(db) {
          //   adminBS.belongsTo(db.user);
          // }
        }
      })
   return adminBS;
}

module.exports = AdminBS;