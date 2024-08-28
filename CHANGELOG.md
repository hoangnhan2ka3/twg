# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Undocumented APIs should be considered internal and may change without warning.

## [Unreleased]

## [2.0.7] - 2024-08-28

### Refactor

- Refactor invalid `callee` detection logic.

### Misc

- Update `callee` option types of `transformer()`.
- Update `debug` message for error `callee` in `replacer()`.

## [2.0.6] - 2024-08-28

### Refactor

- Shorten `toVal()` function of both versions.

### Chore

- Remove unused `@returns` value in `extractor()` function.

## [2.0.5] - 2024-08-28

### Core change

- Shorten lite version of `replacer()` function.

### Chore

- Bump `pnpm` version to `9.9.0`.
- Bump package versions.
- Fix typo in debug message of `replacer()` function.
- Add more context in test case.

### Misc

- Update example for `conditional string and array` in README.
- Fix `complex conditional objects` example.

## [2.0.4] - 2024-08-27

### Core change

- Move the parsing logic of `Key as classes and value as conditionals` in objects to AST transformer.

### Chore

- Pure `console.log` with `terser` minify options to avoid accidentally logging in production.
- Add more context to performance section in `Trade-offs` of README about `v2`.
- Add more test cases for new objects behavior.

## [2.0.3] - 2024-08-27

### Chore

- Shorten the `return` of AST transformer.
- Rename `transformConditional()` to `transformer()` in `src/processor/ast.ts`.

## [2.0.2] - 2024-08-27

### Chore

- Fix `exports` in `package.json` to resolve right import.

## [2.0.1] - 2024-08-27

### Chore

- Remove unused console.log in `src/processor/ast.ts`.

## [2.0.0] - 2024-08-27

### Core change

- Use `@babel` AST to parse all conditional classes, objects, arrays or even both string and array.
  - **Pros:**
    - More accurate, more trust in processing.
    - Works perfectly even with complex conditionals like nested ternary and inside template literal.
    - Reduce several complex regex use to parse condition.
    - Lighter bundle.
  - **Cons:**
    - Currently work on _(.js, .ts, .jsx, .tsx)_ file only.
    - A bit slower, especially on the first time, when nothing is cached.
    - 4 more dependencies 😢
- Supports native objects behavior like `clsx` (Key as classes and value as conditionals) [[docs](https://github.com/hoangnhan2ka3/twg?tab=readme-ov-file#-news)].
- Refactor lite version of `parser()` function to accept new objects behavior.

### Chore

- Add more test cases for new objects behavior.
- Fixed npm README's shields links.
- Bump dependencies version.

### Misc

- Deleted unused `(e)` in catch block of lite version of `replacer()` function.

## [1.2.6] - 2024-08-24

### Refactor

- Revert `const char = content[i]` in `v1.2.4` refactor of `extractor()` function, which caused error on `v1.2.5`.

### Chore

- Add more test cases for `extractor()` function.
- Update npm README.

## [1.2.5] - 2024-08-24

### Core change

- Return original `content` whenever `callee` option is not valid, instead of being overridden by default value.

### Refactor

- Revert `v1.2.3` refactor, because `reducer()` doesn't need to regenerate every time the `parser()` is called.
- Fixed debug message duplicated ":" typo.

### Chore

- Fixed some test cases in context of core change.
- Temporarily remove Ko-fi funding button in README, because of PayPal error.

## [1.2.4] - 2024-08-24

### Refactor

- Refactor `extractor()` function.
- Export `replacer()` as both `default` and `named` export.

### Chore

- Fixed typo in README.
- Update bundle shield links in npm README.

## [1.2.3] - 2024-08-24

### Core change

- Collapses `reducer()` into `parser()` function.
- Improves `reducer()` function, does not need to handle Array anymore.

### Refactor

- Refactor lite `parser()` function.

### Chore

- Test also lite `replacer()` and `twg()` function.
- Add more test cases.

## [1.2.2] - 2024-08-24

### Chore

- Move GitHub README to `.github` to reduce package size on `npm`.

## [1.2.1] - 2024-08-23

### Chore

- Update `.npmignore` to ignore `/public` folder.
- Update funding button in README.

## [1.2.0] - 2024-08-23

### Core change

- Change the behavior of `extractor()` to scan also callee function and outer object(s) inside it.
- Doesn't need regex to match `callee` function anymore.
- Lead to API change in `replacer()` options, now `matchFunction` is deprecated.
- New `replacer()` options: `debug`. Now user can turn off debug message right in options.

### Refactor

- Update README to satisfied new API changes.
- Add section about `Tailwind CSS IntelliSense` in `trade-offs` of README.
- refactor folder structure for readability and clean function name.

### Chore

- Add more test cases, especially ternary and multiple consequent parts of ternary and and-or conditionals.

### Misc

- Update all packages to latest version, delete unused files.

## [1.1.2] - 2024-08-22

### Core change

- Fixed accidentally warning message because of misleading `replacer()` options when give the options object a name.
- Update docs for latest API name.

### Chore

- Refactor JSDoc for functions and fix typo.

## [1.1.1] - 2024-08-21

### Refactor

- Improved regex for parsing nested condition objects.

### Chore

- Add more tests and refactor `ci.yml`.

### Misc

- Update more example for `nesting conditional objects`.

## [1.1.0] - 2024-08-21

### 🚀 First stable release
