document.addEventListener("DOMContentLoaded",function(){
    var studentLogin=document.getElementsByClassName("buttons");
    studentLogin[0].addEventListener("click",function(){
        window.location.href="student.html";
    });
    studentLogin[1].addEventListener("click",function(){
        window.location.href="admin.html";
    });
});