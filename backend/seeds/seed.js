const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const CodeChallenge = require('../models/CodeChallenge');
const Submission = require('../models/Submission');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quiz-system';
console.log('Using MONGO_URI:', MONGO_URI);

// === Sample Data ===

const sampleQuestions = [
    // === JAVASCRIPT QUESTIONS ===
    {
        programmingLanguage: 'JavaScript',
        difficulty: 'easy',
        questionText: 'What is the output of typeof null?',
        options: ['"null"', '"object"', '"undefined"', '"number"'],
        correctAnswer: '"object"'
    },
    {
        programmingLanguage: 'JavaScript',
        difficulty: 'easy',
        questionText: 'Which method adds an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 'push()'
    },
    {
        programmingLanguage: 'JavaScript',
        difficulty: 'easy',
        questionText: 'How do you declare a constant variable in JavaScript?',
        options: ['var', 'let', 'const', 'final'],
        correctAnswer: 'const'
    },
    // JS Medium
    {
        programmingLanguage: 'JavaScript',
        difficulty: 'medium',
        questionText: 'What is the result of 2 + "2" in JavaScript?',
        options: ['4', '"22"', 'NaN', 'Error'],
        correctAnswer: '"22"'
    },
    {
        programmingLanguage: 'JavaScript',
        difficulty: 'medium',
        questionText: 'Which keyword is used to handle exceptions?',
        options: ['try...catch', 'if...else', 'do...while', 'for...in'],
        correctAnswer: 'try...catch'
    },
    {
        programmingLanguage: 'JavaScript',
        difficulty: 'medium',
        questionText: 'What does JSON.stringify() do?',
        options: ['Parses JSON to object', 'Converts object to JSON string', 'Formats JSON', 'Minifies JSON'],
        correctAnswer: 'Converts object to JSON string'
    },
    // JS Hard
    {
        programmingLanguage: 'JavaScript',
        difficulty: 'hard',
        questionText: 'What is a closure in JavaScript?',
        options: ['A function inside another function accessing outer variables', 'A block of code', 'A database connection', 'A CSS property'],
        correctAnswer: 'A function inside another function accessing outer variables'
    },
    {
        programmingLanguage: 'JavaScript',
        difficulty: 'hard',
        questionText: 'What is the event loop?',
        options: ['A looping structure like for', 'Handles asynchronous callbacks', 'A continuous network request', 'A recursive function'],
        correctAnswer: 'Handles asynchronous callbacks'
    },
    {
        programmingLanguage: 'JavaScript',
        difficulty: 'hard',
        questionText: 'What is the difference between == and ===?',
        options: ['No difference', '=== checks value and type', '== checks type only', '=== is slower'],
        correctAnswer: '=== checks value and type'
    },

    // === PYTHON QUESTIONS ===
    {
        programmingLanguage: 'Python',
        difficulty: 'easy',
        questionText: 'How do you print output in Python?',
        options: ['console.log()', 'print()', 'echo', 'System.out.println()'],
        correctAnswer: 'print()'
    },
    {
        programmingLanguage: 'Python',
        difficulty: 'easy',
        questionText: 'Which symbol is used for comments in Python?',
        options: ['//', '#', '/*', '--'],
        correctAnswer: '#'
    },
    {
        programmingLanguage: 'Python',
        difficulty: 'easy',
        questionText: 'How do you create a function in Python?',
        options: ['function myFunc()', 'def myFunc():', 'void myFunc()', 'create myFunc()'],
        correctAnswer: 'def myFunc():'
    },
    // Python Medium
    {
        programmingLanguage: 'Python',
        difficulty: 'medium',
        questionText: 'What does the __init__ method do in a Python class?',
        options: ['Destroys the object', 'Initializes the object', 'Copies the object', 'Prints the object'],
        correctAnswer: 'Initializes the object'
    },
    {
        programmingLanguage: 'Python',
        difficulty: 'medium',
        questionText: 'What is the time complexity of searching in a Python dictionary?',
        options: ['O(n)', 'O(log n)', 'O(1) average', 'O(n^2)'],
        correctAnswer: 'O(1) average'
    },
    {
        programmingLanguage: 'Python',
        difficulty: 'hard',
        questionText: 'What is the output of [x*2 for x in range(3)]?',
        options: ['[0, 1, 2]', '[2, 4, 6]', '[0, 2, 4]', '[1, 2, 3]'],
        correctAnswer: '[0, 2, 4]'
    },
    {
        programmingLanguage: 'Python',
        difficulty: 'hard',
        questionText: 'Which statement about Python generators is TRUE?',
        options: ['They store all values in memory', 'They use yield keyword', 'They cannot be iterated', 'They are faster than lists for random access'],
        correctAnswer: 'They use yield keyword'
    },

    // === C QUESTIONS ===
    {
        programmingLanguage: 'C',
        difficulty: 'easy',
        questionText: 'Which header file is required for printf() function?',
        options: ['stdlib.h', 'stdio.h', 'string.h', 'math.h'],
        correctAnswer: 'stdio.h'
    },
    {
        programmingLanguage: 'C',
        difficulty: 'easy',
        questionText: 'What is the size of int data type in C (on most systems)?',
        options: ['2 bytes', '4 bytes', '8 bytes', '1 byte'],
        correctAnswer: '4 bytes'
    },
    {
        programmingLanguage: 'C',
        difficulty: 'easy',
        questionText: 'Which operator is used to access the address of a variable?',
        options: ['*', '&', '#', '@'],
        correctAnswer: '&'
    },
    // C Medium
    {
        programmingLanguage: 'C',
        difficulty: 'medium',
        questionText: 'What does malloc() return if memory allocation fails?',
        options: ['0', '-1', 'NULL', 'Error'],
        correctAnswer: 'NULL'
    },
    {
        programmingLanguage: 'C',
        difficulty: 'medium',
        questionText: 'What is the output of printf("%d", sizeof(char));?',
        options: ['0', '1', '2', '4'],
        correctAnswer: '1'
    },
    {
        programmingLanguage: 'C',
        difficulty: 'medium',
        questionText: 'Which keyword is used to prevent modification of a variable?',
        options: ['static', 'const', 'volatile', 'extern'],
        correctAnswer: 'const'
    },
    // C Hard
    {
        programmingLanguage: 'C',
        difficulty: 'hard',
        questionText: 'What is the difference between char *p and char p[]?',
        options: ['No difference', 'p[] is read-only', '*p is read-only for string literals', 'They have different sizes'],
        correctAnswer: '*p is read-only for string literals'
    },
    {
        programmingLanguage: 'C',
        difficulty: 'hard',
        questionText: 'What does the volatile keyword indicate?',
        options: ['Variable is constant', 'Variable may change unexpectedly', 'Variable is thread-safe', 'Variable is local'],
        correctAnswer: 'Variable may change unexpectedly'
    },
    {
        programmingLanguage: 'C',
        difficulty: 'hard',
        questionText: 'What is a dangling pointer?',
        options: ['Pointer to NULL', 'Pointer to freed memory', 'Pointer to static memory', 'Uninitialized pointer'],
        correctAnswer: 'Pointer to freed memory'
    },

    // === C++ QUESTIONS ===
    {
        programmingLanguage: 'C++',
        difficulty: 'easy',
        questionText: 'Which operator is used for output in C++?',
        options: ['>>', '<<', '->', '::'],
        correctAnswer: '<<'
    },
    {
        programmingLanguage: 'C++',
        difficulty: 'easy',
        questionText: 'What is the correct way to declare a reference in C++?',
        options: ['int *ref = &x', 'int &ref = x', 'int ref = &x', 'int @ref = x'],
        correctAnswer: 'int &ref = x'
    },
    {
        programmingLanguage: 'C++',
        difficulty: 'easy',
        questionText: 'Which keyword is used to create a class in C++?',
        options: ['struct', 'class', 'object', 'type'],
        correctAnswer: 'class'
    },
    // C++ Medium
    {
        programmingLanguage: 'C++',
        difficulty: 'medium',
        questionText: 'What is function overloading?',
        options: ['Redefining a function', 'Same name, different parameters', 'Calling function recursively', 'Inline functions'],
        correctAnswer: 'Same name, different parameters'
    },
    {
        programmingLanguage: 'C++',
        difficulty: 'medium',
        questionText: 'What is the default access specifier for class members?',
        options: ['public', 'private', 'protected', 'friend'],
        correctAnswer: 'private'
    },
    {
        programmingLanguage: 'C++',
        difficulty: 'medium',
        questionText: 'Which STL container provides O(1) access by index?',
        options: ['list', 'set', 'vector', 'map'],
        correctAnswer: 'vector'
    },
    // C++ Hard
    {
        programmingLanguage: 'C++',
        difficulty: 'hard',
        questionText: 'What is the diamond problem in C++?',
        options: ['Memory leak issue', 'Multiple inheritance ambiguity', 'Pointer dereferencing error', 'Template compilation error'],
        correctAnswer: 'Multiple inheritance ambiguity'
    },
    {
        programmingLanguage: 'C++',
        difficulty: 'hard',
        questionText: 'What does the virtual keyword do in C++?',
        options: ['Makes function inline', 'Enables runtime polymorphism', 'Makes function static', 'Prevents inheritance'],
        correctAnswer: 'Enables runtime polymorphism'
    },
    {
        programmingLanguage: 'C++',
        difficulty: 'hard',
        questionText: 'What is RAII in C++?',
        options: ['Runtime Array Index Initialization', 'Resource Acquisition Is Initialization', 'Random Access Iterator Interface', 'Reference And Instance Injection'],
        correctAnswer: 'Resource Acquisition Is Initialization'
    },

    // === JAVA QUESTIONS ===
    {
        programmingLanguage: 'Java',
        difficulty: 'easy',
        questionText: 'Which keyword is used to create an object in Java?',
        options: ['create', 'new', 'object', 'instance'],
        correctAnswer: 'new'
    },
    {
        programmingLanguage: 'Java',
        difficulty: 'easy',
        questionText: 'What is the entry point method in a Java program?',
        options: ['start()', 'run()', 'main()', 'init()'],
        correctAnswer: 'main()'
    },
    {
        programmingLanguage: 'Java',
        difficulty: 'easy',
        questionText: 'Which data type is used for storing text in Java?',
        options: ['char', 'text', 'String', 'varchar'],
        correctAnswer: 'String'
    },
    // Java Medium
    {
        programmingLanguage: 'Java',
        difficulty: 'medium',
        questionText: 'What is the difference between == and .equals() for Strings?',
        options: ['No difference', '== compares references, .equals() compares content', '== is faster', '.equals() is deprecated'],
        correctAnswer: '== compares references, .equals() compares content'
    },
    {
        programmingLanguage: 'Java',
        difficulty: 'medium',
        questionText: 'What is an interface in Java?',
        options: ['A type of class', 'Contract for methods', 'A variable type', 'A loop structure'],
        correctAnswer: 'Contract for methods'
    },
    {
        programmingLanguage: 'Java',
        difficulty: 'medium',
        questionText: 'Which collection allows duplicate elements?',
        options: ['Set', 'List', 'Map keys', 'HashSet'],
        correctAnswer: 'List'
    },
    // Java Hard
    {
        programmingLanguage: 'Java',
        difficulty: 'hard',
        questionText: 'What is the purpose of the transient keyword?',
        options: ['Thread safety', 'Prevent serialization of a field', 'Make field constant', 'Allow null values'],
        correctAnswer: 'Prevent serialization of a field'
    },
    {
        programmingLanguage: 'Java',
        difficulty: 'hard',
        questionText: 'What is a lambda expression in Java?',
        options: ['A type of loop', 'Anonymous function', 'Error handling mechanism', 'Thread creation method'],
        correctAnswer: 'Anonymous function'
    },
    {
        programmingLanguage: 'Java',
        difficulty: 'hard',
        questionText: 'What does the volatile keyword guarantee in Java?',
        options: ['Thread synchronization', 'Visibility of changes across threads', 'Atomicity of operations', 'Immutability of variable'],
        correctAnswer: 'Visibility of changes across threads'
    }
];

