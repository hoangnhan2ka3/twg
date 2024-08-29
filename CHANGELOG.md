# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Undocumented APIs should be considered internal and may change without warning.

## [Unreleased]

## [3.0.2] - 2024-08-29

### Chore

- Remove accidentally test code in `transformer()` function.

## [3.0.1] - 2024-08-29

### Fixed

- Fixed problem in AST cause misleading finding parent object which lead to wrong outermost object parsing in `v3.0.0`.

### Chore

- Add test cases for `misleading object inside not related object`.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v3.0.0...v3.0.1>

## [3.0.0] - 2024-08-29

### Core change

- Deprecated `extractor()` function due to AST `transformer()`. Now `replacer()` is almost base on AST.
- Change the behavior of `debug message` as limited AST output.

### Refactor

- Refactor AST `transformer()` to handle nested callee functions.
- Refactor `twg()` and its lite version to handle native Object behavior.
- Refactor `parser()` to reduce complexity and better handle native Object behavior.

### Chore

- Remove `extractor()` function test.
- Add more test cases for nested callee functions, native Object behavior.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v2.0.7...v3.0.0>

## [2.0.7] - 2024-08-28

### Refactor

- Refactor invalid `callee` detection logic.

### Misc

- Update `callee` option types of `transformer()`.
- Update `debug` message for error `callee` in `replacer()`.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v2.0.6...v2.0.7>

## [2.0.6] - 2024-08-28

### Refactor

- Shorten `toVal()` function of both versions.

### Chore

- Remove unused `@returns` value in `extractor()` function.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v2.0.5...v2.0.6>

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

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v2.0.4...v2.0.5>

## [2.0.4] - 2024-08-27

### Core change

- Move the parsing logic of `Key as classes and value as conditionals` in objects to AST transformer.

### Chore

- Pure `console.log` with `terser` minify options to avoid accidentally logging in production.
- Add more context to performance section in `Trade-offs` of README about `v2`.
- Add more test cases for new objects behavior.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v2.0.3...v2.0.4>

## [2.0.3] - 2024-08-27

### Chore

- Shorten the `return` of AST transformer.
- Rename `transformConditional()` to `transformer()` in `src/processor/ast.ts`.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v2.0.2...v2.0.3>

## [2.0.2] - 2024-08-27

### Chore

- Fix `exports` in `package.json` to resolve right import.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v2.0.1...v2.0.2>

## [2.0.1] - 2024-08-27

### Chore

- Remove unused console.log in `src/processor/ast.ts`.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v2.0.0...v2.0.1>

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

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.2.6...v2.0.0>

## [1.2.6] - 2024-08-24

### Refactor

- Revert `const char = content[i]` in `v1.2.4` refactor of `extractor()` function, which caused error on `v1.2.5`.

### Chore

- Add more test cases for `extractor()` function.
- Update npm README.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.2.5...v1.2.6>

## [1.2.5] - 2024-08-24

### Core change

- Return original `content` whenever `callee` option is not valid, instead of being overridden by default value.

### Refactor

- Revert `v1.2.3` refactor, because `reducer()` doesn't need to regenerate every time the `parser()` is called.
- Fixed debug message duplicated ":" typo.

### Chore

- Fixed some test cases in context of core change.
- Temporarily remove Ko-fi funding button in README, because of PayPal error.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.2.4...v1.2.5>

## [1.2.4] - 2024-08-24

### Refactor

- Refactor `extractor()` function.
- Export `replacer()` as both `default` and `named` export.

### Chore

- Fixed typo in README.
- Update bundle shield links in npm README.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.2.3...v1.2.4>

## [1.2.3] - 2024-08-24

### Core change

- Collapses `reducer()` into `parser()` function.
- Improves `reducer()` function, does not need to handle Array anymore.

### Refactor

- Refactor lite `parser()` function.

### Chore

- Test also lite `replacer()` and `twg()` function.
- Add more test cases.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.2.2...v1.2.3>

## [1.2.2] - 2024-08-24

### Chore

- Move GitHub README to `.github` to reduce package size on `npm`.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.2.1...v1.2.2>

## [1.2.1] - 2024-08-23

### Chore

- Update `.npmignore` to ignore `/public` folder.
- Update funding button in README.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.2.0...v1.2.1>

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

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.1.2...v1.2.0>

## [1.1.2] - 2024-08-22

### Core change

- Fixed accidentally warning message because of misleading `replacer()` options when give the options object a name.
- Update docs for latest API name.

### Chore

- Refactor JSDoc for functions and fix typo.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.1.1...v1.1.2>

## [1.1.1] - 2024-08-21

### Refactor

- Improved regex for parsing nested condition objects.

### Chore

- Add more tests and refactor `ci.yml`.

### Misc

- Update more example for `nesting conditional objects`.

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.1.0...v1.1.1>

## [1.1.0] - 2024-08-21

### 🚀 First stable release

**Full Changelog**: <https://github.com/hoangnhan2ka3/twg/compare/v1.0.0-beta.7...v1.1.0>
