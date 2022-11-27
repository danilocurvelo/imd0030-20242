---
title: Lessons
description: &desc Learning materials and resources.
summary: *desc
has_children: true
has_toc: true
parent: CSE 373
permalink: /:path/
chance: yes
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

<input id="email" type="email" size="15" placeholder="email@uw.edu" class="text-beta p-2" />

{% for week in site.data.weekly %}
{: .text-gamma }
## {{ week[0] }}

{% for lesson in week[1] %}
{%- for objective in site.data.lessons[lesson]-%}
- [ ] {{ objective }}
{% endfor %}
{%- endfor -%}
{% endfor %}

<script>
const email = document.getElementById("email");
const weeks = document.getElementsByClassName("text-gamma");

email.addEventListener("input", event => {
    const seed = event.target.value.trim().toLowerCase();
    for (const heading of weeks) {
        const ul = heading.nextElementSibling;
        for (const input of ul.getElementsByTagName("input")) {
            input.removeAttribute("checked");
        };
        if (seed.endsWith("@uw.edu")) {
            const chance = new Chance(heading.textContent + seed);
            const shuffled = chance.shuffle(ul.getElementsByTagName("input"));
            for (const input of shuffled.slice(0, 2).sort((x, y) => x - y)) {
                input.setAttribute("checked", "checked");
            };
        };
    };
});
</script>