// === Code Challenges (Dynamic STDIN/STDOUT) ===
const codeChallenges = [
    // --- JAVA ---
    // Code 1: Pass/Fail
    {
        title: "Code 1 - Pass/Fail Check",
        description: "Write a program that reads an integer `marks` and prints \"Pass\" if marks > 50, otherwise \"Fail\".",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int marks = sc.nextInt();
            if (marks > 50) {
                System.out.print("Pass");
            else { 
                System.out.print("Fail");
            }
        }
    }
}`,
        solutionCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int marks = sc.nextInt();
            if (marks > 50) {
                System.out.print("Pass");
            } else {
                System.out.print("Fail");
            }
        }
    }
}`,
        testCases: [{ input: "85", expectedOutput: "Pass" }, { input: "51", expectedOutput: "Pass" }, { input: "50", expectedOutput: "Fail" }, { input: "30", expectedOutput: "Fail" }],
        points: 100
    },
    // Code 2: Calculator
    {
        title: "Code 2 - Calculator",
        description: "Read two integers integers (a, b) and print their sum.",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `import java.util.Scanner;
class Calculator {
    static int add(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int result = add(a, b);
        System.out.print(result) 
    }
}`,
        solutionCode: `import java.util.Scanner;
class Calculator {
    static int add(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
             int a = sc.nextInt();
             int b = sc.nextInt();
             int result = add(a, b);
             System.out.print(result);
        }
    }
}`,
        testCases: [{ input: "10 20", expectedOutput: "30" }, { input: "0 5", expectedOutput: "5" }],
        points: 100
    },
    // Code 3: Main Method
    {
        title: "Code 3 - Main Method",
        description: "Fix the main method signature to print \"Java Debugging\".",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `public class Sample {
    public static void main(String args) { 
        System.out.print("Java Debugging");
    }
}`,
        solutionCode: `public class Sample {
    public static void main(String[] args) {
        System.out.print("Java Debugging");
    }
}`,
        testCases: [{ input: "", expectedOutput: "Java Debugging" }],
        points: 100
    },
    // Code 4: Even/Odd
    {
        title: "Code 4 - Even/Odd",
        description: "Read an integer and print \"Even\" or \"Odd\".",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `import java.util.Scanner;
class EvenOdd {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int number = sc.nextInt();
        if(number % 2 == 1) { 
            System.out.print("Even");
        } else {
            System.out.print("Odd");
        }
    }
}`,
        solutionCode: `import java.util.Scanner;
class EvenOdd {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int number = sc.nextInt();
            if(number % 2 == 0) {
                System.out.print("Even");
            } else {
                System.out.print("Odd");
            }
        }
    }
}`,
        testCases: [{ input: "7", expectedOutput: "Odd" }, { input: "10", expectedOutput: "Even" }],
        points: 100
    },
    // Code 5: Average
    {
        title: "Code 5 - Average Calculation",
        description: "Read 3 integers and print their average rounded down.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `import java.util.Scanner;
class Average {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        int avg = a + b + c / 3; 
        System.out.print("Average = " + avg);
    }
}`,
        solutionCode: `import java.util.Scanner;
