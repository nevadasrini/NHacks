const nameObject = document.getElementById('name');
const levelObjects = document.getElementsByName('edit-level');
const timeObjects = document.getElementsByName('edit-time');
const spaceObjects = document.getElementsByName('edit-space');
const equipmentObjects = document.getElementsByName('edit-equipment');



const form = document.querySelector("#accountForm");

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user)
        displayAccount(user);
    }
    else {
        displayAccount();
        console.log('user logged out')
    }
})

function displayAccount(user)
{
    if (user)
    {
        db.collection('users').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                
                if (doc.data().email == user.email){
                    nameObject.value = doc.data().name;

                    for (i = 0 ; i < levelObjects.length ; i ++) {
                        if (doc.data().level == levelObjects[i].getAttribute('value')) {
                            levelObjects[i].checked = true;
                        }
                    }

                    for (i = 0 ; i < timeObjects.length ; i ++) {
                        if (doc.data().time == timeObjects[i].getAttribute('value')) {
                            timeObjects[i].checked = true;
                        }
                    }

                    for (i = 0 ; i < spaceObjects.length ; i ++) {
                        if (doc.data().space.includes(spaceObjects[i].getAttribute('value'))) {
                            spaceObjects[i].checked = true;
                        }
                    }

                    for (i = 0 ; i < equipmentObjects.length ; i ++) {
                        if (doc.data().equipment.includes(equipmentObjects[i].getAttribute('value'))) {
                            equipmentObjects[i].checked = true;
                        }
                    }
                    
                }

            })
        })
    }
    else {

    }
}

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('user logged in: ', user)
            updateAccount(user);
            thisUser = user;
        }
        else {
            updateAccount();
            console.log('user logged out')
        }
    })
    
})

function updateAccount(user){
    if (user)
    {   
        const ele = document.getElementsByName('edit-level');
        let level = "";
        for(i = 0; i < ele.length; i++) { 
            if(ele[i].checked) level = ele[i].value;
        }

        const ele1 = document.getElementsByName('edit-time');
        let time = "";
        for(i = 0 ; i < ele1.length ; i++) {
            if(ele1[i].checked) time = ele1[i].value;
        }

        const ele2 = document.getElementsByName('edit-space');
        let space = [];
        for(i = 0 ; i < ele2.length ; i++) {
            if(ele2[i].checked) space.push(ele2[i].value);
        }

        const ele3 = document.getElementsByName('edit-equipment');
        let equipment = [];
        for(i = 0 ; i < ele3.length ; i++) {
            if(ele3[i].checked) equipment.push(ele3[i].value);
        }

        db.collection('users').doc(user.email).update({
            
            name: form.name.value,
            email: user.email,
            level: level,
            time: time,
            space: space,
            equipment: equipment

        }).then( function() { document.location.href = "workout.html" })
    }
    else {

    }    
}