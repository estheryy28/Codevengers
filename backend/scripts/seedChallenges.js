/**
 * Seed Script - Custom Code Challenges
 * 10 challenges per language × 4 languages = 40 total challenges
 */

require('dotenv').config();
const mongoose = require('mongoose');
const CodeChallenge = require('../models/CodeChallenge');

// ============================================
// C CHALLENGES
// ============================================
const cChallenges = [
    {
        title: "Missing Semicolon & Wrong if-else Syntax",
        description: "This C code has a missing semicolon and incorrect if-else alignment. Find and fix both errors to make the program compile and run correctly.",
        programmingLanguage: "C",
        difficulty: "easy",
        buggyCode: `#include <stdio.h>

int main() {
    int marks = 85
    if (marks > 50) {
        printf("Pass");
    else {
        printf("Fail");
    }
    return 0;
}`,
        solutionCode: `#include <stdio.h>

int main() {
    int marks = 85;
    if (marks > 50) {
        printf("Pass");
    } else {
        printf("Fail");
    }
    return 0;
}`,
        hints: ["Check for missing semicolons", "The else keyword needs proper alignment with if"],
        testCases: [
            { input: "", expectedOutput: "Pass", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Missing Semicolon in printf",
        description: "This function adds two numbers but has a compilation error. Find and fix it.",
        programmingLanguage: "C",
        difficulty: "easy",
        buggyCode: `#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(10, 20);
    printf("%d", result)
    return 0;
}`,
        solutionCode: `#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(10, 20);
    printf("%d", result);
    return 0;
}`,
        hints: ["Every statement in C needs to end with something", "Check the printf line"],
        testCases: [
            { input: "", expectedOutput: "30", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Wrong main() Declaration",
        description: "This code uses a non-standard main declaration. Fix it to follow C standards.",
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
        hints: ["main() should return an integer in standard C", "Don't forget the return statement"],
        testCases: [
            { input: "", expectedOutput: "C Debugging", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Even or Odd Checker (Logic Error)",
        description: "This code checks if a number is even or odd but has a logic error. The output is reversed!",
        programmingLanguage: "C",
        difficulty: "easy",
        buggyCode: `#include <stdio.h>

int main() {
    int number = 7;

    if (number % 2 == 1) {
        printf("Even");
    } else {
        printf("Odd");
    }
    return 0;
}`,
        solutionCode: `#include <stdio.h>

int main() {
    int number = 7;

    if (number % 2 == 0) {
        printf("Even");
    } else {
        printf("Odd");
    }
    return 0;
}`,
        hints: ["When is a number even?", "Check the condition in the if statement"],
        testCases: [
            { input: "", expectedOutput: "Odd", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Average of Numbers (Operator Precedence)",
        description: "This code calculates the average of three numbers but gives wrong output due to operator precedence.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>

int main() {
    int a = 10, b = 20, c = 30;
    int avg = a + b + c / 3;
    printf("Average = %d", avg);
    return 0;
}`,
        solutionCode: `#include <stdio.h>

int main() {
    int a = 10, b = 20, c = 30;
    int avg = (a + b + c) / 3;
    printf("Average = %d", avg);
    return 0;
}`,
        hints: ["Division has higher precedence than addition", "Use parentheses to control order of operations"],
        testCases: [
            { input: "", expectedOutput: "Average = 20", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Factorial Calculation",
        description: "This code calculates factorial but always returns 0. Find the initialization error.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>

int main() {
    int n = 5;
    int fact = 0;

    for (int i = 1; i <= n; i++) {
        fact = fact * i;
    }
    printf("%d", fact);
    return 0;
}`,
        solutionCode: `#include <stdio.h>

int main() {
    int n = 5;
    int fact = 1;

    for (int i = 1; i <= n; i++) {
        fact = fact * i;
    }
    printf("%d", fact);
    return 0;
}`,
        hints: ["What is 0 multiplied by anything?", "Check the initial value of fact"],
        testCases: [
            { input: "", expectedOutput: "120", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Array Sum (Out of Bounds)",
        description: "This code sums array elements but may access memory out of bounds.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>

int main() {
    int arr[] = {2, 4, 6, 8};
    int sum = 0;

    for (int i = 0; i <= 4; i++) {
        sum += arr[i];
    }
    printf("%d", sum);
    return 0;
}`,
        solutionCode: `#include <stdio.h>

int main() {
    int arr[] = {2, 4, 6, 8};
    int sum = 0;
    int size = sizeof(arr) / sizeof(arr[0]);

    for (int i = 0; i < size; i++) {
        sum += arr[i];
    }
    printf("%d", sum);
    return 0;
}`,
        hints: ["Arrays are 0-indexed", "If array has 4 elements, valid indices are 0 to 3"],
        testCases: [
            { input: "", expectedOutput: "20", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Pass / First Class Logic",
        description: "This code should classify marks but the conditions are in wrong order.",
        programmingLanguage: "C",
        difficulty: "medium",
        buggyCode: `#include <stdio.h>

int main() {
    int marks = 75;

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
    int marks = 75;

    if (marks > 60) {
        printf("First Class");
    } else if (marks >= 40) {
        printf("Pass");
    } else {
        printf("Fail");
    }
    return 0;
}`,
        hints: ["Order of conditions matters in if-else chains", "Check which condition is evaluated first"],
        testCases: [
            { input: "", expectedOutput: "First Class", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Prime Number Check",
        description: "This code checks if a number is prime but has a loop boundary error.",
        programmingLanguage: "C",
        difficulty: "hard",
        buggyCode: `#include <stdio.h>

int main() {
    int num = 9;
    int isPrime = 1;

    for (int i = 2; i < num / 2; i++) {
        if (num % i == 0) {
            isPrime = 0;
            break;
        }
    }

    if (isPrime)
        printf("Prime");
    else
        printf("Not Prime");

    return 0;
}`,
        solutionCode: `#include <stdio.h>

int main() {
    int num = 9;
    int isPrime = 1;

    if (num <= 1) {
        isPrime = 0;
    } else {
        for (int i = 2; i <= num / 2; i++) {
            if (num % i == 0) {
                isPrime = 0;
                break;
            }
        }
    }

    if (isPrime)
        printf("Prime");
    else
        printf("Not Prime");

    return 0;
}`,
        hints: ["The loop condition uses < but should include the boundary", "Also consider edge cases like 0 and 1"],
        testCases: [
            { input: "", expectedOutput: "Not Prime", isHidden: false }
        ],
        points: 200
    },
    {
        title: "Login Validation (String Comparison)",
        description: "This code compares strings incorrectly. Fix the string comparison logic.",
        programmingLanguage: "C",
        difficulty: "hard",
        buggyCode: `#include <stdio.h>

int main() {
    char username[] = "admin";
    char password[] = "1234";

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
    char username[] = "admin";
    char password[] = "1234";

    if (strcmp(username, "admin") == 0 && strcmp(password, "1234") == 0) {
        printf("Login Successful");
    } else {
        printf("Invalid Login");
    }
    return 0;
}`,
        hints: ["In C, you cannot compare strings using ==", "Use the strcmp() function from string.h"],
        testCases: [
            { input: "", expectedOutput: "Login Successful", isHidden: false }
        ],
        points: 200
    }
];

// ============================================
// C++ CHALLENGES
// ============================================
const cppChallenges = [
    {
        title: "Missing Semicolon & Wrong if-else Syntax",
        description: "This C++ code has a missing semicolon and incorrect if-else alignment. Find and fix both errors.",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;

int main() {
    int marks = 85
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
    int marks = 85;
    if (marks > 50) {
        cout << "Pass";
    } else {
        cout << "Fail";
    }
    return 0;
}`,
        hints: ["Check for missing semicolons", "The else keyword needs proper alignment"],
        testCases: [
            { input: "", expectedOutput: "Pass", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Missing Semicolon in Output Statement",
        description: "This function adds two numbers but has a compilation error in the output.",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(10, 20);
    cout << result
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(10, 20);
    cout << result;
    return 0;
}`,
        hints: ["Every statement needs to end properly", "Check the cout line"],
        testCases: [
            { input: "", expectedOutput: "30", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Incorrect main() Signature",
        description: "This code has an incorrect main function signature. Fix it.",
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
        hints: ["main() should return int", "Add the return statement"],
        testCases: [
            { input: "", expectedOutput: "C++ Debugging", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Even or Odd Checker (Logic Error)",
        description: "This code checks even/odd but the logic is reversed.",
        programmingLanguage: "C++",
        difficulty: "easy",
        buggyCode: `#include <iostream>
using namespace std;

int main() {
    int number = 7;

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
    int number = 7;

    if (number % 2 == 0) {
        cout << "Even";
    } else {
        cout << "Odd";
    }
    return 0;
}`,
        hints: ["Even numbers have remainder 0 when divided by 2", "Check the condition"],
        testCases: [
            { input: "", expectedOutput: "Odd", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Average of Numbers (Operator Precedence)",
        description: "This code calculates average incorrectly due to operator precedence.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;

int main() {
    int a = 10, b = 20, c = 30;
    int avg = a + b + c / 3;
    cout << "Average = " << avg;
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int a = 10, b = 20, c = 30;
    int avg = (a + b + c) / 3;
    cout << "Average = " << avg;
    return 0;
}`,
        hints: ["Division happens before addition", "Use parentheses"],
        testCases: [
            { input: "", expectedOutput: "Average = 20", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Factorial Calculation",
        description: "This factorial code always returns 0. Fix the initialization.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;

int main() {
    int n = 5;
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
    int n = 5;
    int fact = 1;

    for (int i = 1; i <= n; i++) {
        fact = fact * i;
    }
    cout << fact;
    return 0;
}`,
        hints: ["0 times anything is 0", "Check initial value of fact"],
        testCases: [
            { input: "", expectedOutput: "120", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Array Sum (Out of Bounds)",
        description: "This code has an array boundary error.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;

int main() {
    int arr[] = {2, 4, 6, 8};
    int sum = 0;

    for (int i = 0; i <= 4; i++) {
        sum += arr[i];
    }
    cout << sum;
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int arr[] = {2, 4, 6, 8};
    int sum = 0;
    int size = sizeof(arr) / sizeof(arr[0]);

    for (int i = 0; i < size; i++) {
        sum += arr[i];
    }
    cout << sum;
    return 0;
}`,
        hints: ["Array indices go from 0 to length-1", "Check the loop condition"],
        testCases: [
            { input: "", expectedOutput: "20", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Pass / First Class Logic",
        description: "The condition order is wrong in this grade classifier.",
        programmingLanguage: "C++",
        difficulty: "medium",
        buggyCode: `#include <iostream>
using namespace std;

int main() {
    int marks = 75;

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
    int marks = 75;

    if (marks > 60) {
        cout << "First Class";
    } else if (marks >= 40) {
        cout << "Pass";
    } else {
        cout << "Fail";
    }
    return 0;
}`,
        hints: ["Check the order of conditions", "Higher condition should be checked first"],
        testCases: [
            { input: "", expectedOutput: "First Class", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Prime Number Check",
        description: "This prime checker has a loop boundary error.",
        programmingLanguage: "C++",
        difficulty: "hard",
        buggyCode: `#include <iostream>
using namespace std;

int main() {
    int num = 9;
    bool isPrime = true;

    for (int i = 2; i < num / 2; i++) {
        if (num % i == 0) {
            isPrime = false;
            break;
        }
    }

    if (isPrime)
        cout << "Prime";
    else
        cout << "Not Prime";

    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    int num = 9;
    bool isPrime = true;

    if (num <= 1) {
        isPrime = false;
    } else {
        for (int i = 2; i <= num / 2; i++) {
            if (num % i == 0) {
                isPrime = false;
                break;
            }
        }
    }

    if (isPrime)
        cout << "Prime";
    else
        cout << "Not Prime";

    return 0;
}`,
        hints: ["The loop uses < but should use <=", "Handle edge cases"],
        testCases: [
            { input: "", expectedOutput: "Not Prime", isHidden: false }
        ],
        points: 200
    },
    {
        title: "Login Validation",
        description: "This code works in C++ but could be improved. Use compare() method.",
        programmingLanguage: "C++",
        difficulty: "hard",
        buggyCode: `#include <iostream>
using namespace std;

int main() {
    string username = "admin";
    string password = "1234";

    if (username == "admin" && password == "1234") {
        cout << "Login Successful";
    } else {
        cout << "Invalid Login";
    }
    return 0;
}`,
        solutionCode: `#include <iostream>
using namespace std;

int main() {
    string username = "admin";
    string password = "1234";

    if (username.compare("admin") == 0 && password.compare("1234") == 0) {
        cout << "Login Successful";
    } else {
        cout << "Invalid Login";
    }
    return 0;
}`,
        hints: ["While == works for strings in C++, compare() is more explicit", "compare() returns 0 for equal strings"],
        testCases: [
            { input: "", expectedOutput: "Login Successful", isHidden: false }
        ],
        points: 200
    }
];

// ============================================
// JAVA CHALLENGES
// ============================================
const javaChallenges = [
    {
        title: "Missing Symbols & Wrong Declaration",
        description: "This Java code has missing semicolon and incorrect if-else syntax. Fix both errors.",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `class Main {
    public static void main(String args[]) {
        int marks = 85
        if(marks > 50) {
            System.out.println("Pass");
        else {
            System.out.println("Fail");
        }
    }
}`,
        solutionCode: `class Main {
    public static void main(String[] args) {
        int marks = 85;
        if (marks > 50) {
            System.out.println("Pass");
        } else {
            System.out.println("Fail");
        }
    }
}`,
        hints: ["Check for missing semicolons", "else needs closing brace before it"],
        testCases: [
            { input: "", expectedOutput: "Pass", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Method Definition Error",
        description: "This calculator code has a missing semicolon. Find and fix it.",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `class Main {
    static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int result = add(10, 20);
        System.out.println(result)
    }
}`,
        solutionCode: `class Main {
    static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int result = add(10, 20);
        System.out.println(result);
    }
}`,
        hints: ["Check the println statement", "Every statement needs a semicolon"],
        testCases: [
            { input: "", expectedOutput: "30", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Incorrect Class & Main Signature",
        description: "This code has an incorrect main method parameter. Fix it.",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `public class Main {
    public static void main(String args) {
        System.out.println("Java Debugging");
    }
}`,
        solutionCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Java Debugging");
    }
}`,
        hints: ["main() takes an array of Strings", "Add [] to the parameter"],
        testCases: [
            { input: "", expectedOutput: "Java Debugging", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Even or Odd Checker",
        description: "This code checks even/odd but produces incorrect output.",
        programmingLanguage: "Java",
        difficulty: "easy",
        buggyCode: `class Main {
    public static void main(String[] args) {
        int number = 7;

        if(number % 2 == 1) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`,
        solutionCode: `class Main {
    public static void main(String[] args) {
        int number = 7;

        if (number % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`,
        hints: ["Even numbers have remainder 0", "Check the condition"],
        testCases: [
            { input: "", expectedOutput: "Odd", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Average of Numbers",
        description: "This code has an operator precedence issue.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `class Main {
    public static void main(String[] args) {
        int a = 10, b = 20, c = 30;
        int avg = a + b + c / 3;
        System.out.println("Average = " + avg);
    }
}`,
        solutionCode: `class Main {
    public static void main(String[] args) {
        int a = 10, b = 20, c = 30;
        int avg = (a + b + c) / 3;
        System.out.println("Average = " + avg);
    }
}`,
        hints: ["Division has higher precedence", "Use parentheses"],
        testCases: [
            { input: "", expectedOutput: "Average = 20", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Factorial Calculation",
        description: "This factorial code always outputs 0. Fix the initialization.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `class Main {
    public static void main(String[] args) {
        int n = 5;
        int fact = 0;

        for(int i = 1; i <= n; i++) {
            fact = fact * i;
        }
        System.out.println(fact);
    }
}`,
        solutionCode: `class Main {
    public static void main(String[] args) {
        int n = 5;
        int fact = 1;

        for (int i = 1; i <= n; i++) {
            fact = fact * i;
        }
        System.out.println(fact);
    }
}`,
        hints: ["Multiplying by 0 gives 0", "Check initial value"],
        testCases: [
            { input: "", expectedOutput: "120", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Array Sum",
        description: "This code throws ArrayIndexOutOfBoundsException.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `class Main {
    public static void main(String[] args) {
        int[] arr = {2, 4, 6, 8};
        int sum = 0;

        for(int i = 0; i <= arr.length; i++) {
            sum += arr[i];
        }
        System.out.println(sum);
    }
}`,
        solutionCode: `class Main {
    public static void main(String[] args) {
        int[] arr = {2, 4, 6, 8};
        int sum = 0;

        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        System.out.println(sum);
    }
}`,
        hints: ["Array index goes from 0 to length-1", "Check the loop condition"],
        testCases: [
            { input: "", expectedOutput: "20", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Student Pass/Fail Logic",
        description: "The conditions are in wrong order.",
        programmingLanguage: "Java",
        difficulty: "medium",
        buggyCode: `class Main {
    public static void main(String[] args) {
        int marks = 75;

        if(marks > 40) {
            System.out.println("Pass");
        } else if(marks > 60) {
            System.out.println("First Class");
        } else {
            System.out.println("Fail");
        }
    }
}`,
        solutionCode: `class Main {
    public static void main(String[] args) {
        int marks = 75;

        if (marks > 60) {
            System.out.println("First Class");
        } else if (marks >= 40) {
            System.out.println("Pass");
        } else {
            System.out.println("Fail");
        }
    }
}`,
        hints: ["Higher threshold should be checked first", "Reorder conditions"],
        testCases: [
            { input: "", expectedOutput: "First Class", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Prime Number Check",
        description: "This prime checker has a subtle loop error.",
        programmingLanguage: "Java",
        difficulty: "hard",
        buggyCode: `class Main {
    public static void main(String[] args) {
        int num = 9;
        boolean isPrime = true;

        for(int i = 2; i < num / 2; i++) {
            if(num % i == 0) {
                isPrime = false;
                break;
            }
        }

        if(isPrime)
            System.out.println("Prime");
        else
            System.out.println("Not Prime");
    }
}`,
        solutionCode: `class Main {
    public static void main(String[] args) {
        int num = 9;
        boolean isPrime = true;

        if (num <= 1) {
            isPrime = false;
        } else {
            for (int i = 2; i <= num / 2; i++) {
                if (num % i == 0) {
                    isPrime = false;
                    break;
                }
            }
        }

        if (isPrime)
            System.out.println("Prime");
        else
            System.out.println("Not Prime");
    }
}`,
        hints: ["Loop should use <= not <", "Handle edge cases like 0 and 1"],
        testCases: [
            { input: "", expectedOutput: "Not Prime", isHidden: false }
        ],
        points: 200
    },
    {
        title: "Login Validation",
        description: "This code uses == for string comparison which is incorrect in Java.",
        programmingLanguage: "Java",
        difficulty: "hard",
        buggyCode: `class Main {
    public static void main(String[] args) {
        String username = "admin";
        String password = "1234";

        if(username == "admin" && password == "1234") {
            System.out.println("Login Successful");
        } else {
            System.out.println("Invalid Login");
        }
    }
}`,
        solutionCode: `class Main {
    public static void main(String[] args) {
        String username = "admin";
        String password = "1234";

        if (username.equals("admin") && password.equals("1234")) {
            System.out.println("Login Successful");
        } else {
            System.out.println("Invalid Login");
        }
    }
}`,
        hints: ["In Java, == compares references, not values", "Use .equals() for string comparison"],
        testCases: [
            { input: "", expectedOutput: "Login Successful", isHidden: false }
        ],
        points: 200
    }
];

// ============================================
// PYTHON CHALLENGES
// ============================================
const pythonChallenges = [
    {
        title: "Missing Colon & Indentation Error",
        description: "This Python code has a missing colon after if. Fix the syntax error.",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `marks = 85
if marks > 50
    print("Pass")
else:
    print("Fail")`,
        solutionCode: `marks = 85
if marks > 50:
    print("Pass")
else:
    print("Fail")`,
        hints: ["if statements need a colon at the end", "Check the if line"],
        testCases: [
            { input: "", expectedOutput: "Pass", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Function Call Syntax Error",
        description: "This code has incorrect function call syntax.",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `def add(a, b):
    return a + b

result = add 10, 20
print(result)`,
        solutionCode: `def add(a, b):
    return a + b

result = add(10, 20)
print(result)`,
        hints: ["Function calls need parentheses", "Check how add is called"],
        testCases: [
            { input: "", expectedOutput: "30", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Incorrect Indentation",
        description: "This code has missing indentation inside the function.",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `def main():
print("Python Debugging")

main()`,
        solutionCode: `def main():
    print("Python Debugging")

main()`,
        hints: ["Code inside a function must be indented", "Add spaces before print"],
        testCases: [
            { input: "", expectedOutput: "Python Debugging", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Even or Odd Checker (Logic Error)",
        description: "This code has reversed even/odd logic.",
        programmingLanguage: "Python",
        difficulty: "easy",
        buggyCode: `number = 7

if number % 2 == 1:
    print("Even")
else:
    print("Odd")`,
        solutionCode: `number = 7

if number % 2 == 0:
    print("Even")
else:
    print("Odd")`,
        hints: ["Even numbers have remainder 0", "Fix the condition"],
        testCases: [
            { input: "", expectedOutput: "Odd", isHidden: false }
        ],
        points: 100
    },
    {
        title: "Average of Numbers (Operator Precedence)",
        description: "This code gives wrong average due to operator precedence.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `a, b, c = 10, 20, 30
avg = a + b + c / 3
print("Average =", avg)`,
        solutionCode: `a, b, c = 10, 20, 30
avg = (a + b + c) / 3
print("Average =", avg)`,
        hints: ["Division happens before addition", "Use parentheses"],
        testCases: [
            { input: "", expectedOutput: "Average = 20.0", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Factorial Calculation",
        description: "This factorial code always returns 0. Fix initialization.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `n = 5
fact = 0

for i in range(1, n + 1):
    fact = fact * i

print(fact)`,
        solutionCode: `n = 5
fact = 1

for i in range(1, n + 1):
    fact = fact * i

print(fact)`,
        hints: ["0 * anything = 0", "Check initial value of fact"],
        testCases: [
            { input: "", expectedOutput: "120", isHidden: false }
        ],
        points: 150
    },
    {
        title: "List Sum – Index Error",
        description: "This code throws IndexError. Fix the range.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `arr = [2, 4, 6, 8]
sum = 0

for i in range(0, len(arr) + 1):
    sum += arr[i]

print(sum)`,
        solutionCode: `arr = [2, 4, 6, 8]
total = 0

for i in range(len(arr)):
    total += arr[i]

print(total)`,
        hints: ["range(len(arr)) gives 0 to len-1", "Don't add 1 to length"],
        testCases: [
            { input: "", expectedOutput: "20", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Pass / First Class Logic",
        description: "Conditions are in wrong order.",
        programmingLanguage: "Python",
        difficulty: "medium",
        buggyCode: `marks = 75

if marks > 40:
    print("Pass")
elif marks > 60:
    print("First Class")
else:
    print("Fail")`,
        solutionCode: `marks = 75

if marks > 60:
    print("First Class")
elif marks >= 40:
    print("Pass")
else:
    print("Fail")`,
        hints: ["Check higher threshold first", "Reorder conditions"],
        testCases: [
            { input: "", expectedOutput: "First Class", isHidden: false }
        ],
        points: 150
    },
    {
        title: "Prime Number Check (Logical Error)",
        description: "This prime checker has a range error.",
        programmingLanguage: "Python",
        difficulty: "hard",
        buggyCode: `num = 9
is_prime = True

for i in range(2, num // 2):
    if num % i == 0:
        is_prime = False
        break

if is_prime:
    print("Prime")
else:
    print("Not Prime")`,
        solutionCode: `num = 9
is_prime = True

if num <= 1:
    is_prime = False
else:
    for i in range(2, num // 2 + 1):
        if num % i == 0:
            is_prime = False
            break

if is_prime:
    print("Prime")
else:
    print("Not Prime")`,
        hints: ["range excludes the end value", "Add 1 to include it"],
        testCases: [
            { input: "", expectedOutput: "Not Prime", isHidden: false }
        ],
        points: 200
    },
    {
        title: "Login Validation (String Comparison)",
        description: "This code uses 'is' instead of '==' for string comparison.",
        programmingLanguage: "Python",
        difficulty: "hard",
        buggyCode: `username = "admin"
password = "1234"

if username is "admin" and password is "1234":
    print("Login Successful")
else:
    print("Invalid Login")`,
        solutionCode: `username = "admin"
password = "1234"

if username == "admin" and password == "1234":
    print("Login Successful")
else:
    print("Invalid Login")`,
        hints: ["'is' checks identity, not equality", "Use == for value comparison"],
        testCases: [
            { input: "", expectedOutput: "Login Successful", isHidden: false }
        ],
        points: 200
    }
];

// ============================================
// SEED FUNCTION
// ============================================
async function seedChallenges() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing challenges
        await CodeChallenge.deleteMany({});
        console.log('Cleared existing challenges');

        // Combine all challenges
        const allChallenges = [
            ...cChallenges,
            ...cppChallenges,
            ...javaChallenges,
            ...pythonChallenges
        ];

        // Insert all challenges
        const inserted = await CodeChallenge.insertMany(allChallenges);
        console.log(`\n✅ Inserted ${inserted.length} challenges\n`);

        // Summary
        console.log('Summary by language:');
        console.log(`  C:      ${cChallenges.length} challenges`);
        console.log(`  C++:    ${cppChallenges.length} challenges`);
        console.log(`  Java:   ${javaChallenges.length} challenges`);
        console.log(`  Python: ${pythonChallenges.length} challenges`);
        console.log(`  ─────────────────────`);
        console.log(`  Total:  ${allChallenges.length} challenges`);

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seedChallenges();
