---
layout: minimal
title: CSE 373
has_children: true
has_toc: true
permalink: /:path/
seo:
  type: Course
  name: Data Structures and Algorithms
---

# {{ site.description }}
{: .mb-2 }
{{ site.tagline }}
{: .fs-6 .fw-300 }

{% assign instructors = site.staffers | where: 'role', 'Instructor' %}
{% for staffer in instructors %}
{{ staffer }}
{% endfor %}

[Husky Maps](https://huskymaps.kevinl.info/) is a web app for mapping the world, searching for places, and navigating around Seattle. All these features are powered by the sociotechnical infrastructure of data structures and algorithms, programming abstractions designed by software engineers to represent data and automate processes. In CSE 143, you learned *how to implement specifications* by writing Java programs that used data structures to solve problems. In CSE 373, you'll learn how to answer the *why* question: *Why did we choose to write the specification that way?*

There are many decisions to make when designing a software system, and many of these decisions have significant consequences on qualities of a system. In this course, we'll focus on learning *data structures* as implementations of *abstract data types*. An abstract data type describes what you can do with a data type, but not how the data type is implemented; a data structure provides both a description of functionality and a specific implementation of functionality. As a cultural idea that took hold in the 1970s, abstraction enabled computer scientists to think of their algorithms less as custom solutions made from scratch and more as templates adapted to address a particular problem.

**Data Structures and Algorithms** presents a selection of these cultural ideas in a way intended to help you design, analyze, and evaluate software systems. Learning these ideas can enable fuller participation in the community of computing professionals. This 10-week course is organized around four 2-week historical case study projects and a final portfolio. By the end of the course, you'll have retraced the history of invention for 4 abstract data types, 12 implementations of them, and 7 real-world problems that they address:

1. **Deque** data structures for browsing history.
1. **Autocomplete** data structures and algorithms for search suggestions and DNA indexing.
1. **Priority queue** data structures for content moderation and shortest paths.
1. **Shortest paths** and graph data structures for seam carving and navigation directions.
1. **Portfolio** assembling all of your work throughout the quarter.

## What will you learn?

{% for module in site.modules %}
{{ module }}
{% endfor %}

## Why should we learn?

The education you receive in this course can help prepare you for programming jobs, but this isn't the only purpose for learning computer science.[^1] Education is not only about yourself and your personal gain, but also about all of us and our capacity to live together as a community.

[^1]: Mark Guzdial. 2021. [Computer science was always supposed to be taught to everyone, and it wasn't about getting a job](https://computinged.wordpress.com/2021/11/26/computer-science-was-always-supposed-to-be-taught-to-everyone-but-not-about-getting-a-job-a-historical-perspective/).

The University of Washington acknowledges the Coast Salish peoples of this land, the land which touches the shared waters of all tribes and bands within the Duwamish, Puyallup, Suquamish, Tulalip and Muckleshoot nations. Among the traditions of the Coast Salish peoples is a value for the connectedness between all living things and a recognition of the unique ways that each of us comes to know something.[^2]

[^2]: Roger Fernandes. 2012. [Roger Fernandes: Artist/Storyteller/Educator](https://youtu.be/O6sS1ZI8dDk).

> Modern education has the idea that we all need to know the same thing. At the end of the lesson, everyone will know the same thing. That's why we have tests, that's why we have quizzes, that's why we have homework: to ensure we all know the same thing. And that's powerful---that's important---within a certain context.
>
> But for native culture, the idea that each listener divines or finds their own answer, their own meaning, their own teaching from the story is equally powerful---that each person needs to be able to look at the world and define it for themselves within their culture and then also find a way to live in that world according to the teachings of their people in their culture.

Our course emphasizes the following values and policies.

We are responsible for each others' success
: Everyone has a right to feel like they belong in this course. We'll need to act with compassion and caring to collaborate with each other. Although we will need more than just unexamined commitments to collaboration, listening, empathy, mindfulness, and caring,[^3] the following guidelines offer a starting point for ensuring compassion toward each other.[^4]

  - Listen with intention to understand first and form an opinion only after you fully understand.
  - Take responsibility for the intended and unintended effects of your words and actions on others.
  - Mindfully respond to others' ideas by acknowledging the unique value of each contribution.

: You should expect and demand to be treated by your classmates and teachers with respect. If any incident occurs that challenges this commitment to a supportive, diverse, inclusive, and equitable environment, please let the instructor know so the issue can be addressed. Should you feel uncomfortable bringing up an issue with the instructor directly, meet our advisors during [quick questions](https://www.cs.washington.edu/academics/ugrad/advising#qqs) or contact the [College of Engineering](https://www.engr.washington.edu/bias).

[^3]: Brian Arao and Kristi Clemens. 2013. "From Safe Spaces to Brave Spaces: A New Way to Frame Dialogue Around Diversity and Social Justice" in *The Art of Effective Facilitation*.

[^4]: Asao B. Inoue. 2019. "Sample Charter for Compassion" in [Labor-Based Grading Contracts: Building Equity and Inclusion in the Compassionate Writing Classroom](https://wac.colostate.edu/books/perspectives/labor/).

We recognize everyone has unique circumstances
: Do not hesitate to contact the instructor by private discussion post or [appointment](https://kevinl.info/meet/). The sooner we are made aware of your circumstances, the more we can help. Extenuating circumstances include work-school balance, familial responsibilities, religious observations, military duties, unexpected travel, or anything else beyond your control that may negatively impact your performance in the class.
: It is the policy and practice of the University of Washington to create inclusive and accessible learning environments consistent with federal and state law. If you have already established accommodations with [Disability Resources for Students](https://depts.washington.edu/uwdrs/) (DRS), activate your accommodations via myDRS so we can discuss how they will be implemented in this course. If you have a temporary health condition or permanent disability that requires accommodations, contact DRS directly to set up an Access Plan.
: Washington state law requires that UW develop a policy for accommodation of student absences or significant hardship due to reasons of faith or conscience, or for organized religious activities. The UW's policy, including more information about how to request an accommodation, is available at [Religious Accommodations Policy](https://registrar.washington.edu/staffandfaculty/religious-accommodations-policy/). Accommodations must be requested within the first two weeks of this course using the [Religious Accommodations Request form](https://registrar.washington.edu/students/religious-accommodations-request/).

We believe everyone wants to learn
: Education is about shaping your identity as much as it is about learning things. In school, the consequences of making mistakes are relatively small. But the habits you form now---repeated over days, weeks, months, or years---determine who you will be in the future. Now is the best time to practice honest habits.
: We ask that you do not claim to be responsible for work that is not yours. When you receive substantial help from someone else, include a citation. Don't request a copy of someone else's work, don't provide your work to another student, and don't post your solutions publicly.
: Academic honesty reflects the trust (or the lack thereof) between students and teachers. We do our best to design the course in ways that ensure trust, but we know our systems are not perfect. If you submit work in violation of these policies but bring it to the attention of the instructor within 72 hours, you may resubmit your own work without further consequence. Rather than blame students, we want to fix or replace broken systems that compel students to lose trust.

## How will you learn?

In a traditional classroom, you attend class while a teacher lectures until time is up. Then, you go home and do the important work of applying concepts toward practice problems or assignments on your own. Finally, you take an exam to show what you know.

Today, we know that there are more effective ways to learn science, engineering, and mathematics.[^5] Think of learning computer science as learning how to ride a bike. Quite a few people know how to ride a bike. But how many of them learned to ride a bike through 50 minutes of lecture three times a week? Probably no one---learning to ride a bike requires riding an actual bike!

[^5]: Scott Freeman, Sarah L. Eddy, Miles McDonough, Michelle K. Smith, Nnadozie Okoroafor, Hannah Jordt, and Mary Pat Wenderoth. 2014. [Active learning increases student performance in science, engineering, and mathematics](https://doi.org/10.1073/pnas.1319030111).

Likewise, learning computer science requires **deliberate practice**: a learning cycle that starts with sustained motivation, then presents tasks that build on prior knowledge, and concludes with immediate, personalized feedback. Each week in the course will involve several different activities that are designed so that we can make the most of our class time together.

1. On your own before class, prepare for learning by completing the **pre-class preparation**.
1. In your team during class and quiz section, collaborate on the **in-class guided practice**.
1. On your own after quiz section, complete the **assessment** and submit an explanation video.
1. In your team throughout the module, apply your learning by collaborating on the **project**.

Expect to spend 4 hours in class and 8 hours outside of class working on this course. Some weeks may require more or less time than other weeks. If you find the workload is significantly exceeding this expectation, talk to your TA.

{% for schedule in site.schedules %}
{{ schedule }}
{% endfor %}

## How is this course graded?

Grading in this course encourages learning through deliberate practice by emphasizing revision and resubmission of work. All coursework is designed around feedback loops where you try something, get feedback, then try again. Grades are based on what you eventually learn through this process. Only the requirements listed under a [Canvas]({{ site.canvas }}) module count toward your final grade.

1.0 or greater
: Completion of all requirements in the **Deques** module.
: Completion of all requirements in the **Autocomplete** module.

2.0 or greater
: Completion of all requirements in the **Deques** module.
: Completion of all requirements in the **Autocomplete** module.
: Completion of all requirements in the **Priority Queues** module.

3.0 or greater
: Completion of all requirements in the **Deques** module.
: Completion of all requirements in the **Autocomplete** module.
: Completion of all requirements in the **Priority Queues** module.
: Completion of all requirements in the **Shortest Paths** module.

4.0
: Completion of all requirements in the **Deques** module.
: Completion of all requirements in the **Autocomplete** module.
: Completion of all requirements in the **Priority Queues** module.
: Completion of all requirements in the **Shortest Paths** module.
: Highest marks across all parts of the **Portfolio**.

{: .note }
> **Evaluating Approaches to Teaching Data Structures and Algorithms**
>
> You are being asked to participate in a research study to find out more about how pedagogical and curricular approaches affect the student experience in an undergraduate Data Structures and Algorithms course. You have been asked to participate in this study because you are a student in a class that is being studied or used as a control. The purpose of this study is to create knowledge that has the potential to improve the educational experience for students at the University of Washington and beyond.
>
> What will you be asked to do?
> : If you agree to be in this study, your data from this class including surveys/evaluations, coursework, course forum discussion, and online learning management system engagement will be included in the analysis. Your participation involves only agreeing to let us use your data in our analysis. You will not be asked to do anything beyond normal educational practice.
>
> What will happen to the information you provide?
> : Data from participants will be retained only for research purposes and stored using codes that provide a degree of confidentiality. Your instructor will not know whether you are participating in this study until after final grades have been posted.
>
> What can you do if you want more information?
> : Talk to the study team. Kevin Lin is the lead researcher at the University of Washington for this study and can be contacted at <kevinl@cs.uw.edu>.
> : Talk to someone else. If you want to talk with someone who is not part of the study team about the study, your rights as a research subject, or to report problems or complaints about the study, contact the UW Human Subjects Division at <hsdinfo@uw.edu> or 206-543-0098.
>
> What are my options for participation?
> : If you consent to participate in this study and are at least 18 years old, no action is needed.
> : Participation in research is voluntary. You may withdraw at any time without penalty.
> : If you decide to withdraw from the research, complete the [online opt-out form](https://docs.google.com/forms/d/e/1FAIpQLSdTOxgmb3JaOeAGqFljO5c6xmxxdniGGfjG352M2zlByka96Q/viewform?usp=sf_link).

## References
