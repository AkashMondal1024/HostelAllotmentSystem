document.addEventListener("DOMContentLoaded",function(){
    var btn=document.getElementsByClassName("buttons");
    btn[0].addEventListener("click",function(){
        account
      .deleteSession("current")
      .then(() => {
        // Clear local storage (if needed)
        localStorage.removeItem("userID");
        
        // Redirect to the login page
        window.location.href = "../student.html";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
    });
    btn[1].addEventListener("click",function(){
        window.location.href="../studentHome.html";
    });
    btn[2].addEventListener("click",function(){
        window.location.href="student-profile.html";
    });
    btn[3].addEventListener("click",function(){
        window.location.href="app-status.html";
    });
    btn[4].addEventListener("click",function(){
        window.location.href="room-details.html";
    });
    btn[5].addEventListener("click",function(){
        window.location.href="canteen.html";
    });
    // btn[6].addEventListener("click",function(){
    //     window.location.href="student.html";
    // });
    // btn[7].addEventListener("click",function(){
    //     window.location.href="student.html";
    // });
});