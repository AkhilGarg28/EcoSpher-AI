/* =========================================
   EcoSphere AI
   Leaderboard JS

   Features
   ✔ Dynamic Ranking
   ✔ Search Employee
   ✔ Department Filter
   ✔ Badge Unlock System
   ✔ Reward Redemption
   ✔ Backend Ready
========================================= */

// =========================================
// Dummy Data
// Backend:
// GET /api/leaderboard
// =========================================

let leaderboard = [

    {
        id:1,
        name:"Amit Sharma",
        department:"IT",
        xp:1250,
        challenges:15,
        esg:92
    },

    {
        id:2,
        name:"Priya Singh",
        department:"HR",
        xp:1100,
        challenges:13,
        esg:88
    },

    {
        id:3,
        name:"Rahul Verma",
        department:"Finance",
        xp:950,
        challenges:10,
        esg:82
    },

    {
        id:4,
        name:"Neha Kapoor",
        department:"Marketing",
        xp:870,
        challenges:9,
        esg:78
    }

];

// =========================================
// DOM Elements
// =========================================

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

const rewardModal =
document.getElementById("rewardModal");

const rewardEmployee =
document.getElementById("rewardEmployee");

const rewardXP =
document.getElementById("rewardXP");

// =========================================
// Initial Load
// =========================================

document.addEventListener("DOMContentLoaded",()=>{

    sortLeaderboard();

    renderLeaderboard(leaderboard);

    updateCards();

});

// =========================================
// Sort Leaderboard
// =========================================

function sortLeaderboard(){

    leaderboard.sort((a,b)=>b.xp-a.xp);

}

// =========================================
// Badge Logic
// =========================================

function getBadge(xp){

    if(xp>=1000){

        return{

            text:"🏆 Eco Legend",

            className:"legend",

            status:"Unlocked"

        };

    }

    if(xp>=800){

        return{

            text:"🥇 Eco Hero",

            className:"hero",

            status:"Unlocked"

        };

    }

    if(xp>=600){

        return{

            text:"🌿 Green Warrior",

            className:"warrior",

            status:"Unlocked"

        };

    }

    if(xp>=400){

        return{

            text:"⭐ CSR Champion",

            className:"champion",

            status:"Unlocked"

        };

    }

    if(xp>=200){

        return{

            text:"🌱 Eco Beginner",

            className:"beginner",

            status:"Unlocked"

        };

    }

    return{

        text:"🔒 Locked",

        className:"locked",

        status:"Locked"

    };

}


// =========================================
// Render Leaderboard
// =========================================

function renderLeaderboard(data){

    leaderboardBody.innerHTML="";

    if(data.length===0){

        leaderboardBody.innerHTML=`

        <tr>

            <td colspan="9" style="text-align:center">

                No Employee Found

            </td>

        </tr>

        `;

        return;

    }

    data.forEach((employee,index)=>{

        const rank=index+1;

        const badge=getBadge(employee.xp);

        let row=document.createElement("tr");

        row.innerHTML=`

        <td class="${
            rank===1
            ?"rank-one"
            :rank===2
            ?"rank-two"
            :rank===3
            ?"rank-three"
            :""
        }">

            #${rank}

        </td>

        <td>${employee.name}</td>

        <td>${employee.department}</td>

        <td class="xp">

            ${employee.xp} XP

        </td>

        <td>

            <span class="badge ${badge.className}">

                ${badge.text}

            </span>

        </td>

        <td>

            <span class="status ${badge.status.toLowerCase()}">

                ${badge.status}

            </span>

        </td>

        <td>

            ${employee.challenges}

        </td>

        <td>

            ${employee.esg}

        </td>

        <td>

            <button
                class="redeem-btn"
                onclick="openRewardModal(${employee.id})">

                Redeem

            </button>

        </td>

        `;

        leaderboardBody.appendChild(row);

    });

}

// =========================================
// Dashboard Cards
// =========================================

function updateCards(){

    let sorted=[...leaderboard].sort((a,b)=>b.xp-a.xp);

    topEmployee.innerText=sorted[0].name;

    let xpTotal=leaderboard.reduce(
        (total,item)=>total+item.xp,
        0
    );

    totalXP.innerText=xpTotal;

    totalEmployees.innerText=leaderboard.length;

}

// =========================================
// Search + Filter
// =========================================

searchEmployee.addEventListener(
    "input",
    filterLeaderboard
);

departmentFilter.addEventListener(
    "change",
    filterLeaderboard
);

function filterLeaderboard(){

    let searchValue=
    searchEmployee.value.toLowerCase();

    let departmentValue=
    departmentFilter.value;

    let filtered=
    leaderboard.filter(employee=>{

        let matchSearch=
        employee.name
        .toLowerCase()
        .includes(searchValue);

        let matchDepartment=

        departmentValue==="All"

        ||

        employee.department===departmentValue;

        return matchSearch && matchDepartment;

    });

    renderLeaderboard(filtered);

}

// =========================================
// Reward Redemption
// =========================================

function openRewardModal(id){

    const employee=
    leaderboard.find(emp=>emp.id===id);

    if(!employee) return;

    rewardEmployee.innerText=
    employee.name;

    rewardXP.innerText=
    employee.xp+" XP";

    rewardModal.classList.add("active");

}

const closeRewardModal=
document.getElementById("closeRewardModal");

if(closeRewardModal){

    closeRewardModal.addEventListener(
        "click",
        ()=>{

            rewardModal.classList.remove("active");

        }
    );

}

window.addEventListener("click",(e)=>{

    if(e.target===rewardModal){

        rewardModal.classList.remove("active");

    }

});

// =========================================
// Redeem Reward Buttons
// =========================================

document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("redeem-btn")){

        const points=
        Number(
            e.target.dataset.points
        );

        if(points){

            alert(
                "Reward redeemed successfully! ("+
                points+
                " XP)"
            );

        }

    }

});

// =========================================
// Award XP (Backend Ready)
// =========================================

function awardXP(employeeId,xp){

    const employee=
    leaderboard.find(emp=>emp.id===employeeId);

    if(!employee) return;

    employee.xp+=xp;

    sortLeaderboard();

    renderLeaderboard(leaderboard);

    updateCards();

}

// =========================================
// Backend Integration Notes
// =========================================

/*

GET    /api/leaderboard

POST   /api/csr/approve

PUT    /api/leaderboard/:id

POST   /api/rewards/redeem

Future Flow

CSR Approved
      ↓
Award XP
      ↓
Badge Unlock
      ↓
Leaderboard Update
      ↓
Reward Redemption

Frontend only renders data.

Backend calculates:

• XP
• Rank
• Badge Eligibility
• Reward Eligibility

*/
