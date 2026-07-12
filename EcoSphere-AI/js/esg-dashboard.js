/* =========================================
   EcoSphere AI
   ESG Dashboard JS

   Features:
   - Overall ESG Score
   - ESG Category Scores
   - Department ESG Performance
   - Progress Bars
   - Backend Ready
========================================= */



// ================================
// Dummy ESG Data
// Backend:
// GET /api/esg/overall
// GET /api/esg/department-score
// ================================


let esgData = {


    overall:86,


    environmental:90,


    social:84,


    governance:85


};





let departmentESG = [


    {
        department:"IT",
        environmental:92,
        social:85,
        governance:88,
        overall:88
    },


    {
        department:"HR",
        environmental:80,
        social:92,
        governance:86,
        overall:86
    },


    {
        department:"Finance",
        environmental:85,
        social:78,
        governance:90,
        overall:84
    },


    {
        department:"Marketing",
        environmental:82,
        social:88,
        governance:80,
        overall:83
    }


];









// ================================
// DOM Elements
// ================================


const overallScore =
document.getElementById("overallScore");



const environmentScore =
document.getElementById("environmentScore");



const socialScore =
document.getElementById("socialScore");



const governanceScore =
document.getElementById("governanceScore");





const environmentProgress =
document.getElementById("environmentProgress");



const socialProgress =
document.getElementById("socialProgress");



const governanceProgress =
document.getElementById("governanceProgress");





const environmentValue =
document.getElementById("environmentValue");



const socialValue =
document.getElementById("socialValue");



const governanceValue =
document.getElementById("governanceValue");





const departmentESGBody =
document.getElementById("departmentESGBody");









// ================================
// Page Load
// ================================


document.addEventListener(
"DOMContentLoaded",
()=>{


    loadESGScore();


    renderDepartmentESG();


});









// ================================
// Load ESG Scores
// ================================


function loadESGScore(){



overallScore.innerText =
esgData.overall + "%";



environmentScore.innerText =
esgData.environmental + "%";



socialScore.innerText =
esgData.social + "%";



governanceScore.innerText =
esgData.governance + "%";







// Progress Update


environmentProgress.style.width =
esgData.environmental + "%";



socialProgress.style.width =
esgData.social + "%";



governanceProgress.style.width =
esgData.governance + "%";







environmentValue.innerText =
esgData.environmental + "%";



socialValue.innerText =
esgData.social + "%";



governanceValue.innerText =
esgData.governance + "%";



}









// ================================
// Department ESG Table
// ================================


function renderDepartmentESG(){



departmentESGBody.innerHTML="";




departmentESG.forEach(
(item)=>{



let row=document.createElement("tr");





row.innerHTML=`

<td>

${item.department}

</td>



<td>

${item.environmental}%

</td>



<td>

${item.social}%

</td>



<td>

${item.governance}%

</td>



<td>


<span class="score-badge">

${item.overall}%

</span>


</td>


`;





departmentESGBody.appendChild(row);



});



}









// ================================
// ESG Score Calculation Logic
// ================================


function calculateOverallESG(
environmental,
social,
governance
){



/*

Weighted ESG Formula:


Overall ESG =

(Environmental * 40%)

+

(Social * 35%)

+

(Governance * 25%)



Example:

90*0.4 +
80*0.35 +
85*0.25


*/



let score =


(environmental * 0.40)

+

(social * 0.35)

+

(governance * 0.25);




return Math.round(score);



}









// ================================
// Backend Integration Notes
// ================================

/*

APIs:



GET

/api/esg/overall


Response:


{
overall:86,
environmental:90,
social:84,
governance:85
}





GET

/api/esg/department-score


Response:


[
{
department:"IT",
environmental:90,
social:85,
governance:88
}
]





Backend will calculate ESG score
from:


CSR Activities

+

Challenge Completion

+

Department Performance

+

Governance Rules



Frontend only displays data.



*/