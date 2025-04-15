---
title: 'unique across time and space: uuids'
tags: ['uuid', 'rfc 4122']
date: 2025-03-31
---

Questions to answer in this blog:

- what are uuids? They are unique identifiers.

  - They can be used in software systems to uniquely identify entitites.
  - 36 string characters and 128 bits
  - There are 5 versions of UUID + 1 common unofficial one
    - Version of UUID

- What is the uuid algorithm? Don't know this. LEARN
- Who made them?
- Why does the uuid algorithm work?
- What are some alternatives unique identifiers?
- What is the algorithm to generate uuids?
- Can I show this in pseudocode?

UUID format
time-low "-" time-mid "-" time-high-and-version "-" (clock-seq-and-reserved + clock-seq-low) "-" node

time-low = 32 bits = 4hexOctets
time-mid = 16bits = 2hexOctets
time-high-and-version = 16bits = 2hexOctets
clock-seq-and-reserved = 8bits = hexOctet
clock-seq-low = 8bits = hexOctet
node = 48bits = 6hexOctet

hexOctet = hexDigit + hexDigit

## RFC 4122
