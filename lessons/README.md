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

{% for assessment in site.data.assessments %}
{: .text-gamma }
## {{ assessment[0] }}

{% for lesson in assessment[1] %}
{% if site.data.lessons[lesson]["Questions"] %}
{: .text-delta }
### {{ lesson }}

{% for question in site.data.lessons[lesson]["Questions"] %}
- [ ] [{{ question[0] }}]({{ question[1] }})
{%- endfor -%}
{% endif %}
{% endfor %}
{% endfor %}

<script>
const email = document.getElementById("email");
const lessons = document.getElementsByClassName("text-delta");

email.addEventListener("input", event => {
    const seed = event.target.value.trim().toLowerCase();
    for (const heading of lessons) {
        const ul = heading.nextElementSibling;
        for (const input of ul.getElementsByTagName("input")) {
            input.removeAttribute("checked");
        };
        if (seed.endsWith("@uw.edu")) {
            const chance = new Chance(heading.textContent + seed);
            const shuffled = chance.shuffle(ul.getElementsByTagName("input"));
            for (const input of shuffled.slice(0, 1).sort((x, y) => x - y)) {
                input.setAttribute("checked", "checked");
            };
        };
    };
});
</script>
