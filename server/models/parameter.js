const db = require('../connection/connection');

exports.getAllParameter = (done) => {
    let sql = 'SELECT pID, pKey, pDesc, pText, pArg, isActive FROM Parameter';
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};

exports.getAllParameterByCriteria = (Category, done) => {
    var wh = db.whereCriteriaGenerator(Category);
    let sql = 'SELECT pID, pKey, pDesc, pText, pArg, isActive FROM Parameter'+wh;
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};
