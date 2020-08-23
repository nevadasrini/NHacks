const nameObject = document.getElementById('name');



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
        db.collection('users').doc(user.email).set({
            name: form.name.value,
            email: user.email,
        }).then( function() { document.location.href = "index.html" })
    }
    else {

    }    
}