const db = require('../connection/connection');

exports.get = (done) => {
    let sql = 'select EnumProp, EnumText, EnumValue from Enum';
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};

exports.getByCriteria = (Obj, done) => {
    var wh = db.whereCriteriaGenerator(Obj);
    let sql = 'select EnumProp, EnumText, EnumValue from Enum'+wh;
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};
