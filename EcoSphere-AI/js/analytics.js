/* =========================================
   EcoSphere AI
   Analytics Dashboard JS

   Features:
   - Summary Cards
   - Department ESG Chart
   - Monthly CSR Chart
   - Challenge Participation Chart
   - ESG Distribution Chart
   - Recent Activities Table
   - Time Filter
   - Backend Ready
========================================= */

// ================================
// Dummy Analytics Data
// Backend:
// GET /api/analytics/summary
// GET /api/analytics/charts
// ================================

const analyticsData = {

    totalEmployees: 245,

    challengesCompleted: 183,

    csrActivities: 127,

    overallESG: 86

};

const departmentData = {

    labels: ["IT", "HR", "Finance", "Marketing", "Sales"],

    scores: [92, 84, 88, 81, 79]

};

const csrData = {

    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

    values: [12, 18, 25, 21, 29, 34]

};

const challengeData = {

    labels: ["Completed", "Pending"],

    values: [183, 62]

};

const categoryData = {

    labels: ["Environmental", "Social", "Governance"],

    values: [42, 35, 23]

};

const recentActivities = [

    {
        date: "12 Jul",
        employee: "Amit Sharma",
        department: "IT",
        activity: "Tree Plantation",
        status: "Approved"
    },

    {
        date: "11 Jul",
        employee: "Priya Singh",
        department: "HR",
        activity: "Blood Donation",
        status: "Approved"
    },

    {
        date: "10 Jul",
        employee: "Rahul Verma",
        department: "Finance",
        activity: "Energy Saving",
        status: "Pending"
    },

    {
        date: "09 Jul",
        employee: "Neha Kapoor",
        department: "Marketing",
        activity: "CSR Campaign",
        status: "Rejected"
    }

];

// ================================
// DOM
// ================================

const employeeCount = document.getElementById("employeeCount");
const challengeCount = document.getElementById("challengeCount");
const csrCount = document.getElementById("csrCount");
const overallESG = document.getElementById("overallESG");
const activityTable = document.getElementById("activityTable");
const timeFilter = document.getElementById("timeFilter");

// ================================
// Initial Load
// ================================

document.addEventListener("DOMContentLoaded", () => {

    loadSummary();

    loadActivities();

    createDepartmentChart();

    createCSRChart();

    createChallengeChart();

    createCategoryChart();

});

// ================================
// Summary Cards
// ================================

function loadSummary() {

    employeeCount.innerText = analyticsData.totalEmployees;

    challengeCount.innerText = analyticsData.challengesCompleted;

    csrCount.innerText = analyticsData.csrActivities;

    overallESG.innerText = analyticsData.overallESG + "%";

}

// ================================
// Recent Activity Table
// ================================

function loadActivities() {

    activityTable.innerHTML = "";

    recentActivities.forEach(item => {

        activityTable.innerHTML += `

        <tr>

            <td>${item.date}</td>

            <td>${item.employee}</td>

            <td>${item.department}</td>

            <td>${item.activity}</td>

            <td>

                <span class="status-${item.status.toLowerCase()}">

                    ${item.status}

                </span>

            </td>

        </tr>

        `;

    });

}

// ================================
// Department ESG Chart
// ================================

function createDepartmentChart() {

    new Chart(document.getElementById("departmentChart"), {

        type: "bar",

        data: {

            labels: departmentData.labels,

            datasets: [

                {

                    label: "ESG Score",

                    data: departmentData.scores,

                    backgroundColor: "#4CAF50"

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

// ================================
// CSR Chart
// ================================

function createCSRChart() {

    new Chart(document.getElementById("csrChart"), {

        type: "line",

        data: {

            labels: csrData.labels,

            datasets: [

                {

                    label: "CSR Activities",

                    data: csrData.values,

                    borderColor: "#2196F3",

                    backgroundColor: "rgba(33,150,243,.15)",

                    fill: true,

                    tension: .4

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

// ================================
// Challenge Chart
// ================================

function createChallengeChart() {

    new Chart(document.getElementById("challengeChart"), {

        type: "doughnut",

        data: {

            labels: challengeData.labels,

            datasets: [

                {

                    data: challengeData.values,

                    backgroundColor: [

                        "#4CAF50",

                        "#FFC107"

                    ]

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

// ================================
// ESG Category Chart
// ================================

function createCategoryChart() {

    new Chart(document.getElementById("categoryChart"), {

        type: "pie",

        data: {

            labels: categoryData.labels,

            datasets: [

                {

                    data: categoryData.values,

                    backgroundColor: [

                        "#4CAF50",

                        "#2196F3",

                        "#FF9800"

                    ]

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

}

// ================================
// Time Filter
// ================================

timeFilter.addEventListener("change", function () {

    console.log("Selected:", this.value);

    /*
    Backend:

    GET /api/analytics?range=monthly

    GET /api/analytics?range=quarterly

    GET /api/analytics?range=yearly

    Then update:

    - Summary Cards
    - Charts
    - Table
    */

});

// ================================
// Backend Integration Notes
// ================================

/*

Summary

GET /api/analytics/summary


Charts

GET /api/analytics/charts


Activities

GET /api/analytics/recent


Future Integration:

fetch("/api/analytics/summary")
.then(res=>res.json())
.then(data=>{

Update cards

});


fetch("/api/analytics/charts")

fetch("/api/analytics/recent")

Only replace dummy data.

No UI changes required.

*/