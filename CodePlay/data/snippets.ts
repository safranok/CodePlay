import { Language, CodeSnippet } from '../types';

/**
 * Snippet Library
 * 
 * Organized by Language ID to ensure O(1) lookup and prevent language mixing.
 * Each language key contains an array of relevant snippets.
 */
export const SNIPPETS_LIBRARY: Record<Language, CodeSnippet[]> = {
  [Language.PYTHON]: [
    {
      name: 'Hello World',
      description: 'Basic print statement',
      code: `print("Hello, World!")`
    },
    {
      name: 'For Loop',
      description: 'Iterate through a range',
      code: `for i in range(5):
    print(f"Index: {i}")`
    },
    {
      name: 'Function Definition',
      description: 'Simple function with arguments',
      code: `def greet(name):
    return f"Hello, {name}!"

print(greet("Developer"))`
    },
    {
      name: 'List Comprehension',
      description: 'Create lists concisely',
      code: `squares = [x**2 for x in range(10)]
print(squares)`
    },
    {
      name: 'File Reading',
      description: 'Read a file safely (Mock)',
      code: `with open('example.txt', 'w') as f:
    f.write("Hello File!")

with open('example.txt', 'r') as f:
    content = f.read()
    print(content)`
    },
    {
      name: 'HTTP Request',
      description: 'Using urllib (Standard Lib)',
      code: `import urllib.request

with urllib.request.urlopen('http://www.google.com') as response:
    html = response.read()
    print(f"Status: {response.status}")`
    }
  ],
  [Language.JAVASCRIPT]: [
    {
      name: 'Console Log',
      description: 'Print to console',
      code: `console.log("Hello, World!");`
    },
    {
      name: 'Array Map',
      description: 'Transform array elements',
      code: `const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
console.log(doubled);`
    },
    {
      name: 'Async/Await',
      description: 'Asynchronous function',
      code: `async function fetchData() {
    return "Data loaded";
}

(async () => {
    const data = await fetchData();
    console.log(data);
})();`
    },
    {
      name: 'Object Destructuring',
      description: 'Extract properties',
      code: `const user = { id: 1, name: 'Alice' };
const { name } = user;
console.log(name);`
    },
    {
      name: 'Promise',
      description: 'Basic Promise usage',
      code: `const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Success!"), 1000);
});

myPromise.then((msg) => console.log(msg));`
    }
  ],
  [Language.TYPESCRIPT]: [
    {
      name: 'Interface',
      description: 'Define object shape',
      code: `interface User {
    id: number;
    username: string;
}

const user: User = { id: 1, username: "CodeMaster" };
console.log(user);`
    },
    {
      name: 'Generic Function',
      description: 'Reusable type-safe function',
      code: `function identity<T>(arg: T): T {
    return arg;
}

console.log(identity<string>("Hello"));
console.log(identity<number>(42));`
    },
    {
      name: 'Enum',
      description: 'Define a set of named constants',
      code: `enum Direction {
    Up,
    Down,
    Left,
    Right
}

console.log(Direction.Up); // 0`
    },
    {
      name: 'Class with Access Modifiers',
      description: 'Private/Public members',
      code: `class Car {
    private speed: number = 0;

    public accelerate() {
        this.speed += 10;
    }

    public getSpeed() {
        return this.speed;
    }
}

const c = new Car();
c.accelerate();
console.log(c.getSpeed());`
    }
  ],
  [Language.JAVA]: [
    {
      name: 'Main Class',
      description: 'Standard entry point',
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`
    },
    {
      name: 'ArrayList',
      description: 'Dynamic array usage',
      code: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("Java");
        list.add("Python");
        
        for (String lang : list) {
            System.out.println(lang);
        }
    }
}`
    },
    {
      name: 'HashMap',
      description: 'Key-Value pairs',
      code: `import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("Alice", 30);
        map.put("Bob", 25);
        
        System.out.println(map.get("Alice"));
    }
}`
    },
    {
      name: 'Try-Catch',
      description: 'Exception handling',
      code: `public class Main {
    public static void main(String[] args) {
        try {
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero");
        }
    }
}`
    }
  ],
  [Language.CPP]: [
    {
      name: 'Hello World',
      description: 'Standard I/O',
      code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
    },
    {
      name: 'Vector',
      description: 'Dynamic array',
      code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    for (int n : numbers) {
        std::cout << n << " ";
    }
    return 0;
}`
    },
    {
      name: 'Class',
      description: 'Basic class definition',
      code: `#include <iostream>
#include <string>

class Person {
public:
    std::string name;
    Person(std::string n) : name(n) {}
    void greet() {
        std::cout << "Hi, I'm " << name << std::endl;
    }
};

int main() {
    Person p("Dave");
    p.greet();
    return 0;
}`
    }
  ],
  [Language.GO]: [
    {
      name: 'Hello World',
      description: 'Main package entry',
      code: `package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}`
    },
    {
      name: 'Goroutine',
      description: 'Lightweight thread',
      code: `package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 3; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    go say("world")
    say("hello")
}`
    },
    {
      name: 'Struct & Interface',
      description: 'Data structures',
      code: `package main

import "fmt"

type Geometry interface {
    area() float64
}

type Rect struct {
    width, height float64
}

func (r Rect) area() float64 {
    return r.width * r.height
}

func main() {
    r := Rect{width: 3, height: 4}
    fmt.Println("Area:", r.area())
}`
    }
  ],
  [Language.PHP]: [
    {
      name: 'Echo',
      description: 'Print output',
      code: `<?php
echo "Hello, PHP!";
?>`
    },
    {
      name: 'Associative Array',
      description: 'Key-value array',
      code: `<?php
$ages = array("Peter"=>35, "Ben"=>37, "Joe"=>43);

foreach($ages as $x => $val) {
  echo "$x = $val\n";
}
?>`
    },
    {
      name: 'Class',
      description: 'OOP in PHP',
      code: `<?php
class Fruit {
  public $name;
  function __construct($name) {
    $this->name = $name;
  }
  function get_name() {
    return $this->name;
  }
}

$apple = new Fruit("Apple");
echo $apple->get_name();
?>`
    }
  ],
  [Language.HTML]: [
    {
      name: 'Basic Structure',
      description: 'HTML5 Boilerplate',
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`
    },
    {
      name: 'Form',
      description: 'Input form with button',
      code: `<form onsubmit="alert('Submitted!'); return false;">
  <label for="fname">First name:</label><br>
  <input type="text" id="fname" name="fname" value="John"><br>
  <label for="lname">Last name:</label><br>
  <input type="text" id="lname" name="lname" value="Doe"><br><br>
  <input type="submit" value="Submit">
</form>`
    },
    {
      name: 'Table',
      description: 'Data table',
      code: `<style>
table, th, td { border: 1px solid black; border-collapse: collapse; padding: 5px; }
</style>
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>Jill</td>
    <td>50</td>
  </tr>
  <tr>
    <td>Eve</td>
    <td>94</td>
  </tr>
</table>`
    },
    {
      name: 'Button & Script',
      description: 'Interactive button',
      code: `<button onclick="changeColor()">Click Me</button>
<p id="demo">I will change color.</p>

<script>
function changeColor() {
  const p = document.getElementById("demo");
  p.style.color = p.style.color === 'red' ? 'black' : 'red';
}
</script>`
    }
  ]
};