---
title: Basic Computer Architecture - The CPU and Memory
date: 2022-07-17 22:57:00 +0530
categories: [Computer Architecture]
tags: [programming from the ground up, low level computing, computer architecture, computer organization, computer memory, cpu]
comments: true
mermaid: true
pin: false
---


According to the **Von Newmann** architecture, computers are composed of two main components,
- The Central Processing Unit (CPU)
- The Memory

## The CPU
 The CPU contains the following components,
 - Program Counter
 - Instruction Decoder
 - Data bus
 - Registers
 - Arithmetic and Logical unit (ALU)

### Program Counter
A program counter (PC) holds the address of the next instruction to execute. A computer fetches the address held in the PC, and then fetches the value that is stored in that address and then passes this value to the `instruction decoder`.

### Instruction Decoder
The instruction decoder takes the value that is passed to it, and decodes the instruction. It figures out whether the instruction is `addition, subtraction, multiplication, data movement, etc` and also the memory addresses associated with the particular instruction. 
For example, if the instruction says `ADD a,b` - The instruction decoder figures out that the `Addition` operation needs to take place on two numbers which are located at the locations `a,b` in the memory.

### Data Bus
A data bus is the actual wire(s) that connects the CPU with the memory. It enables the CPU to load values from the main memory (RAM). 

### Registers
CPU has a special memory storage known as registers. Registers are small, high-speed locations that exist within the CPU. When processing values, the CPU loads them and stores them in the registers to access data faster. 
For example, for an instruction like `ADD a,b` - The CPU retrives the values stored at memory locations `a and b`, stores them in the general-purpose registers and performs the `ADD` operation.
There are two types of registers,
- General-purpose registers: holds temporary data for processing
- Special-purpose registers: for special purposes like holding the status of a program (like stack pointer, program counter, etc)

### Arithmetic and Logical Unit
Arithmetic and Logical Unit (ALU) is responsible for actually executing the decoded instruction (like performing addition, subtraction, etc). After the results are obtained, it places them in either the main memory or a register according to what is specified in the instruction.


## The Memory
A computer memory has multiple `fixed-size` storage locations. 
For example, if you have a memory of 256 Megabytes, it means that you have 256 million (mega = 1 million) fixed-size storage locations. Each storage location can store a byte (8 bits) of information. 
Each byte (fixed-size storage location) in the memory has its own address so that the CPU can access it when it wants to. We call this a `memory address`.

> A byte can hold a number between 0 and 255
{: .prompt-info }

