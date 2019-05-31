"use strict";

/**
 * Proporciona operaciones para la gestión de examenes
 * en la base de datos.
 */
class DAOAdmin {
    /**
     * Inicializa el DAO de examanes.
     * 
     * @param {Pool} pool Pool de conexiones MySQL. Todas las operaciones
     *                    sobre la BD se realizarán sobre este pool.
     */
    constructor(pool) {
        this.pool = pool;
    }

    /**
      * Búsqueda de la cadena "string" en la base de datos.
      * @param {String} string cadena de texto para buscar en los nombres de usuario presentes en la base de datos.
      * @param {Function} callback Función que devolverá el objeto error o el resultado
      */
     search(string, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {callback(`Error de conexión: ${err.message}`, undefined)}
            else {
                connection.query("SELECT * FROM actor_universitario WHERE tipo != ? AND apellidos LIKE ?",
                [0, "%" + string + "%"],
                (err, rows) => {
                    connection.release();
                    if (err) { callback(err, undefined);}
                    else {
                        let users = [];
                        rows.forEach(user => {
                            users.push({ name: user.nombre, surnames: user.apellidos, type: user.tipo, id:user.id});
                        });
                        callback(null, users);
                    }
                })
            }
        });
    }

    /**
     * Añade el usuario cuya información le llega por por parámetro a la base de datos.
     * @param {Object} user Objeto con la información del usuario
     * @param {Function} callback Función que devolverá el objeto error o el resultado
     */
    addUser(user, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err, undefined);
            }
            else{
                connection.query("SELECT nombre, apellidos FROM actor_universitario WHERE nombre=? AND apellidos=?",
                [user.nombre, user.apellidos], (err, rows)=>{
                    if(err){
                        callback(err,undefined);
                    }else{
                        if(rows.length===0){
                            connection.query("INSERT INTO actor_universitario(nombre, apellidos, tipo) VALUES (?,?,?)",
                            [user.nombre, user.apellidos, user.tipo], (err,exito)=>{
                                connection.release();
                                if(err){
                                    callback(err, undefined);
                                }else
                                callback(null,exito);
                            });
                        }else{
                            callback(null, false);
                        }
                    }   
            
                });
            }
        });

    }

    /**
     * 
     * @param {*} id 
     * @param {*} callback 
     */
    removeUser(id, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err,undefined);
            }else{
                connection.query("SELECT id FROM actor_universitario WHERE id = ?", [id], (err,row)=>{
                    if(err){
                        callback(err,undefined);
                    }else{
                        if(row.length===1){
                            connection.query("DELETE FROM actor_universitario WHERE id= ?", [id], (err,exito)=>{
                                connection.release();
                                if(err){
                                    callback(err,undefined);
                                }else{
                                    callback(null, exito);
                                }
                            });
                        }else{
                            callback(undefined, false);
                        }
                    }
                });
            }
        });
    }

    /**
     * 
     * @param {Object} user 
     * @param {Function} callback 
     */
    checkCredentials(user, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined);
            }
            else {
                connection.query("SELECT id_profesor FROM conectar WHERE id_profesor = ?",
                [user.id], (err, rows) => {
                    connection.release();
                    if(err){
                        callback(err, undefined);
                    }else {
                        if (rows.length !== 0) {
                            callback(null, true);
                        }
                        else {
                            callback(null, false);
                        }
                    }
                });
            }
        })
    }

    /**
     * 
     * @param {Object} user 
     * @param {Function} callback 
     */
    grantCredentials(user, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, undefined);
            }
            else {
                connection.query("INSERT INTO conectar(id_profesor, user, pass) VALUES (?, ?,?)",
                [user.id, user.name, user.password], (err, result) => {
                    connection.release();
                    if(err){
                        callback(err, undefined);
                    }else
                    callback(null, result);
                });
            }
        })
    }

    getAllEvents(callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err,undefined);
            }else{
                connection.query("SELECT * FROM events", (err,events)=>{
                    connection.release();
                    if(err){
                        callback(err,undefined);
                    }else{
                        callback(null, events);
                    }
                })
            }
        })
    }

    addSupervisor(idP,idE, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err, null);
            }else{
                connection.query("SELECT * FROM supervisar_examen WHERE id_profesor = ? AND id_evento=?", [idP,idE], (err,rows)=>{
                    if(err){
                        callback(err, null);
                    }else{
                        if(rows!==undefined && rows.length>0){
                            callback(null,false);
                        }else{
                            connection.query("INSERT INTO supervisar_examen VALUES (?,?)", [idP,idE], (err)=>{
                                connection.release();
                                if(err){
                                    callback(err,null);
                                }else{
                                    callback(null,true);
                                }
                            })
                        }
                    }
                })
            }
        })
    }
}

module.exports = {
    DAOAdmin: DAOAdmin
}