class Average {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            int c = sc.nextInt();
            int avg = (a + b + c) / 3;
            System.out.print("Average = " + avg);
        }
    }
}`,
        testCases: [{ input: "10 20 30", expectedOutput: "Average = 20" }],
        points: 150
    },
    // Code 6: Factorial
    {
        title: "Code 6 - Factorial",
        description: "Read an integer n and print its factorial.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `import java.util.Scanner;
class Factorial {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int fact = 0;
        for(int i = 1; i <= n; i++) {
            fact = fact * i;
        }
        System.out.print(fact);
    }
}`,
        solutionCode: `import java.util.Scanner;
class Factorial {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int n = sc.nextInt();
            int fact = 1;
            for(int i = 1; i <= n; i++) {
                fact = fact * i;
            }
            System.out.print(fact);
        }
    }
}`,
        testCases: [{ input: "5", expectedOutput: "120" }, { input: "3", expectedOutput: "6" }],
        points: 150
    },
    // Code 7: Array Sum
    {
        title: "Code 7 - Array Sum",
        description: "Read integer N, then N integers. Print the sum.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `import java.util.Scanner;
class ArraySum {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for(int i=0; i<n; i++) arr[i] = sc.nextInt();
        int sum = 0;
        for(int i = 0; i <= arr.length; i++) { 
            sum += arr[i];
        }
        System.out.print(sum);
    }
}`,
        solutionCode: `import java.util.Scanner;
