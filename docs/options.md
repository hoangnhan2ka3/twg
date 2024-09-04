# ⚙️ Options

## 📌 Table of contents

- [`default` version](#-default-version)
- [`extend` version](#-extend-version)
- [Custom options](#-custom-options)
  - [Custom `callee`](#-custom-callee)
  - [Custom `nestingCallee`](#-custom-nestingcallee)
  - [Custom `separator`](#-custom-separator)
  - [Turn off `debug`](#-turn-off-debug)

---

## ⏩ `default` version

### `replacer()` options

Options          | Types              | Default | Description                                                                                                                                                                                                              | Lite | Status
-----------------|--------------------|:-------:|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----:|:-----:
`callee?`        | string \| string[] |  "twg"  | The function name to use for detecting Tailwind classes. You can change it to whatever you defined in `lib/utils.ts`, eg. `cn`, `cx`, etc. or `["cn", "cx"]`. _(Name it as unique as possible or you'll have conflicts)_ |  ✅   |   ✅
`separator?`<sup style="color: #2f81f7">[1]</sup> | string \| false    |   ":"   | The separator used to join the variant with classes. If `false`, you may need to write it manually, eg.: `twg({"before:": "flex"})`. <sup style="color: #2f81f7">[1]</sup>Remember to sync this option with `separator` option in `twg()` option.          |  x   |   ✅
`debug`          | boolean            |  true   | Printing debug messages in console if there are any warnings or errors. If `false`, it will be silent                                                                                                                    |  x   |   ✅

See [how to use](#-custom-options).

### `twg()` options

Options                | Types           | Default | Description                                                                                                                                                                                                                                                                                 | Lite | Status
-----------------------|-----------------|:-------:|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----:|:-----:
`separator?`<sup style="color: #2f81f7">[1]</sup> <sup style="color: #2f81f7">[2]</sup> | string \| false |   ":"   | The separator used to join the variant with classes. If `false`, you may need to write it manually, eg.: `twg({"before:": "flex"})`. <sup style="color: #2f81f7">[1]</sup>Remember to sync this option with `separator` option in `replacer()` option. <sup style="color: #2f81f7">[2]</sup>Put this option in the **LAST** object of the `twg()` function. |  x   |   ✅

See [how to use](#-custom-separator).

---

## ⏩ `extend` version

### `replacer()` options

Options          | Types              |       Default        | Description                                                                                                                                                                                                                                | Lite | Status
-----------------|--------------------|:--------------------:|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----:|:-----:
`callee?`        | string \| string[] |        "twg"         | The function name to use for detecting Tailwind classes. You can change it to whatever you defined in `lib/utils.ts`, eg. `cn`, `cx`, etc. or `["cn", "cx"]`. _(Name it as unique as possible or you'll have conflicts)_                   |  ✅   |   ✅
`nestingCallee?` | string \| string[] | `callee?` \|\| "twg" | The callee name that allow to be nested inside the main callee function. Useful when you have another custom utility function that handle specific kind of arguments. Default allows `"twg"` or the callee you defined in `callee` option. |  x   |   🧪
`separator?`<sup style="color: #2f81f7">[1]</sup> | string \| false    |         ":"          | The separator used to join the variant with classes. If `false`, you may need to write it manually, eg.: `twg({"before:": "flex"})`. <sup style="color: #2f81f7">[1]</sup>Remember to sync this option with `separator` option in `twg()` option.                            |  x   |   ✅
`debug`          | boolean            |         true         | Printing debug messages in console if there are any warnings or errors. If `false`, it will be silent                                                                                                                                      |  x   |   ✅

See [how to use](#-custom-options).

### `twg()` options

Options                | Types           | Default | Description                                                                                                                                                                                                                                                                                 | Lite | Status
-----------------------|-----------------|:-------:|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----:|:-----:
`separator?`<sup style="color: #2f81f7">[1]</sup> <sup style="color: #2f81f7">[2]</sup> | string \| false |   ":"   | The separator used to join the variant with classes. If `false`, you may need to write it manually, eg.: `twg({"before:": "flex"})`. <sup style="color: #2f81f7">[1]</sup>Remember to sync this option with `separator` option in `replacer()` option. <sup style="color: #2f81f7">[2]</sup>Put this option in the **LAST** object of the `twg()` function. |  x   |   ✅

See [how to use](#-custom-separator).

---

## 🔧 Custom options

### ⏩ Custom `callee`

**1. Change the `callee` option `replacer()` to the callee's name you want, eg. with `cn`:**

  ```js
  // tailwind.config.ts

  transform: {
    DEFAULT: replacer({
      callee: "cn"
    })
  }
  ```

**2. Use several ways to import it:**

- **Option 1:**

  ```jsx
  import { twg as cn } from "twg"
  ```

- **Option 2:**

  ```jsx
  // src/lib/utils.ts
  import { twg as cn } from "twg"
  export { cn }

  // src/Component.tsx
  import { cn } from "@/lib/utils"
  ```

- **Option 3:** [Use with wrapper like `twMerge` 👇](../docs/usage.md#best-practice-with-twmerge).

### ⏩ Custom `nestingCallee`

**1. Change the `nestingCallee` option on `replacer()` to the callee's name you want, eg.:**

  ```js
  transform: {
    DEFAULT: replacer({
      // Define options here, eg.:
      callee: "twg",
      nestingCallee: ["clsx", "twg"]
    })
  }
  ```

**2. Example:**

  ```jsx
  // HelloWorld.tsx

  import clsx from "clsx"
  import { twg } from "twg/extend"

  export function HelloWorld() {
    return (
      <div className={twg(
        "size-92 relative grid place-items-center px-4 py-2",
        {
          before: [
            "absolute inset-0",
            clsx(
              "bg-red-500",
              "hover:bg-blue-500 hover:text-yellow-500",
              "active:border-2 active:border-white"
            )
          ]
        }
      )}>
        Hello, World!
      </div>
    )
  }
  ```

  Output _(what Tailwind will scan, not in browser's inspect tool)_:

  ```html
  <div className="size-92 relative grid place-items-center px-4 py-2 before:absolute before:inset-0 before:bg-red-500 before:hover:bg-blue-500 before:hover:text-yellow-500 before:active:border-2 before:active:border-white">
    Hello, World!
  </div>
  ```

### ⏩ Custom `separator`

Example with separator as `"_"`:

> [!IMPORTANT]
> You must define the `separator` option to **BOTH** `twg()` and `replacer()`.

**1. In `replacer()` options:**

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
      ],
      transform: {
        DEFAULT: replacer({
          callee: "cn",
          separator: "_" // Define `separator` here
        })
      }
    },
    // Other configurations...
  } satisfies Config
  ```

**2. In `twg()` options:**

  ```js
  // src/lib/utils.ts

  import { twg, type ClassValue } from "twg"
  import { extendTailwindMerge } from "tailwind-merge"

  export function cn(...inputs: ClassValue[]) {
    return twg(...inputs, {
      separator: "_" // Always be the last Object
    })
  }
  ```

**3. Example:**

  ```jsx
  // HelloWorld.tsx

  import { cn } from "@/lib/utils"

  export function HelloWorld() {
    return (
      <div className={cn(
        "size-92 relative grid place-items-center px-4 py-2",
        {
          before: [
            "absolute inset-0 bg-red-500",
            {
              hover: "bg-blue-500 text-yellow-500"
            }
          ],
          "aria-expanded": "bg-red-500 text-yellow-500",
        }
      )}>
        Hello, World!
      </div>
    )
  }
  ```

Output (html):

  ```html
  <div class="size-92 relative grid place-items-center before_absolute before_inset-0 before_bg-red-500 before_hover_bg-blue-500 before_hover_text-yellow-500 aria-expanded_bg-red-500 aria-expanded_text-yellow-500">
    Hello, World!
  </div>
  ```

### ⏩ Turn off `debug`

Printing debug messages in console if there are any warnings or errors, eg.:

  ```bash
  ⚠️ TWG - Problem occurred on `replacer()`:
  utilities is not defined in:
  - { utilities }
  Trying to be transformed into:
  + { utilities }
  ```

If set to `false`, it will not print any debug messages.

---

<div style="display: flex; justify-content: space-between; align-items: center;">
  <p align="start">
    <a href="../docs/README.md">< Back to docs</a>
  </p>
  <p align="center">
    MIT © <a href="https://github.com/hoangnhan2ka3">Nguyễn Hoàng Nhân</a>
  </p>
  <p align="end">
    <a href="#">Scroll to top</a>
  </p>
</div>
