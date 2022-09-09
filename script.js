let görevListesi = [];

if (localStorage.getItem("görevListesi") != null) {
    //görev listesine aktarmak için local storage içerisindeki bilgileri  JSON.parse ile string  obje tipine çevirmemiz gerekiyor.
    görevListesi = JSON.parse(localStorage.getItem("görevListesi"));
}

let editId;
let isEditTask = false;


const taskInput = document.querySelector("#txtTaskName");
let clearBtn = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span");

displayTasks("all");

//İNPUT DEĞERLERİNİ YAZDIRIR.
function displayTasks(filters) {
    let ul = document.getElementById("task-list");
    ul.innerHTML = "";
    if (görevListesi.length == 0) {
        ul.innerHTML = "<p class='p-3 m-0'>Task List is empty</p>"
    } else {

        for (let gorev of görevListesi) {

            let completed = gorev.durum == "completed" ? "checked" : "";

            if (filters == gorev.durum || filters == "all") {



                let li = `
<li class="task list-group-item">
                        <div class="form-check">
                            <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${completed}>
                            <label for="${gorev.id}"" class="form-check-label ${completed}">${gorev.görevAdi}</label>
                        </div>
                        <div class="dropdown">
<button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
<i class="fa-solid fa-ellipsis"></i>
</button>
<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
<li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Delete</a></li>
<li><a onclick='editTask(${gorev.id},"${gorev.görevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Edit</a></li>
</ul>
</div>
</li>
     `;

                ul.insertAdjacentHTML("beforeend", li);
            }

        }
    }


}

let btnEkle = document.querySelector("#btnAddNewTask");
let btnClear = document.querySelector("#btnClear");
btnEkle.addEventListener("click", newTask);
btnClear.addEventListener("click", function (event) {

    event.preventDefault();
});

// input içerisine girilen ifadenin enter tuşu ile liste kısmına aktarılması:
document.querySelector("#btnAddNewTask").addEventListener("keypress", function () {
    if (event.key == "Enter") {
        btnEkle.click();
    }

});




function newTask(event) {

    if (taskInput.value == "") {
        // alert komutu uyarı getirmek için kullanılır.
        alert("görev girmelisiniz");
    }
    else {

        if (!isEditTask) {
            //ekleme
            görevListesi.push({ "id": görevListesi.length + 1, "görevAdi": taskInput.value, "durum": "pending" });
        } else {
            //güncelleme
            for (let gorev of görevListesi) {
                if (gorev.id == editId) {
                    gorev.görevAdi = taskInput.value;
                }
                isEditTask = false;
            }
        }

        // input kısmının boş kalması için:
        taskInput.value = "";
        displayTasks(document.querySelector("span.active").id);
        //string olarak aldığımız görevi local storage alanına taşırken JSON.stringify metodu ile json türüne çevirmemiz gerekiyor. 
        localStorage.setItem("görevListesi", JSON.stringify(görevListesi));

    }
    event.preventDefault();
}

function deleteTask(id) {
    let deletedId;
    deletedId = görevListesi.find(gorev => gorev.id == id);

    görevListesi.splice(deletedId, 1);
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("görevListesi", JSON.stringify(görevListesi));
}


function editTask(taskId, taskName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");
}


clearBtn.addEventListener("click", function () {
    görevListesi.splice(0, görevListesi.length);
    localStorage.setItem("görevListesi", JSON.stringify(görevListesi));
    displayTasks();
});


function updateStatus(selectedTask) {
    let label = selectedTask.nextElementSibling;
    let durum;

    if (selectedTask.checked) {
        label.classList.add("checked");
        durum = "completed";
    } else {
        label.classList.remove("checked");
        durum = "pending";
    }

    for (let gorev of görevListesi) {
        if (gorev.id == selectedTask.id) {
            gorev.durum = durum;
        }
    }
    displayTasks(document.querySelector("span.active").id);
    localStorage.setItem("görevListesi", JSON.stringify(görevListesi));

}


for (let span of filters) {
    span.addEventListener("click", function () {
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);

    });

}
