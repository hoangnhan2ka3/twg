# tailwind-variants-grouping

> A more elegant way of writing Tailwind classes. Never need to repeating the same variants over and over again 🤯.

## Features

- ✅ No need to repeat the same variants over and over again.
- ✅ Very easy setup.
- ✅ Support for nesting multiple functions, objects, and arrays.
- ✅ Support for conditional classes _(not conditional objects)_.
- ✅ Customizable `callee` name and `separator`.
- ✅ Compatible with wrappers like [`twMerge`](https://github.com/dcastil/tailwind-merge).
- ✅ "Base" support for Tailwind CSS IntelliSense (IDEs extension), also [Hover Preview](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss#hover-preview).
- 🔥 Partial support for multiple objects. _(For now, just don't put any string between two objects.)_

## Table of Contents

- [Quick Intro](#quick-intro)
- [Getting Started](#getting-started)
  - [1. Install the package](#1-install-the-package)
  - [2. Setup](#2-setup)
- [Options](#options)
  - [`replacer()` options](#replacer-options)
  - [`twg` options](#twg-options)
- [How to use](#how-to-use)
  - [Basic usage](#basic-usage)
  - [Complex as ☠️ usage](#complex-as-%EF%B8%8F-usage)
  - [Conditional Classes](#conditional-classes)
- [Custom `options`](#custom-options)
  - [Custom `callee`](#custom-callee)
- [Combination](#combination)
- [API](#api)
- [Deeper explanation](#deeper-explanation)
  - [What is `twg`?](#what-is-twg)
  - [Explanation](#explanation)
  - [Trade-offs](#trade-offs)
- [Contributing](#contributing)

## Quick Intro

> Simply open a Object, put the `variant` as key, and classes you want to map to that `variant` as each value.

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

## Getting Started

### 1. Install the package

```bash
pnpm add twg
```

### 2. Setup

```js
// tailwind.config.ts

import { type Config } from "tailwindcss"
import { replacer } from "twg/replacer"
// or
import replacer from "twg"

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

If you need to override default `replacer` options:

```js
transform: {
  DEFAULT: replacer({
    // Define options here, eg.:
    callee: "cn"
  })
}
```

## Options

### `replacer()` options

`options?` | Types | Default | Description | Status
--- | --- | --- | --- | ---
`callee?` | string \| string[] | "twg" | The function name to use for detecting Tailwind classes. You can change it to whatever you defined in `lib/utils.ts`, eg. `cn`, `cx`, etc. or `["cn", "cx"]`. _(Name it as unique as possible or you'll have conflicts)_ | ✅
`matchFunction?` | RegExp \| string | /twg\\((?:[^()]\*\|\\((?:[^()]\*\|\\([^()]\*\\))\*\\))\*\\)/gis | The regex used to match the whole `callee function` (eg.: `twg(...)`) inside your actual code file. | ✅
`separator?`(*) | string \| false | ":" | The separator used to join the classes. If `false`, you may need to write it manually, eg.: `twg({"before:": "flex"})`. (*)Remember to sync this option with `separator` option in `twg` option. | 🚧 Currently not available

### `twg` options

`options?` | Types | Default | Description | Status
--- | --- | --- | --- | ---
`separator?`(\*) | string \| false | ":" | The separator used to join the classes. If `false`, you may need to write it manually, eg.: `twg({"before:": "flex"})`. (*)Remember to sync this option with `separator` option in `replacer()` option. | 🚧 Currently not available

## How to use

```jsx
import { twg } from "twg"
// or
import twg from "twg"
```

### Basic usage

```jsx
// HelloWorld.tsx

import { twg } from "twg"
// or
import twg from "twg"

export function HelloWorld() {
  return (
    <div className={twg(
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
<div class="size-92 relative grid place-items-center px-4 py-2 before:absolute before:inset-0 before:bg-red-500 before:hover:bg-blue-500 before:hover:text-yellow-500 aria-expanded:bg-red-500 aria-expanded:text-yellow-500">
  Hello, World!
</div>
```

### Complex as ☠️ usage

```jsx
// HelloWorld.tsx

import { twg } from "twg"
// or
import twg from "twg"

export function HelloWorld() {
  return (
    <div className={twg(
      "Lorem ipsum",
      "dolor sit",
      ["amet", "consectetur adipiscing elit"],
      ["Sed sit", "amet ligula", ["ex", "Ut"]],
      {
        var1: "in suscipit metus",
        var2: [
          "vel accumsan",
          "orci",
          ["Vivamus sapien", "neque", ["dictum vel", "felis maximus"]]
        ],
        var3: ["luctus", { var4: "lorem" }],
        var5: [
            "Fusce malesuada massa",
            ["eu turpis finibus"],
            {
              var6: [
                "mollis",
                {
                  var7: [
                    "In augue tortor",
                    {
                      var8: [
                        "porta eu erat sit amet",
                        ["tristique", "ullamcorper", "arcu"]
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
    )}>
      Hello, World!
    </div>
  )
}
```

Output (html):

```html
<div class="Lorem ipsum dolor sit amet consectetur adipiscing elit Sed sit amet ligula ex Ut var1:in var1:suscipit var1:metus var2:vel var2:accumsan var2:orci var2:Vivamus var2:sapien var2:neque var2:dictum var2:vel var2:felis var2:maximus var3:luctus var3:var4:lorem var5:Fusce var5:malesuada var5:massa var5:eu var5:turpis var5:finibus var5:var6:mollis var5:var6:var7:In var5:var6:var7:augue var5:var6:var7:tortor var5:var6:var7:var8:porta var5:var6:var7:var8:eu var5:var6:var7:var8:erat var5:var6:var7:var8:sit var5:var6:var7:var8:amet var5:var6:var7:var8:tristique var5:var6:var7:var8:ullamcorper var5:var6:var7:var8:arcu">
  Hello, World!
</div>
```

### Conditional classes

You can use conditional like `&& | || | ??` _(and/or)_ or `isFooBar === "twg" ? "..." : "..."` _(ternary)_ as well:

```jsx
// HelloWorld.tsx

import { twg } from "twg"
import { useState } from "react"

export function HelloWorld() {
  const [isAndOr, setIsAndOr] = useState(false)
  const [isTernary, setIsTernary] = useState("foo")
  // ...
  return (
    <div className={twg(
      "size-92 relative grid place-items-center px-4 py-2",
      {
        before: [
          "absolute inset-0 bg-red-500",
          isTernary === "bar" ? {
            hover: "bg-blue-500 text-yellow-500"
          } : {
            hover: [
              "bg-blue-500 text-yellow-500",
              isAndOr && "border-2 border-white",
            ]
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

> **In short:**
> Just use `twg` as the way you use `clsx` or `classnames`, except for the `object zones` which you can use the `twg` way.

## Custom `options`

### Custom `callee`

First change the `callee` option `replacer()` to the callee's name you want, eg. with `cn`:

```js
transform: {
  DEFAULT: replacer({
    // Define options here, eg.:
    callee: "cn"
  })
}
```

Then use several ways to import it:

Option 1:

```jsx
import { twg as cn } from "twg"
```

Option 2:

```jsx
// src/lib/utils.ts
import { twg as cn } from "twg"
export { cn }

// src/Component.tsx
import { cn } from "@/lib/utils"
```

Option 3: [Use with wrapper like `twMerge` 👇](#best-practice-with-twmerge).

## Combination

### Best practice with [`twMerge`](https://github.com/dcastil/tailwind-merge)

Default:

```js
// src/lib/utils.ts

import { twg, type ClassValue } from "twg"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(twg(...inputs))
}
```

Extend options:

```js
// src/lib/utils.ts

import { twg, type ClassValue } from "twg"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge<...>({
  extend: { ... }
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(twg({
    // ⚠️ Currently not available, but I'm working on it.
    separator: "-"
  })(...inputs))
}
```

## API

### `replacer({ options })(content)`

Returns: `string`

_@param_ — **[options](#replacer-options)**

Types: `ReplacerOptions`

```js
interface ReplacerOptions {
  callee?: string | string[],
  matchFunction?: RegExp | string,
  separator?: string | false
}
```

_@param_ — **content**

Types: `string`

---

### `twg({ options })(...inputs)`

Returns: `string`

_@param_ — **[options](#twg-options)**

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

## Deeper explanation

### What is `twg`?

> `twg` means `tailwind-variants-grouping`. It's actually called `tvg` but npm said there was another package called `tv4` which has a similar name so I had to rename it. In the end, I still like the name `tvg` :D.

`twg` is a combination of [`clsx`](https://github.com/lukeed/clsx/) and [`easy-tailwind`](https://github.com/Noriller/easy-tailwind), especially `easy-tailwind`, which is a phenomenal package and it is the "preflight" of this project 💕.

`twg` is a great replacement for `clsx` and [`classnames`](https://github.com/JedWatson/classnames) when you're using Tailwind CSS (or any other CSS libraries which have the [`content.transform`](https://tailwindcss.com/docs/content-configuration#transforming-source-files) API like Tailwind)

> Use the `content.transform` option to **TRANSFORM ANY CONTENT** matching a specific file extension **BEFORE EXTRACTING CLASSES**. _(Tailwind's docs)_

### Explanation

`twg` package has 02 main parts, same job but different purpose:

Function | What it does
--- | ---
`twg` | Transform classes you typed in dev code to html classes in development or production env.
`replacer()` | Transform classes you typed in dev code to normal classes and save in temp that Tailwind can scan _(the transformed code of this function does not affect anything in your end, just for Tailwind)_.

> So, as example, if you want to use custom `separator` instead of default `":"`, you must provide the `separator` option to both `twg` and `replacer()`. One for your actual code and one for Tailwind. Got the idea 😉.

- ### `twg`

`twg`'s job is just transforming the object(s) inside itself to `map the key to each values`, outside the object and the rest processes are the job of `clsx`.

```jsx
<div className={twg(
  "size-92 relative grid place-items-center", // <== clsx will handle outside the object
  {
    before: "absolute inset-0 bg-red-500",
    "aria-expanded": "bg-red-500 text-yellow-500",
  } // <== twg will handle the object
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

- ### `replacer()`

More complex than `twg`, `replacer()` uses `regex` and some `extractor` functions to _find > replace > put it right back_ to the original `content` (which is all [`content.files`](https://tailwindcss.com/docs/content-configuration#transforming-source-files)), eg.:

> `replacer()` was used in Tailwind API `content.transform`, but why? We already have the right classes after the process of `twg`, so why we need to do it again with `replacer()`?
>
> Well, Tailwind actually scans the classes in our `root code` files, not the already built code that we see in browser's inspect tool. That's why we cannot use [dynamic class names](https://tailwindcss.com/docs/content-configuration#dynamic-class-names)
>
> That is a reasonable existence of `content.transform`.

```jsx
// ...
<div className={twg(
  "size-92 relative grid place-items-center", // <== don't care cuz it's already valid Tailwind classes
  {
    before: "absolute inset-0 bg-red-500",
    "aria-expanded": "bg-red-500 text-yellow-500",
  } // <== replacer() just handle Object(s)
)}>
  Hello, World!
</div>
//...
```

Output (right before Tailwind starts to scan classes in our files):

```jsx
//...
<div className={twg(
  "size-92 relative grid place-items-center",
  "before:absolute before:inset-0 before:bg-red-500 aria-expanded:bg-red-500 aria-expanded:text-yellow-500",
)}>
  Hello, World!
</div>
//...
```

Then Tailwind can start extracting this `temp` code as they are our "expected classes" now 😉.

### Trade-offs

- With `clsx`:

In `clsx`, this is an example of what you can do inside the `object zones` (taken from clsx's README):

```jsx
// Objects
clsx({ foo: true, bar: false, baz: isTrue() });
//=> 'foo baz'

// Objects (variadic)
clsx({ foo: true }, { bar: false }, null, { '--foobar': 'hello' });
//=> 'foo --foobar'
```

If you're someone who likes to write conditionals like the example above, perhaps you should change the way you use in `twg`. Above example violates the `twg` [convention](#twg).

> **POV:** I think there's nothing useful to do with `Objects` inside utility function like `clsx` so they handle it as:

```jsx
clsx({ foo: true, bar: false, baz: isTrue() })
//=> 'foo baz'
```

Although someone would like that, but why not write it as:

```jsx
clsx(true && "foo", false && "bar", isTrue() && "baz")
//=> 'foo baz'

//? Easily change to ternary if needed
clsx(true ? "foo" : "", false ? "bar" : "", isTrue() ? "baz" : "")
//=> 'foo baz'
```

So no need to open a Object for nothing, right? You can't event use direct ternary inside the object.

- Remote utilities:

You cannot use remote utilities like this:

```jsx
const remoteUtil = "absolute inset-0 bg-red-500"

<div className={twg(
  "relative grid place-items-center",
  {
    before: remoteUtil
  }
)}>
  Hello, World!
</div>
```

If you try to use it, it will work in browser's inspect tool:

```html
<div class="relative grid place-items-center before:absolute before:inset-0 before:bg-red-500">
  Hello, World!
</div>
```

But no styles will be applied because the problem comes from the `replacer()` which cannot transform these remote utilities.

Instead, you can end up with the whole object remote:

```jsx
const remoteObject = twg({
  before: "absolute inset-0 bg-red-500"
})

<div className={twg(
  "relative grid place-items-center",
  remoteObject,
  {
    "aria-expanded": "bg-red-500 text-yellow-500"
  }
)}>
  Hello, World!
</div>
```

- Performance:

Yes of course, `twg` is slower than vanilla `clsx` because it uses `regex` and `extractors` to find and replace the classes. But it's not that slow, it's still fast enough for you to use in your project. This project aim for the better developer-experience with Tailwind variants classes, not for the best performance.

## Contributing

### Issues

`twg` now work for me but maybe not for you in some edges. Consider opening an [issue](https://github.com/hoangnhan2ka3/twg/issues) if you have any problem with it that I can fix it ASAP. Or a [pull request](https://github.com/hoangnhan2ka3/twg/pulls) is welcome too.

### Work with me

<https://www.linkedin.com/in/hoangnhan2ka3/>

## License

MIT © [Nguyễn Hoàng Nhân](https://hoangnhanne.id.vn)