Everything that computers store and process are nothing but numbers. These numbers have different special interpretations and they are converted to their interpretations when processing. 
For example, according to [ASCII](https://en.wikipedia.org/wiki/ASCII) standard, the capital letters `A-Z` are represented by the decimal numbers `65-90`. 

>**Storing numbers larger than 255?**
Each byte can only hold a number upto 255, but that doesn't mean computers cannot store and process numbers higher than 255. Bytes can be combined together to represent larger numbers.
For example, a number like `551` can be represented in binary as `1000100111` (using 10 bits), hence this number can be represented using two bytes `22 7`
{: .prompt-info}


### Word Size
The word size of a computer is the size of the CPU's register. On 32-bit computers, the word size is `32 bits (4 bytes)`, which means a register in such computers can hold values upto 4 bytes. Similarly, the word size of  64-bit computers is `64 bits (8 bytes)` which means a register in this computer can hold values upto 8 bytes.
The size of memory addresses is the same as the word size of the computer, i.e., in a 32-bit computer the addresses are 4 bytes long and in a 64-bit computer, the addresses are 8 bytes long.

> Computers cannot tell if a value is an address, a number,  or an instruction. A programmar gets to decide how to treat specific numbers/values located in the memory. For example, we can treat a value as either an ASCII number, or a memory address.
{: .prompt-info}

> A clarification: Memory addresses are only stored in registers and not in RAM, whereas values that are parameters for operations are stored in the RAM and are later moved into a register where they are stored temporarily until the operation is finished.
{: .prompt-tip}


### Pointers
Addresses that are stored in the memory are called `pointers`. They point to the other locations in the memory where the actual data required for the operations are stored. 

At any point, a memory address that is stored in a register can locate data in the RAM. Each bit in the memory address can reference each byte in the memory. 
According to this logic, at any given time when a memory address is in the register, 32-bit computers can access `2^32 = 4294967296 bytes` from the RAM and 64-bit computers can access `2^64 = 18446744073709551616 bytes` from the RAM.

For example, consider a memory address `122036470` in decimal which is `00000111010001100010000011110110` in binary and `74 62 0F 6` in hexadecimal. Each bit (0 or 1) in this memory address can reference an individual byte in the actual memory. Therefore, total number of bytes it can potentially reference is 2^32.


### Interpreting Memory
As a programmar, we can tell the computer how to store and interpret the data in the memory.

For example, let's say we want to store information about Customers in the memory with these attributes,
- Customer name (50 bytes)
- Customer address (50 bytes)
- Customer age (4 bytes)
- Customer ID (4 bytes)

We can follow one of these implementations.

#### Implementation 1
```
Start of Customer record (address: 1001)
-------
Name(50 bytes)     <---- start (1001) (address)
-------
Address (50 bytes) <---- start + 50 bytes (address)
-------
Age (4 bytes)      <---- start + 100 bytes (address)
-------
ID (4 bytes)       <---- start + 104 bytes (address)
```

With the above implementation, if we want to get the age of the customer, we take the start address (`1001` in this case) and add 100 to it, which gives `1101`. So we can simply get the value located at the address `1101` and it is the age of the customer.

So the flow of retrieving an attribute goes like this, 
``` 
value at (start address + offset)
```
But a disadvantage with this implementation is that the attributes need to have fixed size.

#### Implementation 2
Instead of storing the address of the start of customer record, we can store the addresses of pointers of each atrribute.
Let's assume the size of an address is 4 bytes long (1 word)

```
Start of Customer record (address: 1001)
-------
Name(50 bytes)     <---- start (1001) (pointer address)
-------
Address (50 bytes) <---- start + 4 bytes (pointer address)
-------
Age (4 bytes)      <---- start + 8 bytes (pointer address)
-------
ID (4 bytes)       <---- start + 12 bytes (pointer address)
```

With the above implementation, if we want to get the age of the customer, we take the pointer address of the start of customer record (`1001` in this case) and add 8 to it, which gives `1009`, now we get the value at this address which gives us the pointer which is pointing to the age of the customer.

The flow of retrieving an attribute goes like this,
```
value at (value at (start pointer address + offset))
```

In this implementation, we don't have to limit the size of the attributes of the customer record.


### Data Accessing Methods
There are different modes a processer can use to access data from the memory. 
- Immediate mode
- Register addressing mode
- Direct addressing mode
- Indexed addressing mode
- Indirect addressing mode
- Base pointer addressing mode

#### Immediate mode
In this mode, the data to access is embedded in the instruction itself.
For example, consider the instruction `ADD 2,3`. It directly specifies the numbers (2 and 3) to add in the instruction itself.

#### Register addressing mode
In this mode, the instruction contains a register to access rather than a memory address. For example, consider the instruction `ADD %eax, %ebx`. It specifies the registers (eax and ebx) from where the data is to be extracted from to perform the operation.

#### Direct addressing mode
In this mode, the instruction contains the memory address to access. For example, consider the instruction `ADD 1001h, 1005h`. It specifies the memory addresses (1001 and 1005) from where the values are to be extracted to perform the addition operation.

#### Indexed addressing mode
In this mode, the instruction contains a memory address and also an index register that holds an offset. The offset is added to the memory address before retrieving the value. 
For example, consider the instruction `ADD 1001h+%si, 1003h+%di`. It contains the memory addresses (1001 and 1003) and also the index registers (si and di) to offset the address.

#### Indirect addressing mode
In this mode, the instruction contains a register that contains a pointer of the actual data.
For example, if we specify the register `eax`, the pointer in this register is retrieved and then value pointed by the pointer is extracted to perform the action.

#### Base pointer addressing mode
Similar to indirect addressing mode, but it also includes an offset to the pointer stored in the register.


## References
- [Programming from the Ground Up by Jonathan Bartlett](https://www.researchgate.net/publication/265580654_Programming_from_the_Ground_Up)

[![Dominick Bruno](https://c5.rgstatic.net/m/448675030402/images/icons/icons/author-avatar.svg)](https://www.researchgate.net/scientific-contributions/Dominick-Bruno-2054000406)