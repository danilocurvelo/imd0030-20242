---
layout: minimal
title: Equipe
description: &desc Equipe envolvida em IMD0030.
summary: *desc
parent: IMD0030
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

{% assign instructors = site.staffers | where: 'role', 'Instructor' %}
{% for staffer in instructors %}
{{ staffer }}
{% endfor %}

{% assign teaching_assistants = site.staffers | where: 'role', 'Teaching Assistant' | sort: 'section' %}
{% for staffer in teaching_assistants %}
{{ staffer }}
{% endfor %}
