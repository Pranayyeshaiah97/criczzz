// click event code for sign in button
document.getElementById("signInButton").addEventListener("click", function signInButton(){
    document.querySelector(".backGroundOnForm").style.display="flex";
});

document.getElementById("cancelButton").addEventListener("click", function cancelButton(){
    document.querySelector(".backGroundOnForm").style.display="none";
});


// click event code for sign up button
document.getElementById("signUpButton").addEventListener("click", function signUpButton(){
    document.querySelector(".signUpbackGroundOnForm").style.display="flex";
});

document.getElementById("signUpCloseButton").addEventListener("click", function signUpCloseButton(){
    document.querySelector(".signUpbackGroundOnForm").style.display="none";
})

document.getElementById("signIn").onclick =function(){
    location.href = (__dirname+"/Cricket_ScoringBoard/homepage.html");
};