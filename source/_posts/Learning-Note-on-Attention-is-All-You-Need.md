---
title: Learning Note on Attention is All You Need
date: 2025-05-10 08:38:58
tags: AI/ML
categories: ML / LLM
index_img: /images/LNOAIAYN.jpg
math: true
toc: true
style: |
  .post-content {
    font-family: "楷体", "STKaiti", serif;
    font-size: 18px;
  }
---


---

*[You also could click here to download this article.](https://github.com/Solkatt-cn/LLMStudyNotes/tree/main/Google2017AttentionIsAllYouNeed/note.md)*

### Learning Note on "Attention Is All You Need" 

#### For Absolute Beginners:

1. Only basic math required (+, -, ×, ÷)
2. All technical terms explained using 🍔🍰 examples
3. Key concepts marked with (⭐)

------

### 1. Why Was Transformer Invented?

#### 1.1 Problems with Old AI (RNN/LSTM): Why are traditional models like "pass the word game"?

Imagine you are playing a game of pass the word game, and the rules are as follows:

1.**Strict order**: You must pass the word A→B→C→D one by one, and you cannot skip anyone

2.**Memory decay**: When it reaches the 10th person, the words said by the first person may have changed beyond recognition

3.**Low efficiency**: You must wait for the previous person to finish speaking 

#### 1.2 How Humans Process Information

##### Empirical Observation

When reading the sentence:
"Although it's raining, __ forgot an umbrella"
Human cognition demonstrates:

1. **Semantic Association**: Instantaneous strong linkage between "raining" and "umbrella"
2. **Non-sequential Processing**: Accurate prediction of the missing pronoun ("he/she") without word-by-word reading
3. **Contextual Integration**: Automatic suppression of irrelevant information (e.g., the concessive "although") while focusing on critical concepts

#### Cognitive Science and Attention Mechanism Alignment

This phenomenon directly inspired the **Attention Mechanism** in Transformers:

- **Key-Value-Query Model**
  The human brain analogously performs:
  
  ![1](/images/Learning-Note-on-Attention-is-All-You-Need/1.png)

Then I'll explain the formula to you with the understanding of a high school student, Imagine you're in the cafeteria for lunch (that's the attention mechanic!).：

**Q (Query) - What you need**
"What do I want to eat today?" (e.g. want to eat spicy food, want to have a full stomach)

**K (Key) - The signboard of the window**
Menu for each rice window (Window 1: Spicy Fragrant Pot; Window 2: Beef noodles... ）
  ![](/images/Learning-Note-on-Attention-is-All-You-Need/2.png)

**Degree of matching**
You take your requirement (Q) and compare it with the menu (K) of each window:

- Spicy fragrant pot: spicy ✅, full-filling ✅, → high score
- Beef noodles: slightly spicy ❌ and filling ✅→ medium
- Salad: not spicy ❌, not full ❌→ Low score

  ![3](/images/Learning-Note-on-Attention-is-All-You-Need/3.png)


 **Prevent "Difficulty in Selection"**
If there are too many menu options (d_k too big), you need to divide by the root number d_k make the score more reasonable, so that all the scores are too high to make a difficult choice

**Softmax - Make a choice**
Convert fractions into probabilities:

- Spicy Pot: 70%
- Beef noodles: 25%
- Salad: 5%
  (It's like turning fractions into percentages)

**V (Value)—Final decision**
*Allocate attention based on probability:*

1. 70% of the "attention funds" are invested in spicy fragrant pot
2. 25% to beef noodles
3. 5% to salads
4. The whole process is:
   You (Q) go to the cafeteria with your needs, compare the menus (K), calculate the matching degree (QK^T), prevent too many options (√d_k), use Softmax to calculate the probability, and finally decide how to distribute the meal money (V)!

- - So when processing "raining" (as Query), it automatically retrieves association strength (Value) with "umbrella" (Key)
- **Global Perception**
  Sequential processing in traditional RNNs vs. human parallel processing → Transformer's self-attention design

#### Core Implications (*Attention Is All You Need*)

1. **Long-Range Dependency**
   Humans handle "Although...umbrella" without distance constraints → Transformer's attention window overcomes RNN gradient vanishing
2. **Dynamic Weight Allocation**
   Humans assign higher weight to "umbrella" → Model's attention scores automatically learn feature importance
3. **Cross-Modality Generality**
   The same mechanism applies to vision (local image regions) and speech (phoneme alignment)

#### Comparative Evidence

| Processing Mode  | Human Performance                     | Transformer Performance     |
| :--------------- | :------------------------------------ | :-------------------------- |
| Association Span | Unlimited distance                    | Theoretically infinite      |
| Processing Speed | 200-300ms/concept                     | O(1)-level parallelism      |
| Error Patterns   | Semantic interference (e.g., "sunny") | Similarity matrix confusion |

> Key Conclusion: The attention mechanism mathematically models human information processing, validating the cognitive hypothesis that "association takes precedence over sequence".



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
