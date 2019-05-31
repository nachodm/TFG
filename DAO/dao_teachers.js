"use strict";

/**
 * Proporciona operaciones para la gestión de profesores
 * en la base de datos.
 */
class DAOTeachers {
    /**
     * Inicializa el DAO de profesores.
     * 
     * @param {Pool} pool Pool de conexiones MySQL. Todas las operaciones
     *                    sobre la BD se realizarán sobre este pool.
     */
    constructor(pool) {
        this.pool = pool;
    }

    /**
     * Determina si un determinado usuario aparece en la BD con la contraseña
     * pasada como parámetro.
     * 
     * Es una operación asíncrona, de modo que se llamará a la función callback
     * pasando, por un lado, el objeto Error (si se produce, o null en caso contrario)
     * y, por otro lado, un booleano indicando el resultado de la operación
     * (true => el usuario existe, false => el usuario no existe o la contraseña es incorrecta)
     * En caso de error error, el segundo parámetro de la función callback será indefinido.
     * 
     * @param {string} user Identificador del usuario a buscar
     * @param {string} password Contraseña a comprobar
     * @param {function} callback Función que recibirá el objeto error y el resultado
     */
    isUserCorrect(user, password, callback) {
        this.pool.getConnection((err, connection) => {
            if(err){
                callback(err, undefined);
            }
            else{
                //Poner bien los campos acordes con las columnas de la bd
                connection.query("SELECT * FROM conectar  WHERE user = ? and pass = ?",
                [user, password],
                (err, rows) => {
                    connection.release();
                    if (err) { callback(err, undefined); }
                    if (rows.length === 0) {
                        callback("Usuario y/o contraseña incorrectos", undefined);
                    } else {
                        callback(null, rows[0]);
                    }
                });
            }
        });
        
    }
    /**
     * 
     * @param {*} ex 
     */
    checkExams(ex){
        this.pool.getConnection((err,connection)=>{
            if(err){
                return false;
            }else{
                connection.query("SELECT DISTINCT start_date FROM events e JOIN examen ex ON e.id=ex.id_evento JOIN imparte i ON ex.id_asignatura = i.id_asignatura WHERE i.id_profesor= ? AND start_date < CURRENT_DATE",
                [ex.id_profesor],
                (err,eventos)=>{
                    connection.release();
                    if(err){
                        return false;
                    }else{
                        if(eventos.length>0){
                            
                            eventos.forEach(e=>{
                                let ahora=new Date();
                                ahora.setMinutes(+10);
                                if(ahora===e){
                                    return true;
                                }else{
                                    return false;
                                }
                            })
                        }
                    }
                })
            }
        })
    }
    /**
     * 
     * @param {*} user_id 
     * @param {*} callback 
     */
    currentCourses(user_id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
            }
            else {
                var today = new Date();
                var year = today.getFullYear();
                connection.query("SELECT * FROM IMPARTE i JOIN EXAMEN e ON i.id_grupo=e.id_grupo WHERE i.id_profesor = ? AND i.ano = ?",
                [user_id, year],
                (err, rows) => {
                    connection.release();
                    if (err) { 
                        callback(err, undefined); 
                    }
                    else if (rows.length === 0) {
                        callback(null, null);
                    } else {
                        let found = false;
                        let i = 0;
                        while (!found && (i < rows.length)) {
                            if (this.checkExams(rows[i])) {
                                found = true;
                            }
                            else{
                                i++;
                            }
                        }
                        if(found) {
                            callback(null, rows[i].id_grupo);
                        }
                        else {
                            callback(null, -1)
                        }
                    }
                });
            }
        })
    }

    /**
     *  
     * @param {*} callback 
     */
    getAllUsers(callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
            }
            else {
                connection.query("SELECT * FROM ACTOR_UNIVERSITARIO",
                (err, rows) => {
                    connection.release();
                    if (err) { 
                        callback(err, undefined); 
                    } else {   
                        callback(null, rows);
                    }
                });
            }
        })
    }

    /**
     * 
     * @param {*} examen 
     * @param {*} callback 
     */
    getRoom(examen,callback) {
        this.pool.getConnection((err, connection) => {
            if(err){
                callback(err, undefined);
            }
            else{
                //Poner bien los campos acordes con las columnas de la bd
            connection.query("SELECT id, filas, columnas, pasillo FROM aula WHERE id_examen =  ?",
            [examen],
            (err, rows) => {
            connection.release();
            if (err) { callback(err, undefined); }
            if (rows.length === 0) {
                callback(null, null);
            } else {
                callback(null, rows[0]);
            }
            });
        }
        
        });
    }

    /**
     * 
     * @param {*} nombre 
     * @param {*} callback 
     */
    getIdTeacher(nombre,callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err,undefined);
            }else{
                connection.query("SELECT id_profesor FORM conectar WHERE user=?",[nombre],
                (err,rows)=>{
                    connection.release();
                    if(err){callback(err,undefined);}
                    if(rows.length===0){
                        callback(null,null);
                    }else{
                        callback(null,rows[0].id_profesor);
                    }
                });
            }
            
        });
    }

    /**
     * 
     * @param {*} idP 
     * @param {*} callback 
     */
    getAllSubjects(idP, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err,undefined);
            }else{
                connection.query("SELECT id_asignatura FROM imparte WHERE id_profesor = ?", [idP], 
                (err,rows)=>{
                    connection.release();
                    if(err){callback(err,undefined);}
                    if(rows.length===0){
                        callback(null,null);
                    }else{
                        callback(null, rows);
                    }
                })
            }
           
        });
    }
    /**
     * 
     * @param {*} idG 
     * @param {*} idAs 
     * @param {Function} callback 
     */
    getTeacherExam(idG, idAs, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err,null);
            }else{
                connection.query("SELECT id_profesor FROM imparte WHERE id_grupo=? AND id_asignatura=?", [idG,idAs], (err,row)=>{
                    connection.release();
                    if(err){
                        callback(err,null);
                    }else{
                        if(row.length>0){
                            callback(null, row[0]);
                        }else{
                            callback(null, null);
                        }
                    }
                })
            }
        })
    }
    /**
     * 
     * @param {Number} id 
     * @param {Function} callback 
     */
    getWarnings(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
            }
            else {
                connection.query("SELECT * FROM aviso WHERE id_profesor = ?", [id], (err, rows) => {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(null, rows);
                    }
                })
            }
        })
    }

    deleteWarnings(id, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
            }
            else {
                connection.query("DELETE FROM aviso WHERE id_profesor = ?", [id], (err, rows) => {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(null, rows);
                    }
                })
            }
        })
    }
}

module.exports = {
    DAOTeachers: DAOTeachers
}