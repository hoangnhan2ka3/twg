<div align="center">
  <img src="../public/twg_logo.webp" alt="twg logo" width="150px" height="150px">
</div>

<h1 align="center">✨ API</h1>

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

  Types: `ClassValue[]`

  ```js
  type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

- ### `createTwg(options)(...inputs)`

  Exports: `module`, `default`

  Returns: `(...inputs: ClassValue[]) => string`

  _@param_ — **[options](../docs/options.md#createtwg-options)**: separator

  Types: `TWGOptions`

  ```js
  interface TWGOptions {
    separator?: string | false
  }
  ```

  _@param_ — **inputs**

  Types: `ClassValue[]`

  ```js
  type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
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

  Types: `ClassValue[]`

  ```js
  type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

- ### `createTwg(options)(...inputs)`

  Exports: `module`, `default`

  Returns: `(...inputs: ClassValue[]) => string`

  _@param_ — **[options](../docs/options.md#createtwg-options)**: separator

  Types: `TWGOptions`

  ```js
  interface TWGOptions {
    separator?: string | false
  }
  ```

  _@param_ — **inputs**

  Types: `ClassValue[]`

  ```js
  type ClassValue<T = string | string[] | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
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
          <a href="#-api">Scroll to top</a>
        </div>
      </th>
    </tr>
  </table>
</div>
