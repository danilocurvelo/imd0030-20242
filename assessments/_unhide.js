const email = document.getElementById("email");
const container = document.getElementById("questions");
const lessons = document.getElementsByTagName("dt");

email.addEventListener("input", event => {
    const seed = event.target.value.trim().toLowerCase();
    if (!seed.endsWith("@uw.edu")) {
        container.classList.add("d-none");
        return;
    }
    container.classList.remove("d-none");
    for (const dt of lessons) {
        const elements = dt.nextElementSibling.children;
        for (const element of elements) {
            element.classList.add("d-none");
        };
        if (seed.endsWith("@uw.edu")) {
            const chance = new Chance(dt.textContent + seed);
            const shuffled = chance.shuffle(elements);
            for (const element of shuffled.slice(0, 1).sort((x, y) => x - y)) {
                element.classList.remove("d-none");
            };
        };
    };
});
