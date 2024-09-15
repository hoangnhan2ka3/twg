<div align="center">
  <img src="../public/twg_logo.webp" alt="twg logo" width="150px" height="150px">
</div>

<h1 align="center">✨ API</h1>

## 📌 Table of contents

- [default](#-default-version)
- [default/lite](#-defaultlite-version)
- [extend](#-default-version)
- [extend/lite](#-default-version)
- [Types definition](#-types-definition)

---

## 💥 `default` version

- ### `transformer({ /* options */ })(content)`

  Exports: `named`

  Returns: `(content: string) => string`

  _@param_ — **[options](../docs/options.md#transformer-options)**: callee, separator, debug

  Types: `TransformerOptions`

  ```js
  interface TransformerOptions {
    callee?: string | string[],
    separator?: string | false,
    debug?: boolean
  }
  ```

- ### `twg(...inputs)`

  Exports: `named`

  Returns: `string`

  _@param_ — **inputs**

  Types: `ClassValue[]`

  ```js
  type ClassValue<T = string | string[] | bigint | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

- ### `createTwg(options)(...inputs)`

  Exports: `named`

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
  type ClassValue<T = string | string[] | bigint | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

---

## 💥 `default/lite` version

- ### `transformer({ /* option */ })(content)`

  Exports: `named`

  Returns: `(content: string) => string`

  _@param_ — **[option](../docs/options.md#transformer-options)**: callee

  Types: `TransformerOptions`

  ```js
  interface TransformerOptions {
    callee?: string | string[],
  }
  ```

- ### `twg(...inputs)`

  Exports: `named`

  Returns: `string`

  _@param_ — **inputs**

  Types: `ClassValue[]`

  ```js
  type ClassValue<T = string | string[] | bigint | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

---

## 💥 `extend` version

- ### `transformer({ /* options */ })(content)`

  Exports: `named`

  Returns: `(content: string) => string`

  _@param_ — **[options](../docs/options.md#transformer-options)**: callee, nestingCallee, separator, debug

  Types: `TransformerOptions`

  ```js
  export interface TransformerOptions {
    callee?: string | string[],
    nestingCallee?: string | string[],
    separator?: string | false,
    debug?: boolean
  }
  ```

- ### `twg(...inputs)`

  Exports: `named`

  Returns: `string`

  _@param_ — **inputs**

  Types: `ClassValue[]`

  ```js
  type ClassValue<T = string | string[] | bigint | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

- ### `createTwg(options)(...inputs)`

  Exports: `named`

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
  type ClassValue<T = string | string[] | bigint | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

---

## 💥 `extend/lite` version

- ### `transformer({ /* option */ })(content)`

  Exports: `named`

  Returns: `(content: string) => string`

  _@param_ — **[option](../docs/options.md#transformer-options)**: callee

  Types: `TransformerOptions`

  ```js
  interface TransformerOptions {
    callee?: string | string[],
  }
  ```

- ### `twg(...inputs)`

  Exports: `named`

  Returns: `string`

  _@param_ — **inputs**

  Types: `ClassValue[]`

  ```js
  type ClassValue<T = string | string[] | bigint | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

---

## 💥 Types definition

- ### `ClassValue`

  ```js
  type ClassValue<T = string | string[] | bigint | number | boolean | null | undefined> = T | T[] | Record<string, unknown>
  ```

  Can be imported from:

  - `twg`
  - `twg/lite`
  - `twg/extend`
  - `twg/extend/lite`

- ### `TransformerOptions`

  `default` version:

  ```js
  interface TransformerOptions {
    callee?: string | string[],
    separator?: string | false,
    debug?: boolean
  }
  ```

  `extend` version:

  ```js
  interface TransformerOptions {
    callee?: string | string[],
    nestingCallee?: string | string[],
    separator?: string | false,
    debug?: boolean
  }
  ```

  `default/lite` and `extend/lite` version:

  ```js
  interface TransformerOptions {
    callee?: string | string[]
  }
  ```

  Can be imported from:

  - `twg`
  - `twg/lite`
  - `twg/extend`
  - `twg/extend/lite`

- ### `TWGOptions`

  ```js
  interface TWGOptions {
    separator?: string | false
  }
  ```

  Can be imported from:

  - `twg`
  - `twg/extend`

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
