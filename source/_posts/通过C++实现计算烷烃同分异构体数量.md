---
title: C++计算烷烃同分异构体数量
date: 2025-05-10 17:42:49
tags: 算法
categories: 算法
toc: true
style: |
  .post-content {
    font-family: "楷体", "STKaiti", serif;
    font-size: 18px;
  }
index_img: /images/bg6.jpg
#banner_img: /images/bg3.png
---



## C++计算烷烃同分异构体数量

### 引子

事出有因，吾今为高一学子，昨日于化学课习及有机物，恰留意到 `烷烃` 之 `癸烷`，以变幻无端之结构组合，竟得七十五种同分异构体，吾觉甚牛而逼之，然转念思之，彼言七十五种，果如是乎？”然吾性懒，弗能以草稿纸列诸般品类而逐个数之。忽又转念，可借算法以行计算，遂成此文。

###### smalltalk: 此文因吾水平尚浅（方入 OI 约两月且资质驽钝），故于其中借助 DeepSeek 以辅助算法之设计。



### 初步思考

首先来看看我们要通过算法实现计算烷烃同分异构体数量需要哪些基础知识(部分参考来源于DeepSeek)

| 领域         | 具体知识点                                          |
| :----------- | :-------------------------------------------------- |
| **化学**     | 烷烃通式、碳四价键规则、同分异构体概念。            |
| **编程**     | 输入输出、`map` 存储键值对、条件语句（`if-else`）。 |
| **数学**     | 查表法（避免复杂计算，直接引用已知结果）。          |
| **问题分解** | 先验证输入合法性，再通过预存数据快速返回结果。      |



进行进一步分析，得出的利用思路如下

#### **1. 化学知识利用**

- **烷烃通式**：C**n**H**2n+2**
- **碳骨架规则**：
  - 每个碳原子（C）必须形成 **4 个共价键**（与其他 C 或 H 原子连接）
  - 氢原子（H）只能形成 **1 个键**，且不参与骨架构建

#### **2. 简化问题**

- 仅计算 **碳骨架的非环状结构**（不考虑立体异构或复杂对称性）
- 手动预存小规模 **n** 的异构体数量（n≤10），避免复杂算法

#### **3. 编程实现**

- **输入验证**：检查 *H* 是否等于 2C+2
- **查表法**：直接返回预计算的异构体数量（适用于 C≤10）
- **逐步扩展**：未来可升级到递归生成碳骨架



### 具体分析

1. **输入验证**

   我们先检查输入的`H`的数量是否满足`2C+2`，否则进行错误回显

2. 查表法

   - 使用 `map` 存储 n=1∼10*n*=1∼10 的异构体数量（刚好到癸烷）
   - 例如：
     - **n=4** -> 2种异构体（正丁烷、异丁烷）
     - **n=5** -> 3种异构体

3. 输出结果

   - 直接返回表中对应的异构体数量，若 n>10 则提示不支持

现在是最终优化过的代码
```C++
#include <iostream>
#include <bits/stdc++.h>
#include <map>
using namespace std;

int main() {
    int carbon, hydrogen;
    // 提示用户输入碳原子数
    printf("Enter the number of carbon atoms (C): ");
    scanf("%d",&carbon);
    
    // 提示用户输入氢原子数
    printf("Enter the number of hydrogen atoms (H): ");
    scanf("%d",&hydrogen);
    
    // 验证是否为烷烃（CnH2n + 2）
    if (hydrogen != 2 * carbon + 2) {
        printf("Error: This is not an alkane (expected H = 2C + 2).\n");
        return 0;
    }

    // 预计算的烷烃异构体数量（n = 1~10）
    map<int, int> isomerTable = {
        {1, 1},  // CH4
        {2, 1},  // C2H6
        {3, 1},  // C3H8
        {4, 2},  // C4H10（正丁烷、异丁烷）
        {5, 3},  // C5H12
        {6, 5},  // C6H14
        {7, 9},  // C7H16
        {8, 18}, // C8H18
        {9, 35}, // C9H20
        {10, 75} // C10H22
    };

    if (carbon >= 1 && carbon <= 10) {
        printf("Number of alkane isomers for C%dH%d: %d\n", carbon, hydrogen, isomerTable[carbon]);
    } 
    else {
        printf("Error: Carbon count must be 1~10 (this program is for beginners).\n");
  }
  return 0;
}
```

当然，我们只能计算碳原子数量为10的烷烃，表现出我们的功能完全不够强大，我也思考了关于后续补充的一些其他想法，诸如升级递归算法、引入图论(马上把基础打完滚去学树)甚至是结合动态规划或生成函数优化计算(需学习组合数学)，后续我还会更新的 敬请期待！



<script src="https://giscus.app/client.js"
        data-repo="p4y1oad/p4y1oad.github.io"
        data-repo-id="R_kgDONzaTTQ"
        data-category="Announcements"
        data-category-id="DIC_kwDONzaTTc4Cpqn7"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>