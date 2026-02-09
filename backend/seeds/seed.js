const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');
const CodeChallenge = require('../models/CodeChallenge');
const Submission = require('../models/Submission');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quiz-system';

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
    {
        title: "Code 1 - Pass/Fail Check",
        description: "Write a program that reads an integer `marks` and prints \"Pass\" if marks > 50, otherwise \"Fail\".",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int marks = sc.nextInt();
            // Bug: Logic error or syntax
            if (marks >= 50) { // Bug: Should be > 50
                System.out.print("Pass");
            } else {
                System.out.print("Fail");
            }
        }
    }
}`,
        solutionCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int marks = sc.nextInt();
            if (marks > 50) {
                System.out.print("Pass");
            } else {
                System.out.print("Fail");
            }
        }
    }
}`,
        testCases: [
            { input: "85", expectedOutput: "Pass" },
            { input: "51", expectedOutput: "Pass" },
            { input: "50", expectedOutput: "Fail" },
            { input: "30", expectedOutput: "Fail" }
        ],
        points: 100
    },
    // ... Add more Java here (skipped for brevity, but I promise I would write them in real life) ... 
    // Wait, I MUST ANYWAY write them. I cannot skip. The user wants them.
    {
        title: "Code 2 - Calculator Addition",
        description: "Read two integers a and b from input and print their sum.",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.print(a - b); // Bug: Subtraction instead of addition
    }
}`,
        solutionCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.print(a + b);
    }
}`,
        testCases: [{ input: "10 20", expectedOutput: "30" }, { input: "-5 10", expectedOutput: "5" }],
        points: 100
    },
    // --- PYTHON ---
    {
        title: "Code 1 - Pass/Fail Check",
        description: "Read an integer `marks` and print \"Pass\" if marks > 50, otherwise \"Fail\".",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `marks = int(input())
if marks > 50  # Bug: Missing colon
    print("Pass", end="")
else:
    print("Fail", end="")`,
        solutionCode: `marks = int(input())
if marks > 50:
    print("Pass", end="")
else:
    print("Fail", end="")`,
        testCases: [{ input: "85", expectedOutput: "Pass" }, { input: "50", expectedOutput: "Fail" }],
        points: 100
    },
    {
        title: "Code 2 - Calculator Addition",
        description: "Read two space-separated integers a and b and print their sum.",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `a, b = map(int, input().split())
print(a - b, end="") # Bug: Subtraction`,
        solutionCode: `a, b = map(int, input().split())
print(a + b, end="")`,
        testCases: [{ input: "10 20", expectedOutput: "30" }],
        points: 100
    },
    // --- C ---
    {
        title: "Code 1 - Pass/Fail Check",
        description: "Read an integer `marks` and print \"Pass\" if marks > 50, otherwise \"Fail\".",
        programmingLanguage: "C",
        difficulty: "easy",
        buggyCode: `#include <stdio.h>
int main() {
    int marks;
    scanf("%d", &marks);
    if (marks > 50) {
        printf("Pass");
    else { // Bug: Missing curly brace or indentation not saving it from syntax error if braces used wrong?
           // Original C.md had missing semicolon.
           // Let's use missing semicolon.
        printf("Fail");
    }
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int marks;
    scanf("%d", &marks);
    if (marks > 50) {
        printf("Pass");
    } else {
        printf("Fail");
    }
    return 0;
}`,
        testCases: [{ input: "85", expectedOutput: "Pass" }, { input: "50", expectedOutput: "Fail" }],
        points: 100
    },
    // --- C++ ---
    {
        title: "Code 1 - Pass/Fail Check",
        description: "Read an integer `marks` and print \"Pass\" if marks > 50, otherwise \"Fail\".",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int marks;
    cin >> marks;
    if (marks > 50) {
        cout << "Pass";
    else { // Bug: Syntax error
        cout << "Fail";
    }
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int marks;
    cin >> marks;
    if (marks > 50) {
        cout << "Pass";
    } else {
        cout << "Fail";
    }
    return 0;
}`,
        testCases: [{ input: "85", expectedOutput: "Pass" }, { input: "50", expectedOutput: "Fail" }],
        points: 100
    },
    // --- JAVA 3-10 ---
    {
        title: "Code 3 - Print Message",
        description: "Write a program that prints exactly \"Java Debugging\".",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `public class Main {
    public static void main(String[] args) {
        System.out.print("Java Debuging");
    }
}`,
        solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.print("Java Debugging");
    }
}`,
        testCases: [{ input: "", expectedOutput: "Java Debugging" }],
        points: 100
    },
    {
        title: "Code 4 - Even / Odd",
        description: "Read an integer and print \"Even\" or \"Odd\".",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()){
             int n = sc.nextInt();
             if (n % 2 == 1) System.out.print("Odd");
             else System.out.print("Even");
        }
    }
}`,
        solutionCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if(sc.hasNextInt()){
             int n = sc.nextInt();
             if (n % 2 == 0) System.out.print("Even");
             else System.out.print("Odd");
        }
    }
}`,
        testCases: [{ input: "7", expectedOutput: "Odd" }, { input: "10", expectedOutput: "Even" }],
        points: 100
    },
    {
        title: "Code 5 - Average Calculation",
        description: "Read 3 integers and print their average.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.print(a + b + c / 3);
    }
}`,
        solutionCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        int c = sc.nextInt();
        System.out.print((a + b + c) / 3);
    }
}`,
        testCases: [{ input: "10 20 30", expectedOutput: "20" }],
        points: 150
    },
    {
        title: "Code 6 - Factorial",
        description: "Read n and print factorial.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long f = 1;
        for(int i=1; i<n; i++) f*=i;
        System.out.print(f);
    }
}`,
        solutionCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long f = 1;
        for(int i=1; i<=n; i++) f*=i;
        System.out.print(f);
    }
}`,
        testCases: [{ input: "5", expectedOutput: "120" }],
        points: 150
    },
    {
        title: "Code 7 - Array Sum",
        description: "Read size N, then N integers. Print sum.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        int s = 0;
        for(int i=0; i<=n; i++) { a[i]=sc.nextInt(); s+=a[i]; }
        System.out.print(s);
    }
}`,
        solutionCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int s = 0;
        for(int i=0; i<n; i++) s+=sc.nextInt();
        System.out.print(s);
    }
}`,
        testCases: [{ input: "4 2 4 6 8", expectedOutput: "20" }],
        points: 150
    },
    {
        title: "Code 8 - Marks",
        description: "Read marks. Print First Class (>=75), Pass (>=40), Fail (<40).",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        if(m>75) System.out.print("First Class");
        else if(m>40) System.out.print("Pass");
        else System.out.print("Fail");
    }
}`,
        solutionCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m = sc.nextInt();
        if(m>=75) System.out.print("First Class");
        else if(m>=40) System.out.print("Pass");
        else System.out.print("Fail");
    }
}`,
        testCases: [{ input: "75", expectedOutput: "First Class" }, { input: "60", expectedOutput: "Pass" }],
        points: 150
    },
    {
        title: "Code 9 - Prime",
        description: "Read n. Print Prime/Not Prime.",
        programmingLanguage: "Java",
        difficulty: "hard",
        buggyCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if(n<=1) {System.out.print("Not Prime"); return;}
        for(int i=2; i<n; i++) {
             if(n%i==0) {System.out.print("Prime"); return;}
        }
        System.out.print("Not Prime");
    }
}`,
        solutionCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if(n<=1) {System.out.print("Not Prime"); return;}
        boolean p=true;
        for(int i=2; i*i<=n; i++) {
             if(n%i==0) {p=false; break;}
        }
        if(p) System.out.print("Prime");
        else System.out.print("Not Prime");
    }
}`,
        testCases: [{ input: "2", expectedOutput: "Prime" }, { input: "9", expectedOutput: "Not Prime" }],
        points: 200
    },
    {
        title: "Code 10 - Login",
        description: "Read user pass. Print Login Successful/Invalid Login.",
        programmingLanguage: "Java",
        difficulty: "hard",
        buggyCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String u = sc.next();
        String p = sc.next();
        if(u=="admin" && p=="1234") System.out.print("Login Successful");
        else System.out.print("Invalid Login");
    }
}`,
        solutionCode: `import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String u = sc.next();
        String p = sc.next();
        if(u.equals("admin") && p.equals("1234")) System.out.print("Login Successful");
        else System.out.print("Invalid Login");
    }
}`,
        testCases: [{ input: "admin 1234", expectedOutput: "Login Successful" }],
        points: 200
    },
    // --- PYTHON 3-10 ---
    {
        title: "Code 3 - Print Message",
        description: "Write a program that prints exactly \"Python Debugging\".",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `def main():
  print("Python Debuging") # Bug: Typo
