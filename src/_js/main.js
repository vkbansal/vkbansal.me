(function(){
    let burger = document.getElementById("nav-btn"),
        nav = document.getElementById("main-nav");

    burger.addEventListener("click", (e) => {
      e.preventDefault();
      nav.classList.toggle("open");
    });
})();
