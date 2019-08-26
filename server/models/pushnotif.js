const db = require('../connection/connection');

exports.getAllPushNotif = (done) => {
    let sql = "SELECT Id, PushData,Email from PushNotif";
    db.execSql(sql).then(res => {
        done(null, res);
    }).catch((err) => {
        done(err);
        conn.close();
    });
};

exports.getAllPushNotifByCriteria = (PushNotif, done) => {
    var wh = db.whereCriteriaGenerator(PushNotif);
    let sql = "SELECT Id, PushData,Email from PushNotif" + wh;
    db.execSql(sql).then(res => {
        done(null, res);
    }).catch((err) => {
        done(err);
        conn.close();
    });
};

exports.insertPushNotif = (obj,email, done) => {
    let sql = "INSERT INTO PushNotif SELECT '" + JSON.stringify(obj) + "','" + email + "'";
    db.execSql(sql).then(res => {
        done(null, res);
    }).catch((err) => {
        done(err);
        conn.close();
    });
};

exports.deletePushNotif = function (key, done) {
    let sql = "DELETE FROM PushNotif WHERE Email='" + key + "'";
    db.execSql(sql).then(res => {
        done(null, res);
    }).catch((err) => {
        done(err);
        conn.close();
    });
}