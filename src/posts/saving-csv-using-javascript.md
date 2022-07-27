---
layout: 'layouts/Blog.astro'
title: Saving CSV using JavaScript
description: Save a CSV data file using just JavaScript
date: 2016-12-17
tags:
  - tricks
  - javascript
---

There might be cases, when you have some data at front-end (via AJAX call , etc.) and you need to create a file for users to download it. [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) is simple format to store tabular data in plain text.

Here we will take a look at saving some data directly from browser. The steps are very simple:

1.  Convert data into CSV Format.
2.  Add Headers to the data (optional).
3.  Create a hidden link element and trigger a click on it.

## Convert data in CSV Format

There are certain guidelines that a CSV file needs to follow as specified in [RFC4180](https://tools.ietf.org/html/rfc4180), but to keep things simple, we will follow these rules:

1.  The fields must be separated by `,` (comma).
    ```
    1,Timothy,Hamilton,Male,146.205.212.14
    ```
2.  The fileds can contain any letters and numbers but no quotes and commas.
    ```
    3,Terry,Vasquez,Male,119.83.126.89 // Correct
    3,Terry,"Vas'qu,ez",Male,119.83.126.89 // This is also correct CSV,
                                           // but the example code may not work
                                           // with such data
    ```
3.  Each line must end with with a line-break expect the last line
    ```
    1,Timothy,Hamilton,Male,146.205.212.14 \n
    2,Jose,Parker,Male,93.159.55.174
    ```
4.  The last field in a line must no be followed by a comma.
    ```
    3,Terry,Vasquez,Male,119.83.126.89, // Wrong
    3,Terry,Vasquez,Male,119.83.126.89  // Correct
    ```

Keeping this basic rules in mind, lets begin:

```javascript
const data = [
	[1, 'Timothy', 'Hamilton', 'Male', '146.205.212.14'],
	[2, 'Jose', 'Parker', 'Male', '93.159.55.174'],
	[3, 'Terry', 'Vasquez', 'Male', '119.83.126.89'],
	[4, 'Ruby', 'Rose', 'Female', '124.60.220.96'],
	[5, 'Lawrence', 'Henderson', 'Male', '208.165.238.89'],
	[6, 'Jeffrey', 'Campbell', 'Male', '235.159.156.1'],
	[7, 'Jack', 'Torres', 'Male', '220.147.205.219'],
	[8, 'Rachel', 'Stanley', 'Female', '186.17.24.36'],
	[9, 'Gregory', 'Pierce', 'Male', '241.176.82.141'],
	[10, 'Ronald', 'Hanson', 'Male', '70.93.233.186'],
];

let csvData = '';

data.forEach((row) => {
	csvData += '\n';
	csvData += row.reduce((prev, col) => `${prev},${col}`, '').slice(1);
});
```

## Add Headers to data

If you have headers for your data, you can add them. They must follow the same rules as the data.

```javascript
csvData = 'id,first_name,last_name,gender,ip_address' + csvData;
```

## Create Hidden Link

Now it's time to create a link/button to down load the CSV File

```javascript
const hiddenElement = document.createElement('a');

hiddenElement.href = `data:text/csv;charset=utf-8,${encodeURI(csvData)}`;
hiddenElement.target = '_blank';
hiddenElement.download = 'download.csv';
document.body.appendChild(hiddenElement);
hiddenElement.click();
hiddenElement.remove();
```

## The Final Result

Sample code from JSFiddle.

<iframe width="100%" height="300" src="//jsfiddle.net/vkbansal/ut7ezovv/embedded/js,html,result/dark/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
