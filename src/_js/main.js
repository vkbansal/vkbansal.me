(function(){
    let burger = document.getElementById("nav-btn");

    burger.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.classList.toggle("open");
      burger.classList.toggle("open");
    });
})();
