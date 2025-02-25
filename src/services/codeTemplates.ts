import { languages } from 'prismjs';

export interface CodeTemplate {
  name: string;
  description: string;
  code: string;
}

export const codeTemplates: Record<string, CodeTemplate[]> = {
  javascript: [
    {
      name: 'Basic Function',
      description: 'A simple JavaScript function template',
      code: `function main() {
  // Your code here
  console.log("Hello from JavaScript!");
}

main();`
    },
    {
      name: 'Class Template',
      description: 'Object-oriented class template',
      code: `class MyClass {
  constructor() {
    this.value = 0;
  }

  increment() {
    this.value++;
    return this.value;
  }
}

const instance = new MyClass();
console.log(instance.increment());`
    },
    {
      name: 'Async Function',
      description: 'Asynchronous function template',
      code: `async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData();`
    }
  ],
  typescript: [
    {
      name: 'Interface',
      description: 'TypeScript interface template',
      code: `interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

function createUser(user: User): void {
  console.log('Created user:', user);
}

const newUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};

createUser(newUser);`
    },
    {
      name: 'Generic Class',
      description: 'Generic class template',
      code: `class Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}

const numberContainer = new Container<number>(42);
console.log(numberContainer.getValue());`
    }
  ],
  python: [
    {
      name: 'Basic Script',
      description: 'Simple Python script template',
      code: `def main():
    print("Hello from Python!")
    numbers = [1, 2, 3, 4, 5]
    total = sum(numbers)
    print(f"Sum: {total}")

if __name__ == "__main__":
    main()`
    },
    {
      name: 'Class Definition',
      description: 'Python class template',
      code: `class Person:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age
    
    def greet(self) -> str:
        return f"Hello, my name is {self.name}"

person = Person("Alice", 30)
print(person.greet())`
    }
  ],
  java: [
    {
      name: 'Main Class',
      description: 'Java main class template',
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        
        System.out.println("Sum: " + sum);
    }
}`
    },
    {
      name: 'Interface Implementation',
      description: 'Java interface template',
      code: `interface Animal {
    void makeSound();
}

public class Dog implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Woof!");
    }

    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.makeSound();
    }
}`
    }
  ],
  cpp: [
    {
      name: 'Basic Program',
      description: 'C++ program template',
      code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++!" << endl;
    
    int numbers[] = {1, 2, 3, 4, 5};
    int sum = 0;
    
    for (int num : numbers) {
        sum += num;
    }
    
    cout << "Sum: " << sum << endl;
    return 0;
}`
    },
    {
      name: 'Class Template',
      description: 'C++ class template',
      code: `#include <iostream>
using namespace std;

class Rectangle {
private:
    int width, height;
    
public:
    Rectangle(int w, int h) : width(w), height(h) {}
    
    int area() {
        return width * height;
    }
};

int main() {
    Rectangle rect(5, 3);
    cout << "Area: " << rect.area() << endl;
    return 0;
}`
    }
  ]
};

export function getTemplateForLanguage(language: string): CodeTemplate[] {
  return codeTemplates[language] || codeTemplates.javascript;
}