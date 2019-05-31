"use strict";

const config = require("./config");
const mysql = require("mysql");
const daoTeachers = require("./DAO/dao_teachers");
const daoExams = require("./DAO/dao_exams");
const daoAdmin = require("./DAO/dao_admin");
const router = require("./router");
const path = require("path");
const express = require("express");
const bodyParser = require ("body-parser");
const session = require ("express-session");
const expressValidator = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: path.join(__dirname, "public/uploads")});
const util = require("util");
const app = express();

const pool = mysql.createPool(config.mysqlconfig);
pool.query = util.promisify(pool.query);

const middlewareSession = session ({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(middlewareSession);
app.use(expressValidator());

const teachers = new daoTeachers.DAOTeachers(pool);
const examenes = new daoExams.DAOExams(pool);
const admin = new daoAdmin.DAOAdmin(pool);
const Storage = require("./storage");
const eventStorage = new Storage(pool);
router.setRoutes(app, "/events", eventStorage);

app.listen(config.port, function(err) {
    if (err) {
        console.log("Error al iniciar el servidor");
    }
    else {
        console.log(`servidor arrancado en el puerto ${config.port}`);
    }
});

app.get("/", (request, response) => {
    if (request.session.loggedUser === undefined) {
        response.redirect("login");
    }
    else {
        response.redirect("PerfilExamen");
    }
});

app.get("/login", (request, response) => {
    if (request.session.loggedUser === undefined) {
        response.render("login", {error: request.session.error});
        request.session.error = undefined;
    }
    else {
        response.redirect("PerfilExamen");
    }
});


app.post("/isUserCorrect", (request, response) => {
    teachers.isUserCorrect(request.body.user, request.body.pass, (err, user) => {
        if (err) {
            request.session.error = err;
            response.status(500).send('Error 500: Internal server error');
        }
        else if (user === undefined){
            response.session.error = "Usuario y/o contraseña incorrecta";
            response.redirect("login");
        }
        else if(user.user==="admin"){
            request.session.loggedUser=user;
            response.redirect("admin");
        }
        else { 
            teachers.currentCourses(user.id_profesor, (err, courses) => {
                if (err) {
                    request.session.error = err;
                    response.redirect("login");
                }
                else if (courses === -1){//Profesor de guardia
                    request.session.exam = false;
                    request.session.loggedUser = user;
                    response.redirect("PerfilExamen");
                }
                else {//Profesor responsable
                    teachers.getExam(courses, (err, room) => {
                        if (err) {
                            request.session.error = err;
                            response.redirect("login");
                        }
                        else {
                            if (room != null) {
                                request.session.loggedUser = user;
                                response.render("hall");
                                response.end();
                            }
                        }
                    })
                }
            })
        }
    });
});

app.get("/admin", (request, response) => {
    if (request.session.loggedUser === undefined) {
        response.redirect("login");
    } 
    else if (request.session.loggedUser.user !== "admin") {
        response.redirect("PerfilExamen");
    }
    else {
        response.render("admin");
    }
});

app.get("/examen", (request, response) => {
    if (!request.session.students) {
        request.session.students = [];
    }
    if (!request.session.seats) {
        request.session.seats = [];
    }
    if (!request.session.full) {
        request.session.full = false;
    }
    if(!request.session.finished) {
        request.session.finished = 0;
    }
    if (request.session.loggedUser === undefined) {
        response.redirect("login");
    }
    else {
        examenes.getRoomExam(request.session.loggedUser.id_profesor, (err,room)=>{
            if (err) {
                response.status(500).send('Error 500: Internal server error');
            }else{
                if(room!==null){
                    request.session.aula={ nombreA:room[0].nombre, id_grupo:room[0].id_grupo, id_aula:room[0].id_aula, id_asignatura:room[0].id_asignatura};
                    examenes.randomAllocation(request.session.seats, request.session.aula.id_aula, room[0].id, (err, result) => {
                        if (err) {
                            if (err === "full") {
                                request.session.full = true;
                                response.render("hall", {students:request.session.students, aula:request.session.aula, full: request.session.full, finished: request.session.finished});
                            }
                            else {
                                response.status(500).send('Error 500: Internal server error');
                            }
                        }
                        else {
                            examenes.getStudent(request.session.students, (err,student)=>{
                                if (err) {
                                    if (err === "full") {
                                        request.session.full = true;
                                        response.render("hall", {students:request.session.students, aula:request.session.aula, full: request.session.full, finished: request.session.finished});
                                    }
                                    else {
                                        response.status(500).send('Error 500: Internal server error');
                                    }
                                } else {
                                    examenes.sitStudent(student.id, request.session.aula.id_aula, result.puesto, (err, success) => {
                                        if (err) {
                                            response.status(500).send('Error 500: Internal server error');
                                        }
                                        else {
                                            if (student) {
                                                request.session.seats.push(result.puesto);
                                                student.puesto = result.puesto;
                                                student.ruta = result.ruta;
                                                request.session.students.push(student);
                                            }
                                            response.render("hall", {students:request.session.students, aula:request.session.aula, full: request.session.full, finished: request.session.finished});
                                      
                                        }
                                    })  
                                }
                            });
                        }
                    })
                } else{
                    response.redirect("PerfilExamen");
                }
            }
        })

        
    }
});

app.get("/PerfilExamen", (request, response)=>{
    if (request.session.loggedUser !== undefined) {
        let ruta, exams;
        let warnings;
        if(request.session.mex){
            ruta=request.session.mex;
            request.session.mex = undefined;
        }else{
            ruta=null;
        }
        examenes.showExams(request.session.loggedUser.id_profesor, (err,idExams)=>{
            if(err){
                exams = null;
            }else{
                if (idExams !== null && idExams.length>0){
                    exams = idExams;
                }else{
                    exams = null;
                }
            }
            teachers.getWarnings(request.session.loggedUser.id_profesor, (err, warn) => {
                if (err) {
                    warnings = null;
                }
                else {
                    warnings=warn;
                }
                
            response.render("Exams", {examenes:exams, rutaEx:ruta, warnings: warnings}); 
            });  
        });
    }
    else {
        response.redirect("login");
    }
    
});

app.get("/adminusers", (request, response) => {
    if (request.session.loggedUser === undefined) {
        response.redirect("login");
    } 
    else if (request.session.loggedUser.user !== "admin") {
        response.redirect("PerfilExamen");
    }
    else {
        teachers.getAllUsers((err, users) => {
            if (err) {
                response.render("useradmin", {users:"no se han podido cargar los usuarios", credentials: request.session.credentials, errAdd: undefined, errRemove: undefined, eventos:undefined})
            }
            else {
                if (request.session.errorAdd === undefined) {
                    request.session.errorAdd = null;
                }
                if (request.session.errorRemove === undefined) {
                    request.session.errorRemove = null;
                }
                if (request.session.credentials === undefined) {
                    request.session.credentials = null;
                }
                if(request.session.errorSupervisor===undefined){
                    request.session.errorSupervisor=null;
                }
                admin.getAllEvents((err,events)=>{
                    if(err){
                        response.render("useradmin", {users:users, credentials: request.session.credentials, errAdd: request.session.errorAdd, errRemove: request.session.errorRemove, errSupervisor:request.session.errorSupervisor,eventos:undefined})
                    }else{
                        response.render("useradmin", {users:users, credentials: request.session.credentials, errAdd: request.session.errorAdd, errRemove: request.session.errorRemove, errSupervisor:request.session.errorSupervisor, eventos:events})
                    }
                })
                
            }
        });
    }
    
});

app.post("/searchUser", (request,response) => {
    admin.search(request.body.search, (err, result) => {
        if (err) {
            response.status(500).send('Error 500: Internal server error');
        } else {
            if (result.length !== 0) {
                request.session.credentials = result;
            }
        }
        response.redirect("adminusers#manageCredentials")
    });
});

app.post("/addUser", (request, response) => {
    request.checkBody("nombre", "Nombre de usuario no válido").matches(/^[a-zA-Z0-9 ]+$/i);
    request.checkBody("apellidos", "Apellidos no válidos").matches(/^[a-zA-Z0-9 ]+$/i);
    request.checkBody("tipo", "Tipo no válido").matches(/^[0-3]$/);
    request.getValidationResult().then(function(result) {
        if(result.isEmpty()) {
            let user = {
                nombre:request.body.nombre,
                apellidos: request.body.apellidos,
                tipo: request.body.tipo
            };
            admin.addUser(user, (err, result) => {
                if(err) {
                    response.status(500).send('Error 500: Internal server error');
                }
                else {
                    if(result) {
                        request.session.errorAdd = false;
                        response.redirect("adminusers#addUser");
                    } else {
                        request.session.errorAdd = true;
                        response.redirect("adminusers#addUser");
                    }
                }
            });
        }
        else {
            request.session.errorResult = result.array();
            response.redirect("adminusers#addUser");
        }
    });
    
});
app.post("/deleteUser", (request, response)=>{
    request.checkBody("idU", "id no válido").matches(/^\d*$/);
    request.getValidationResult().then(function(result){
        if(result.isEmpty()){
            admin.removeUser(request.body.idU, (err,result)=>{
                if(err){
                    response.redirect("adminusers");
                }else{
                    if(result){
                        request.session.errorRemove = false;
                        response.redirect("adminusers#deleteUser");
                    }else{
                        request.session.errorRemove = true;
                        response.redirect("adminusers#deleteUser");
                    }
                }
            });
        }else{
            request.session.errorResult = result.array();
            response.redirect("adminusers#deleteUser");
        }
    });
    
});


app.post('/uploadexams', upload.array('examen', 12), (request, response) => {
    if (request.files) {
        request.files.forEach(file => {
            examenes.addExamToBBDD(file.originalname, file.path, request.session.loggedUser.id_profesor, (error,añadidos)=>{
                if(!error){
                    if(añadidos){
                        console.log("Examen añadido a la BBDD");
                        console.log(`Fichero guardado en: ${file.path}`);  
                    }
                }
            });
        })
    }
    response.redirect("PerfilExamen");
});

app.post("/eliminarExamen", (request,response)=>{
    examenes.removeExamFromBBDD(request.body.ex, (err,exito)=>{
        if (err) {
            response.status(500).send('Error 500: Internal server error');
        } else {
            if (exito) {
                response.redirect("PerfilExamen");
            } else {
                response.redirect("PerfilExamen");
            }
        }
    })
});


app.post("/grantCredentials", (request,response)=>{
    let user = {
        id: request.body.idU,
        name:request.body.username,
        password: request.body.newpass,
    };
    admin.checkCredentials(user, (err, exists) => {
        if (err) {
            response.status(500).send('Error 500: Internal server error');
        }
        else {
            if (!exists) {
                admin.grantCredentials(user, (err,exito)=>{
                    if (err) {
                    } else {
                        if (exito) {
                            response.redirect("adminusers#manageCredentials");
                        } else {
                            response.redirect("adminusers#manageCredentials");
                        }
                    }
                })
            }
            else {
                response.redirect("adminusers#manageCredentials");
            }
        }
    })
});

app.post("/manageSupervisorsExams", (request,response)=>{
    let idP=request.body.idT;
    let idE=request.body.idE;
    admin.addSupervisor(idP,idE, (err,exito)=>{
        if(err){
            response.status(500).send('Error 500: Internal server error');
        }else{
            if(exito){
                request.session.errorSupervisor = false;
                response.redirect("adminusers#managesupervisors");
            }else{
                request.session.errorSupervisor = true;
                response.redirect("adminusers#managesupervisors");
            }
        }
    })
})

app.post("/mostrarExamen", (request,response)=>{
    let me=request.body.mex.substring(35,request.body.mex.length);
    
    request.session.mex=me;
    response.redirect("/PerfilExamen");
});

app.post("/handExam", (request,response)=>{
    let e=request.body.hand;
    examenes.handExam(e, (err)=>{
        if(err){
            response.redirect("Examen");
        }else{
            request.session.finished++;
            let i = 0, found = false;
            do {
                if (request.session.students[i].id == e) {
                    request.session.students.splice(i, 1); 
                    found = true;
                }
                else {
                    i++;
                }
            } while (!found);
            if (found) {
                response.redirect("Examen");
            }
            else {
                response.status(500).send('Error 500: Internal server error');
            }
        }
    });
});


app.post("/deleteWarnings", (request,response)=>{
    teachers.deleteWarnings(request.session.loggedUser.id_profesor, (err)=>{
        if(err){
            response.status(500).send('Error 500: Internal server error');
        }else{
            response.redirect("PerfilExamen");
        }
    });
});

app.post("/sendWarning", (request,response)=>{
    let idG=request.session.aula.id_grupo;//profesor responsable del examen
    let idAs=request.session.aula.id_asignatura;
    let idA=request.body.warn;//alumno
    
    teachers.getTeacherExam(idG, idAs, (err, id)=>{
        if(err){
            request.redirect("Examen");
        } else {
            if(id!==null){
                examenes.getStudentName(idA,(err,name)=>{
                    if(err){
                        response.redirect("Examen");
                    }else{
                        examenes.getSubjectName(idAs, (err,subject) => {
                            if (err) {
                                response.redirect("Examen");
                            }
                            else {
                                examenes.sendWarning(idA, id.id_profesor, name[0].nombre + " "+name[0].apellidos + " ha copiado en la asignatura de " + subject, (err)=>{
                                    if(err){
                                        response.redirect("Examen");
                                    }else{
                                        response.redirect("Examen");
                                    }
                                });
                            }
                        })
                    }
                })
            }else{
                response.redirect("Examen");
            }
        }
    })
    
});


app.post("/finalize", (request,response)=>{
    let e=request.body.fin;
    examenes.finalize(e, (err)=>{
        if(err){
            response.redirect("Examen");
        }else{
            request.session.finished++;
            let i = 0, found = false;
            do {
                if (request.session.students[i].id == e) {
                    request.session.students.splice(i, 1); 
                    found = true;
                }
                else {
                    i++;
                }
            } while (!found);
            if (found) {
                response.redirect("Examen");
            }
            else {
                response.status(500).send('Error 500: Internal server error');
            }
        }
    });
});

app.get("/uploads/:id", (request, response) => {
    let examPath = path.join(__dirname, "public/uploads", request.params.id);
    response.sendFile(examPath);
});

app.get("/destroy", (request, response) => {
    request.session.destroy();
    response.redirect("login");
});

app.use((request, response, next) => {    // Código 404: enlace roto.
    response.status(404);     
    response.render("error", {error:"404", url: request.url });
}); 