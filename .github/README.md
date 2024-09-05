![twg_thumbnail](../public/twg_thumbnail.webp)

<p align="center">
  <a href="https://github.com/hoangnhan2ka3/twg/actions"><img src="https://img.shields.io/github/actions/workflow/status/hoangnhan2ka3/twg/tests.yml?branch=main&label=tests" alt="Tests Status"></a>
  <a href="https://bundlephobia.com/result?p=twg"><img src="https://img.shields.io/bundlephobia/min/twg@latest?label=bundle" alt="Bundle Size"></a>
  <a href="https://bundlephobia.com/result?p=twg"><img src="https://img.shields.io/bundlephobia/minzip/twg@latest?label=gzip&colorB=8a2be2" alt="Gzip Size"></a>
  <a href="https://www.npmjs.com/package/twg"><img src="https://img.shields.io/npm/dt/twg.svg?colorB=f279b6" alt="Total Downloads"></a>
  <a href="https://www.npmjs.com/package/twg"><img src="https://img.shields.io/npm/v/twg.svg?colorB=bc3433" alt="Latest Release"></a>
  <a href="https://github.com/twg/twg/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/twg.svg?colorB=d0bb76" alt="License"></a>
</p>

<p align="center">
A more elegant way of writing Tailwind classes. Never need to repeating the same variants over and over again 🤯.
</p>

---

<div align="center">

<table>
<tr>
  <th>
    <h3 align="center"><code>default</code> version</h3>
  </th>
  <th>
    <h3 align="center"><code>extend</code> version</h3>
  </th>
</tr>
<tr>
<td>

| 📍 Entry point                | 📦 Bundle | 📦 Gzip  |
|-------------------------------|:---------:|:---------:|
| `twg`                         |    1kB    | **558B**  |
| `twg/lite` 🪶                 |   763B    | **444B**  |
| `twg/replacer`                |   2.7kB   | **1.4kB** |
| `twg/lite/replacer` 🪶        |   2.2kB   | **1.2kB** |

</td>
<td>

| 📍 Entry point                | 📦 Bundle | 📦 Gzip  |
|-------------------------------|:---------:|:---------:|
| `twg/extend`                  |   1.1kB   | **592B**  |
| `twg/extend/lite` 🪶          |   875B    | **491B**  |
| `twg/extend/replacer`         |   2.5kB   | **1.1kB** |
| `twg/extend/lite/replacer` 🪶 |   1.9kB   | **852B**  |

</td>
</tr>
</table>

</div>

---

## 🗝️ Features

