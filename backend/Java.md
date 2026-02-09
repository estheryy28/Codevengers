### **🔹 Code 1: Missing Symbols & Wrong Declaration**

`class Student {`  
    `public static void main(String args[]) {`  
        `int marks = 85`  
        `if(marks > 50) {`  
            `System.out.println("Pass");`  
        `else {`  
            `System.out.println("Fail");`  
        `}`  
    `}`  
`}`

👉 Errors involve missing semicolon and incorrect `if-else` syntax.

**Answer:**

* **Missing semicolon**  
* **`else` not aligned with `if`**

`class Student {`

    `public static void main(String[] args) {`

        `int marks = 85;`

        `if (marks > 50) {`

            `System.out.println("Pass");`

        `} else {`

            `System.out.println("Fail");`

        `}`

    `}`

`}`

### **🔹 Code 2: Method Definition Error**

`class Calculator {`  
    `static int add(int a, int b) {`  
        `return a + b;`  
    `}`

    `public static void main(String[] args) {`  
        `int result = add(10, 20);`  
        `System.out.println(result)`  
    `}`  
`}`

👉 Looks correct at first glance, but fails compilation.

**Answer:**

* **Missing semicolon in `println`**

**`class Calculator {`**

    **`static int add(int a, int b) {`**

        **`return a + b;`**

    **`}`**

    **`public static void main(String[] args) {`**

        **`int result = add(10, 20);`**

        **`System.out.println(result);`**

    **`}`**

**`}`**

### **🔹 Code 3: Incorrect Class & Main Signature**

`public class Sample {`  
    `public static void main(String args) {`  
        `System.out.println("Java Debugging");`  
    `}`  
`}`

👉 Very common mistake students make in exams.

**Answer:**

* **Incorrect `main()` parameter**

**`public class Sample {`**

    **`public static void main(String[] args) {`**

        **`System.out.println("Java Debugging");`**

    **`}`**

**`}`**

### **🔹 Code 4: Even or Odd Checker**

`class EvenOdd {`  
    `public static void main(String[] args) {`  
        `int number = 7;`

        `if(number % 2 == 1) {`  
            `System.out.println("Even");`  
        `} else {`  
            `System.out.println("Odd");`  
        `}`  
    `}`  
`}`

👉 Code runs but produces **incorrect output**.

**Answer:**

### **❌ Error**

* **Even/Odd logic reversed**

**`class EvenOdd {`**

    **`public static void main(String[] args) {`**

        **`int number = 7;`**

        **`if (number % 2 == 0) {`**

            **`System.out.println("Even");`**

        **`} else {`**

            **`System.out.println("Odd");`**

        **`}`**

    **`}`**

**`}`**

### **🔹 Code 5: Average of Numbers**

`class Average {`  
    `public static void main(String[] args) {`  
        `int a = 10, b = 20, c = 30;`  
        `int avg = a + b + c / 3;`  
        `System.out.println("Average = " + avg);`  
    `}`  
`}`

👉 Tests **operator precedence understanding**.

**Answer:**

* **Operator precedence mistake**

**`class Average {`**

    **`public static void main(String[] args) {`**

        **`int a = 10, b = 20, c = 30;`**

        **`int avg = (a + b + c) / 3;`**

        **`System.out.println("Average = " + avg);`**

    **`}`**

**`}`**

### **🔹 Code 6: Factorial Calculation**

`class Factorial {`  
    `public static void main(String[] args) {`  
        `int n = 5;`  
        `int fact = 0;`

        `for(int i = 1; i <= n; i++) {`  
            `fact = fact * i;`  
        `}`  
        `System.out.println(fact);`  
    `}`  
`}`

👉 Students must reason about **initial values**.

**Answer:**

* **Wrong initial value of `fact`**

**`class Factorial {`**

    **`public static void main(String[] args) {`**

        **`int n = 5;`**

        **`int fact = 1;`**

        **`for (int i = 1; i <= n; i++) {`**

            **`fact = fact * i;`**

        **`}`**

        **`System.out.println(fact);`**

    **`}`**

