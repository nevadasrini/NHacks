// Project: Song Converter
// Names: Nivedha Srinivasan, Oreoluwa Alao
// Date: 6/14/20
// Task Description: Handles user authentication (log in, sign up, log out) and tracks user auth status

// listen for auth status changes and logs them to the console
let notSwitched = true;
auth.onAuthStateChanged(user => {
    if (user) {
        if(document.location.href == "index.html")  document.location.href = "workout.html";
        console.log('user logged in: ', user)
        setupUI(user);
    } else {
        if(notSwitched && document.location.href != "index.html"){
            notSwitched = false;
            document.location.href = "index.html";
        }
        setupUI();
        console.log('user logged out');
    }
})

// sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    // prevent refresh (losing info)
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    const name = signupForm['signup-name'].value;
    
    const ele = document.getElementsByName('signup-level');
    let level = "";
    for(i = 0; i < ele.length; i++) { 
        if(ele[i].checked) level = ele[i].value;
    }

    const ele1 = document.getElementsByName('signup-time');
    let time = "";
    for(i = 0 ; i < ele1.length ; i++) {
        if(ele1[i].checked) time = ele1[i].value;
    }

    const ele2 = document.getElementsByName('space');
    let space = [];
    for(i = 0 ; i < ele2.length ; i++) {
        if(ele2[i].checked) space.push(ele2[i].value);
    }

    const ele3 = document.getElementsByName('equipment');
    let equipment = [];
    for(i = 0 ; i < ele3.length ; i++) {
        if(ele3[i].checked) equipment.push(ele3[i].value);
    }

    const docID = email;
    db.collection('users').doc(docID).set({
        email: email,
        name: name,
        level: level,
        time: time,
        space: space,
        equipment: equipment
    })
    
    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    })
    
    auth.onAuthStateChanged(user => {
        db.collection('users').doc(docID).update({
            userid: user.uid || "none"
        })
    })
})

// log out
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    // prevent default actions (refresh)
    e.preventDefault()
    auth.signOut().then(() => {
        console.log("logged out");
    })
})

//  login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    // prevent default actions (refresh)
    e.preventDefault()

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log in user
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // close login modal and reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})
