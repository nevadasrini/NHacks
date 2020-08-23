const users = db.collection("users");
var currentUser = null;
var currentUserData = null;

auth.onAuthStateChanged(user => {
    if (user) {
        getUser(user.uid).then(doc=>{
            currentUser = doc;
            currentUserData = doc.data();
        })
        .catch(error=>console.error(error));
        
    } 
    else{
        currentUser = null;
        currentUserData = null;
    }
})


function getUsers(){ /*in future want to use user ID*/
    return new Promise((resolve,reject)=>{
        users.get().then(
        function(snapshot) {
            let doc = snapshot.docs[0];
            if(doc && doc.exists) { 
                console.log(doc.data());
                resolve(doc.data());
            }
            else{
                reject("Error no users in database.");
            }
            }).catch((error) => reject(error));

    })
}

function getUser(UserID){ /*in future want to use user ID*/
    return new Promise((resolve,reject)=>{

        users.where("userid","==",UserID).get().then(
        function(snapshot) {
            let doc = snapshot.docs[0];
            if(doc && doc.exists) { 
                console.log(doc.data());
                resolve(doc);
            }
            else{
                reject("Error user does not exist.");
            }
            }).catch((error) => reject(error));

    })
}

function getUserInfo(UserID){ /*in future want to use user ID*/
    return new Promise((resolve,reject)=>{

        users.where("userid","==",UserID).get().then(
        function(snapshot) {
            let doc = snapshot.docs[0];
            if(doc && doc.exists) { 
                console.log(doc.data());
                resolve(doc.data());
            }
            else{
                reject("Error user does not exist.");
            }
            }).catch((error) => reject(error));

    })
}