class ArraySum {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int n = sc.nextInt();
            int[] arr = new int[n];
            for(int i=0; i<n; i++) arr[i] = sc.nextInt();
            int sum = 0;
            for(int i = 0; i < arr.length; i++) {
                sum += arr[i];
            }
            System.out.print(sum);
        }
    }
}`,
        testCases: [{ input: "4 2 4 6 8", expectedOutput: "20" }],
        points: 150
    },
    // Code 8: Result
    {
        title: "Code 8 - Result Classification",
        description: "Read marks. >60: First Class, >40: Pass, else Fail.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `import java.util.Scanner;
class Result {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int marks = sc.nextInt();
        if(marks > 40) { 
            System.out.print("Pass");
        } else if(marks > 60) {
            System.out.print("First Class");
        } else {
            System.out.print("Fail");
        }
    }
}`,
        solutionCode: `import java.util.Scanner;
class Result {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int marks = sc.nextInt();
            if(marks > 60) {
                System.out.print("First Class");
            } else if(marks >= 40) {
                System.out.print("Pass");
            } else {
                System.out.print("Fail");
            }
        }
    }
}`,
        testCases: [{ input: "75", expectedOutput: "First Class" }, { input: "40", expectedOutput: "Pass" }],
        points: 150
    },
    // Code 9: Prime
    {
        title: "Code 9 - Prime Check",
        description: "Read integer. Print Prime or Not Prime.",
        programmingLanguage: "Java",
        difficulty: "hard",
        buggyCode: `import java.util.Scanner;
class PrimeCheck {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int num = sc.nextInt();
        boolean isPrime = true;
        for(int i = 2; i < num / 2; i++) { 
            if(num % i == 0) {
                isPrime = false;
                break;
            }
        }
        if(isPrime) System.out.print("Prime");
        else System.out.print("Not Prime");
    }
}`,
        solutionCode: `import java.util.Scanner;
class PrimeCheck {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()) {
            int num = sc.nextInt();
            boolean isPrime = true;
            if (num <= 1) isPrime = false;
            else {
                for(int i = 2; i <= num / 2; i++) {
                    if(num % i == 0) {
                        isPrime = false;
                        break;
                    }
                }
            }
            if(isPrime) System.out.print("Prime");
            else System.out.print("Not Prime");
        }
    }
}`,
        testCases: [{ input: "9", expectedOutput: "Not Prime" }, { input: "2", expectedOutput: "Prime" }],
        points: 200
    },
    // Code 10: Login
    {
        title: "Code 10 - Login Validation",
        description: "Read username and password. Validate.",
        programmingLanguage: "Java",
        difficulty: "hard",
        buggyCode: `import java.util.Scanner;
class Login {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String username = sc.next();
        String password = sc.next();
        if(username == "admin" && password == "1234") { 
            System.out.print("Login Successful");
        } else {
            System.out.print("Invalid Login");
        }
    }
}`,
        solutionCode: `import java.util.Scanner;
class Login {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNext()) {
            String username = sc.next();
            String password = sc.next();
            if(username.equals("admin") && password.equals("1234")) {
                System.out.print("Login Successful");
            } else {
                System.out.print("Invalid Login");
            }
        }
    }
}`,
        testCases: [{ input: "admin 1234", expectedOutput: "Login Successful" }, { input: "admin 0000", expectedOutput: "Invalid Login" }],
        points: 200
    },

    // --- PYTHON ---
    // Code 1
    {
        title: "Code 1 - Pass/Fail",
        description: "Read marks. Print Pass (>50) or Fail.",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `marks = int(input())
if marks > 50
    print("Pass")
else:
    print("Fail")`,
        solutionCode: `try:
    marks = int(input())
    if marks > 50:
        print("Pass", end="")
    else:
        print("Fail", end="")
except:
    pass`,
        testCases: [
            { input: "85", expectedOutput: "Pass" },
            { input: "51", expectedOutput: "Pass" },
            { input: "50", expectedOutput: "Fail" },
            { input: "30", expectedOutput: "Fail" }
        ],
        points: 100
    },
    // Code 2
    {
        title: "Code 2 - Calculator",
        description: "Read two integers. Print sum.",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `def add(a, b):
    return a + b
a = int(input())
b = int(input())
result = add a, b 
print(result)`,
        solutionCode: `def add(a, b):
    return a + b
try:
    a = int(input())
    b = int(input())
    result = add(a, b)
    print(result, end="")
except:
    pass`,
        testCases: [
            { input: "10 20", expectedOutput: "30" },
            { input: "0 5", expectedOutput: "5" },
            { input: "-5 10", expectedOutput: "5" },
            { input: "-3 -7", expectedOutput: "-10" }
        ],
        points: 100
    },
    // Code 3
    {
        title: "Code 3 - Print Message",
        description: "Print \"Python Debugging\".",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `def main():
print("Python Debugging") 
main()`,
        solutionCode: `def main():
    print("Python Debugging", end="")
main()`,
        testCases: [{ input: "", expectedOutput: "Python Debugging" }],
        points: 100
    },
    // Code 4
    {
        title: "Code 4 - Even/Odd",
        description: "Read number. Print Even or Odd.",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `number = int(input())
if number % 2 == 1: 
    print("Even")
else:
    print("Odd")`,
        solutionCode: `try:
    number = int(input())
    if number % 2 == 0:
        print("Even", end="")
    else:
        print("Odd", end="")
except:
    pass`,
        testCases: [
            { input: "7", expectedOutput: "Odd" },
            { input: "10", expectedOutput: "Even" },
            { input: "0", expectedOutput: "Even" },
            { input: "-3", expectedOutput: "Odd" }
        ],
        points: 100
    },
    // Code 5
    {
        title: "Code 5 - Average",
        description: "Read 3 integers. Print average.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `a = int(input())
