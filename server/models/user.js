const db = require('../connection/connection');

exports.getAllUser = (done) => {
    let sql = 'SELECT * FROM [User]';
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};

exports.getAllUserByCriteria = (User, done) => {
    var wh = db.whereCriteriaGenerator(User);
    let sql = 'SELECT * FROM [User]'+wh;
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};

//GA
exports.getAllUserGA = (done) => {
    let sql = 'SELECT * FROM [User]';
    db.execSql(sql,{},"GA").then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};

exports.getAllUserByCriteriaGA = (User, done) => {
    var wh = db.whereCriteriaGenerator(User);
    let sql = 'SELECT * FROM [User]'+wh;
    db.execSql(sql,{},"GA").then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};