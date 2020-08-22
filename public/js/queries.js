const db = firebase.firestore();
const users = db.collection("users");

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

function getUserInfo(UserID){ /*in future want to use user ID*/
    return new Promise((resolve,reject)=>{

        users.where("email","==",UserID).get().then(
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

