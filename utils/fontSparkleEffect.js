let index = 0,
    interval = 5000;

const randNumber = (min, max) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const animate = star => {
    star.style.setProperty("--star-left", `${randNumber(-10, 100)}%`);
    star.style.setProperty("--star-top", `${randNumber(-40, 80)}%`);

    star.style.animation = "none";
    star.offsetHeight;
    star.style.animation = "";
}

for(const star of document.getElementsByClassName("magic-star")) {
    setTimeout(() => {
        animate(star);
        
        setInterval(() => animate(star), 1000);
    }, index++ * (interval / 3))
}