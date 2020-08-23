
const fs = require('fs') 


auth.onAuthStateChanged(user => {
    if (user){
        try {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const exerciseType = urlParams.get('other');

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

    getUserInfo(user.email).then(
        userInfo => {
            
            let workouts = parseWorkouts("txt/workouts.txt");

            let sortedWorkouts = [];
            workouts.forEach( workout => {
                if ( checkWorkout(user, workout, type) ) {
                    sortedWorkouts.push(workout);
                }
            })

            // Insert sortedWorkouts info onto page.

        }
    )

}

function parseWorkouts(textFileName) {
    const re = /NEW([^,]+),([^,]+),([^,]+),([^,]+),([^,]*),([^,]*),([^,]+)/g

    fs.readFile(textFileName, (err, data) => { 
        if (err) throw err; 
      
        let result;
        let returnArray = [];
        while ((result = re.exec(data)) !== null ) {
            returnArray.push(
                {
                    name: result[0],
                    type: result[1],
                    intensity: result[2],
                    duration: result[3],
                    equipment: result[4],
                    space: result[5],
                    time: result[6]
                }
            )
        }
        return returnArray;
    }) 
}

function checkWorkout (user, workout, type) {

    if (type == workout.type && user.intensity == workout.intensity && user.time >= parseInt(workout.time)){
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