if __name__ == "__main__": main()`,
        solutionCode: `def main():
  print("Python Debugging", end="")
if __name__ == "__main__": main()`,
        testCases: [{ input: "", expectedOutput: "Python Debugging" }],
        points: 100
    },
    {
        title: "Code 4 - Even / Odd",
        description: "Read an integer and print \"Even\" or \"Odd\".",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `n = int(input())
if n % 2 == 1: print("Odd", end="")
else: print("Even", end="")`,
        solutionCode: `n = int(input())
if n % 2 == 0: print("Even", end="")
else: print("Odd", end="")`,
        testCases: [{ input: "7", expectedOutput: "Odd" }, { input: "10", expectedOutput: "Even" }],
        points: 100
    },
    {
        title: "Code 5 - Average Calculation",
        description: "Read 3 integers (space separated) and print their average.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `nums = list(map(int, input().split()))
a,b,c = nums[0], nums[1], nums[2]
print(a + b + c / 3, end="") # Bug: Precedence`,
        solutionCode: `nums = list(map(int, input().split()))
if len(nums) >= 3:
  a,b,c = nums[0], nums[1], nums[2]
  print(int((a + b + c) / 3), end="")`,
        testCases: [{ input: "10 20 30", expectedOutput: "20" }],
        points: 150
    },
    {
        title: "Code 6 - Factorial",
        description: "Read integer n and print factorial.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `n = int(input())
f = 1
for i in range(1, n): f *= i
print(f, end="")`,
        solutionCode: `n = int(input())
f = 1
for i in range(1, n+1): f *= i
print(f, end="")`,
        testCases: [{ input: "5", expectedOutput: "120" }],
        points: 150
    },
    {
        title: "Code 7 - Array Sum",
        description: "Read size N, then N integers. Print sum.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `vals = list(map(int, input().split()))
n = vals[0]
arr = vals[1:]
s = 0
for i in range(n+1): s += arr[i] # Bug: OOB
print(s, end="")`,
        solutionCode: `vals = list(map(int, input().split()))
n = vals[0]
arr = vals[1:]
print(sum(arr[:n]), end="")`,
        testCases: [{ input: "4 2 4 6 8", expectedOutput: "20" }],
        points: 150
    },
    {
        title: "Code 8 - Marks",
        description: "Read marks. Print First Class/Pass/Fail.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `m = int(input())
if m > 75: print("First Class", end="")
elif m > 40: print("Pass", end="")
else: print("Fail", end="")`,
        solutionCode: `m = int(input())
if m >= 75: print("First Class", end="")
elif m >= 40: print("Pass", end="")
else: print("Fail", end="")`,
        testCases: [{ input: "75", expectedOutput: "First Class" }, { input: "60", expectedOutput: "Pass" }],
        points: 150
    },
    {
        title: "Code 9 - Prime",
        description: "Read n. Print Prime/Not Prime.",
        programmingLanguage: "Python",
        difficulty: "hard",
        buggyCode: `n = int(input())
if n <= 1:
    print("Not Prime", end="")
    exit()
for i in range(2, n):
    if n % i == 0:
        print("Prime", end="") 
        exit()
print("Not Prime", end="")`,
        solutionCode: `import math
n = int(input())
if n <= 1:
    print("Not Prime", end="")
else:
    isPrime = True
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            isPrime = False
            break
    if isPrime: print("Prime", end="")
    else: print("Not Prime", end="")`,
        testCases: [{ input: "2", expectedOutput: "Prime" }, { input: "9", expectedOutput: "Not Prime" }],
        points: 200
    },
    {
        title: "Code 10 - Login",
        description: "Read user pass (space separated). Print Login Successful/Invalid Login.",
        programmingLanguage: "Python",
        difficulty: "hard",
        buggyCode: `parts = input().split()
u, p = parts[0], parts[1]
if u is "admin" and p is "1234":
    print("Login Successful", end="")
else:
    print("Invalid Login", end="")`,
        solutionCode: `parts = input().split()
if len(parts) >= 2:
    u, p = parts[0], parts[1]
    if u == "admin" and p == "1234":
        print("Login Successful", end="")
    else:
        print("Invalid Login", end="")`,
        testCases: [{ input: "admin 1234", expectedOutput: "Login Successful" }],
        points: 200
    },
    // --- C 3-10 ---
    {
        title: "Code 3 - Print Message",
        description: "Write a program that prints exactly \"C Debugging\".",
        programmingLanguage: "C",
        difficulty: "easy",
        buggyCode: `#include <stdio.h>
void main() { // Bug: Non-standard main
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
    {
        title: "Code 4 - Even / Odd",
        description: "Read an integer and print \"Even\" or \"Odd\".",
        programmingLanguage: "C",
        difficulty: "easy",
        buggyCode: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    if (n % 2 == 1) printf("Odd"); // Bug: Negative Logic
    else printf("Even");
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int n;
    if(scanf("%d", &n));
    if (n % 2 == 0) printf("Even");
    else printf("Odd");
    return 0;
}`,
        testCases: [{ input: "7", expectedOutput: "Odd" }, { input: "10", expectedOutput: "Even" }],
        points: 100
    },
    {
        title: "Code 5 - Average Calculation",
        description: "Read 3 integers and print average.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>
int main() {
    int a,b,c;
    scanf("%d %d %d", &a, &b, &c);
    printf("%d", a + b + c / 3); // Bug: Precedence
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int a,b,c;
    if(scanf("%d %d %d", &a, &b, &c));
    printf("%d", (a + b + c) / 3);
    return 0;
}`,
        testCases: [{ input: "10 20 30", expectedOutput: "20" }],
        points: 150
    },
    {
        title: "Code 6 - Factorial",
        description: "Read n and print factorial.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    int f=0; // Bug: Init 0
    for(int i=1; i<=n; i++) f*=i;
    printf("%d", f);
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int n;
    if(scanf("%d", &n));
    long long f=1;
    for(int i=1; i<=n; i++) f*=i;
    printf("%lld", f);
    return 0;
}`,
        testCases: [{ input: "5", expectedOutput: "120" }],
        points: 150
    },
    {
        title: "Code 7 - Array Sum",
        description: "Read size N, then N integers. Print sum.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    int arr[n];
    int s=0;
    for(int i=0; i<=n; i++) { // Bug: OOB
        scanf("%d", &arr[i]);
        s+=arr[i];
    }
    printf("%d", s);
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int n;
    if(scanf("%d", &n));
    int temp, s=0;
    for(int i=0; i<n; i++) {
        if(scanf("%d", &temp));
        s+=temp;
    }
    printf("%d", s);
    return 0;
}`,
        testCases: [{ input: "4 2 4 6 8", expectedOutput: "20" }],
        points: 150
    },
    {
        title: "Code 8 - Marks",
        description: "Read marks. Print First Class/Pass/Fail.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>
int main() {
    int m;
    scanf("%d", &m);
    if(m>75) printf("First Class");
    else if(m>40) printf("Pass");
    else printf("Fail");
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int m;
    if(scanf("%d", &m));
    if(m>=75) printf("First Class");
    else if(m>=40) printf("Pass");
    else printf("Fail");
    return 0;
}`,
        testCases: [{ input: "75", expectedOutput: "First Class" }, { input: "60", expectedOutput: "Pass" }],
        points: 150
    },
    {
        title: "Code 9 - Prime",
        description: "Read n. Print Prime/Not Prime.",
        programmingLanguage: "C",
        difficulty: "hard",
        buggyCode: `#include <stdio.h>
int main() {
    int n;
    scanf("%d", &n);
    if(n<=1) {printf("Not Prime"); return 0;}
    for(int i=2; i<n; i++) {
        if(n%i==0) {printf("Prime"); return 0;} // Bug
    }
    printf("Not Prime");
    return 0;
}`,
        solutionCode: `#include <stdio.h>
int main() {
    int n;
    if(scanf("%d", &n));
    if(n<=1) {printf("Not Prime"); return 0;}
    int p=1;
    for(int i=2; i*i<=n; i++) {
        if(n%i==0) {p=0; break;}
    }
    if(p) printf("Prime");
    else printf("Not Prime");
    return 0;
}`,
        testCases: [{ input: "2", expectedOutput: "Prime" }, { input: "9", expectedOutput: "Not Prime" }],
        points: 200
    },
    {
        title: "Code 10 - Login",
        description: "Read user pass. Print Login Successful/Invalid Login.",
        programmingLanguage: "C",
        difficulty: "hard",
        buggyCode: `#include <stdio.h>
int main() {
    char u[20], p[20];
    scanf("%s %s", u, p);
    if(u=="admin" && p=="1234") printf("Login Successful"); // Bug: String ==
    else printf("Invalid Login");
    return 0;
}`,
        solutionCode: `#include <string.h>
#include <stdio.h>
int main() {
    char u[20], p[20];
    if(scanf("%s %s", u, p));
    if(strcmp(u,"admin")==0 && strcmp(p,"1234")==0) printf("Login Successful");
    else printf("Invalid Login");
    return 0;
}`,
        testCases: [{ input: "admin 1234", expectedOutput: "Login Successful" }],
        points: 200
    },
    // --- C++ 2-10 ---
    {
        title: "Code 2 - Calculator Addition",
        description: "Read two integers a and b and print their sum.",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a - b; // Bug: Subtraction
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}`,
        testCases: [{ input: "10 20", expectedOutput: "30" }, { input: "-5 10", expectedOutput: "5" }],
        points: 100
    },
    {
        title: "Code 3 - Print Message",
        description: "Write a program that prints exactly \"C++ Debugging\".",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    cout << "C++ Debuging"; // Bug: Typo
    return 0;
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
    {
        title: "Code 4 - Even / Odd",
        description: "Read an integer and print \"Even\" or \"Odd\".",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if (n % 2 == 1) cout << "Odd"; // Bug
    else cout << "Even";
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if (n % 2 == 0) cout << "Even";
    else cout << "Odd";
    return 0;
}`,
        testCases: [{ input: "7", expectedOutput: "Odd" }, { input: "10", expectedOutput: "Even" }],
        points: 100
    },
    {
        title: "Code 5 - Average Calculation",
        description: "Read 3 integers and print their average.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int a,b,c;
    cin >> a >> b >> c;
    cout << a + b + c / 3; // Bug: Precedence
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int a,b,c;
    cin >> a >> b >> c;
    cout << (a + b + c) / 3;
    return 0;
}`,
        testCases: [{ input: "10 20 30", expectedOutput: "20" }],
        points: 150
    },
    {
        title: "Code 6 - Factorial",
        description: "Read n and print factorial.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long f=1;
    for(int i=1; i<n; i++) f*=i; // Bug: < n
    cout << f;
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long f=1;
    for(int i=1; i<=n; i++) f*=i;
    cout << f;
    return 0;
}`,
        testCases: [{ input: "5", expectedOutput: "120" }],
        points: 150
    },
    {
        title: "Code 7 - Array Sum",
        description: "Read size N, then N integers. Print sum.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    int s=0;
    for(int i=0; i<=n; i++) { // Bug: OOB
        cin >> a[i];
        s+=a[i];
    }
    cout << s;
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    int temp, s=0;
    for(int i=0; i<n; i++) {
        cin >> temp;
        s+=temp;
    }
    cout << s;
    return 0;
}`,
        testCases: [{ input: "4 2 4 6 8", expectedOutput: "20" }],
        points: 150
    },
    {
        title: "Code 8 - Marks",
        description: "Read marks. Print First Class/Pass/Fail.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int m;
    cin >> m;
    if(m>75) cout << "First Class";
    else if(m>40) cout << "Pass";
    else cout << "Fail";
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int m;
    cin >> m;
    if(m>=75) cout << "First Class";
    else if(m>=40) cout << "Pass";
    else cout << "Fail";
    return 0;
}`,
        testCases: [{ input: "75", expectedOutput: "First Class" }, { input: "60", expectedOutput: "Pass" }],
        points: 150
    },
    {
        title: "Code 9 - Prime",
        description: "Read n. Print Prime/Not Prime.",
        programmingLanguage: "C++",
        difficulty: "medium", // actually hard usually
        buggyCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if(n<=1) {cout << "Not Prime"; return 0;}
    for(int i=2; i<n; i++) {
        if(n%i==0) {cout << "Prime"; return 0;} // Bug
    }
    cout << "Not Prime";
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if(n<=1) {cout << "Not Prime"; return 0;}
    bool p=true;
    for(int i=2; i*i<=n; i++) {
        if(n%i==0) {p=false; break;}
    }
    if(p) cout << "Prime";
    else cout << "Not Prime";
    return 0;
}`,
        testCases: [{ input: "2", expectedOutput: "Prime" }, { input: "9", expectedOutput: "Not Prime" }],
        points: 200
    },
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
    if(u=="admin" || p=="1234") cout << "Login Successful"; // Bug: OR logic
    else cout << "Invalid Login";
    return 0;
}`,
        solutionCode: `#include <iostream>
#include <string>
using namespace std;
int main() {
    string u, p;
    cin >> u >> p;
    if(u=="admin" && p=="1234") cout << "Login Successful";
    else cout << "Invalid Login";
    return 0;
}`,
        testCases: [{ input: "admin 1234", expectedOutput: "Login Successful" }],
        points: 200
    },

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
            password: 'admin123',
            role: 'ADMIN'
        });
        await adminUser.save();
        console.log('Admin user created: admin / admin123');

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
        console.log('\\n========================================');
        console.log('Database seeded successfully!');
        console.log('========================================\\n');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seedDatabase();
