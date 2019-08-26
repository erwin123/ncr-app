const db = require('../connection/connection');

exports.getAll = (done) => {
    let sql = "select ProjectID, LocationID, RootCause, Matters, ReportBy, Description,LocationDetail, Notes, Founder, SLA, TotalCost FROM Report";
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};

exports.getByCriteria = (Obj, done) => {
    var wh = db.whereCriteriaGenerator(Obj);
    let sql = "select ProjectID, LocationID, RootCause, Matters, ReportBy, Description,LocationDetail, Notes, Founder, SLA, TotalCost FROM Report"+wh;
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};

exports.insert = (Obj, done) => {
    let sql = "exec up_insertReport"+
              "@ProjectID='"+Obj.ProjectID+"'"+
              ", @LocationID='"+Obj.LocationID+"'"+
              ", @RootCause='"+Obj.RootCause+"'"+
              ", @Matters='"+Obj.Matters+"'"+
              ", @ReportBy='"+Obj.ReportBy+"'"+
              ", @Desription='"+Obj.Desription+"'"+
              ", @LocationDetail='"+Obj.LocationDetail+"'"+
              ", @Notes='"+Obj.Notes+"'"+
              ", @Founder='"+Obj.Founder+"'"+
              ", @SLA='"+Obj.SLA+"'"+
              ", @TotalCost='"+Obj.TotalCost+"'"+
              ", @CreateBy='"+Obj.CreateBy+"'";
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};

exports.update = (Ticket, done) => {
    let clean = db.nullCleanser(Ticket);
    let sql = "UPDATE Ticket set fNote="+(clean.fNote ==='NULL'? '':clean.fNote) +",pNote="+(clean.pNote ==='NULL'? '':clean.pNote)+",cNote="+(clean.cNote ==='NULL'? '':clean.cNote)+",sDate="+clean.sDate+", cDate="+clean.cDate+",pDate="+clean.pDate+",fDate="+clean.fDate+",asignTo="+Ticket.asignTo+", tStat="+clean.tStat+", pCause="+clean.pCause+" WHERE tID="+Ticket.tID;
    db.execSql(sql).then(res=>{
        done(null, res);
    }).catch((err)=> {
        done(err);
        conn.close();
    });  
};
