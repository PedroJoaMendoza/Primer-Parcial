const Url = "https://jsonplaceholder.typicode.com/photos"

window.onload = function(){
    getObject()
}

//FUNCIONES PARA API

function loadObject() {
    return new Promise (function(resolve,reject){
        var request = new XMLHttpRequest()
        request.open('GET',Url)
        request.onload = function(){
            if (request.status == 200) {
                resolve(JSON.parse(request.response))
            }else{
                reject(Error(request.statusText))
            }
        }
        request.onerror = function(){
            reject(Error('Unexpected network error'))
        }
        request.send()
    })
}

function addObject(){
    return new Promise (function(resolve,reject){
        var request = new XMLHttpRequest()
        request.open('POST',Url)
        request.setRequestHeader('Content-type','application/json')
        var object =JSON.stringify({
            'title': document.getElementById('title').value,
            'url': document.getElementById('url').value,
            'thumbnailUrl': document.getElementById('thumbnailUrl').value
        })
        request.onload = function(){
            if (request.status == 201) {
                resolve(request.response)
            }else{
                reject(Error(request.statusText))
            }
        }
        request.onerror = function(){
            reject(Error('Unexpected network error'))
        }
        request.send(object)
    })
}

function removeObject(id){
    return new Promise(function(resolve,reject){
        var request = new XMLHttpRequest()
        request.open('DELETE',Url + '/'+ id)
        request.onload = function(){
            if (request.status == 200) {
                resolve(request.response)
            }else{
                reject(Error(request.statusText))
            }
        }
        request.onerror = function (){
            reject(Error('Unexpected network error'))
        }
        request.send()
    })
}

function modifyObject(id){
    return new Promise(function(resolve,reject){
        var request = new XMLHttpRequest()
        request.open('PUT',Url + '/'+id)
        request.setRequestHeader('Content-Type','application/json')
        var object = JSON.stringify({
            'title': document.getElementById('title2').value,
            'url': document.getElementById('url2').value,
            'thumbnailUrl': document.getElementById('thumbnailUrl2').value
        })
        request.onload = function(){
            if (request.status == 200) {
                resolve(JSON.parse(request.response))
            }else{
                reject(Error(request.statusText))
            }
        }
        request.onerror = function (){
            reject(Error('Unexpected network error'))
        }
        request.send(object)
    })
}

//FUNCIONES PARA LA WEB
function getObject() {
    loadObject().then(response=>{
        var tbody = document.querySelector('tbody')
        tbody.innerHTML=''
        for (let i = 0; i < 50; i++) {
            insertTr(response[i])
        }
    }).catch(reason=>{
        console.error(reason)
    })
}

function saveObject(){
    if (document.getElementById('title').value.trim() !== '' && document.getElementById('url').value.trim() !=='' && document.getElementById('thumbnailUrl').value.trim() !== '') {
        addObject().then(response=>{
            let obj = JSON.parse(response)
            insertTr(obj)        
        }).catch(reason=>{
            console.error(reason)
        })
    }
}

function deleteObject(id){
    removeObject(id).then(()=>{
        const table = document.querySelector('tbody')
        for (let i = 0; i < table.rows.length; i++) {
            let row = table.rows[i]
            if (row.cells[0].innerHTML == id) {
                table.deleteRow(i)
                break
            }            
        }
    }).catch(reason=>{
        console.error(reason)
    }) 
}

function updateObject(id){
    if (document.getElementById('title2').value.trim() !== '' && document.getElementById('url2').value.trim() !== '' && document.getElementById('thumbnailUrl2').value.trim() !== '') {
        modifyObject(id).then(()=>{
            var table = document.querySelector('tbody')
            for (let i = 0; i < table.rows.length; i++) {
                let row = table.rows[i]
                if (row.cells[0].innerHTML == id) {
                    row.cells[1].innerHTML = document.getElementById('title2').value
                    row.cells[2].innerHTML = document.getElementById('url2').value
                    row.cells[3].innerHTML = document.getElementById('thumbnailUrl2').value
                    break
                }                
            }
        }).catch(reason=>{
            console.error(reason)
        })
    }
}


//FUNCION DE FILA

function insertTr(object){
    
    var tbody = document.querySelector('tbody')
    var row = tbody.insertRow()
    row.setAttribute('id',object.id)
    var id = row.insertCell()
    id.innerHTML = object.id
    var title = row.insertCell()
    title.innerHTML = object.title
    var url = row.insertCell()
    url.innerHTML = object.url
    var thumbnailUrl = row.insertCell()
    thumbnailUrl.innerHTML = object.thumbnailUrl
    var objectData = JSON.stringify({
        'id':object.id,
        'title': object.title,
        'url': object.url,
        'thumbnailUrl': object.thumbnailUrl
    })
    var view = row.insertCell()
    view.innerHTML = `<button class="btn btn-secondary" onclick='editObjectModal(${JSON.stringify(object)})'>Editar</button>`
    var del = row.insertCell()
    del.innerHTML = `<button class="btn btn-secondary" onclick='deleteObject(${object.id})'>Borrar</button>`
}

//FUNCION DE LOS POP UPS

function editObjectModal(object){
    document.getElementById('title2').value = object.title
    document.getElementById('url2').value = object.url
    document.getElementById('thumbnailUrl2').value = object.thumbnailUrl
    $('#editPopUp').dialog({
        modal : true,
        width : 400,
        buttons: {
            "Actualizar": function(){
                updateObject(object.id)
                $(this).dialog("close")
            },
            "Cancelar": function(){
                $(this).dialog("close")
            }
        }
    })
}

function addObjectModal(){
    $('#addPopUp').dialog({
        modal : true,
        width : 400,
        buttons: {
            "Añadir": function(){
                saveObject()
                $(this).dialog("close")
            },
            "Cancelar": function(){
                $(this).dialog("close")
            }
        }
    })
}