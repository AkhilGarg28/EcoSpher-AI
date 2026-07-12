// ======================================
// EcoSphere AI Admin Dashboard
// dashboard.js
// ======================================

// Dashboard Loaded
document.addEventListener("DOMContentLoaded", () => {

    console.log("EcoSphere AI Dashboard Loaded Successfully");

    animateCards();

    setupQuickActions();

    welcomeMessage();

});

// ======================================
// Animate Dashboard Cards
// ======================================

function animateCards() {

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(40px)";

        setTimeout(() => {

            card.style.transition = "0.6s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 200);

    });

}

// ======================================
// Quick Action Buttons
// ======================================

function setupQuickActions() {

    const buttons = document.querySelectorAll(".quick-actions button");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const action = button.innerText;

            switch (action) {

                case "Add Department":

                    alert("Redirecting to Department Management...");
                    window.location.href = "departments.html";
                    break;

                case "Create Challenge":

                    alert("Redirecting to Challenge Management...");
                    window.location.href = "challenges.html";
                    break;

                case "Approve CSR":

                    alert("Redirecting to CSR Approval...");
                    window.location.href = "csr-approval.html";
                    break;

                case "Generate Report":

                    alert("Report Generated Successfully!");
                    break;

                default:

                    alert(action);

            }

        });

    });

}

// ======================================
// Notification Icon
// ======================================

// const notification = document.querySelector(".fa-bell");

// if (notification) {

//     notification.addEventListener("click", () => {

//         alert("No new notifications.");

//     });

// }

// ======================================
// Welcome Message
// ======================================

function welcomeMessage() {

    const hour = new Date().getHours();

    let greeting = "";

    if (hour < 12) {

        greeting = "Good Morning ☀️";

    }

    else if (hour < 18) {

        greeting = "Good Afternoon 🌿";

    }

    else {

        greeting = "Good Evening 🌙";

    }

    console.log(greeting);

}

// ======================================
// Card Hover Effect
// ======================================

const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.cursor = "pointer";

    });

});

// ======================================
// Table Row Highlight
// ======================================

const rows = document.querySelectorAll("tbody tr");

rows.forEach(row => {

    row.addEventListener("click", () => {

        rows.forEach(r => {

            r.style.background = "";

        });

        row.style.background = "#E8F5E9";

    });

});

// ======================================
// Future Features
// ======================================

// Chart.js Graph

// Sidebar Toggle

// Dark Mode

// API Integration

// Fetch Dashboard Data

// Live Notifications

// Export Report PDF






