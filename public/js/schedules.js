//Ask what days the user can exercise
//Ask amt of time per workout day
//Make routine template based on goals/wanted exercizes
//Take recommended exercizes and put them into the template
var days = [true, false, false, true, true, false, true,] //representative of Mon Tues Weds Thurs Fri Sat Sun
var cardio = true;
var strength = false;
var startDay = -1;
var numRest = 0;
var numWork = 0;
var timePerDay = 60; //in minutes

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
    //make workout template structure
    if(numWork >= 4){
        temp = 0;
        if (days[0]) temp ++;
        for(let i = 1; i < days.length; i++){
            if ((days[i]) && (days[i-1] || temp == 3)){
                days[i]= false;
                numWork--;
                numRest++;
            }
            else if (days[i]) {
                temp++;
            }
        }
    }
    console.log(days);
}