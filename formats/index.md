---
layout: default
---

# Open Data Formats

## Comma-Separated Values (CSV)
CSVs (and Tab Separated Values - TSVs) are plain-text, representing simple tables of information, comprised of rows and columns. 

### Pros
* Probably the most accessible open format. Anyone with basic spreadsheet tools (Microsoft Excel, Apple Numbers, Google Sheets, etc) can open CSVs and work with the data.
* There are many, many software libraries in almost all modern programming languages for working with this format.
* In terms of size, it is one of the more effective formats for transmitting large amounts of data, especially when compression is applied.

### Cons
* They are not well-suited for representing multiple sets of data and showing relationships between them (no built-in support for nested data structures).
* While they might differentiate between strings and numbers fairly well, CSVs do not provide a mechanism for knowing if a given value is a date/time, boolean, or other type of data 
* It cannot apply any rules for data consistency, such as requiring a data value to be only one of a specific list.
* The characters which are used for separators (usually commas) and data value encapsulation (usually double-quotation marks) commonly appear in data values, which therefore requires special handling. This handling is often done inconsistently across different software components which output the format, as well as those that read it.
* It is not especially human-readable.

## JavaScript Object Notation (JSON)
JSON is an open standard format that uses human-readable text to transmit data objects consisting of attribute–value pairs. It is used primarily to transmit data between a server and web application, as an alternative to XML.

### Pros
* It is a data format which is widely and consistently supported, particularly across a variety of web browsers and browser versions. 
* Most modern programming languages have libraries to produce and consume it.
* Well suited for nested data structures. This allows data to be represented heirarchically, which can also substitute for truly relational data.
* Standardized rules for how numbers, strings, booleans, nested data objects, and others (excluding dates/times) are represented aids data consistency.
* Special handling for single and double-quote characters (which also serve as wrappers for string values) are well-documented and consistently applied between different software libraries.
* It is relatively human-readable.

### Cons
* JSON is generally not usable by tools familiar to average computer users, though its popularity is increasing. Its flexibility in nesting data structures limits how much common tools will be able to gain from it.
* It cannot apply any rules for data consistency (unless used with JSON schema), such as requiring an array of objects to conform to a specific structure.
* In terms of size, it is not particularly efficient or compact. However, because it is plain text, it can be compressed quite well.

## eXtensible Markup Language (XML)

### Pros
* It is a data format which is widely used and consistently supported, particularly in machine-to-machine communications.
* Most modern programming languages have libaries to produce and consume it.
* It is well-suited for nested data structures, allowing data to be represented hierarchically. It can also represent relational data, though support for this in software products varies considerably.

### Cons
* Compared to JSON, XML is slightly more usable by tools familiar to average computer users. However, its flexibility in nesting data structures limits how much common tools will be able to gain from it.
* Although intended to be human readable, it generally isn't.
* XML supports element attributes and element values, permitting inconsistency in how data is transmitted.
* XML does not (unless used in conjunction with an XML Schema Definition) provide the ability to determine the type of data based upon the way its value is represented.
* The characters which are used for element tags (usually less than and greater than symbols) may appear in data values, which therefore requires special handling. However, because this handling is part of a published standard, it is consistently applied across all software libraries that can read and write XML.
* In terms of size, it is not efficient or compact. However, because it is plain text, it can be compressed quite well.
