//db.js
const sql = require('mssql');

const config = {
    user: 'ncruser',
    password: 'Acset123',
    server: 'asgard', // You can use 'localhost\\instance' to connect to named instance
    database: 'ncr_app',
    options: {
        encrypt: false // Use this if you're on Windows Azure
    }
}

exports.execSql = async function (sqlquery, params = {}) {
    let auditFields = "select Id, RowStatus, format(CreateDate,'yyyy-MM-dd HH:mm:ss') CreateDate, CreateBy, format(UpdateDate,'yyyy-MM-dd HH:mm:ss') UpdateDate, UpdateBy,";
    let pool;
    pool = new sql.ConnectionPool(config);
    pool.on('error', err => {
        console.log('sql pool error db.js', err);
    });

    try {
        await pool.connect();
        let result = await pool.request();
        for (let key in params) {
            if (Array.isArray(params[key])) {
                // input(field_name, dataType, value)
                result = await result.input(key, params[key][1], params[key][0]);
            } else {
                // input(field_name, value)
                result = await result.input(key, params[key]);
            };
        };
        result = await result.query(sqlquery.replace("select", auditFields));

        return { success: result };
    } catch (err) {
        // stringify err to easily grab just the message
        let e = JSON.stringify(err, ["message", "arguments", "type", "name"]);
        // return { error: JSON.parse(e).message };
        throw { error: JSON.parse(e).message };
    } finally {
        pool.close(); //closing connection after request is finished.
    }
};

exports.whereCriteriaGenerator = function (object) {
    var where = " where ";
    for (var propertyName in object) {
        where += propertyName + " = '" + object[propertyName] + "' and ";
    }
    where = where.substring(0, where.length - 4);
    return where;
}

exports.nullCleanser = function (object) {
    for (var propertyName in object) {
        if (object[propertyName] === null) {
            object[propertyName] = "NULL";
        } else {
            object[propertyName] = "'" + object[propertyName] + "'";
        }
    }
    return object;
}