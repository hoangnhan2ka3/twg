# ✨ API

## 📌 Table of contents

- [default](#-default-version)
- [default/lite](#-defaultlite-version)
- [extend](#-default-version)
- [extend/lite](#-default-version)

---

## 💥 `default` version

- ### `replacer({ /* options */ })(content)`

  Exports: `module`, `default`

  Returns: `(content: string) => string`

  _@param_ — **[options](../docs/options.md#replacer-options)**: callee, separator, debug

  Types: `ReplacerOptions`

  ```js
  interface ReplacerOptions {
    callee?: string | string[],
    separator?: string | false,
    debug?: boolean
  }
  ```

- ### `twg(...inputs)`

  Exports: `module`, `default`

  Returns: `string`

  _@param_ — **inputs**

  Types: `(ClassValue | TWGOptions)[]`

  ```js
  type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>

  interface TWGOptions {
    separator?: string | false
  }
  ```

---

## 💥 `default/lite` version

- ### `replacer({ /* option */ })(content)`

  Exports: `module`, `default`

  Returns: `(content: string) => string`

  _@param_ — **[option](../docs/options.md#replacer-options)**: callee

  Types: `ReplacerOptions`

  ```js
  interface ReplacerOptions {
    callee?: string | string[],
  }
  ```

- ### `twg(...inputs)`

  Exports: `module`, `default`

  Returns: `string`

  _@param_ — **inputs**

  Types: `ClassValue[]`

  ```js
  type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

---

## 💥 `extend` version

- ### `replacer({ /* options */ })(content)`

  Exports: `module`, `default`

  Returns: `(content: string) => string`

  _@param_ — **[options](../docs/options.md#replacer-options)**: callee, nestingCallee, separator, debug

  Types: `ReplacerOptions`

  ```js
  export interface ReplacerOptions {
    callee?: string | string[],
    nestingCallee?: string | string[],
    separator?: string | false,
    debug?: boolean
  }
  ```

- ### `twg(...inputs)`

  Exports: `module`, `default`

  Returns: `string`

  _@param_ — **inputs**

  Types: `(ClassValue | TWGOptions)[]`

  ```js
  type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>

  interface TWGOptions {
    separator?: string | false
  }
  ```

---

## 💥 `extend/lite` version

- ### `replacer({ /* option */ })(content)`

  Exports: `module`, `default`

  Returns: `(content: string) => string`

  _@param_ — **[option](../docs/options.md#replacer-options)**: callee

  Types: `ReplacerOptions`

  ```js
  interface ReplacerOptions {
    callee?: string | string[],
  }
  ```

- ### `twg(...inputs)`

  Exports: `module`, `default`

  Returns: `string`

  _@param_ — **inputs**

  Types: `ClassValue[]`

  ```js
  type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

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
