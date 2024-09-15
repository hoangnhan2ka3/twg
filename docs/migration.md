<div align="center">
  <img src="../public/twg_logo.webp" alt="twg logo" width="150px" height="150px">
</div>

<h1 align="center">⤴️ Migration Guide</h1>

## 📌 Table of contents

- [Usage](#-usage)
  - [Basic usage](#-basic-usage)
  - [Complex as ☠️ usage](#-complex-as-%EF%B8%8F-usage)
- [Use cases](#-use-cases)
  - [Conditionals](#-conditionals)
  - [Nesting callee functions](#-nesting-callee-functions)
- [Combination](#-combination)

---

> [!NOTE]
> For more detailed information (what's changed on each version), please read the [changelog](../CHANGELOG.md). Below is just a quick summary of breaking changes (latest upper, older lower) of users' behavior on each version.

## `v5` to `v6`

- ### ⏩ `transformer()` <sup>(old `replacer()`)</sup> import path

  - **Breaking changes:**
    - Renamed `replacer()` function to `transformer()`.
    - No `default` export anymore.
    - Removed `*/replacer` entry point.

  **Old (`v5`):**

  ```js
  import { replacer } from "twg/replacer"
  // or
  import replacer from "twg/replacer"
  ```

  **New (`v6`):**

  ```js
  import { transformer } from "twg"
  ```

- ### ⏩ `twg()` and `createTwg()` import

  - **Breaking changes:** No `default` export anymore.

  **Old (`v5`):**

  ```js
  import { twg } from "twg"
  // or
  import twg from "twg"
  ```

  ```js
  import { createTwg } from "twg"
  // or
  import createTwg from "twg"
  ```

  **New (`v6`):**

  ```js
  import { twg } from "twg"
  ```

  ```js
  import { createTwg } from "twg"
  ```

---

## `v4` to `v5`

- ### ⏩ `separator` option

  - **Breaking changes:** Now define the `separator` option in the new `createTwg()` API function. Not in the last object of `twg()` function anymore.

  **Old (`v4`):**

  ```js
  import { twg } from "twg"
  // or
  import twg from "twg"

  twg(
    "flex items-center justify-center",
    {
      before: [
        "absolute inset-0",
        {
          hover: "bg-blue-500 text-yellow-500"
        }
      ],
    },
    {
      separator: "_" // <== Always in the last object
    }
  )
  ```

  **New (`v5`):**

  ```js
  import { createTwg } from "twg"
  // or
  import createTwg from "twg"

  createTwg({ separator: "_" })(
    "flex items-center justify-center",
    {
      before: [
        "absolute inset-0",
        {
          hover: "bg-blue-500 text-yellow-500"
        }
      ],
    }
  )
  ```

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
          <a href="#-migration-guide">Scroll to top</a>
        </div>
      </th>
    </tr>
  </table>
</div>
