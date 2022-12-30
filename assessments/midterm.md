---
layout: minimal
title: Midterm
description: &desc Individual interview questions.
summary: *desc
parent: Assessments
grand_parent: CSE 373
chance: yes
---

# {{ page.title }}
{: .no_toc .mb-2 }

{{ page.description }}
{: .fs-6 .fw-300 }

<input id="email" type="email" size="15" placeholder="email@uw.edu" class="text-beta p-2 mb-2" />

{: .note .d-none }
> Describe 3 approaches to design a data type that can:
>
> 1. Add words.
> 1. Return a list of all the unique words in alphabetical order.
> 1. Return the number of times a given word has been added.
>
> Give a worst-case asymptotic analysis for all methods where _N_ is the total number of words. If helpful, you can choose your own variable to describe the number of unique words.

{: .note .d-none }
> Describe 3 approaches to design a data type that can:
>
> 1. Add "observed" words.
> 1. Add "known" words.
> 1. Return how many "observed" words are present in "known".
>
> Give a worst-case asymptotic analysis for all methods where _N_ is the number of "observed" words and MM is the number of "known" words.

{: .note .d-none }
> Describe 3 approaches to design a data type that can:
>
> 1. Add user reviews, where a user review has a name, a date, and a rating.
> 1. Return the reviews that fall between a given start and end date range.
> 1. Return the reviews by a given name.
>
> Give a worst-case asymptotic analysis for all methods where _N_ is the total number of reviews and _M_ is the number of reviews returned by the date range query.

{: .note .d-none }
> Describe 3 approaches to design a data type that can:
>
> 1. Add numbers.
> 1. Return the value that is closest to the median of all added values.
> 1. Remove the value that is closest to the median of all added values.
>
> Give a worst-case asymptotic analysis for all methods where _N_ is the size of the data type.

{: .note .d-none }
> Describe 3 approaches to design a data type that can:
>
> 1. Add places, where a place consists of an (_x_, _y_) coordinate pair.
> 1. Return the closest place to a given _x_ coordinate.
> 1. Return the closest place to a given _y_ coordinate.
>
> Give a worst-case asymptotic analysis for all methods where _N_ is the size of the data type.

{: .note .d-none }
> Describe 3 approaches to design a data type that can:
>
> 1. Add numbers.
> 1. Remove the minimum number.
> 1. Remove the maximum number.
>
> Give a worst-case asymptotic analysis for all methods where _N_ is the size of the data type.

{: .note .d-none }
> Describe 3 approaches to design a data type that can:
>
> 1. Add an element to the front (index 0), which increases the index of every other element.
> 1. Return the element at index _i_.
> 1. Promote the element at index _i_ to index 0.
>
> Give a worst-case asymptotic analysis for all methods where _N_ is the size of the data type.

{: .note .d-none }
> Describe 3 approaches to design a data type that can:
>
> 1. Add words.
> 1. Return the most frequent word.
> 1. Return the most frequent word of given length _k_.
>
> Give a worst-case asymptotic analysis for all methods where _N_ is the size of the data type.

{: .note .d-none }
> Describe 3 approaches to design a data type that can:
>
> 1. Add a post written by a given user.
> 1. Undo the last post written by a given user.
> 1. Return a list of all posts written by a given user in the order that they were added.
>
> Give a worst-case asymptotic analysis for all methods where _N_ is the number of posts and MM is the number of users.

{: .note .d-none }
> Describe 3 approaches to design a data type that can:
>
> 1. Cast a vote for a candidate.
> 1. Return the number of votes for a given candidate.
> 1. Return the candidate with the greatest number of votes.
>
> Give a worst-case asymptotic analysis for all methods where _N_ is the number of votes and MM is the number of candidates.

<script>
const email = document.getElementById("email");
const notes = document.getElementsByClassName("note");

email.addEventListener("input", event => {
    const seed = event.target.value.trim().toLowerCase();
    if (seed.endsWith("@uw.edu")) {
        document.title = document.title.replace("|", ` for ${seed} |`);
        const url = new URL(window.location);
        url.searchParams.set("email", seed);
        window.history.pushState(null, "", url.toString());
        for (const note of notes) {
            note.classList.add("d-none");
        };
        const chance = new Chance(seed);
        const shuffled = chance.shuffle(notes);
        for (const note of shuffled.slice(0, 3).sort((x, y) => x - y)) {
            note.classList.remove("d-none");
        };
    };
});

(new URL(window.location)).searchParams.forEach((val, key) => {
    const field = document.getElementById(key);
    field.value = val;
    field.dispatchEvent(new Event("input"));
});
</script>
