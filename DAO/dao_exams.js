"use strict";


/**
 * Proporciona operaciones para la gestión de examenes
 * en la base de datos.
 */
class DAOExams {
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
     * Determina si un determinado examen aparece en la BD con el nombre
     * pasado como parámetro.
     * 
     * Es una operación asíncrona, de modo que se llamará a la función callback
     * pasando, por un lado, el objeto Error (si se produce, o null en caso contrario)
     * y, por otro lado, un booleano indicando el resultado de la operación
     * (true => el examen no existe, false => el examen existe)
     * En caso de error error, el segundo parámetro de la función callback será indefinido.
     * 
     * @param {string} idExamen Identificador del examen a buscar
     * @param {string} nombreExamen Nombre a comprobar
     * @param {function} callback Función que recibirá el objeto error y el resultado
     */

    
    addExamToBBDD(nombreExamen, ruta, idP, callback){
        this.pool.getConnection((err, connection) => {
            if(err){
                callback(err, null);
            }
            else{
                let nombreEx=nombreExamen.split('-');
                let nombreExF="";
                if(nombreEx.length===3){
                    nombreExF=nombreEx[0]+ '-'+nombreEx[1];
                }else{
                    let aux=nombreEx.splice('.');
                    nombreExF=aux[0]+'-'+aux[1];
                }
                connection.query("SELECT id, id_evento, id_asignatura FROM examen WHERE nombre=?", [nombreExF], (err, row)=>{
                    if(err){
                        callback(err,null);
                    }else{
                        if(row!==undefined && row.length>0){//Existe ese examen
                            connection.query("SELECT modelo FROM modelos WHERE id_examen = ? AND modelo=?", [row[0].id, nombreExamen], (err,rows)=>{
                                if(err){
                                    callback(err,null);
                                }else{
                                    if(rows.length===0){//No existe ese modelo
                                        connection.query("INSERT INTO modelos VALUES(?,?,?)", [row[0].id, nombreExamen, ruta], (err)=>{
                                           connection.release();
                                            if(err){
                                                callback(err,null);
                                            }else{
                                                callback(null, true);
                                            }
                                        })
                                    }
                                }
                            })
                        }else{//No existe el examen
                            connection.query("SELECT id FROM events WHERE text= ?", [nombreExF], (err,row)=>{
                                if(err){
                                    callback(err,null);
                                }else{
                                    if(row!==undefined && row.length>0){//existe el evento
                                        connection.query("SELECT i.id_asignatura, i.id_grupo  FROM imparte i INNER JOIN asignatura a ON i.id_asignatura = a.id WHERE a.nombre = ? AND i.id_profesor = ?", [nombreEx[0], idP],
                                        (err,row2)=>{
                                            if(err){callback(err,null);}
                                            else{
                                                if(row2!==undefined && row2.length>0){//existe la asignatura de ese evento
                                                    connection.query("INSERT INTO examen(id_asignatura,nombre, id_evento, id_grupo, id_aula) VALUES (?,?,?,?,1)", [row2[0].id_asignatura, nombreExF, row[0].id, row2[0].id_grupo,],
                                                    (err)=>{
                                                       // connection.release();
                                                        if(err){callback(err,null);}
                                                        else{
                                                            connection.query("SELECT id FROM examen WHERE id_evento=?", [row[0].id], (err,rows)=>{
                                                                if(err){
                                                                    callback(err,null);
                                                                }else{
                                                                    connection.query("INSERT INTO modelos VALUES (?,?,?)", [rows, nombreExamen,ruta], (err)=>{
                                                                        connection.release();
                                                                        if(err){
                                                                            callback(err,null);
                                                                        }else{
                                                                            callback(null, true);
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        })
									}
                                }
                            })
                        }
                    }
                })
            }
        })
    }
    

    removeExamFromBBDD(nombreExamen,callback){
        this.pool.getConnection((err, connection) => {
            if(err){
                callback(err, undefined);
            }
            else{
            connection.query("SELECT id_examen FROM modelos WHERE modelo = ?",
            [nombreExamen],
            (err, rows) => {
            if (err) { callback(err, undefined); }
            if (rows!==null && rows.length !== 0) {//Existe el examen
                connection.query("DELETE FROM modelos WHERE modelo= ?",[nombreExamen],
                (err)=>{
                    if(err){callback(err,undefined)}
                    else{
                        connection.query("DELETE FROM examen WHERE id=?", [rows], (err)=>{
                            connection.release();
                            if(err){
                                callback(err,undefined);
                            }else{
                                callback(null,true);
                            }
                        })
                    }
                });
                
            } else {//No existe el examen
                callback(null, false);
            }
            });
        }
       
        });
    }
    /**
     * Devuelve null o el array de examenes
     * @param {*} idAsignatura 
     * @param {*} callback 
     */
    showExams(idP,callback){
        this.pool.getConnection((err, connection) => {
            if(err){
                callback(err, null);
            }
            else{
                connection.query("SELECT modelo,ruta FROM modelos, examen WHERE id= id_examen AND id_asignatura IN (SELECT id_asignatura FROM imparte WHERE id_profesor = ?)", [idP],(error, rows) => {  
                    connection.release();
                    if (error) { callback(error, null); }
                    if (rows!==undefined && rows.length>0) {//Existe algun examen
                       callback(null, rows);
                    }else{
                        callback(null,null);
                    }
            });
            
        }
       
        });
    }
    /**
     * 
     * @param {*} students 
     * @param {*} callback 
     */
    getStudent(students, callback){
        this.pool.getConnection((err, connection)=>{
            if(err){
                callback(err,null);
            }else{
                connection.query("SELECT * FROM actor_universitario WHERE tipo = 0", (err,rows)=>{
                    connection.release();
                    if(err){
                        callback(err,null);
                    }else{
                        if(rows!==undefined && rows.length>1){
                            if (students.length === rows.length) {
                                callback ("full", null);
                            }
                            else {
                                let random, found;
                                do {
                                    random= Math.floor(Math.random()*(rows.length-0));
                                    found = students.some(st => st.id === rows[random].id);
                                } while (found);
                                callback(null,rows[random]);
                            }
                        }else if(rows.length === 1){
                            callback(null,rows[0]);
                        }else{
                            callback(null,null);
                        }
                    }

                });
            }
           
        });
    }
    /**
     * 
     * @param {*} idA 
     * @param {*} callback 
     */
    handExam(idA, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err);
            }else{
                connection.query("SELECT id FROM asiento WHERE id_alumno=?", [idA] , (err, row)=>{
                    if(err){
                        callback(err);
                    }else{
                        if(row.length==1){
                            let hora=new Date();
                            connection.query("INSERT INTO entrega(id_asiento, hora, entregado) VALUES(?,?,?)", [row[0].id,hora,1], (err)=>{
                                connection.release();
                                if(err){
                                    callback(err);
                                }else{
                                    callback(null);
                                }
                            });
                        }
                    }
                });
            }
        })
    }

    finalize(idA, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err);
            }else{
                connection.query("SELECT id FROM asiento WHERE id_alumno=?", [idA] , (err, row)=>{
                    if(err){
                        callback(err);
                    }else{
                        if(row.length==1){
                            let hora=new Date();
                            let horaf=this.formatDate(hora);
                            connection.query("INSERT INTO entrega(id_asiento, hora, entregado) VALUES(?,?,?)", [row[0].id,horaf,0], (err)=>{
                                connection.release();
                                if(err){
                                    callback(err);
                                }else{
                                    callback(null);
                                }
                            });
                        }
                    }
                });
            }
        })
    }
    sendWarning(idA, idP, aviso, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err);
            }else{
                connection.query("INSERT INTO aviso(id_alumno, id_profesor, texto) VALUES(?,?,?)", [idA, idP, aviso] , (err)=>{
                    connection.release();
                    if(err){
                        callback(err);
                    }else{
                        callback(null);
                    }
                });
            }
        })
    }

    formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth() +1;
        var year = date.getFullYear();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      }

    getRoomExam(idPg, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err,null);
            }else{
                let dia=new Date();
                let diaF=this.formatDate(dia);
                connection.query("SELECT ex.*, a.nombre FROM events e INNER JOIN supervisar_examen r ON (e.id=r.id_evento) INNER JOIN examen ex ON (ex.id_evento=e.id) INNER JOIN asignatura a ON (ex.id_asignatura=a.id) WHERE ? >=start_date AND ? < end_date AND r.id_profesor = ?", [diaF,diaF, idPg], (err, rows)=>{
                    connection.release();
                    if(err){
                        callback(err, null);
                    }else{
                        if(rows.length>0){
                            callback(null, rows);
                        }else{
                            callback(null,null);
                        }
                    }
                })
            }
        })
    }

    /**
     * 
     * @param {*} idS 
     * @param {*} callback 
     */
    getStudentName(idS, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err, null);
            }else{
                connection.query("SELECT nombre, apellidos FROM actor_universitario WHERE id=?", [idS], (err,row)=>{
                    if(err){
                        callback(err,null);
                    }else{
                        if(row!==null && row.length>0){
                            callback(null, row);//Devuelve tanto el id como los modelos con sus rutas
                        }else{
                            callback(null,null);
                        }
                    }
                })
            }
        })
    }

    /**
     * 
     * @param {*} id 
     * @param {*} callback 
     */
    getSubjectName(id, callback){
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err, null);
            }else{
                connection.query("SELECT nombre FROM asignatura WHERE id=?", [id], (err,row)=>{
                    if(err){
                        callback(err,null);
                    }else{
                        if(row!==null && row.length>0){
                            callback(null, row[0].nombre);
                        }else{
                            callback(null,null);
                        }
                    }
                })
            }
        })
    }

    /**
     * 
     * @param {*} ocupados 
     * @param {*} aula 
     * @param {*} examen 
     * @param {*} callback 
     */
    randomAllocation(ocupados, aula, examen, callback) {
        this.pool.getConnection((err,connection)=>{
            if(err){
                callback(err,undefined);
            }else{
                connection.query("SELECT fila,columnas FROM aula WHERE id= ?", [aula],
                (err, room)=>{
                    if(err){
                        callback(err,null);
                    }else{
                        if (ocupados.length === room[0].fila*room[0].columnas) {
                            callback("full", null);
                        }
                        else {
                            let ruta, modelo, puesto, fila, columna;
                            do {
                                fila= Math.floor(Math.random()*(room[0].fila)+1);
                                columna= Math.floor(Math.random()*(room[0].columnas)+1);
                                puesto = columna + (fila-1)*room[0].columnas;
                            } while (ocupados.includes(puesto));
                            connection.query("SELECT * FROM examen e INNER JOIN modelos m ON (e.id=m.id_examen) WHERE e.id=?", [examen],
                            (err, exams)=>{
                                connection.release();
                                if(err){
                                    callback(err,null);
                                }else {
                                    if (fila%2 === 0) {
                                        modelo = columna%exams.length;
                                        ruta = exams[modelo].modelo;
                                        callback(null, {ruta, puesto});
                                    }
                                    else {
                                        let temp = exams.pop();
                                        exams.unshift(temp);
                                        modelo = columna%exams.length;
                                        ruta = exams[modelo].modelo;
                                        callback(null, {ruta, puesto});
                                    }
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
    DAOExams: DAOExams
}