

## **🔹 Code 1: Missing Colon & Indentation Error**

### **❌ Given Code**

marks \= 85  
if marks \> 50  
    print("Pass")  
else:  
    print("Fail")

### **👉 Errors**

* Missing `:` after `if`  
* Indentation depends on correct syntax

marks \= 85  
if marks \> 50:  
    print("Pass")  
else:  
    print("Fail")

## **🔹 Code 2: Function Call Syntax Error**

### **❌ Given Code**

def add(a, b):  
    return a \+ b

result \= add 10, 20  
print(result)

### **👉 Error**

* Incorrect function call syntax

def add(a, b):  
    return a \+ b

result \= add(10, 20\)  
print(result)

## **🔹 Code 3: Incorrect Indentation (Very Common)**

### **❌ Given Code**

def main():  
print("Python Debugging")

main()

### **👉 Error**

* Indentation missing inside function

def main():  
    print("Python Debugging")

main()

## **🔹 Code 4: Even or Odd Checker (Logic Error)**

### **❌ Given Code**

number \= 7

if number % 2 \== 1:  
    print("Even")  
else:  
    print("Odd")

### **👉 Error**

* Even/Odd logic reversed

number \= 7

if number % 2 \== 0:  
    print("Even")  
else:  
    print("Odd")

## **🔹 Code 5: Average of Numbers (Operator Precedence)**

### **❌ Given Code**

a, b, c \= 10, 20, 30  
avg \= a \+ b \+ c / 3  
print("Average \=", avg)

### **👉 Error**

* Operator precedence mistake

a, b, c \= 10, 20, 30  
avg \= (a \+ b \+ c) / 3  
print("Average \=", avg)

## **🔹 Code 6: Factorial Calculation**

### **❌ Given Code**

n \= 5  
fact \= 0

for i in range(1, n \+ 1):  
    fact \= fact \* i

print(fact)

### **👉 Error**

* Wrong initial value of `fact`

n \= 5  
fact \= 1

for i in range(1, n \+ 1):  
    fact \= fact \* i

print(fact)

## **🔹 Code 7: Array (List) Sum – Index Error**

### **❌ Given Code**

arr \= \[2, 4, 6, 8\]  
sum \= 0

for i in range(0, len(arr) \+ 1):  
    sum \+= arr\[i\]

print(sum)

### **👉 Error**

* Loop goes out of range

arr \= \[2, 4, 6, 8\]  
total \= 0

for i in range(len(arr)):  
    total \+= arr\[i\]

print(total)

## **🔹 Code 8: Pass / First Class Logic**

### **❌ Given Code**

marks \= 39

if marks \> 40:  
    print("Pass")  
elif marks \> 60:  
    print("First Class")  
else:  
    print("Fail")

### **👉 Error**

* Conditions in wrong order

marks \= 39

if marks \> 60:  
    print("First Class")  
elif marks \>= 40:  
    print("Pass")  
else:  
    print("Fail")

## **🔹 Code 9: Prime Number Check (Logical Error)**

### **❌ Given Code**

num \= 9  
is\_prime \= True

for i in range(2, num // 2):  
    if num % i \== 0:  
        is\_prime \= False  
        break

if is\_prime:  
    print("Prime")  
else:  
    print("Not Prime")

### **👉 Error**

* Loop does not check all required divisors  
* Missing check for numbers ≤ 1

num \= 9  
is\_prime \= True

if num \<= 1:  
    is\_prime \= False  
else:  
    for i in range(2, num // 2 \+ 1):  
        if num % i \== 0:  
            is\_prime \= False  
            break

if is\_prime:  
    print("Prime")  
else:  
    print("Not Prime")

## **🔹 Code 10: Login Validation (String Comparison)**

### **❌ Given Code**

username \= "admin"  
password \= "1234"

if username is "admin" and password is "1234":  
    print("Login Successful")  
else:  
    print("Invalid Login")

### **👉 Error**

* Using `is` instead of `==` for string comparison

username \= "admin"  
password \= "1234"

if username \== "admin" and password \== "1234":  
    print("Login Successful")  
else:  
    print("Invalid Login")

