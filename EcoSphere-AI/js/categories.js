/* =========================================
   EcoSphere AI
   Category Management JS

   Features:
   - Add Category
   - Edit Category
   - Delete Category
   - Search
   - Dynamic Rendering
   - Backend Ready
========================================= */



// ================================
// Dummy Category Data
// Backend:
// GET /api/categories
// ================================


let categories = [

    {
        id:1,
        name:"Tree Plantation",
        type:"Environmental",
        description:"Activities related to environment protection",
        status:"Active"
    },


    {
        id:2,
        name:"Employee Welfare",
        type:"Social",
        description:"Social responsibility activities",
        status:"Active"
    },


    {
        id:3,
        name:"Company Policies",
        type:"Governance",
        description:"Governance improvement activities",
        status:"Inactive"
    }

];



let editCategoryId = null;

let deleteCategoryId = null;





// ================================
// DOM Elements
// ================================


const categoryBody =
document.getElementById("categoryBody");



const addCategoryBtn =
document.getElementById("addCategoryBtn");



const categoryModal =
document.getElementById("categoryModal");



const categoryForm =
document.getElementById("categoryForm");



const closeCategoryModal =
document.getElementById("closeCategoryModal");



const cancelCategoryBtn =
document.getElementById("cancelCategoryBtn");



const modalTitle =
document.getElementById("modalTitle");



const searchCategory =
document.getElementById("searchCategory");



const deleteModal =
document.getElementById("deleteModal");



const cancelDeleteBtn =
document.getElementById("cancelDeleteBtn");



const confirmDeleteBtn =
document.getElementById("confirmDeleteBtn");








// ================================
// Initial Load
// ================================


document.addEventListener(
"DOMContentLoaded",
()=>{

    renderCategories(categories);

});








// ================================
// Render Categories
// ================================


function renderCategories(data){


    categoryBody.innerHTML="";



    if(data.length===0){


        categoryBody.innerHTML=`

        <tr>

        <td colspan="6" style="text-align:center">

        No Category Found

        </td>

        </tr>

        `;


        return;

    }





    data.forEach(category=>{


        let row=document.createElement("tr");



        row.innerHTML=`

        <td>${category.id}</td>


        <td>${category.name}</td>


        <td>${category.type}</td>


        <td>${category.description}</td>


        <td>


        <span class="${
        
        category.status==="Active"
        ?
        "active-status"
        :
        "inactive-status"

        }">


        ${category.status}


        </span>


        </td>




        <td>



        <button

        class="edit-btn"

        onclick="editCategory(${category.id})">


        <i class="fa-solid fa-pen"></i>


        </button>




        <button

        class="delete-btn"

        onclick="openDeleteModal(${category.id})">


        <i class="fa-solid fa-trash"></i>


        </button>



        </td>


        `;




        categoryBody.appendChild(row);



    });



}









// ================================
// Open Add Modal
// ================================


addCategoryBtn.addEventListener(
"click",
()=>{


    editCategoryId=null;


    categoryForm.reset();


    modalTitle.innerText=
    "Add Category";


    categoryModal.style.display="flex";


});









// ================================
// Close Modal
// ================================


function closeModal(){


    categoryModal.style.display="none";


}



closeCategoryModal.addEventListener(
"click",
closeModal
);



cancelCategoryBtn.addEventListener(
"click",
closeModal
);









// ================================
// Add / Update Category
// ================================


categoryForm.addEventListener(
"submit",
(e)=>{


e.preventDefault();




let name =
document.getElementById("categoryName")
.value.trim();



let type =
document.getElementById("categoryType")
.value;



let description =
document.getElementById("categoryDescription")
.value.trim();



let status =
document.getElementById("categoryStatus")
.value;






// Validation


if(name===""){


alert(
"Category name required"
);


return;


}





// EDIT MODE


if(editCategoryId){



let index =
categories.findIndex(
item=>item.id===editCategoryId
);




categories[index]={

id:editCategoryId,

name,

type,

description,

status

};



alert(
"Category Updated"
);



}





// ADD MODE


else{


let newCategory={


id:Date.now(),

name,

type,

description,

status


};



categories.push(
newCategory
);



alert(
"Category Added"
);



}





renderCategories(
categories
);



categoryForm.reset();



closeModal();



});









// ================================
// Edit Category
// ================================


function editCategory(id){



let category =
categories.find(
item=>item.id===id
);



if(!category)
return;




editCategoryId=id;



modalTitle.innerText=
"Edit Category";





document.getElementById(
"categoryName"
).value=
category.name;



document.getElementById(
"categoryType"
).value=
category.type;



document.getElementById(
"categoryDescription"
).value=
category.description;



document.getElementById(
"categoryStatus"
).value=
category.status;





categoryModal.style.display="flex";



}









// ================================
// Delete Category
// ================================


function openDeleteModal(id){


deleteCategoryId=id;


deleteModal.style.display="flex";


}







cancelDeleteBtn.addEventListener(
"click",
()=>{


deleteModal.style.display="none";


});









confirmDeleteBtn.addEventListener(
"click",
()=>{


categories =
categories.filter(
item=>item.id!==deleteCategoryId
);




renderCategories(
categories
);




deleteModal.style.display="none";



alert(
"Category Deleted"
);



});









// ================================
// Search Category
// ================================


searchCategory.addEventListener(
"input",
()=>{


let value =
searchCategory.value.toLowerCase();



let filtered =
categories.filter(
category=>


category.name
.toLowerCase()
.includes(value)


||

category.type
.toLowerCase()
.includes(value)


);



renderCategories(
filtered
);



});









// ================================
// Backend Integration Notes
// ================================

/*

API ENDPOINTS


GET

/api/categories



POST

/api/categories



PUT

/api/categories/:id



DELETE

/api/categories/:id



Only replace dummy array operations
with API calls.


Frontend structure remains same.


*/