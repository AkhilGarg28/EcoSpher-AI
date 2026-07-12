/* =========================================
   EcoSphere AI
   Leaderboard JS

   Features:
   - Employee Ranking
   - XP Sorting
   - Search
   - Department Filter
   - Stats Cards
   - Backend Ready
========================================= */



// ================================
// Dummy Leaderboard Data
// Backend:
// GET /api/leaderboard
// ================================


let leaderboard = [

    {
        id:1,
        name:"Amit Sharma",
        department:"IT",
        xp:1250,
        badges:8,
        challenges:15,
        esg:92
    },


    {
        id:2,
        name:"Priya Singh",
        department:"HR",
        xp:1100,
        badges:7,
        challenges:13,
        esg:88
    },


    {
        id:3,
        name:"Rahul Verma",
        department:"Finance",
        xp:950,
        badges:5,
        challenges:10,
        esg:82
    },


    {
        id:4,
        name:"Neha Kapoor",
        department:"Marketing",
        xp:870,
        badges:4,
        challenges:9,
        esg:78
    }


];






// ================================
// DOM Elements
// ================================


const leaderboardBody =
document.getElementById("leaderboardBody");



const searchEmployee =
document.getElementById("searchEmployee");



const departmentFilter =
document.getElementById("departmentFilter");



const topEmployee =
document.getElementById("topEmployee");



const totalXP =
document.getElementById("totalXP");



const totalEmployees =
document.getElementById("totalEmployees");








// ================================
// Initial Load
// ================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    sortLeaderboard();


    renderLeaderboard(leaderboard);


    updateCards();


});









// ================================
// Sort By XP
// ================================


function sortLeaderboard(){


leaderboard.sort(
(a,b)=>b.xp-a.xp
);


}









// ================================
// Render Leaderboard
// ================================


function renderLeaderboard(data){


    leaderboardBody.innerHTML="";



    if(data.length===0){


        leaderboardBody.innerHTML=`

        <tr>

        <td colspan="7" style="text-align:center">

        No Employee Found

        </td>

        </tr>

        `;


        return;


    }






    data.forEach(
    (employee,index)=>{


        let rank=index+1;



        let row=document.createElement("tr");



        row.innerHTML=`

        <td class="${
        
        rank===1
        ?
        "rank-one"
        :
        rank===2
        ?
        "rank-two"
        :
        rank===3
        ?
        "rank-three"
        :
        ""

        }">


        #${rank}


        </td>




        <td>

        ${employee.name}

        </td>




        <td>

        ${employee.department}

        </td>





        <td>

        ${employee.xp}

        XP

        </td>





        <td>


        <span class="badge-count">

        ${employee.badges}

        Badges

        </span>


        </td>





        <td>

        ${employee.challenges}

        </td>





        <td>

        ${employee.esg}

        </td>



        `;



        leaderboardBody.appendChild(row);



    });



}









// ================================
// Update Top Cards
// ================================


function updateCards(){



let sorted =
[...leaderboard]
.sort(
(a,b)=>b.xp-a.xp
);




topEmployee.innerText =
sorted[0].name;




let xpTotal =
leaderboard.reduce(
(total,item)=>total+item.xp,
0
);



totalXP.innerText =
xpTotal;



totalEmployees.innerText =
leaderboard.length;



}









// ================================
// Search + Filter
// ================================


searchEmployee.addEventListener(
"input",
filterLeaderboard
);



departmentFilter.addEventListener(
"change",
filterLeaderboard
);







function filterLeaderboard(){



let searchValue =
searchEmployee.value.toLowerCase();



let departmentValue =
departmentFilter.value;





let filtered =
leaderboard.filter(
employee=>{


let matchSearch =


employee.name
.toLowerCase()
.includes(searchValue);




let matchDepartment =


departmentValue==="All"

||

employee.department===departmentValue;




return matchSearch && matchDepartment;


});






renderLeaderboard(filtered);



}









// ================================
// Backend Integration Notes
// ================================

/*

API:


GET

/api/leaderboard



Example Response:


[
{
name:"Amit Sharma",
department:"IT",
xp:1200,
badges:5,
challenges:10,
esg:90
}
]



Backend will calculate:

- Ranking
- XP
- Badges
- Challenge Completion


Frontend only displays data.


*/