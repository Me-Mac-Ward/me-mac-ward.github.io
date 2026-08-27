// Load calendar data
async function loadCalendar() {
    try {
        const response = await fetch("events.json");

        if (!response.ok) {
            throw new Error("Could not load events.json");
        }

        const data = await response.json();

        displayToday(data.activities);
        displayUpcoming(data.activities);
        displayAssignments(data.assignments);

    } catch (error) {
        console.error("Calendar error:", error);
    }
}


// Get today's date as YYYY-MM-DD
function getToday() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Get a date N days from today
function getDateOffset(days) {
    const date = new Date();

    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Display today's activities
function displayToday(activities) {

    const today = getToday();

    const todayActivities = activities
        .filter(activity => activity.date === today)
        .sort((a, b) => a.start.localeCompare(b.start));


    const container = document.getElementById("today-activities");

    container.innerHTML = "";


    if (todayActivities.length === 0) {
        container.innerHTML = `
            <div class="no-events">
                No activities today
            </div>
        `;

        return;
    }


    todayActivities.forEach(activity => {

        const element = document.createElement("div");

        element.className = "activity";

        element.innerHTML = `
            <div class="activity-time">
                ${activity.start}
            </div>

            <div class="activity-details">

                <div class="activity-title">
                    ${activity.title}
                </div>

                <div class="activity-location">
                    ${activity.location || ""}
                </div>

            </div>
        `;

        container.appendChild(element);
    });
}


// Display upcoming activities
function displayUpcoming(activities) {

    const today = getToday();

    const upcomingActivities = activities
        .filter(activity => activity.date > today)
        .sort((a, b) => {

            const dateComparison =
                a.date.localeCompare(b.date);

            if (dateComparison !== 0) {
                return dateComparison;
            }

            return a.start.localeCompare(b.start);
        });


    const container =
        document.getElementById("upcoming-activities");

    container.innerHTML = "";


    if (upcomingActivities.length === 0) {

        container.innerHTML = `
            <div class="no-events">
                No upcoming activities
            </div>
        `;

        return;
    }


    // Display the next 6 activities
    upcomingActivities
        .slice(0, 6)
        .forEach(activity => {

            const element =
                document.createElement("div");

            element.className = "upcoming-activity";

            element.innerHTML = `
                <div class="activity">
                    ${activity.title}<br>
                    ${activity.start} -- ${activity.end}<br> 
                    ${activity.location || ""}<br>

                // <div class="upcoming-date">
                //     ${formatUpcomingDate(activity.date)}
                // </div>

                // <div class="upcoming-time">
                //     ${activity.start}
                // </div>

                // <div class="upcoming-title">
                //     ${activity.title}
                // </div>
            `;

            container.appendChild(element);
        });
}


// Display assignments
function displayAssignments(assignments) {

    const today = getToday();

    const upcomingAssignments = assignments
        .filter(assignment => assignment.due >= today)
        .sort((a, b) =>
            a.due.localeCompare(b.due)
        );


    const container =
        document.getElementById("assignments");

    container.innerHTML = "";


    if (upcomingAssignments.length === 0) {

        container.innerHTML = `
            <div class="no-events">
                No assignments
            </div>
        `;

        return;
    }


    // Display the next 4 assignments
    upcomingAssignments
        .slice(0, 4)
        .forEach(assignment => {

            const element =
                document.createElement("div");

            element.className = "assignment";

            element.innerHTML = `
                <div class="assignment-subject">
                    ${assignment.subject}
                </div>

                <div class="assignment-title">
                    ${assignment.title}
                </div>

                <div class="assignment-due">
                    ${formatDueDate(assignment.due)}
                </div>
            `;

            container.appendChild(element);
        });
}


// Format dates for the "Up Next" section
function formatUpcomingDate(dateString) {

    const today = getToday();
    const tomorrow = getDateOffset(1);

    if (dateString === tomorrow) {
        return "Tomorrow";
    }


    const date = new Date(`${dateString}T12:00:00`);

    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });
}


// Format assignment deadlines
function formatDueDate(dateString) {

    const today = getToday();
    const tomorrow = getDateOffset(1);

    if (dateString === today) {
        return "Due today";
    }

    if (dateString === tomorrow) {
        return "Due tomorrow";
    }


    const date = new Date(`${dateString}T12:00:00`);

    return "Due " + date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short"
    });
}


// Start the calendar
loadCalendar();


// Refresh every minute
setInterval(loadCalendar, 60 * 1000);