var form = document.forms.createTodo;
var table = document.querySelector("#out");
readAllData();

form.addEventListener("submit", function (e) {
    e.preventDefault();

    var toCreate = {
        id: this.elements.id.value,
        title: this.title.value,
        desc: this.desc.value
    };

    this.elements.id.value = "";
    if (form.title.value !== "" || form.desc.value !== "") {
        var xhr = new XMLHttpRequest();
        xhr.open(toCreate.id ? "put" : "post", "/api/todo");
        xhr.responseType = "json";
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify(toCreate);
        xhr.send(data);

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState !== this.DONE) {
                return;
            }
            var todo = this.response;
            var rowExistent = document.getElementById(todo.id);
            addRow(todo, table, rowExistent);
            if (rowExistent) {
                rowExistent.parentElement.removeChild(rowExistent);
            }
            clearForm(form);
        })
    }
});

table.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
        var btn = e.target;
        var id = btn.getAttribute("data-target");
        if (btn.classList.contains("removeBtn")) {
            remove(id);
        } else if (btn.classList.contains("editBtn")) {
            setToEdit(id, form);
        }
    } else if (e.target.tagName === "I") {
        var iTag = e.target;
        var idITag = iTag.getAttribute("data-target");
        if (iTag.parentElement.classList.contains("removeBtn")) {
            remove(idITag);
        } else if (iTag.parentElement.classList.contains("editBtn")) {
            setToEdit(idITag, form);
        }
    }
});

function setToEdit(id, form) {
    var getXhr = new XMLHttpRequest();
    getXhr.open("get", "/api/todo/" + id);
    getXhr.responseType = "json";
    getXhr.addEventListener("readystatechange", function () {
        if (this.readyState !== 4) {
            return;
        }

        var todo = this.response;
        form.title.value = todo.title;
        form.desc.value = todo.desc;
        form.elements.id.value = todo.id;
        form.formBtn.innerText = "Edit";

        var div = document.createElement("div");
        div.setAttribute("class", "movingLine");
        form.formBtn.appendChild(div);

        var divNext = document.createElement("div");
        divNext.setAttribute("class", "secondLine");
        form.formBtn.appendChild(divNext);

    });
    getXhr.send();
}

function remove(id) {
    var removeXhr = new XMLHttpRequest();
    removeXhr.open("delete", "/api/todo/" + id);
    removeXhr.responseType = "json";
    removeXhr.addEventListener("readystatechange", function () {
        if (this.readyState !== 4) {
            return;
        }
        var rowToRemove = document.getElementById(this.response.id);
        rowToRemove.parentElement.removeChild(rowToRemove);
    });
    removeXhr.send();
}

function readAllData() {
    var readXhr = new XMLHttpRequest();
    readXhr.open("get", "/api/todo");
    readXhr.responseType = "json";
    readXhr.send();
    readXhr.addEventListener("readystatechange", function () {
        if (this.readyState !== this.DONE) {
            return;
        }

        for (var i = 0; i < this.response.length; i++) {
            addRow(this.response[i], table);
        }
    })
}

function addRow(todo, table, before) {
    var row = document.createElement("tr");
    row.setAttribute("id", todo.id);
    table.insertBefore(row, before);

    var titleCell = document.createElement("td");
    titleCell.innerText = todo.title;

    var descCell = document.createElement("td");
    descCell.innerText = todo.desc;

    var removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.classList.add("removeBtn");
    removeBtn.setAttribute("data-target", todo.id);
    var removeBtnTextInside = document.createElement("i");
    removeBtnTextInside.setAttribute("class", "fa fa-trash");
    removeBtnTextInside.setAttribute("aria-hidden", "true");
    removeBtnTextInside.style.color = "#A00A1D";
    removeBtnTextInside.setAttribute("data-target", todo.id);
    removeBtn.appendChild(removeBtnTextInside);

    var editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.classList.add("editBtn");
    editBtn.setAttribute("data-target", todo.id);
    var editBtnTextInside = document.createElement("i");
    editBtnTextInside.setAttribute("class", "fa fa-pencil");
    editBtnTextInside.setAttribute("aria-hidden", "true");
    editBtnTextInside.style.color = "#412AA0";
    editBtnTextInside.setAttribute("data-target", todo.id);
    editBtn.appendChild(editBtnTextInside);


    var controlsCell = document.createElement("td");
    controlsCell.appendChild(editBtn);
    controlsCell.appendChild(removeBtn);
    row.appendChild(titleCell);
    row.appendChild(descCell);
    row.appendChild(controlsCell);
}

function clearForm(form) {
    form.title.value = "";
    form.desc.value = "";
    form.elements.id.value = "";
    form.formBtn.innerText = "Create";

    var div = document.createElement("div");
    div.setAttribute("class", "movingLine");
    form.formBtn.appendChild(div);

    var divNext = document.createElement("div");
    divNext.setAttribute("class", "secondLine");
    form.formBtn.appendChild(divNext);
}

// function leaveLines(x) {
//     var div = document.createElement("div");
//     div.setAttribute("class", x);
//     form.formBtn.appendChild(div);
// }

