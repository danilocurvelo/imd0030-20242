---
title: &title Hash Tables
description: *title
summary: *title
redirect_to: &redirect https://docs.google.com/presentation/d/1VrPPPZFVozBjAsPBGb5BiCL6MY2nh6yvQJtJOhHdOnQ/edit?usp=sharing
canonical_url: *redirect
---

Label each step in this diagram and explain how the contains method works.
Contains method
1
11
3
1
2
3

hashCode contract
The hashCode documentation notes 3 properties of good hash functions: consistency, equality, and distribution.
Dog d1 = new Dog("Temmie", 5);Dog d2 = new Dog("Temmie", 5);
Will this code work if d1 and d2 are equal but have different hash codes?
HashSet<Dog> dogs = new HashSet<>();dogs.add(d1);System.out.println(dogs.contains(d1));System.out.println(dogs.contains(d2));

2

Mutable keys
Draw the hash table that results from running this code. Assume HashMap is a separate chaining hash table with 4 buckets and never resizes. Husky.equals checks that the names are equal. Husky.hashCode returns the length of the name.
HashMap<Husky, Integer> map = new HashMap<>();
Husky a = new Husky("lilli");
Husky b = new Husky("ahmed");
map.put(a, 1);
map.put(b, 2);
a.name += a.name;
map.put(a, 3);
map.put(b, 4);
b.name += b.name;
map.put(b, 5);
System.out.println(map.size());                       // 4
System.out.println(map.get(new Husky("lilli")));      // null
System.out.println(map.get(new Husky("lillililli"))); // 3
3

Equals and HashCode
ArrayList.equals checks that both lists’ items are equal. ArrayList.hashCode iteratively combines all the item hash codes, just like hashing each char in a string.
Explain why expert programmers would feel concerned about this data type:
HashSet<ArrayList<String>>
4

5-bucket HashSet
Complete the diagram to show a HashSet with 5 buckets after adding the values 20, 2, 10, 4, 105, 102, 38. Assume the integer hash code returns its numeric value.
5
20
2

10-bucket HashSet
6
20
2
