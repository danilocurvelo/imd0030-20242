---
layout: minimal
title: Staff
description: &desc All the teaching and learning assistants.
summary: *desc
parent: CSE 373
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

{% assign teaching_assistants = site.staffers | where: 'role', 'Teaching Assistant' | sort: 'section' %}
{% for staffer in teaching_assistants %}
{{ staffer }}
{% endfor %}
