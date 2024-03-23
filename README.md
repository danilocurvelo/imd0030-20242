---
layout: minimal
title: IMD0030
has_children: true
has_toc: true
permalink: /:path/
seo:
  type: Course
  name: Linguagem de Programação I
---

# {{ site.description }}
{: .mb-2 }
{{ site.tagline }}
{: .fs-6 .fw-300 }

{% assign instructors = site.staffers | where: 'role', 'Instructor' %}
{% for staffer in instructors %}
{{ staffer }}
{% endfor %}

Bem vindo ao curso **Linguagem de Programação I (IMD0030)** oferecido pelo Instituto Metrópole Digital no semestre 2024.1.

Este curso foi desenvolvido para capacitar o estudante a utilizar a linguagem de programação C++ para a implementação de programas visando a solução de problemas, sem nunca esquecer de aplicar as *boas práticas de programação*. Durante este curso, nos aprofundaremos na sintaxe, lógica e paradigmas da programação em C++, capacitando vocês a dominarem os fundamentos e a prática da codificação eficiente e robusta. Que este curso seja uma experiência enriquecedora, preparando-os para enfrentar os desafios do mundo da programação com confiança e habilidade.

Dentro dos diferente tópicos que iremos abordar durante o curso estão: Operadores de alocação dinâmica; Formas de implementação de TADs (Tipos Abstratos de Dados); Funções e Recursividade; Tipos de recursão; Recursão x Interação; Performance, Expressividade; Introdução a Classes; Construtores e Destrutores; Tipos compostos; Tipos recursivos; Gerenciamento de memória; Modularização de Programas; Depuração e Profiling; Aplicações em estruturas e algoritmos presentes em EDB1.

## Material

{% for module in site.modules %}
{{ module }}
{% endfor %}

## Calendário

<div class="schedule">
  <ul class="schedule-timeline" style="min-width: 120px">
    <li class="schedule-time">18:40 </li>
    <li class="schedule-time">19:30 </li>
  </ul>
  <ul class="schedule-group">

    <li class="schedule-day">
      <h2 class="schedule-header">Segunda</h2>
    </li>

    <li class="schedule-day">
      <h2 class="schedule-header">Terça</h2>
      <ul class="schedule-events" style="height: 80px">
        <li class="schedule-event office-hours"
            style="top: 0px; height: 80px;">
          <div class="name">Turma 01</div>
          <div class="time">18:40–20:20</div>
          <div class="location">A309</div>
        </li>
      </ul>
    </li>

    <li class="schedule-day">
      <h2 class="schedule-header">Quarta</h2>
    </li>

    <li class="schedule-day">
      <h2 class="schedule-header">Quinta</h2>
      <ul class="schedule-events" style="height: 80px">
        <li class="schedule-event office-hours"
            style="top: 0px; height: 80px;">
          <div class="name">Turma 01</div>
          <div class="time">18:40–20:20</div>
          <div class="location">A309</div>
        </li>
      </ul>
    </li>

    <li class="schedule-day">
      <h2 class="schedule-header">Sexta</h2>
    </li>
  </ul>
</div>

## Recursos

[![discord](https://img.shields.io/badge/discord-canal-7289da?logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/zKm3f83vnY)&nbsp;&nbsp;&nbsp;&nbsp;
[![github](https://img.shields.io/badge/github-repositório-0d74e7?logo=github&logoColor=white&style=for-the-badge)](https://github.com/danilocurvelo-ufrn/imd0030-codes)&nbsp;&nbsp;&nbsp;&nbsp;
[![githubclassroom](https://img.shields.io/badge/GitHub_Classroom-atividades-2dba4e?logo=googleclassroom&logoColor=white&style=for-the-badge)](https://classroom.github.com/classrooms/113917566-imd0030-2024-1)&nbsp;&nbsp;&nbsp;&nbsp;

## Avaliação

O processo de avaliação enste curso é contínuo e envolve diferentes vertentes: atividades práticas em sala de aula e provas escritas. Desta forma, as unidades 1 e 2 deste curso são formadas por 50% de atividades de laboratório desenvolvidas em sala de aula, e os outros 50% compostos pela nota obtida na prova escrita. Lembrando que o aprendizado por meio da prática é altamente recomendado, enfatizando no processo de revisão e reenvio dos trabalhos de programação. Todos os roteiros de laboratório são elaborados em torno de ciclos de *feedback* onde você tenta algo, obtém *feedback* e tenta novamente. Já a prova escrita é necessária para contemplar os requisitos dispostos na [resolução Nº 016/2023-CONSEPE](https://arquivos.info.ufrn.br/arquivos/202319510188f5132967936bb99cbc4964/res0162023-aprova_o_regulamento_da_graduao_da_UFRN._COM_EMENDA_INCORPORADA.pdf), que rege o regulamento dos Cursos de Graduação da Universidade Federal do Rio Grande do Norte - UFRN. Por fim. as notas são baseadas no que você eventualmente aprende por meio desse processo. 

Unidade 1
: **50%**{: .label .label-purple } Atividades práticas de laboratório
: **50%**{: .label .label-purple } Prova escrita

Unidade 2
: **50%**{: .label .label-purple } Atividades práticas de laboratório 
: **50%**{: .label .label-purple } Prova escrita

Unidade 3
: **100%**{: .label .label-purple } Projeto final

## Bibliografia

Os principais recursos bibliográficos para esta disciplina estão disponíveis gratuitamente na Internet:

- [learncpp.com](https://www.learncpp.com)
- [cplusplus.com](https://cplusplus.com)
- [cppreference.com](https://cppreference.com)
- [roadmap.sh/cpp](htpps://roadmap.sh/cpp)


