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

var days = [true, false, true, true, false, true, true]; //representative of Mon Tues Weds Thurs Fri Sat Sun
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

    if (numWork >=5){
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
            
            if(b>=days.length){
                b= b-days.length;
            }

            if(c>=days.length){
                c= c-days.length;
            }
            console.log(`${a}${b}${c}`);
            if (check(a,b,c)){
                i=days.length;
            }
            else if(i>0&&i<3){
                a = days.length-i;
                b = a + 2;
                c = a + 4;
                
                if(b>=days.length){
                    b= b-days.length;
                }
    
                if(c>=days.length){
                    c= c-days.length;
                }
                console.log(`${a}${b}${c}`);
                if (check(a,b,c)){
                    i=days.length;
                }
            }
        }

        /*
        let start = -1;
        let combo = 0;

        if(days[0]&&days[days.length - 1]){
            for (let j = days.length-1; j>=0; j--){
                combo++;
                if(!days[j-1]){
                    start = j;
                }
            }
            for (let i = 0; i<days.length; i++)
                combo++;
                if(!days[j+1]){
                    i=days.length;
                }
            }
        }
*/
        /*for(let i = 0; i<days.length; i++){
            if (
                (i=0&&!days[days.length-1]&& days[0])||
                (!days[i-1]&& days[0])
               )
            {
                start = i;
                combo ++;
            }
            else if(days[i] && start!=-1){
                combo ++;
;           }
            else if(!days[i]){
                
            }
        }
    }*/
    //make workout template structure
    /*if(numWork >= 4){
        temp = 0;
        if (days[0]){
            temp ++;
            if (cardio) {
                dayCardio[0] = true;
            }
            else {dayStrength[0] = true}
            if (days[6]){
            }
        } 
        for(let i = 1; i < days.length; i++){
            if ((days[i]) && (days[i-1] || temp == 3)){
                days[i]= false;
                numWork--;
                numRest++;
            }
            else if (days[i]) {
                temp++;
                if (cardio) {dayCardio[i] = true}
                else {dayStrength[i] = true}
            }
        }
    }
    else{
        
            for(let i =0; i<days.length; i++){
                if (days[i]) {
                    if (cardio) {dayCardio[i] = true}
                    else {dayStrength[i] = true}
                }
            }
        
       
        }
    
}*/console.log(days);
console.log(dayCardio);
console.log(dayStrength);}
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
}}

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