b = int(input())
c = int(input())
avg = a + b + c / 3 
print("Average =", avg)`,
        solutionCode: `try:
    a = int(input())
    b = int(input())
    c = int(input())
    avg = int((a + b + c) / 3)
    print("Average =", avg, end="")
except:
    pass`,
        testCases: [
            { input: "10 20 30", expectedOutput: "Average = 20" },
            { input: "5 5 5", expectedOutput: "Average = 5" },
            { input: "0 0 0", expectedOutput: "Average = 0" },
            { input: "1 2 2", expectedOutput: "Average = 1" }
        ],
        points: 150
    },
    // Code 6
    {
        title: "Code 6 - Factorial",
        description: "Read n. Print factorial.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `n = int(input())
fact = 0 
for i in range(1, n + 1):
    fact = fact * i
print(fact)`,
        solutionCode: `try:
    n = int(input())
    fact = 1
    for i in range(1, n + 1):
        fact = fact * i
    print(fact, end="")
except:
    pass`,
        testCases: [
            { input: "5", expectedOutput: "120" },
            { input: "1", expectedOutput: "1" },
            { input: "0", expectedOutput: "1" },
            { input: "3", expectedOutput: "6" }
        ],
        points: 150
    },
    // Code 7
    {
        title: "Code 7 - Array Sum",
        description: "Read space-separated integers. Print sum. (Input: `2 4 6 8`)",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `arr = list(map(int, input().split()))
sum = 0
for i in range(0, len(arr) + 1): 
    sum += arr[i]
print(sum)`,
        solutionCode: `try:
    arr = list(map(int, input().split()))
    total = 0
    for i in range(len(arr)):
        total += arr[i]
    print(total, end="")
except:
    pass`,
        testCases: [
            { input: "2 4 6 8", expectedOutput: "20" },
            { input: "1 1 1", expectedOutput: "3" },
            { input: "5", expectedOutput: "5" }
        ],
        points: 150
    },
    // Code 8
    {
        title: "Code 8 - Result",
        description: "Read marks. Print First Class/Pass/Fail.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `marks = int(input())
if marks > 40:
    print("Pass")
elif marks > 60:
    print("First Class")
else:
    print("Fail")`,
        solutionCode: `try:
    marks = int(input())
    if marks > 60:
        print("First Class", end="")
    elif marks >= 40:
        print("Pass", end="")
    else:
        print("Fail", end="")
except:
    pass`,
        testCases: [
            { input: "75", expectedOutput: "First Class" },
            { input: "60", expectedOutput: "Pass" },
            { input: "40", expectedOutput: "Pass" },
            { input: "39", expectedOutput: "Fail" },
            { input: "0", expectedOutput: "Fail" }
        ],
        points: 150
    },
    // Code 9
    {
        title: "Code 9 - Prime",
        description: "Read num. Print Prime/Not Prime.",
        programmingLanguage: "Python",
        difficulty: "hard",
        buggyCode: `num = int(input())
