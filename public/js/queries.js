alert(2);
console.log(firebase);
const db = firebase.firestore();
alert(1);

function getUsers(){ /*in future want to use user ID*/
    return new Promise((resolve,reject)=>{

        db.collection("users").where("email","==",UserID).get().then(
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

function getUserInfo(UserID){ /*in future want to use user ID*/
    return new Promise((resolve,reject)=>{

        db.collection("users").where("email","==",UserID).get().then(
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

