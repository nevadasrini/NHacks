//Ask what days the user can exercise
//Ask amt of time per workout day
//Make routine template based on goals/wanted exercizes
//Take recommended exercizes and put them into the template

class Day{
    constructor(index,cardio,strength,time){
        this.cardio = cardio;
        this.strength = strength;
        this.time = time;
        this.workouts = [];
        this.index = index;
    }

    get joint(){
        if (cardio&&strength){
            return true;
        }else{
            return false;
        }
    }
}

let days = [false, false, false, false, false, false, false]; //representative of Mon Tues Weds Thurs Fri Sat Sun
let dayCardio = [false, false, false, false, false, false, false];
let dayStrength = [false, false, false, false, false, false, false];
let dayWorkouts =[null,null,null,null,null,null,null];

for(let i = 0; i<dayWorkouts.length; i++){
    dayWorkouts[i]=new Day(i, false, false, 0)
}

let cardio = false;
let strength = false;
let startDay = -1;
let numRest = 0;
let numWork = 0;
let timePerDay = 60; //in minutes
let group = [0,0];

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('poop logged in: ', user)
        
    } else {
        console.log('user logged out')
    }
})

const scheduleForm = document.querySelector('.schedule-button');
const scheduleModal = document.querySelector('#modal-schedule')
scheduleForm.addEventListener('click', (e) => {
    // prevent refresh (losing info)
    e.preventDefault();

    // get user info
    days = [false, false, false, false, false, false, false]; //representative of Mon Tues Weds Thurs Fri Sat Sun
    dayCardio = [false, false, false, false, false, false, false];
    dayStrength = [false, false, false, false, false, false, false];

    cardio = false;
    strength = false;
    numRest = 0;
    numWork = 0;

    const ele3 = document.getElementsByName('days');
    for(i = 0 ; i < ele3.length ; i++) {
        if(ele3[i].checked) days[i] = true;
    }

    const ele4 = document.getElementsByName('work');
    if(ele4[0].checked){
        strength = true;
    } 
    else if(ele4[1].checked){
        cardio = true;
    }
    else{
        strength = true;
        cardio= true;
    }

    console.group(scheduleModal);
    M.Modal.getInstance(scheduleModal).close();
    
    initialize();
    document.querySelector("#made").classList.remove("hide");
})



function initialize(){
for(let i = 0; i < days.length; i++){
    if(days[i]){
        numWork++;
        if(startDay==-1){
            startDay = i;
        }  
    }
}

numRest = 7-numWork;

if((cardio && !strength) || (!cardio && strength)){

    if (numWork >=4){
        findBeginner()
    }
    console.log(days);

    for(let i =0; i<days.length; i++){
        if (days[i]) {
            if (cardio) {dayCardio[i] = true}
            else {dayStrength[i] = true}
        }
    }
    
    
    console.log(dayCardio);
    console.log(dayStrength);
}
else { 
    if(numWork >= 4){
        if(numWork == 7){
            setRestDay(6);
        }
        alt = true;
        for(let i = startDay; i<days.length; i++){
            if (days[i]){
                if (alt){
                    dayStrength[i] = true;
                }
                else{
                    dayCardio[i] = true;
                }
                alt= !alt;
            }
        }
    }
    else{
        for(let i = 0; i<days.length; i++){
            dayCardio[i] = true;
            dayStrength[i] = true;
        }
    }
}
console.log('yee');

let table = document.getElementById("schedule"); //gets schedules week graphic
let tableDays = table.rows[1];
console.log(tableDays);


for(let i = 0; i<days.length;i++){
    let childList = tableDays.cells[i].childNodes[1];
    childList.innerText = '';
    if(days[i]){
        dayWorkouts[i].cardio = dayCardio[i];
        dayWorkouts[i].strength = dayStrength[i];
        insertWorkouts("cardio").then(queried => dayWorkouts[i].workouts = queried).catch(error=>console.error(error));
        console.log(dayWorkouts[i]);
        

        if(dayStrength[i]){
            var x = document.createElement("li");
            x.innerText = "Strength";
            childList.appendChild(x);
            console.log(1);
        }
        if(dayCardio[i]){
            var x = document.createElement("li");
            x.innerText = "Cardio";
            childList.appendChild(x);
            
        }
        
    }
    else{
        var x = document.createElement("li");
        x.innerText = "Rest";
        childList.appendChild(x);
        
    }
}
}

function findBeginner(){
    for (let i = 0; i<5; i++){
        let a = i;
        let b = i+2;
        let c = i+4;

        const check = (a,b,c)=>{
            if(days[a]&&days[b]&&days[c]){
                for (let k = 0; k<days.length; k++){
                    if(k!=a&k!=b&&k!=c){
                        setRestDay(k);
                    }
                }
                return true;
            }else{
                return false;
            }
        }
        
        b = arrayWrapCheck(b, days);

        c = arrayWrapCheck(c, days);

        console.log(`${a}${b}${c}`);
        if (check(a,b,c)){
            return true;
        }
        else if(i>0&&i<3){
            a = i + 4;
            b = a + 2;
            c = a + 4;
            
            b = arrayWrapCheck(b, days);

            c = arrayWrapCheck(c, days);

            console.log(`${a}${b}${c}`);
            if (check(a,b,c)){
                return true;
            }
        }
    }
    console.log("wah");
    let start = -1;
            let i = 0;

            while (true){
                b = i-1;

                b = arrayWrapCheck(b, days);
                console.log(!days[b] && days[i]);

                if(!days[b] && days[i]){
                    start = i;
                    c = start + 2;
                    c = arrayWrapCheck(c, days);

                    if (days[c]){
                        setRestDay(c);
                    }
                    else if (days[arrayWrapCheck(c+1, days)]){
                        setRestDay(arrayWrapCheck(c+1, days));
                    }
                    else if(start == days.length-1){
                        setRestDay(0);
                    }
                    else {
                        setRestDay(arrayWrapCheck(start+5, days));
                    }
                    return true;
                }

                i++;
                i = arrayWrapCheck(i, days);
            }
            
}

function comboHandler(start, combo){
    if (combo == 3){
        if(start == days.length-1){
            setRestDay(0);
        }
        else{
            setRestDay(start+1);
        }
    }
    if (combo == 4){
        
    }
}

function arrayWrapCheck(index, array){
    if(index>=array.length){
        return index-array.length;
    }else if (index<0){
        return index+array.length;
    }else {
        return index;
    }
    
}

function setRestDay(index){
    days[index] = false;
    numWork--;
    numRest++;
}

function insertWorkouts(type){
                
                let workouts = parseWorkouts("txt/workouts.txt");
    
                let sortedWorkouts = [];
                workouts.forEach( workout => {
                    if ( checkWorkout(currentUserData, workout, type) ) {
                        sortedWorkouts.push(workout);
                    }
                })
                return sortedWorkouts;
                
}

