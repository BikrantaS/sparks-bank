const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
let instance = null;

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});


connection.connect((err) => {
    if (err) {
        console.log(err.message);

    }
    console.log('db ' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM accounts;";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    async insertNewName(name, initialBalance) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO accounts (name,date_registered,acc_balance) VALUES(?,?,?);";
                connection.query(query, [name, dateAdded, initialBalance], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            // console.log(insertId);
            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded,
                initialBalance: initialBalance,
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM accounts WHERE id=?";
                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }

    }

    async updateNameById(id, name, newbalance) {

        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE accounts SET name = ? , acc_balance = ? WHERE id = ? ";

                connection.query(query, [name, newbalance, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            return response === 1 ? true : false;

            // console.log(response);
        } catch (error) {
            console.log("dbsrviece error", error);
            return false;
        }

    }

    async tranferById(id1, id2, amt) {

        try {
            id1 = parseInt(id1, 10);
            id2 = parseInt(id2, 10);
            amt = parseInt(amt, 10);
            const dateAdded = new Date();
            const response = await new Promise((resolve, reject) => {

                var sqlquery =
                    `
                SET autocommit=0;
                start transaction;
                SELECT @x:=acc_balance FROM accounts WHERE id=${id1}
                SELECT @y:=acc_balance FROM accounts WHERE id=${id2}
                
                SELECT @a=@x+${amt};
                SELECT @b=@y-${amt};
                UPDATE accounts
                SET acc_balance = @a
                WHERE id=${id1};
                UPDATE accounts
                SET acc_balance =@b
                WHERE id=${id2};
                
                SELECT @n1:=name FROM accounts WHERE id=${id1};
                SELECT @n2:=name FROM accounts WHERE id=${id2};
                INSERT INTO transactions(tname1,tname2,tdate,tamount)
                VALUES(@n1,@n2,${dateAdded},${amt});
                commit;
                `;
                connection.query(sqlquery, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
            return response === 1 ? true : false;

            // console.log(response);
        } catch (error) {
            console.log("dbsrviece error", error);
            return false;
        }

    }

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM accounts WHERE name=?";
                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = DbService;

