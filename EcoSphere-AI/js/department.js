/* =========================================
   EcoSphere AI
   Department Management JS

   Features:
   - Add Department
   - Edit Department
   - Delete Department
   - Search Department
   - Dynamic Table Rendering
   - Validation
   - Backend Ready Structure
========================================= */


// ================================
// Dummy Department Data
// Backend:
// GET /api/departments
// ================================

let departments = [

    {
        id: 1,
        name: "Information Technology",
        head: "Rahul Sharma",
        employees: 35,
        status: "Active"
    },

    {
        id: 2,
        name: "Human Resources",
        head: "Priya Singh",
        employees: 18,
        status: "Active"
    },

    {
        id: 3,
        name: "Finance",
        head: "Aman Verma",
        employees: 20,
        status: "Inactive"
    },

    {
        id: 4,
        name: "Marketing",
        head: "Neha Kapoor",
        employees: 24,
        status: "Active"
    }

];


let editId = null;

let deleteId = null;



// ================================
// DOM Elements
// ================================


const departmentBody =
document.getElementById("departmentBody");


const searchInput =
document.getElementById("searchDepartment");


const addBtn =
document.getElementById("addDepartmentBtn");


const modal =
document.getElementById("departmentModal");


const form =
document.getElementById("departmentForm");


const closeModalBtn =
document.getElementById("closeDepartmentModal");


const cancelBtn =
document.getElementById("cancelDepartmentBtn");


const modalTitle =
document.getElementById("modalTitle");


const deleteModal =
document.getElementById("deleteModal");


const cancelDelete =
document.getElementById("cancelDeleteBtn");


const confirmDelete =
document.getElementById("confirmDeleteBtn");





// ================================
// Initial Render
// ================================

document.addEventListener(
"DOMContentLoaded",
()=>{

    renderDepartments(departments);

});




// ================================
// Render Departments
// ================================


function renderDepartments(data){


    departmentBody.innerHTML = "";


    data.forEach((dept)=>{


        let row = document.createElement("tr");


        row.innerHTML = `

        <td>${dept.id}</td>

        <td>${dept.name}</td>

        <td>${dept.head}</td>

        <td>${dept.employees}</td>

        <td>

        <span class="${dept.status==="Active"
        ? "active-status"
        : "inactive-status"}">

        ${dept.status}

        </span>

        </td>


        <td>

        <button 
        class="edit-btn"
        onclick="editDepartment(${dept.id})">

        <i class="fa-solid fa-pen"></i>

        </button>


        <button
        class="delete-btn"
        onclick="deleteDepartmentPopup(${dept.id})">

        <i class="fa-solid fa-trash"></i>

        </button>


        </td>

        `;


        departmentBody.appendChild(row);


    });


}





// ================================
// Open Add Modal
// ================================


addBtn.addEventListener(
"click",
()=>{


    editId = null;


    form.reset();


    modalTitle.innerText =
    "Add Department";


    modal.style.display="flex";


});





// ================================
// Close Modal
// ================================


function closeDepartmentModal(){


    modal.style.display="none";


}


closeModalBtn.addEventListener(
"click",
closeDepartmentModal
);



cancelBtn.addEventListener(
"click",
closeDepartmentModal
);





// ================================
// Add / Edit Department
// ================================


form.addEventListener(
"submit",
(e)=>{


e.preventDefault();



let name =
document.getElementById("departmentName")
.value.trim();


let head =
document.getElementById("departmentHead")
.value.trim();



let employees =
document.getElementById("departmentEmployees")
.value;



let status =
document.getElementById("departmentStatus")
.value;



// Validation

if(
name === "" ||
head === "" ||
employees === ""
){

alert("Please fill all fields");

return;

}





// EDIT

if(editId !== null){


let index =
departments.findIndex(
item=>item.id===editId
);



departments[index]={

id:editId,

name,

head,

employees,

status

};



alert("Department Updated");


}




// ADD

else{


let newDepartment={


id: Date.now(),

name,

head,

employees,

status


};



departments.push(
newDepartment
);



alert("Department Added");


}



renderDepartments(
departments
);



form.reset();


closeDepartmentModal();



});






// ================================
// Edit Department
// ================================


function editDepartment(id){


let dept =
departments.find(
item=>item.id===id
);



editId=id;



modalTitle.innerText =
"Edit Department";



document.getElementById(
"departmentName"
).value =
dept.name;



document.getElementById(
"departmentHead"
).value =
dept.head;



document.getElementById(
"departmentEmployees"
).value =
dept.employees;



document.getElementById(
"departmentStatus"
).value =
dept.status;



modal.style.display="flex";


}






// ================================
// Delete Department
// ================================


function deleteDepartmentPopup(id){


deleteId=id;


deleteModal.style.display="flex";


}




cancelDelete.addEventListener(
"click",
()=>{


deleteModal.style.display="none";


});





confirmDelete.addEventListener(
"click",
()=>{


departments =
departments.filter(
item=>item.id!==deleteId
);



renderDepartments(
departments
);



deleteModal.style.display="none";


alert("Department Deleted");


});






// ================================
// Search Department
// ================================


searchInput.addEventListener(
"keyup",
()=>{


let value =
searchInput.value.toLowerCase();



let filtered =
departments.filter(
dept=>


dept.name
.toLowerCase()
.includes(value)


||

dept.head
.toLowerCase()
.includes(value)


);



renderDepartments(filtered);


});





// ================================
// Backend Integration Notes
// ================================

/*

Later replace dummy operations:

GET:
fetch("/api/departments")


POST:
fetch("/api/departments",{
method:"POST",
body:JSON.stringify(data)
})


PUT:
fetch("/api/departments/:id")


DELETE:
fetch("/api/departments/:id")


Frontend structure remains same.

*/