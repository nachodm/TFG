let dropArea = document.getElementById('drop-area');

//Inicializar los drag
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
});

//Si se ha añadido uno o varios archivos se llama a la funcion highlight para que cambie el color del div
['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
});

//Si se ha eliminado uno o varios archivos se llama a la funcion highlight para que cambie el color del div
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

dropArea.addEventListener('drop', handleDrop, false)
function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
}

function highlight(e) {//añade color
    dropArea.classList.add('highlight')
}

function unhighlight(e) {//elimina color
    dropArea.classList.remove('highlight')
}


function handleDrop(e) {//Si se borran archivos
    let dt = e.dataTransfer
    let files = dt.files

    handleFiles(files)
}

function handleFiles(files) {
    files=[...files]
    files.forEach(uploadFile)
    files.forEach(previewFile)
}
//Vista previa
/*function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
       let img = document.createElement('img')
       img.src = reader.result;
       img.src="img/pdf-icono.png";
        document.getElementById('gallery').appendChild(img)
    }
}*/
//Subir archivos
/*function uploadFile(file) {
    var url = 'https://examenesucm.herokuapp.com/' //AÑADIR URL NUESTRA DEL SERVIDOR
    var formData = new FormData()
    //HACER METODO POST??
    formData.append('file', file)

}  */