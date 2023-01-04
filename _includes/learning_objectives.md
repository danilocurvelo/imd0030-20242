{% for objective in site.data.lessons[include.lesson]["Objectives"] %}
1. {{ objective -}}
{% endfor -%}