**`}`**

### **🔹 Code 7: Array Sum**

`class ArraySum {`  
    `public static void main(String[] args) {`  
        `int[] arr = {2, 4, 6, 8};`  
        `int sum = 0;`

        `for(int i = 0; i <= arr.length; i++) {`  
            `sum += arr[i];`  
        `}`  
        `System.out.println(sum);`  
    `}`  
`}`

👉 Logical \+ boundary condition error (classic but not trivial).

**Answer:**

* **Loop runs out of bounds**

**`class ArraySum {`**

    **`public static void main(String[] args) {`**

        **`int[] arr = {2, 4, 6, 8};`**

        **`int sum = 0;`**

        **`for (int i = 0; i < arr.length; i++) {`**

            **`sum += arr[i];`**

        **`}`**

        **`System.out.println(sum);`**

    **`}`**

**`}`**

### **🔹 Code 8: Student Pass/Fail Logic**

`class Result {`  
    `public static void main(String[] args) {`  
        `int marks = 39;`

        `if(marks > 40) {`  
            `System.out.println("Pass");`  
        `} else if(marks > 60) {`  
            `System.out.println("First Class");`  
        `} else {`  
            `System.out.println("Fail");`  
        `}`  
    `}`  
`}`

👉 Condition **order matters** — good discriminator question.

**Answer:**

* **Conditions arranged incorrectly**

**`class Result {`**

    **`public static void main(String[] args) {`**

        **`int marks = 39;`**

        **`if (marks > 60) {`**

            **`System.out.println("First Class");`**

        **`} else if (marks >= 40) {`**

            **`System.out.println("Pass");`**

        **`} else {`**

            **`System.out.println("Fail");`**

        **`}`**

    **`}`**

**`}`**

### **🔹 Code 9: Prime Number Check**

`class PrimeCheck {`  
    `public static void main(String[] args) {`  
        `int num = 9;`  
        `boolean isPrime = true;`

        `for(int i = 2; i < num / 2; i++) {`  
            `if(num % i == 0) {`  
                `isPrime = false;`  
                `break;`  
            `}`  
        `}`

        `if(isPrime)`  
            `System.out.println("Prime");`  
        `else`  
            `System.out.println("Not Prime");`  
    `}`  
`}`

👉 Logical flaw is **subtle**, not syntax-based.

**Answer:**

* **Loop condition skips required checks**

**`class PrimeCheck {`**

    **`public static void main(String[] args) {`**

        **`int num = 9;`**

        **`boolean isPrime = true;`**

        **`if (num <= 1) {`**

            **`isPrime = false;`**

        **`} else {`**

            **`for (int i = 2; i <= num / 2; i++) {`**

                **`if (num % i == 0) {`**

                    **`isPrime = false;`**

                    **`break;`**

                **`}`**

            **`}`**

        **`}`**

        **`if (isPrime)`**

            **`System.out.println("Prime");`**

        **`else`**

            **`System.out.println("Not Prime");`**

    **`}`**

**`}`**

### **🔹 Code 10: Login Validation**

`class Login {`  
    `public static void main(String[] args) {`  
        `String username = "admin";`  
        `String password = "1234";`

        `if(username == "admin" && password == "1234") {`  
            `System.out.println("Login Successful");`  
        `} else {`  
            `System.out.println("Invalid Login");`  
        `}`  
    `}`  
`}`

👉 Tests **string comparison logic** — excellent 3rd year filter.

**Answer:**

* **Using `==` instead of `.equals()`**

**`class Login {`**

    **`public static void main(String[] args) {`**

        **`String username = "admin";`**

        **`String password = "1234";`**

        **`if (username.equals("admin") && password.equals("1234")) {`**

            **`System.out.println("Login Successful");`**

        **`} else {`**

            **`System.out.println("Invalid Login");`**

        **`}`**

    **`}`**

**`}`**