- ✅ Elegant.
- ✅ Easy setup.
- ✅ Support for multiple objects parsing.
- ✅ Support for nesting multiple objects, arrays, and itself functions.
- ✅ Support for (multiple) conditional classes, objects, and arrays.
- ✅ Customizable `callee` name and `separator`.
- ✅ Compatible with wrappers like [`twMerge`](https://github.com/dcastil/tailwind-merge).
- ✅ "Base" support for Tailwind CSS IntelliSense (IDEs extension), as well as [Hover Preview](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss#hover-preview).
- ✅ Lite version.

---

<div align="center">

<h3 align="center">
Version comparison
</h3>

| Features                                                                                               | `default` | `default/lite` | `extend` | `extend/lite` |
|--------------------------------------------------------------------------------------------------------|:---------:|:--------------:|:--------:|:-------------:|
| Accept string, number, array, object                                                                   |     ✓     |       ✓        |    ✓     |       ✓       |
| Accept template literal                                                                                |  partial  |    partial     |    ✓     |       ✓       |
| Accept multiple outermost objects                                                                      |     ✓     |       ✓        |    ✓     |       ✓       |
| Accept nesting objects, arrays                                                                         |     ✓     |       ✓        |    ✓     |       ✓       |
| Accept nesting template literal                                                                        |  partial  |    partial     |    ✓     |       ✓       |
| Accept nesting other callee functions inside main object(s)                                            |           |                |    ✓     |       ✓       |
| Accept logical conditionals                                                                            |     ✓     |       ✓        |    ✓     |       ✓       |
| Accept ternary conditionals                                                                            |  partial  |    partial     |    ✓     |       ✓       |
| Accept native object behavior (key as classes and value as conditionals)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |           |                |    ✓     |       ✓       |
| Compatible with wrappers                                                                               |     ✓     |       ✓        |    ✓     |       ✓       |
| Fully customizable                                                                                     |     ✓     |    partial     |    ✓     |    partial    |
| [Options](../docs/options.md) ↗️                                                                        |     3     |       1        |    4     |       1       |

<h3 align="center">
What version should I use?
</h3>

<div id="image-table" align="center">
  <table>
    <tr>
      <td>
        <ul>
          <li align="start">
            <code>default</code> version seems to be suitable for almost base cases, promise that you don't need to handle very complex conditions, template literals or nesting itself/custom functions.
          </li>
          <li align="start">
            In the other hand, <code>extend</code> version is the most stable and powerful, it can handle almost any cases you can imagine (if not, please open an issue), your only trade-off is that it's a bit slower than <code>default</code> version (because of AST parsing).
          </li>
          <li align="start">
            I'm currently using <code>extend/lite</code> version.
          </li>
        </ul>
      </td>
    </tr>
  </table>
</div>

<h3 align="center">
Tested conditions
</h3>

| No. | Framework/Lib    | Version                     | Additional info                                                | Tester | Status |
|:---:|------------------|-----------------------------|----------------------------------------------------------------|:------:|:------:|
| 1\. | `next`           | 15.0.0-canary.141           | With `--turbo` flag and `babel-plugin-react-compiler` enabled. | author |   ✅   |
| 2\. | `react`          | 19.0.0-rc-d1afcb43-20240903 |                                                                | author |   ✅   |
| 3\. | `tailwindcss`    | 3.4.10                      |                                                                | author |   ✅   |
| 4\. | `tailwind-merge` | 2.5.2                       |                                                                | author |   ✅   |

</div>

---

## 📌 Table of contents

- [News](#-news)
- [Quick intro](#-quick-intro)
- [Getting started](#-getting-started)
  - [`default` version](#-default-version)
  - [`extend` version](#-extend-version)
- [More on docs](#-docs)
- [Changelog](#-changelog)
- [Contributing](#%EF%B8%8F-contributing)
- [Credits](#-credits)

## 📰 News

<details>

<summary>Click to expand/collapse this section</summary>

- 🔥 From `v3.1.0`:

  - Supports nesting custom callee functions through `nestingCallee` option _(default version only)_.

    ```js
    transform: {
      DEFAULT: replacer({
        // Define options here, eg.:
        callee: "twg",
        nestingCallee: ["clsx", "twg"]
      })
    }
    ```

    **Usage:** see [custom `nestingCallee`](../docs/options.md#-custom-nestingcallee).

- 🔥 From `v2.0.0`:

  - Supports native objects behavior like `clsx` (Key as classes and value as conditionals)

    ```jsx
    twg({ foo: true, bar: false, baz: isTrue() });
    //=> "foo baz"

    twg({ "you are": true, not: false, m_y: 1, "destiny": isTrue() });
    //=> "you are m_y destiny"
    ```

  - Use `@babel` AST to parse all conditional classes, objects, arrays or even both string and array.
    - **Pros:**
      - More accurate, more trust in processing.
      - Works perfectly even with complex conditionals like nested ternary and inside template literal.
      - Reduce several complex regex use to parse condition.
      - Resolve all outstanding issues related to any kind of conditionals, nested conditionals.
    - **Cons:**
      - Currently work on _(.js, .ts, .jsx, .tsx)_ file only.
      - A bit slower, especially on the first time, when nothing is cached.
      - 4 more dependencies 😢

- 🔥 Lite version:

  Same as default, but:

  - Without any options API except for custom `callee` in [`replacer()` options](../docs/options.md#replacer-options).
  - No `debug messages` (no console messages).
  - No `JSDoc` comments for each function.
  - 20 ~ 30% lighter.
  - Compile 200 ~ 300ms faster (`extend` version).

> [!TIP]
> When you tested using with default version, and everything's OK. So you could want to use lite version, for better performance.

</details>

## 🚨 Quick intro

> [!TIP]
> Simply open an Object, put the `variant` as key, and classes you want to map to that `variant` as each value.

Example:

```jsx
<div className={twg(
  "size-92 relative grid place-items-center",
  {
    before: "absolute inset-0 bg-red-500",
    "aria-expanded": "bg-red-500 text-yellow-500",
  }
)}>
  Hello, World!
</div>
```

Output (html):

```jsx
<div class="size-92 relative grid place-items-center before:absolute before:inset-0 before:bg-red-500 aria-expanded:bg-red-500 aria-expanded:text-yellow-500">
  Hello, World!
</div>
```

## 🚀 Getting started

### ⏩ `default` version

**1. Install the package**

```bash
pnpm add twg
```

or

```bash
npm install twg
```

**2. Setup**

```js
// tailwind.config.ts

import { type Config } from "tailwindcss"
import { replacer } from "twg/replacer"
// or
import replacer from "twg/replacer"

export default {
  content: {
    files: [
      "./src/app/**/*.{ts,tsx}",
      "./src/components/**/*.{ts,tsx}",
    ], // Move your old `content` to `content.files` like this
    transform: {
      DEFAULT: replacer() // Put `replacer()` here
    }
  },
  // Other configurations...
} satisfies Config
```

- Lite version:

  ```js
  // tailwind.config.ts

  import { replacer } from "twg/lite/replacer"
  // or
  import replacer from "twg/lite/replacer"

  // Rest like above
  ```

- If you need to override default `replacer()` options:

  ```js
  transform: {
    DEFAULT: replacer({
      // Define options here, eg.:
      callee: "cn"
    })
  }
  ```

**3. Use**

```jsx
import { twg } from "twg"
// or
import twg from "twg"
```

- Lite version:

  ```jsx
  import { twg } from "twg/lite"
  ```

  See [how to use](../docs/usage.md).

- If you need to override default `twg()` options:

  ```js
  twg(
    //...,
    {
      separator: "-" // Always be the last Object
    }
  )
  ```

### ⏩ `extend` version

> [!NOTE]
>You need to install 4 more `@babel` dependencies in order to use `extend` version. Besides that, you just need to change the import statement from `twg/*` to `twg/extend/*`.

**1. Install the package**

```bash
pnpm add twg @babel/generator @babel/parser @babel/traverse @babel/types
```

or

```bash
npm install twg @babel/generator @babel/parser @babel/traverse @babel/types
```

**2. Setup**

```js
// tailwind.config.ts

import { type Config } from "tailwindcss"
import { replacer } from "twg/extend/replacer"
// or
import replacer from "twg/extend/replacer"

export default {
  content: {
    files: [
      "./src/app/**/*.{ts,tsx}",
      "./src/components/**/*.{ts,tsx}",
    ], // Move your old `content` to `content.files` like this
    transform: {
      DEFAULT: replacer() // Put `replacer()` here
    }
  },
  // Other configurations...
} satisfies Config
```

- Lite version:

  ```js
  // tailwind.config.ts

  import { replacer } from "twg/extend/lite/replacer"
  // or
  import replacer from "twg/extend/lite/replacer"

  // Rest like above
  ```

- If you need to override default `replacer()` options:

  ```js
  transform: {
    DEFAULT: replacer({
      // Define options here, eg.:
      callee: "cn"
    })
  }
  ```

**3. Use**

```jsx
import { twg } from "twg/extend"
// or
import twg from "twg/extend"
```

- Lite version:

  ```jsx
  import { twg } from "twg/extend/lite"
  ```

  See [how to use](../docs/usage.md).

- If you need to override default `twg()` options:

  ```js
  twg(
    //...,
    {
      separator: "-" // Always be the last Object
    }
  )
  ```

For more information, consider reading [custom options](../docs/options.md#-custom-options) ↗️ and [best practice](../docs/usage.md#best-practice-with-twmerge) ↗️.

## 📖 Docs

- [Usage / Use cases](../docs/usage.md) ↗️
  - [Usage](../docs/usage.md#-usage) ↗️
    - [Basic usage](../docs/usage.md#-basic-usage) ↗️
    - [Complex as ☠️ usage](../docs/usage.md#-complex-as-%EF%B8%8F-usage) ↗️
  - [Use cases](../docs/usage.md#-use-cases) ↗️
    - [Conditionals](../docs/usage.md#-conditionals) ↗️
    - [Nesting callee functions](../docs/usage.md#-nesting-callee-functions) ↗️
  - [Combination](../docs/usage.md#-combination)
- [Options](../docs/options.md) ↗️
  - [`replacer()` options](../docs/options.md#replacer-options) ↗️
  - [`twg` options](../docs/options.md#twg-options) ↗️
  - [Custom options](../docs/options.md#-custom-options) ↗️
    - [Custom `callee`](../docs/options.md#-custom-callee) ↗️
    - [Custom `nestingCallee`](../docs/options.md#-custom-nestingcallee) ↗️
    - [Custom `separator`](../docs/options.md#-custom-separator) ↗️
    - [Turn off `debug`](../docs/options.md#-turn-off-debug) ↗️
- [API](../docs/api.md) ↗️
- [Deeper explanation](../docs/introduction.md) ↗️
  - [What is `twg`?](../docs/introduction.md#-what-is-twg) ↗️
  - [Explanation](../docs/introduction.md#%EF%B8%8F-explanation) ↗️
  - [Trade-offs](../docs/introduction.md#-trade-offs) ↗️

## 🎉 Changelog

See [CHANGELOG.md](../CHANGELOG.md).

## 🎗️ Contributing

### Issues

`twg` now work for me but maybe not for you in some edges. Consider opening an [issue](https://github.com/hoangnhan2ka3/twg/issues) if you have any problem with it that I can fix it ASAP. Or a [pull request](https://github.com/hoangnhan2ka3/twg/pulls) is welcome too.

### 💪 Work with me

<https://www.linkedin.com/in/hoangnhan2ka3/>

## 🪪 Credits

### References

- [easy-tailwind](https://github.com/Noriller/easy-tailwind) ↗️
- [clsx](https://github.com/lukeed/clsx) ↗️
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) ↗️

### Project starts on

- August 15, 2024

### Funding

[![Donate me](https://img.shields.io/static/v1?label=Donate%20me&message=❤️&style=social)](https://github.com/sponsors/hoangnhan2ka3)

---

<div align="center" width="100%">
  <table>
    <tr>
      <th width="500px">
        <div align="start">
          <a href="#-getting-started">Getting started</a>
        </div>
      </th>
      <th width="500px">
        <div align="center">
          MIT © <a href="https://github.com/hoangnhan2ka3">Nguyễn Hoàng Nhân</a>
        </div>
      </th>
      <th width="500px">
        <div align="end">
          <a href="#">Scroll to top</a>
        </div>
      </th>
    </tr>
  </table>
</div>
