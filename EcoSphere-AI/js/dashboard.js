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
    loadDashboardData();
    setupLogout();
    renderDemoChart();
});

async function loadDashboardData() {
    const token = localStorage.getItem("ecosphere_token");
    if (!token) {
        return;
    }
    try {
        const res = await fetch("/api/dashboard-opt/admin", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
            const cardsList = document.querySelectorAll(".card h1");
            if (cardsList.length >= 4) {
                cardsList[0].innerText = data.leaderboard.length || "0";
                cardsList[1].innerText = data.recentActivity?.recentChallenges?.length || "0";
                cardsList[2].innerText = data.cards.unreadNotifications || "0";
                cardsList[3].innerText = `${Math.round(data.cards.overallESG)}%`;
            }
            const tbody = document.querySelector("table tbody");
            if (tbody) {
                tbody.innerHTML = "";
                const combinedActivity = [
                    ...(data.rewardsRedeemed || []).map(r => ({
                        user: r.name,
                        dept: r.department || "N/A",
                        action: `Redeemed ${r.rewardTitle}`,
                        status: "Success"
                    })),
                    ...(data.recentActivity?.recentCSR || []).map(c => ({
                        user: c.organizer?.name || "N/A",
                        dept: c.organizer?.department || "N/A",
                        action: `CSR: ${c.title}`,
                        status: "Pending"
                    }))
                ];
                if (combinedActivity.length === 0) {
                    tbody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>No recent activities found</td></tr>";
                } else {
                    combinedActivity.slice(0, 10).forEach(act => {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td>${act.user}</td>
                            <td>${act.dept}</td>
                            <td>${act.action}</td>
                            <td><span style="font-weight:bold; color:${act.status === "Success" ? "green" : "orange"}">${act.status}</span></td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            }
        }
    } catch (error) {
        console.error("loadDashboardData() error:", error.message);
    }
}

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

function setupLogout() {
    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("ecosphere_token");
            localStorage.removeItem("ecosphere_user");
            window.location.href = "/login";
        });
    }
}

function renderDemoChart() {
    const ctx = document.getElementById("dashboardChart");
    if (!ctx) return;
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            datasets: [{
                label: "Monthly ESG Engagements",
                data: [65, 59, 80, 81, 56, 55, 92],
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                borderColor: "rgba(16, 185, 129, 1)",
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(0, 0, 0, 0.05)"
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}






