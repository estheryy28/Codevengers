## **🔹 Code 1: Missing Semicolon & Wrong if–else Syntax** 

### **❌ Given Code**

\#include \<stdio.h\>

int main() {  
    int marks \= 85  
    if (marks \> 50\) {  
        printf("Pass");  
    else {  
        printf("Fail");  
    }  
    return 0;  
}

### **👉 Errors**

* Missing semicolon after `85`  
* `else` not properly aligned with `if`

\#include \<stdio.h\>

int main() {  
    int marks \= 85;  
    if (marks \> 50\) {  
        printf("Pass");  
    } else {  
        printf("Fail");  
    }  
    return 0;  
}

## **🔹 Code 2: Missing Semicolon in printf**

### **❌ Given Code**

\#include \<stdio.h\>

int add(int a, int b) {  
    return a \+ b;  
}

int main() {  
    int result \= add(10, 20);  
    printf("%d", result)  
    return 0;  
}

### **👉 Error**

* Missing semicolon after `printf`

\#include \<stdio.h\>

int add(int a, int b) {  
    return a \+ b;  
}

int main() {  
    int result \= add(10, 20);  
    printf("%d", result);  
    return 0;  
}

## **🔹 Code 3: Wrong `main()` Declaration**

### **❌ Given Code**

\#include \<stdio.h\>

void main() {  
    printf("C Debugging");  
}

### **👉 Error**

* Non-standard `main()` declaration

\#include \<stdio.h\>

int main() {  
    printf("C Debugging");  
    return 0;  
}

## **🔹 Code 4: Even or Odd Checker (Logic Error)**

### **❌ Given Code**

\#include \<stdio.h\>

int main() {  
    int number \= 7;

    if (number % 2 \== 1\) {  
        printf("Even");  
    } else {  
        printf("Odd");  
    }  
    return 0;  
}

### **👉 Error**

* Even/Odd logic reversed

\#include \<stdio.h\>

int main() {  
    int number \= 7;

    if (number % 2 \== 0\) {  
        printf("Even");  
    } else {  
        printf("Odd");  
    }  
    return 0;  
}

## **🔹 Code 5: Average of Numbers (Operator Precedence)**

### **❌ Given Code**

\#include \<stdio.h\>

int main() {  
    int a \= 10, b \= 20, c \= 30;  
    int avg \= a \+ b \+ c / 3;  
    printf("Average \= %d", avg);  
    return 0;  
}

### **👉 Error**

* Operator precedence issue

\#include \<stdio.h\>

int main() {  
    int a \= 10, b \= 20, c \= 30;  
    int avg \= (a \+ b \+ c) / 3;  
    printf("Average \= %d", avg);  
    return 0;  
}

## **🔹 Code 6: Factorial Calculation**

### **❌ Given Code**

\#include \<stdio.h\>

int main() {  
    int n \= 5;  
    int fact \= 0;

    for (int i \= 1; i \<= n; i++) {  
        fact \= fact \* i;  
    }  
    printf("%d", fact);  
    return 0;  
}

### **👉 Error**

* Wrong initial value of `fact`

\#include \<stdio.h\>

int main() {  
    int n \= 5;  
    int fact \= 1;

    for (int i \= 1; i \<= n; i++) {  
        fact \= fact \* i;  
    }  
    printf("%d", fact);  
    return 0;  
}

## **🔹 Code 7: Array Sum (Out of Bounds)**

### **❌ Given Code**

\#include \<stdio.h\>

int main() {  
    int arr\[\] \= {2, 4, 6, 8};  
    int sum \= 0;

    for (int i \= 0; i \<= 4; i++) {  
        sum \+= arr\[i\];  
    }  
    printf("%d", sum);  
    return 0;  
}

### **👉 Error**

* Loop runs beyond array size

\#include \<stdio.h\>

int main() {  
    int arr\[\] \= {2, 4, 6, 8};  
    int sum \= 0;  
    int size \= sizeof(arr) / sizeof(arr\[0\]);

    for (int i \= 0; i \< size; i++) {  
        sum \+= arr\[i\];  
    }  
    printf("%d", sum);  
    return 0;  
}

## **🔹 Code 8: Pass / First Class Logic**

### **❌ Given Code**

\#include \<stdio.h\>

int main() {  
    int marks \= 39;

    if (marks \> 40\) {  
        printf("Pass");  
    } else if (marks \> 60\) {  
        printf("First Class");  
    } else {  
        printf("Fail");  
    }  
    return 0;  
}

### **👉 Error**

* Conditions in wrong order

\#include \<stdio.h\>

int main() {  
    int marks \= 39;

    if (marks \> 60\) {  
        printf("First Class");  
    } else if (marks \>= 40\) {  
        printf("Pass");  
    } else {  
        printf("Fail");  
    }  
    return 0;  
}

## **🔹 Code 9: Prime Number Check (Logical Error)**

### **❌ Given Code**

\#include \<stdio.h\>

int main() {  
    int num \= 9;  
    int isPrime \= 1;

    for (int i \= 2; i \< num / 2; i++) {  
        if (num % i \== 0\) {  
            isPrime \= 0;  
            break;  
        }  
    }

    if (isPrime)  
        printf("Prime");  
    else  
        printf("Not Prime");

    return 0;  
}

### **👉 Error**

* Loop condition skips required divisor

\#include \<stdio.h\>

int main() {  
    int num \= 9;  
    int isPrime \= 1;

    if (num \<= 1\) {  
        isPrime \= 0;  
    } else {  
        for (int i \= 2; i \<= num / 2; i++) {  
            if (num % i \== 0\) {  
                isPrime \= 0;  
                break;  
            }  
        }  
    }

    if (isPrime)  
        printf("Prime");  
    else  
        printf("Not Prime");

    return 0;  
}

## **🔹 Code 10: Login Validation (String Comparison)**

### **❌ Given Code**

\#include \<stdio.h\>

int main() {  
    char username\[\] \= "admin";  
    char password\[\] \= "1234";

    if (username \== "admin" && password \== "1234") {  
        printf("Login Successful");  
    } else {  
        printf("Invalid Login");  
    }  
    return 0;  
}

### **👉 Error**

* Cannot compare strings using `==` in C

\#include \<stdio.h\>  
\#include \<string.h\>

int main() {  
    char username\[\] \= "admin";  
    char password\[\] \= "1234";

    if (strcmp(username, "admin") \== 0 && strcmp(password, "1234") \== 0\) {  
        printf("Login Successful");  
    } else {  
        printf("Invalid Login");  
    }  
    return 0;  
}  
