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

var days = [true, false, true, true, false, true, false]; //representative of Mon Tues Weds Thurs Fri Sat Sun
var dayCardio = [false, false, false, false, false, false, false];
var dayStrength = [false, false, false, false, false, false, false];
var dayWorkouts =[null,null,null,null,null,null,null];

var cardio = true;
var strength = false;
var startDay = -1;
var numRest = 0;
var numWork = 0;
var timePerDay = 60; //in minutes
var group = [0,0];

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('poop logged in: ', user)
        initialize();
    } else {
        console.log('user logged out')
    }
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

    for(let i =0; i<days.length; i++){
        if (days[i]) {
            if (cardio) {dayCardio[i] = true}
            else {dayStrength[i] = true}
        }
    }
    
    console.log(days);
    console.log(dayCardio);
    console.log(dayStrength);
}
else { 
    if(numWork >= 4){
        alt = true;
        for(let i = startDay; i<days.length; i++){
            if (days[i]){
                if (alt){
                    dayStrength[i] = true;
                }
                else{
                    dayCardio[i] = true;
                }
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


for(let i = 0; i<days.length;i++){
    if(days[i]){
        dayWorkouts[i] = new Day(dayCardio, dayStrength, 60);
        insertWorkouts("cardio").then(queried => dayWorkouts[i].workouts = queried).catch(error=>console.error(error));
        console.log(dayWorkouts[i]);
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
    new Promise((resolve,reject)=>{
        getUserInfo(user.email).then(
            userInfo => {
                
                let workouts = parseWorkouts("txt/workouts.txt");
    
                let sortedWorkouts = [];
                workouts.forEach( workout => {
                    if ( checkWorkout(userInfo, workout, type) ) {
                        sortedWorkouts.push(workout);
                    }
                })
                resolve(sortedWorkouts);
                
    
            }
        ).catch(error=>reject(error));
    })
    
}

