




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
            
                workouts = parseWorkouts("txt/workouts.txt")

                let sortedWorkouts = [];
                workouts.forEach( workout => {
                    if ( checkWorkout(userInfo, workout, type) ) {
                        sortedWorkouts.push(workout);
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

function parseWorkouts(textFileName) {
    const re = /NEW([^,]+),([^,]+),([^,]+),([^,]+),([^,]*),([^,]*),([^,]+),([^,]+?)\n/g

    let returnArray = [];

    let result;
    while ((result = re.exec(data)) !== null ) {
        returnArray.push(
            {
                name: result[0],
                type: result[1],
                intensity: result[2],
                duration: result[3],
                equipment: result[4],
                space: result[5],
                time: result[6],
                imageRef: result[7]
            }
        )
    }
    console.log(returnArray);
    return returnArray;
}

function checkWorkout (user, workout, type) {

    if (type == workout.type && parseInt(user.time) >= parseInt(workout.time)){
        let equipMatch = false;
        let spaceMatch = false;
        user.equipment.forEach( equip => {
            if (equip in workout.equipment.split(":")){
                equipMatch = true;
            }
        })
        user.space.forEach( space => {
            if (space in workout.space.split(":")){
                spaceMatch = true;
            }
        })

        if ((equipMatch || workout.equipment == "none") && (spaceMatch || workout.space == "none")) {
            return true;
        }
    }
    return false;
}

function createPageNumbers(sortedWorkouts, userInfo){
    const pager = document.getElementById("pagination");
    for (i = 0 ; i < ceil(sortedWorkouts.length / 4) ; i++)
    {
        let pageLink = document.createElement("a");
        pageLink.href = "#";
        pageLink.addEventListener("click", function () {
            preventDefault();
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
    pagerChildren[page].classList.remove("w3-hover-black");
    pagerChildren[page].classList.add("w3-black");

    const container = document.getElementById("workout-card-container");
    container.innerHTML = "";

    insertWorkoutsOntoPage(sortedWorkouts, userInfo, page);

}

function insertWorkoutsOntoPage(workouts, userInfo, page) {

    const container = document.getElementById("workout-card-container");

    let start = (page - 1) * 4;
    let end = start + 4;
    if (end > workouts.length) end = workouts.length;


    workouts.slice(start, end).forEach(workout => {
        
        let displayedDuration = workout.duration.split(":")[userInfo.level];
        if(workout.type == "cardio") {
            displayedDuration += " minutes";
        }
        else {
            displayedDuration += " reps";
        }

        let additionalInformation = "Type: " + workout.type;
        additionalInformation += "\nIntensity: " + workout.intensity;
        additionalInformation += "\nRecommended Duration: " + displayedDuration;
        additionalInformation += "\nEquipment Needed: ";
        workout.equipment.split(":").forEach( equip => {
            additionalInformation += "\n\t" + equip;
        } )

        container.innerHTML += `
        <div class="card" style="width:350px;margin:10px">
        <div class="card-image waves-effect waves-block waves-light" >
        <img class="activator" src="` + workout.imageRef + `" height="200px">
        </div>
        <div class="card-content">
        <span class="card-title activator grey-text text-darken-4">`+ workout.name +`<i class="material-icons right">more_vert</i></span>
        <p><span>` + displayedDuration + `</span></p>
        </div>
        <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">`+ workout.name + `<i class="material-icons right">close</i></span>
        <p>` + additionalInformation + `</p>
        </div>
        </div>
        `
    }
        
    )

}