/* =========================================
   EcoSphere AI
   CSR Approval Panel JS

   Features:
   - View CSR Submissions
   - Approve CSR
   - Reject CSR
   - Award XP
   - Search
   - Filter
   - Backend Ready
========================================= */



// ================================
// Dummy CSR Data
// Backend:
// GET /api/csr
// ================================


let csrSubmissions = [

    {
        id:1,
        employee:"Amit Sharma",
        department:"IT",
        activity:"Tree Plantation Drive",
        category:"Environmental",
        proof:"tree-drive.jpg",
        xp:100,
        status:"Pending"
    },


    {
        id:2,
        employee:"Priya Singh",
        department:"HR",
        activity:"Blood Donation Camp",
        category:"Social",
        proof:"blood-camp.jpg",
        xp:120,
        status:"Approved"
    },


    {
        id:3,
        employee:"Rahul Verma",
        department:"Finance",
        activity:"Paperless Office Initiative",
        category:"Governance",
        proof:"paperless.jpg",
        xp:80,
        status:"Pending"
    }


];





// ================================
// DOM Elements
// ================================


const csrBody =
document.getElementById("csrBody");



const searchCSR =
document.getElementById("searchCSR");



const csrFilter =
document.getElementById("csrFilter");



const proofModal =
document.getElementById("proofModal");



const proofContent =
document.getElementById("proofContent");



const closeProofModal =
document.getElementById("closeProofModal");







// ================================
// Initial Load
// ================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    renderCSR(csrSubmissions);


});








// ================================
// Render CSR Table
// ================================


function renderCSR(data){


    csrBody.innerHTML="";



    if(data.length===0){


        csrBody.innerHTML=`

        <tr>

        <td colspan="9" style="text-align:center">

        No CSR Submission Found

        </td>

        </tr>

        `;


        return;

    }







    data.forEach(item=>{


        let row=document.createElement("tr");



        row.innerHTML=`

        <td>${item.id}</td>


        <td>${item.employee}</td>


        <td>${item.department}</td>


        <td>${item.activity}</td>


        <td>${item.category}</td>



        <td>


        <button

        class="proof-btn"

        onclick="viewProof(${item.id})">


        View


        </button>


        </td>



        <td>${item.xp}</td>





        <td>


        <span class="${
        
        item.status==="Pending"
        ?
        "status-pending"
        :
        item.status==="Approved"
        ?
        "status-approved"
        :
        "status-rejected"

        }">


        ${item.status}


        </span>


        </td>





        <td>


        ${
        
        item.status==="Pending"

        ?

        `

        <button

        class="approve-btn"

        onclick="approveCSR(${item.id})">


        <i class="fa-solid fa-check"></i>


        </button>





        <button

        class="reject-btn"

        onclick="rejectCSR(${item.id})">


        <i class="fa-solid fa-xmark"></i>


        </button>

        `

        :

        "-"

        }


        </td>



        `;



        csrBody.appendChild(row);



    });



}









// ================================
// View Proof
// ================================


function viewProof(id){



let csr =
csrSubmissions.find(
item=>item.id===id
);



proofContent.innerHTML=`

<h3>
${csr.activity}
</h3>


<p>

<b>Employee:</b>
${csr.employee}

</p>


<p>

<b>Category:</b>
${csr.category}

</p>



<p>

<b>Proof File:</b>
${csr.proof}

</p>



<img

class="proof-image"

src="../assets/proofs/${csr.proof}"

alt="CSR Proof">


`;



proofModal.style.display="flex";


}








closeProofModal.addEventListener(
"click",
()=>{


proofModal.style.display="none";


});









// ================================
// Approve CSR
// ================================


function approveCSR(id){



let csr =
csrSubmissions.find(
item=>item.id===id
);




csr.status="Approved";




// Award XP Logic
// Backend:
// POST /api/rewards/xp


awardXP(csr.employee,csr.xp);



renderCSR(csrSubmissions);



alert(
"CSR Approved & XP Awarded"
);



}









// ================================
// Reject CSR
// ================================


function rejectCSR(id){



let csr =
csrSubmissions.find(
item=>item.id===id
);




csr.status="Rejected";



renderCSR(csrSubmissions);



alert(
"CSR Rejected"
);



}









// ================================
// Award XP
// ================================


function awardXP(employee,xp){


console.log(
`${xp} XP awarded to ${employee}`
);



/*

Backend API:


POST

/api/rewards/xp



Body:

{
 employee,
 xp
}


*/

}









// ================================
// Search + Filter
// ================================


searchCSR.addEventListener(
"input",
filterCSR
);



csrFilter.addEventListener(
"change",
filterCSR
);





function filterCSR(){



let searchValue =
searchCSR.value.toLowerCase();



let filterValue =
csrFilter.value;





let filtered =
csrSubmissions.filter(
item=>{


let matchSearch =


item.employee
.toLowerCase()
.includes(searchValue)


||

item.activity
.toLowerCase()
.includes(searchValue);



let matchStatus =


filterValue==="All"

||

item.status===filterValue;



return matchSearch && matchStatus;


});




renderCSR(filtered);



}








// ================================
// Backend Integration Notes
// ================================

/*

APIs:


GET

/api/csr



Approve:

PUT

/api/csr/:id/approve



Reject:

PUT

/api/csr/:id/reject



Award XP:

POST

/api/rewards/xp



Frontend logic remains same.

Only dummy array will be replaced
with API response.


*/