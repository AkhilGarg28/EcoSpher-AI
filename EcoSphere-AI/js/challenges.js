/* =========================================
   EcoSphere AI
   Challenge Management JS

   Features:
   - Add Challenge
   - Edit Challenge
   - Delete Challenge
   - Search Challenge
   - Status Filter
   - Dynamic Rendering
   - Backend Ready
========================================= */



// ================================
// Dummy Challenge Data
// Backend:
// GET /api/challenges
// ================================


let challenges = [

    {
        id:1,
        name:"Plant 100 Trees",
        category:"Environment",
        department:"All Departments",
        xp:100,
        deadline:"2026-08-15",
        participants:45,
        status:"Active"
    },


    {
        id:2,
        name:"Plastic Free Office",
        category:"Environment",
        department:"Operations",
        xp:80,
        deadline:"2026-09-01",
        participants:30,
        status:"Upcoming"
    },


    {
        id:3,
        name:"CSR Donation Drive",
        category:"Social",
        department:"HR",
        xp:120,
        deadline:"2026-07-30",
        participants:60,
        status:"Completed"
    }


];



let editChallengeId = null;

let deleteChallengeId = null;





// ================================
// DOM Elements
// ================================


const challengeBody =
document.getElementById("challengeBody");


const addChallengeBtn =
document.getElementById("addChallengeBtn");


const challengeModal =
document.getElementById("challengeModal");


const challengeForm =
document.getElementById("challengeForm");


const closeChallengeModal =
document.getElementById("closeChallengeModal");


const cancelChallengeBtn =
document.getElementById("cancelChallengeBtn");


const modalTitle =
document.getElementById("modalTitle");



const searchChallenge =
document.getElementById("searchChallenge");


const statusFilter =
document.getElementById("statusFilter");



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

    renderChallenges(challenges);

});







// ================================
// Render Challenges
// ================================


function renderChallenges(data){


    challengeBody.innerHTML="";


    if(data.length===0){


        challengeBody.innerHTML=`

        <tr>

        <td colspan="9" style="text-align:center">

        No Challenge Found

        </td>

        </tr>

        `;


        return;

    }




    data.forEach(challenge=>{


        let row=document.createElement("tr");



        row.innerHTML=`

        <td>${challenge.id}</td>


        <td>${challenge.name}</td>


        <td>${challenge.category}</td>


        <td>${challenge.department}</td>


        <td>${challenge.xp}</td>


        <td>${challenge.deadline}</td>


        <td>${challenge.participants}</td>



        <td>


        <span class="${
        
        challenge.status==="Active"
        ?"status-active"
        :
        challenge.status==="Upcoming"
        ?"status-upcoming"
        :
        "status-completed"

        }">


        ${challenge.status}


        </span>


        </td>




        <td>


        <button

        class="edit-btn"

        onclick="editChallenge(${challenge.id})">


        <i class="fa-solid fa-pen"></i>


        </button>





        <button

        class="delete-btn"

        onclick="openDeleteModal(${challenge.id})">


        <i class="fa-solid fa-trash"></i>


        </button>



        </td>


        `;



        challengeBody.appendChild(row);



    });



}







// ================================
// Open Add Modal
// ================================


addChallengeBtn.addEventListener(
"click",
()=>{


    editChallengeId=null;


    challengeForm.reset();


    modalTitle.innerText=
    "Add Challenge";


    challengeModal.style.display="flex";


});






// ================================
// Close Modal
// ================================


function closeModal(){


    challengeModal.style.display="none";


}



closeChallengeModal.addEventListener(
"click",
closeModal
);



cancelChallengeBtn.addEventListener(
"click",
closeModal
);








// ================================
// Add / Edit Challenge
// ================================


challengeForm.addEventListener(
"submit",
(e)=>{


e.preventDefault();




let name =
document.getElementById("challengeName")
.value.trim();



let category =
document.getElementById("challengeCategory")
.value;



let department =
document.getElementById("challengeDepartment")
.value.trim();



let xp =
document.getElementById("challengeXP")
.value;



let deadline =
document.getElementById("challengeDeadline")
.value;



let status =
document.getElementById("challengeStatus")
.value;




// Validation


if(
name==="" ||
department==="" ||
xp==="" ||
deadline===""
){


alert("Please fill all fields");


return;


}





// EDIT


if(editChallengeId){



let index =
challenges.findIndex(
item=>item.id===editChallengeId
);



challenges[index]={

id:editChallengeId,

name,

category,

department,

xp,

deadline,

participants:
challenges[index].participants,

status

};



alert(
"Challenge Updated"
);



}






// ADD


else{


let newChallenge={


id:Date.now(),

name,

category,

department,

xp,

deadline,

participants:0,

status


};



challenges.push(
newChallenge
);



alert(
"Challenge Added"
);


}



renderChallenges(
challenges
);



challengeForm.reset();


closeModal();


});








// ================================
// Edit Challenge
// ================================


function editChallenge(id){


let challenge =
challenges.find(
item=>item.id===id
);



editChallengeId=id;



modalTitle.innerText=
"Edit Challenge";



document.getElementById(
"challengeName"
).value=
challenge.name;



document.getElementById(
"challengeCategory"
).value=
challenge.category;



document.getElementById(
"challengeDepartment"
).value=
challenge.department;



document.getElementById(
"challengeXP"
).value=
challenge.xp;



document.getElementById(
"challengeDeadline"
).value=
challenge.deadline;



document.getElementById(
"challengeStatus"
).value=
challenge.status;



challengeModal.style.display="flex";


}







// ================================
// Delete Challenge
// ================================


function openDeleteModal(id){


deleteChallengeId=id;


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


challenges =
challenges.filter(
item=>item.id!==deleteChallengeId
);



renderChallenges(
challenges
);



deleteModal.style.display="none";


alert(
"Challenge Deleted"
);



});







// ================================
// Search Challenge
// ================================


searchChallenge.addEventListener(
"input",
filterChallenges
);



statusFilter.addEventListener(
"change",
filterChallenges
);





function filterChallenges(){


let searchValue =
searchChallenge.value.toLowerCase();



let statusValue =
statusFilter.value;




let filtered =
challenges.filter(
challenge=>{


let matchSearch =

challenge.name
.toLowerCase()
.includes(searchValue);



let matchStatus =

statusValue==="All"
||
challenge.status===statusValue;



return matchSearch && matchStatus;


});



renderChallenges(
filtered
);



}







// ================================
// Backend Integration Notes
// ================================

/*

API STRUCTURE


GET

/api/challenges


POST

/api/challenges



PUT

/api/challenges/:id



DELETE

/api/challenges/:id



Frontend logic remains same.

Only replace dummy array
operations with API calls.


*/