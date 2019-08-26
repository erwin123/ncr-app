const db = require('../connection/connection');

exports.getAllTicketProgress = (done) => {
    let sql = "SELECT tID,tMsg,updby, format(upddate,'yyyy-MM-dd HH:mm:ss') upddate from TicketProgress";
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};

exports.getAllTicketProgressByCriteria = (TicketProgress, done) => {
    var wh = db.whereCriteriaGenerator(TicketProgress);
    let sql = "SELECT tID,tMsg,updby,format(upddate,'yyyy-MM-dd HH:mm:ss') upddate from TicketProgress"+wh+" order by upddate desc";
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};

exports.insertTicketProgress = (TicketProgress, done) => {
    let sql = "INSERT INTO TicketProgress SELECT '"+TicketProgress.tID+"','"+TicketProgress.tMsg+"','"+TicketProgress.updby+"',GETDATE()";
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};