is_prime = True
for i in range(2, num // 2):
    if num % i == 0:
        is_prime = False
        break
if is_prime:
    print("Prime")
else:
    print("Not Prime")`,
        solutionCode: `try:
    num = int(input())
    is_prime = True
    if num <= 1:
        is_prime = False
    else:
        for i in range(2, num // 2 + 1):
            if num % i == 0:
                is_prime = False
                break
    if is_prime:
        print("Prime", end="")
    else:
        print("Not Prime", end="")
except:
    pass`,
        testCases: [
            { input: "2", expectedOutput: "Prime" },
            { input: "3", expectedOutput: "Prime" },
            { input: "9", expectedOutput: "Not Prime" },
            { input: "1", expectedOutput: "Not Prime" },
            { input: "0", expectedOutput: "Not Prime" },
            { input: "17", expectedOutput: "Prime" }
        ],
        points: 200
    },
    // Code 10
    {
        title: "Code 10 - Login",
        description: "Read username and password. Print result.",
        programmingLanguage: "Python",
        difficulty: "hard",
        buggyCode: `username = input()
password = input()
if username is "admin" and password is "1234":
    print("Login Successful")
else:
    print("Invalid Login")`,
        solutionCode: `try:
    username = input()
    password = input()
    if username == "admin" and password == "1234":
        print("Login Successful", end="")
    else:
        print("Invalid Login", end="")
except:
    pass`,
        testCases: [
            { input: "admin\n1234", expectedOutput: "Login Successful" },
            { input: "admin\n0000", expectedOutput: "Invalid Login" },
            { input: "user\n1234", expectedOutput: "Invalid Login" },
            { input: "ADMIN\n1234", expectedOutput: "Invalid Login" },
            { input: "admin\nAdmin", expectedOutput: "Invalid Login" }
        ],
        points: 200
    },

    // === C QUESTIONS ===
    // Code 1
    {
        title: "Code 1 - Pass/Fail",
        description: "Read marks. Print Pass/Fail.",
        programmingLanguage: "C",
        difficulty: "easy",
        buggyCode: `#include <stdio.h>
int main() {
    int marks;
    scanf("%d", &marks); 
    if (marks > 50) { 
        printf("Pass");
    else {
        printf("Fail");
    }
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int marks;
    if(scanf("%d", &marks)) {
        if (marks > 50) {
            printf("Pass");
        } else {
            printf("Fail");
        }
    }
    return 0;
}`,
        testCases: [
            { input: "85", expectedOutput: "Pass" },
            { input: "51", expectedOutput: "Pass" },
            { input: "50", expectedOutput: "Fail" },
            { input: "30", expectedOutput: "Fail" }
        ],
        points: 100
    },
    // Code 2
    {
        title: "Code 2 - Calculator",
        description: "Read two ints. Print sum.",
        programmingLanguage: "C",
        difficulty: "easy",
        buggyCode: `#include <stdio.h>
int add(int a, int b) {
    return a + b;
}
int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    int result = add(a, b);
    printf("%d", result) 
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int add(int a, int b) {
    return a + b;
}
int main() {
    int a, b;
    if(scanf("%d %d", &a, &b)) {
        int result = add(a, b);
        printf("%d", result);
    }
    return 0;
}`,
        testCases: [
            { input: "10 20", expectedOutput: "30" },
            { input: "0 5", expectedOutput: "5" },
            { input: "-5 10", expectedOutput: "5" },
            { input: "-3 -7", expectedOutput: "-10" }
        ],
        points: 100
    },
    // Code 3
    {
        title: "Code 3 - Main",
        description: "Print \"C Debugging\".",
        programmingLanguage: "C",
        difficulty: "easy",
        buggyCode: `#include <stdio.h>
void main() { 
    printf("C Debugging");
}`,
        solutionCode: `#include <stdio.h>
int main() {
    printf("C Debugging");
    return 0;
}`,
        testCases: [{ input: "", expectedOutput: "C Debugging" }],
        points: 100
    },
    // Code 4
    {
        title: "Code 4 - Even/Odd",
        description: "Read number. Print Even or Odd.",
        programmingLanguage: "C",
        difficulty: "easy",
        buggyCode: `#include <stdio.h>
int main() {
    int number;
    scanf("%d", &number);
    if (number % 2 == 1) { 
        printf("Even");
    } else {
        printf("Odd");
    }
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int number;
    if(scanf("%d", &number)) {
        if (number % 2 == 0) {
            printf("Even");
        } else {
            printf("Odd");
        }
    }
    return 0;
}`,
        testCases: [
            { input: "7", expectedOutput: "Odd" },
            { input: "10", expectedOutput: "Even" },
            { input: "0", expectedOutput: "Even" },
            { input: "-3", expectedOutput: "Odd" }
        ],
        points: 100
    },
    // Code 5
    {
        title: "Code 5 - Average",
        description: "Read 3 ints. Print Average.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>
int main() {
    int a, b, c;
    scanf("%d %d %d", &a, &b, &c);
    int avg = a + b + c / 3; 
    printf("Average = %d", avg);
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int a, b, c;
    if(scanf("%d %d %d", &a, &b, &c)) {
        int avg = (a + b + c) / 3;
        printf("Average = %d", avg);
    }
    return 0;
}`,
        testCases: [
            { input: "10 20 30", expectedOutput: "Average = 20" },
            { input: "5 5 5", expectedOutput: "Average = 5" },
            { input: "0 0 0", expectedOutput: "Average = 0" },
            { input: "1 2 2", expectedOutput: "Average = 1" }
        ],
        points: 150
    },
    // Code 6
    {
        title: "Code 6 - Factorial",
        description: "Read n. Print factorial.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    int fact = 0; 
    for (int i = 1; i <= n; i++) {
        fact = fact * i;
    }
    printf("%d", fact);
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int n;
    if(scanf("%d", &n)) {
        int fact = 1;
        for (int i = 1; i <= n; i++) {
            fact = fact * i;
        }
        printf("%d", fact);
    }
    return 0;
}`,
        testCases: [
            { input: "5", expectedOutput: "120" },
            { input: "1", expectedOutput: "1" },
            { input: "0", expectedOutput: "1" },
            { input: "3", expectedOutput: "6" }
        ],
        points: 150
    },
    // Code 7
    {
        title: "Code 7 - Array Sum",
        description: "Read N, then N ints. Print sum.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    int arr[100]; // Assume max 100
    for(int i=0; i<n; i++) scanf("%d", &arr[i]);
    int sum = 0;
    for (int i = 0; i <= n; i++) { 
        sum += arr[i];
    }
    printf("%d", sum);
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int n;
    if(scanf("%d", &n)) {
        int arr[100];
        for(int i=0; i<n; i++) scanf("%d", &arr[i]);
        int sum = 0;
        for (int i = 0; i < n; i++) {
            sum += arr[i];
        }
        printf("%d", sum);
    }
    return 0;
}`,
        testCases: [
            { input: "4 2 4 6 8", expectedOutput: "20" },
            { input: "3 1 1 1", expectedOutput: "3" },
            { input: "1 5", expectedOutput: "5" }
        ],
        points: 150
    },
    // Code 8
    {
        title: "Code 8 - Result",
        description: "Read marks. Print First Class/Pass/Fail.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>
int main() {
    int marks;
    scanf("%d", &marks);
    if (marks > 40) { 
        printf("Pass");
    } else if (marks > 60) {
        printf("First Class");
    } else {
        printf("Fail");
    }
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int marks;
    if(scanf("%d", &marks)) {
        if (marks > 60) {
            printf("First Class");
        } else if (marks >= 40) {
            printf("Pass");
        } else {
            printf("Fail");
        }
    }
    return 0;
}`,
        testCases: [
            { input: "75", expectedOutput: "First Class" },
            { input: "60", expectedOutput: "Pass" },
            { input: "40", expectedOutput: "Pass" },
            { input: "39", expectedOutput: "Fail" },
            { input: "0", expectedOutput: "Fail" }
        ],
        points: 150
    },
    // Code 9
    {
        title: "Code 9 - Prime",
        description: "Read num. Print Prime/Not Prime.",
        programmingLanguage: "C",
        difficulty: "hard",
        buggyCode: `#include <stdio.h>
int main() {
    int num;
    scanf("%d", &num);
    int isPrime = 1;
    for (int i = 2; i < num / 2; i++) { 
        if (num % i == 0) {
            isPrime = 0;
            break;
        }
    }
    if (isPrime) printf("Prime");
    else printf("Not Prime");
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int num;
    if(scanf("%d", &num)) {
        int isPrime = 1;
        if (num <= 1) isPrime = 0;
        else {
            for (int i = 2; i <= num / 2; i++) {
                if (num % i == 0) {
                    isPrime = 0;
                    break;
                }
            }
        }
        if (isPrime) printf("Prime");
        else printf("Not Prime");
    }
    return 0;
}`,
        testCases: [
            { input: "2", expectedOutput: "Prime" },
            { input: "3", expectedOutput: "Prime" },
            { input: "9", expectedOutput: "Not Prime" },
            { input: "1", expectedOutput: "Not Prime" },
            { input: "0", expectedOutput: "Not Prime" },
            { input: "17", expectedOutput: "Prime" }
        ],
        points: 200
    },
    // Code 10
    {
        title: "Code 10 - Login",
        description: "Read username password. Print result.",
        programmingLanguage: "C",
        difficulty: "hard",
        buggyCode: `#include <stdio.h>
int main() {
    char username[20], password[20];
    scanf("%s %s", username, password);
    if (username == "admin" && password == "1234") { 
        printf("Login Successful");
    } else {
        printf("Invalid Login");
    }
    return 0;
}`,
        solutionCode: `#include <stdio.h>
#include <string.h>
int main() {
    char username[20], password[20];
    if(scanf("%s %s", username, password)) {
        if (strcmp(username, "admin") == 0 && strcmp(password, "1234") == 0) {
            printf("Login Successful");
        } else {
            printf("Invalid Login");
        }
    }
    return 0;
}`,
        testCases: [
            { input: "admin 1234", expectedOutput: "Login Successful" },
            { input: "admin 0000", expectedOutput: "Invalid Login" },
            { input: "user 1234", expectedOutput: "Invalid Login" },
            { input: "ADMIN 1234", expectedOutput: "Invalid Login" },
            { input: "admin Admin", expectedOutput: "Invalid Login" }
        ],
        points: 200
    },
    // === C++ QUESTIONS ===
    // Code 1
    {
        title: "Code 1 - Pass/Fail",
        description: "Read marks. Print Pass/Fail.",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int marks;
    cin >> marks;
    if (marks > 50) {
        cout << "Pass";
    else { 
        cout << "Fail";
    }
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int marks;
    if(cin >> marks) {
        if (marks > 50) {
            cout << "Pass";
        } else {
            cout << "Fail";
        }
    }
    return 0;
}`,
        testCases: [
            { input: "85", expectedOutput: "Pass" },
            { input: "51", expectedOutput: "Pass" },
            { input: "50", expectedOutput: "Fail" },
            { input: "30", expectedOutput: "Fail" }
        ],
        points: 100
    },
    // Code 2
    {
        title: "Code 2 - Calculator",
        description: "Read 2 ints. Print sum.",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;
int add(int a, int b) {
    return a + b;
}
int main() {
    int a, b;
    cin >> a >> b;
    cout << add(a,b) 
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int add(int a, int b) {
    return a + b;
}
int main() {
    int a, b;
    if(cin >> a >> b) {
        cout << add(a, b);
    }
    return 0;
}`,
        testCases: [
            { input: "10 20", expectedOutput: "30" },
            { input: "0 5", expectedOutput: "5" },
            { input: "-5 10", expectedOutput: "5" },
            { input: "-3 -7", expectedOutput: "-10" }
        ],
        points: 100
    },
    // Code 3
    {
        title: "Code 3 - Main",
        description: "Print C++ Debugging",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;
void main() { 
    cout << "C++ Debugging";
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    cout << "C++ Debugging";
    return 0;
}`,
        testCases: [{ input: "", expectedOutput: "C++ Debugging" }],
        points: 100
    },
    // Code 4
    {
        title: "Code 4 - Even/Odd",
        description: "Read num. Print Even/Odd.",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int number;
    cin >> number;
    if (number % 2 == 1) { 
        cout << "Even";
    } else {
        cout << "Odd";
    }
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int number;
    if(cin >> number) {
        if (number % 2 == 0) {
            cout << "Even";
        } else {
            cout << "Odd";
        }
    }
    return 0;
}`,
        testCases: [
            { input: "7", expectedOutput: "Odd" },
            { input: "10", expectedOutput: "Even" },
            { input: "0", expectedOutput: "Even" },
            { input: "-3", expectedOutput: "Odd" }
        ],
        points: 100
    },
    // Code 5
    {
        title: "Code 5 - Average",
        description: "Read 3 ints. Print Average.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    int avg = a + b + c / 3; 
    cout << "Average = " << avg;
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    if(cin >> a >> b >> c) {
        int avg = (a + b + c) / 3;
        cout << "Average = " << avg;
    }
    return 0;
}`,
        testCases: [
            { input: "10 20 30", expectedOutput: "Average = 20" },
            { input: "5 5 5", expectedOutput: "Average = 5" },
            { input: "0 0 0", expectedOutput: "Average = 0" },
            { input: "1 2 2", expectedOutput: "Average = 1" }
        ],
        points: 150
    },
    // Code 6
    {
        title: "Code 6 - Factorial",
        description: "Read n. Print Fact.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int fact = 0; 
    for (int i = 1; i <= n; i++) {
        fact = fact * i;
    }
    cout << fact;
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    if(cin >> n) {
        int fact = 1;
        for (int i = 1; i <= n; i++) {
            fact = fact * i;
        }
        cout << fact;
    }
    return 0;
}`,
        testCases: [
            { input: "5", expectedOutput: "120" },
            { input: "1", expectedOutput: "1" },
            { input: "0", expectedOutput: "1" },
            { input: "3", expectedOutput: "6" }
        ],
        points: 150
    },
    // Code 7
    {
        title: "Code 7 - Array Sum",
        description: "Read N, then N ints. Print sum.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int arr[100];
    for(int i=0; i<n; i++) cin >> arr[i];
    int sum = 0;
    for (int i = 0; i <= n; i++) { 
        sum += arr[i];
    }
    cout << sum;
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    if(cin >> n) {
        int arr[100];
        for(int i=0; i<n; i++) cin >> arr[i];
        int sum = 0;
        for (int i = 0; i < n; i++) {
            sum += arr[i];
        }
        cout << sum;
    }
    return 0;
}`,
        testCases: [
            { input: "4 2 4 6 8", expectedOutput: "20" },
            { input: "3 1 1 1", expectedOutput: "3" },
            { input: "1 5", expectedOutput: "5" }
        ],
        points: 150
    },
    // Code 8
    {
        title: "Code 8 - Result",
        description: "Read marks. Print Result.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int marks;
    cin >> marks;
    if (marks > 40) { 
        cout << "Pass";
    } else if (marks > 60) {
        cout << "First Class";
    } else {
        cout << "Fail";
    }
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int marks;
    if(cin >> marks) {
        if (marks > 60) {
            cout << "First Class";
        } else if (marks >= 40) {
            cout << "Pass";
        } else {
            cout << "Fail";
        }
    }
    return 0;
}`,
        testCases: [
            { input: "75", expectedOutput: "First Class" },
            { input: "60", expectedOutput: "Pass" },
            { input: "40", expectedOutput: "Pass" },
            { input: "39", expectedOutput: "Fail" },
            { input: "0", expectedOutput: "Fail" }
        ],
        points: 150
    },
    // Code 9
    {
        title: "Code 9 - Prime",
        description: "Read num. Print Prime/Not Prime.",
        programmingLanguage: "C++",
        difficulty: "hard",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int num;
    cin >> num;
    bool isPrime = true;
    for (int i = 2; i < num / 2; i++) { 
        if (num % i == 0) {
            isPrime = false;
            break;
        }
    }
    if (isPrime) cout << "Prime";
    else cout << "Not Prime";
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int num;
    if(cin >> num) {
        bool isPrime = true;
        if (num <= 1) isPrime = false;
        else {
            for (int i = 2; i <= num / 2; i++) {
                if (num % i == 0) {
                    isPrime = false;
                    break;
                }
            }
        }
        if (isPrime) cout << "Prime";
        else cout << "Not Prime";
    }
    return 0;
}`,
        testCases: [
            { input: "2", expectedOutput: "Prime" },
            { input: "3", expectedOutput: "Prime" },
            { input: "9", expectedOutput: "Not Prime" },
            { input: "1", expectedOutput: "Not Prime" },
            { input: "0", expectedOutput: "Not Prime" },
            { input: "17", expectedOutput: "Prime" }
        ],
        points: 200
    },
    // Code 10
    {
        title: "Code 10 - Login",
        description: "Read user pass. Print Login Successful/Invalid Login.",
        programmingLanguage: "C++",
        difficulty: "hard",
        buggyCode: `#include <iostream>
#include <string>
using namespace std;
int main() {
    string u, p;
    cin >> u >> p;
    if(u=="admin" && p=="1234") cout << "Login Successful";
    else cout << "Invalid Login";
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <string>
using namespace std;
int main() {
    string u, p;
    if(cin >> u >> p) {
        if(u=="admin" && p=="1234") cout << "Login Successful";
        else cout << "Invalid Login";
    }
    return 0;
}`,
        testCases: [
            { input: "admin 1234", expectedOutput: "Login Successful" },
            { input: "admin 0000", expectedOutput: "Invalid Login" },
            { input: "user 1234", expectedOutput: "Invalid Login" },
            { input: "ADMIN 1234", expectedOutput: "Invalid Login" },
            { input: "admin Admin", expectedOutput: "Invalid Login" }
        ],
        points: 200
    }
];

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Question.deleteMany({});
        await CodeChallenge.deleteMany({});
        await Submission.deleteMany({});
        console.log('Existing data cleared');

        // Create admin user
        console.log('Creating admin user...');
        const adminUser = new User({
            username: 'admin',
            password: 'AiTronix@2026!',
            role: 'ADMIN'
        });
        await adminUser.save();
        console.log('Admin user created: admin / AiTronix@2026!');

        // Create sample test user
        const testUser = new User({
            username: 'testuser',
            password: 'test123',
            role: 'USER'
        });
        await testUser.save();
        console.log('Test user created: testuser / test123');

        // Insert MCQs
        console.log('Inserting MCQs...');
        const questionsWithPoints = sampleQuestions.map(q => ({
            ...q,
            basePointValue: Question.getBasePoints(q.difficulty),
            currentPointValue: Question.getBasePoints(q.difficulty)
        }));

        await Question.insertMany(questionsWithPoints);
        console.log(`Inserted ${questionsWithPoints.length} MCQs`);

        // Insert Code Challenges
        console.log('Inserting Code Challenges...');
        await CodeChallenge.insertMany(codeChallenges);
        console.log(`Inserted ${codeChallenges.length} Code Challenges`);

        // Summary
        console.log('\n========================================');
        console.log('Database seeded successfully!');
        console.log('========================================\n');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seedDatabase();
