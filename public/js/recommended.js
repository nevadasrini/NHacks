




auth.onAuthStateChanged(user => {
    if (user){
        try {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const exerciseType = urlParams.get('type');

            const titleHeader = document.getElementById("title-header");
            const mainTitle = document.getElementById("main-title");
            let displayExerciseType = exerciseType.slice(0,1).toUpperCase() + exerciseType.slice(1);
            displayExerciseType = `Recommended ${displayExerciseType} Exercises`;
            titleHeader.innerHTML = displayExerciseType;
            mainTitle.innerHTML = displayExerciseType;


            runApp(user, exerciseType)
        } catch (error) {
            console.log("Could not retrieve URL parameters. Error is below.")
            console.log(error)
        }
        
    }
    else {
        console.log("Not logged in.")
    }
}
)


function runApp (user, type) {

    getUserInfo(user.uid).then(
        userInfo => {
            
                workouts = parseWorkouts()

                let sortedWorkouts = [];
                workouts.forEach( workout => {
                    if ( checkWorkout(workout, type) ) {
                        sortedWorkouts.push(workout);
                        console.log(sortedWorkouts)
                    }
                })

                if(sortedWorkouts.length == 0) {
                    document.querySelectorAll(".no-results-found").forEach( element => {
                        element.style.display = "block";
                    })
                } else {
                    // Insert sortedWorkouts info onto page.
                    createPageNumbers(sortedWorkouts, userInfo);
                }
        }
    )

}

function parseWorkouts() {
    const re = /NEW([^,]+),([^,]+),([^,]+),([^,]+),([^,]*),([^,]*),([^,]+),([^,]+?)\n/g

    let returnArray = [];

    let result;
    while ((result = re.exec(data)) !== null ) {
        returnArray.push(
            {
                name: result[1],
                type: result[2],
                intensity: result[3],
                duration: result[4],
                equipment: result[5],
                space: result[6],
                time: result[7],
                imageRef: result[8]
            }
        )
    }
    
    return returnArray;
}

function checkWorkout (workout, type) {
    
    if(workout.name == "Running") {
        console.log(type == workout.type);
        console.log(parseInt(currentUserData.time) >= parseInt(workout.time));

    }

    if (type == workout.type && parseInt(currentUserData.time) >= parseInt(workout.time)){

        let equipMatch = false;
        let spaceMatch = false;
        currentUserData.equipment.forEach( equip => {
            if (workout.equipment.split(":").includes(equip)){
                equipMatch = true;
            }
        })
        currentUserData.space.forEach( space => {
            if (workout.space.split(":").includes(space)){
                spaceMatch = true;
            }
        })

        if ((equipMatch || workout.equipment == "none") && (spaceMatch || workout.space == "none")) {
            console.log("SUPER");
            return true;
        }
    }
    return false;
}

function createPageNumbers(sortedWorkouts, userInfo){
    const pager = document.getElementById("pagination");
    pager.innerHTML = "";
    for (let i = 0 ; i < Math.ceil(sortedWorkouts.length / 4) ; i++)
    {
        let pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.addEventListener("click", function (event) {
            event.preventDefault();
            goToPage(sortedWorkouts, userInfo, i);
        });
        pageLink.innerHTML = String(i + 1);
        pageLink.classList.add("w3-bar-item", "w3-button");
        
        if(i == 0) pageLink.classList.add("w3-black");
        else pageLink.classList.add("w3-hover-black");

        pager.appendChild(pageLink)
    }

    goToPage(sortedWorkouts, userInfo, 0);
}

function goToPage(sortedWorkouts, userInfo, page){
    const pager = document.getElementById("pagination");
    const pagerChildren = pager.childNodes;

    console.log(pagerChildren);

    for(let i = 0; i<pagerChildren.length; i++) {
        if(i == page){
            pagerChildren[i].classList.add("w3-black");
            pagerChildren[i].classList.remove("w3-hover-black");
        }
        else {
            pagerChildren[i].classList.add("w3-hover-black");
            pagerChildren[i].classList.remove("w3-black");
        }
    }

    const container = document.getElementById("workout-card-container");
    container.innerHTML = "";

    insertWorkoutsOntoPage(sortedWorkouts, userInfo, page);

}

function insertWorkoutsOntoPage(workouts, userInfo, page) {

    const container = document.getElementById("workout-card-container");

    let start = (page) * 4;
    let end = start + 4;
    if (end > workouts.length) end = workouts.length;
    console.log(start);
    console.log(end);
    console.log(workouts);
    console.log(workouts.slice(start, end));

    workouts.slice(start, end).forEach(workout => {
        
        let displayedDuration = workout.duration.split(":")[userInfo.level];
        if(workout.type == "cardio") {
            displayedDuration += " minutes";
        }
        else {
            displayedDuration += " reps";
        }

        let additionalInformation = "Type: " + workout.type;
        additionalInformation += "<br/><br/>Intensity: " + workout.intensity;
        additionalInformation += "<br/><br/>Recommended Duration: " + displayedDuration;
        additionalInformation += "<br/><br/>Equipment Needed: ";
        workout.equipment.split(":").forEach( equip => {
            additionalInformation += "<br/>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp" + equip;
        } )

        container.innerHTML += `
        <div class="card" style="width:350px;margin:10px; flex-basis: 33%;">
        <div class="card-image waves-effect waves-block waves-light" >
        <img class="activator" src="images/` + String(workout.imageRef) + `" height="250px">
        </div>
        <div class="card-content">
        <span class="card-title activator grey-text text-darken-4">`+ String(workout.name) +`<i class="material-icons right">more_vert</i></span>
        <p><span>` + String(displayedDuration) + `</span></p>
        </div>
        <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">`+ String(workout.name) + `<i class="material-icons right">close</i></span>
        <p>` + String(additionalInformation) + `</p>
        </div>
        </div>
        `
    }
        
    )

}