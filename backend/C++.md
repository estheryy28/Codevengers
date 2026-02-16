## **🔹 Code 1: Missing Semicolon & Wrong if–else Syntax (C++)**

### **❌ Given Code**

\#include \<iostream\>  
using namespace std;

int main() {  
    int marks \= 85  
    if (marks \> 50\) {  
        cout \<\< "Pass";  
    else {  
        cout \<\< "Fail";  
    }  
    return 0;  
}

### **👉 Errors**

* Missing semicolon  
* `else` not properly aligned

\#include \<iostream\>  
using namespace std;

int main() {  
    int marks \= 85;  
    if (marks \> 50\) {  
        cout \<\< "Pass";  
    } else {  
        cout \<\< "Fail";  
    }  
    return 0;  
}

## **🔹 Code 2: Missing Semicolon in Output Statement**

### **❌ Given Code**

\#include \<iostream\>  
using namespace std;

int add(int a, int b) {  
    return a \+ b;  
}

int main() {  
    int result \= add(10, 20);  
    cout \<\< result  
    return 0;  
}

### **👉 Error**

* Missing semicolon after `cout`

\#include \<iostream\>  
using namespace std;

int add(int a, int b) {  
    return a \+ b;  
}

int main() {  
    int result \= add(10, 20);  
    cout \<\< result;  
    return 0;  
}

## **🔹 Code 3: Incorrect `main()` Signature**

### **❌ Given Code**

\#include \<iostream\>  
using namespace std;

void main() {  
    cout \<\< "C++ Debugging";  
}

### **👉 Error**

* `main()` should return `int`

\#include \<iostream\>  
using namespace std;

int main() {  
    cout \<\< "C++ Debugging";  
    return 0;  
}

## **🔹 Code 4: Even or Odd Checker (Logic Error)**

### **❌ Given Code**

\#include \<iostream\>  
using namespace std;

int main() {  
    int number \= 7;

    if (number % 2 \== 1\) {  
        cout \<\< "Even";  
    } else {  
        cout \<\< "Odd";  
    }  
    return 0;  
}

### **👉 Error**

* Even/Odd logic reversed

\#include \<iostream\>  
using namespace std;

int main() {  
    int number \= 7;

    if (number % 2 \== 0\) {  
        cout \<\< "Even";  
    } else {  
        cout \<\< "Odd";  
    }  
    return 0;  
}

**🔹 Code 5: Average of Numbers (Operator Precedence)**

### **❌ Given Code**

\#include \<iostream\>  
using namespace std;

int main() {  
    int a \= 10, b \= 20, c \= 30;  
    int avg \= a \+ b \+ c / 3;  
    cout \<\< "Average \= " \<\< avg;  
    return 0;  
}

### **👉 Error**

* Operator precedence mistake

\#include \<iostream\>  
using namespace std;

int main() {  
    int a \= 10, b \= 20, c \= 30;  
    int avg \= (a \+ b \+ c) / 3;  
    cout \<\< "Average \= " \<\< avg;  
    return 0;  
}

## **🔹 Code 6: Factorial Calculation**

### **❌ Given Code**

\#include \<iostream\>  
using namespace std;

int main() {  
    int n \= 5;  
    int fact \= 0;

    for (int i \= 1; i \<= n; i++) {  
        fact \= fact \* i;  
    }  
    cout \<\< fact;  
    return 0;  
}

### **👉 Error**

* Wrong initial value of `fact`

\#include \<iostream\>  
using namespace std;

int main() {  
    int n \= 5;  
    int fact \= 1;

    for (int i \= 1; i \<= n; i++) {  
        fact \= fact \* i;  
    }  
    cout \<\< fact;  
    return 0;  
}

## **🔹 Code 7: Array Sum (Out of Bounds)**

### **❌ Given Code**

\#include \<iostream\>  
using namespace std;

int main() {  
    int arr\[\] \= {2, 4, 6, 8};  
    int sum \= 0;

    for (int i \= 0; i \<= 4; i++) {  
        sum \+= arr\[i\];  
    }  
    cout \<\< sum;  
    return 0;  
}

### **👉 Error**

* Loop exceeds array boundary

\#include \<iostream\>  
using namespace std;

int main() {  
    int arr\[\] \= {2, 4, 6, 8};  
    int sum \= 0;  
    int size \= sizeof(arr) / sizeof(arr\[0\]);

    for (int i \= 0; i \< size; i++) {  
        sum \+= arr\[i\];  
    }  
    cout \<\< sum;  
    return 0;  
}

## **🔹 Code 8: Pass / First Class Logic**

### **❌ Given Code**

\#include \<iostream\>  
using namespace std;

int main() {  
    int marks \= 39;

    if (marks \> 40\) {  
        cout \<\< "Pass";  
    } else if (marks \> 60\) {  
        cout \<\< "First Class";  
    } else {  
        cout \<\< "Fail";  
    }  
    return 0;  
}

### **👉 Error**

* Conditions arranged incorrectly

\#include \<iostream\>  
using namespace std;

int main() {  
    int marks \= 39;

    if (marks \> 60\) {  
        cout \<\< "First Class";  
    } else if (marks \>= 40\) {  
        cout \<\< "Pass";  
    } else {  
        cout \<\< "Fail";  
    }  
    return 0;  
}

**🔹 Code 9: Prime Number Check (Logical Error)**

### **❌ Given Code**

\#include \<iostream\>  
using namespace std;

int main() {  
    int num \= 9;  
    bool isPrime \= true;

    for (int i \= 2; i \< num / 2; i++) {  
        if (num % i \== 0\) {  
            isPrime \= false;  
            break;  
        }  
    }

    if (isPrime)  
        cout \<\< "Prime";  
    else  
        cout \<\< "Not Prime";

    return 0;  
}

### **👉 Error**

* Loop condition skips required divisor

\#include \<iostream\>  
using namespace std;

int main() {  
    int num \= 9;  
    bool isPrime \= true;

    if (num \<= 1\) {  
        isPrime \= false;  
    } else {  
        for (int i \= 2; i \<= num / 2; i++) {  
            if (num % i \== 0\) {  
                isPrime \= false;  
                break;  
            }  
        }  
    }

    if (isPrime)  
        cout \<\< "Prime";  
    else  
        cout \<\< "Not Prime";

    return 0;  
}

**🔹 Code 10: Login Validation (String Comparison)**

### **❌ Given Code**

\#include \<iostream\>  
using namespace std;

int main() {  
    string username \= "admin";  
    string password \= "1234";

    if (username \== "admin" && password \== "1234") {  
        cout \<\< "Login Successful";  
    } else {  
        cout \<\< "Invalid Login";  
    }  
    return 0;  
}

### **👉 Trick Question**

* **This code is actually CORRECT in C++**  
  (`std::string` supports `==`)

\#include \<iostream\>  
using namespace std;

int main() {  
    string username \= "admin";  
    string password \= "1234";

    if (username.compare("admin") \== 0 && password.compare("1234") \== 0\) {  
        cout \<\< "Login Successful";  
    } else {  
        cout \<\< "Invalid Login";  
    }  
    return 0;  
}  
