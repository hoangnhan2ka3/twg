<div align="center">
  <img src="../public/twg_logo.webp" alt="twg logo" width="150px" height="150px">
</div>

<h1 align="center">⚙️ Options</h1>

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

### `transformer()` options

| Options                    | Types              | Default | Description                                                                                                                                                                                                                 | Lite | Status |
|:---------------------------|:-------------------|:-------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----:|:------:|
| `callee?`                  | string \| string[] |  "twg"  | The function name to use for detecting Tailwind classes. You can change it to whatever you defined in `lib/utils.ts`, eg. `cn`, `cx`, etc. or `["cn", "cx"]`. _(Name it as unique as possible or you'll have conflicts)_    |  ✅  |   ✅   |
| `separator?`<sup>[*]</sup> | string \| false    |   ":"   | The separator used to join the variant with classes. If `false`, you may need to write it manually, eg.: `{"before:": "flex"}`. <sup>[*]</sup>Remember to sync this option with `separator` option in `createTwg()` option. |  x   |   ✅   |
| `debug`                    | boolean            |  true   | Printing debug messages in console if there are any warnings or errors. If `false`, it will be silent                                                                                                                       |  x   |   ✅   |

See [how to use](#-custom-options).

### `createTwg()` options

| Options                    | Types           | Default | Description                                                                                                                                                                                                                                  | Lite | Status |
|:---------------------------|:----------------|:-------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----:|:------:|
| `separator?`<sup>[*]</sup> | string \| false |   ":"   | The separator used to join the variant with classes. If `false` or `empty string`, you may need to write it manually, eg.: `{"before:": "flex"}`. <sup>[*]</sup>Remember to sync this option with `separator` option in `transformer()` option. |  x   |   ✅   |

See [how to use](#-custom-separator).

---

## ⏩ `extend` version

### `transformer()` options

| Options                    | Types              |  Default  | Description                                                                                                                                                                                                                                | Lite | Status |
|:---------------------------|:-------------------|:---------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----:|:------:|
| `callee?`                  | string \| string[] |   "twg"   | The function name to use for detecting Tailwind classes. You can change it to whatever you defined in `lib/utils.ts`, eg. `cn`, `cx`, etc. or `["cn", "cx"]`. _(Name it as unique as possible or you'll have conflicts)_                   |  ✅  |   ✅   |
| `nestingCallee?`           | string \| string[] | `callee?` | The callee name that allow to be nested inside the main callee function. Useful when you have another custom utility function that handle specific kind of arguments. Default allows `"twg"` or the callee you defined in `callee` option. |  x   |   🧪   |
| `separator?`<sup>[*]</sup> | string \| false    |    ":"    | The separator used to join the variant with classes. If `false`, you may need to write it manually, eg.: `{"before:": "flex"}`. <sup>[*]</sup>Remember to sync this option with `separator` option in `createTwg()` option.                |  x   |   ✅   |
| `debug`                    | boolean            |   true    | Printing debug messages in console if there are any warnings or errors. If `false`, it will be silent                                                                                                                                      |  x   |   ✅   |

See [how to use](#-custom-options).

### `createTwg()` options

| Options                    | Types           | Default | Description                                                                                                                                                                                                                                  | Lite | Status |
|:---------------------------|:----------------|:-------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----:|:------:|
| `separator?`<sup>[*]</sup> | string \| false |   ":"   | The separator used to join the variant with classes. If `false` or `empty string`, you may need to write it manually, eg.: `{"before:": "flex"}`. <sup>[*]</sup>Remember to sync this option with `separator` option in `transformer()` option. |  x   |   ✅   |

See [how to use](#-custom-separator).

---

## 🔧 Custom options

### ⏩ Custom `callee`

**1. Change the `callee` option `transformer()` to the callee's name you want, eg. with `cn`:**

  ```js
  // tailwind.config.ts

  transform: {
    DEFAULT: transformer({
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

**1. Change the `nestingCallee` option on `transformer()` to the callee's name you want, eg.:**

  ```js
  transform: {
    DEFAULT: transformer({
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
> You must define the `separator` option to **BOTH** `createTwg()` and `transformer()`.

**1. In `transformer()` options:**

  ```js
  // tailwind.config.ts

  import { type Config } from "tailwindcss"
  import { transformer } from "twg"

  export default {
    content: {
      files: [
        "./src/app/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}",
      ],
      transform: {
        DEFAULT: transformer({
          callee: "cn",
          separator: "_" // Define `separator` here
        })
      }
    },
    // Other configurations...
  } satisfies Config
  ```

**2. In `createTwg()` options:**

> [!NOTE]
> `twg()` is an alias of `createTwg()` function, that mean `twg()` is simply exported with default `createTwg()`'s `separator` option, which is `":"`. So if you want to custom the `separator`, you must define it in `createTwg()`, not in `twg()`.

  ```js
  // src/lib/utils.ts

  import { createTwg, type ClassValue } from "twg"

  export function cn(...inputs: ClassValue[]) {
    return createTwg({ separator: "_" })(...inputs)
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

If `separator` option is set to `false`, you may manually define the separator yourself:

  ```js
  // src/lib/utils.ts

  import { createTwg, type ClassValue } from "twg"

  export function cn(...inputs: ClassValue[]) {
    return createTwg({ separator: false })(...inputs)
  }
  ```

Example:

  ```jsx
  // HelloWorld.tsx

  import { cn } from "@/lib/utils"

  export function HelloWorld() {
    return (
      <div className={cn(
        "size-92 relative grid place-items-center px-4 py-2",
        {
          "before:": [
            "absolute inset-0 bg-red-500",
            {
              "hover:": "bg-blue-500 text-yellow-500"
            }
          ],
          "text-": "lg red-500 pretty",
        }
      )}>
        Hello, World!
      </div>
    )
  }
  ```

Output (html):

  ```html
  <div class="size-92 relative grid place-items-center before:absolute before:inset-0 before:bg-red-500 before:hover:bg-blue-500 before:hover:text-yellow-500 text-lg text-red-500 text-pretty">
    Hello, World!
  </div>
  ```

### ⏩ Turn off `debug`

Printing debug messages in console if there are any warnings or errors, eg.:

  ```bash
  ⚠️ TWG - Problem occurred on `transformer()`:
  utilities is not defined in:
  - { utilities }
  Trying to be transformed into:
  + { utilities }
  ```

If set to `false`, it will not print any debug messages.

---

<div align="center" width="100%">
  <table>
    <tr>
      <th width="500px">
        <div align="start">
          <a href="../docs/README.md">< Back to docs</a>
        </div>
      </th>
      <th width="500px">
        <div align="center">
          MIT © <a href="https://github.com/hoangnhan2ka3">Nguyễn Hoàng Nhân</a>
        </div>
      </th>
      <th width="500px">
        <div align="end">
          <a href="#%EF%B8%8F-options">Scroll to top</a>
        </div>
      </th>
    </tr>
  </table>
</div>
