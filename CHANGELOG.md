# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Undocumented APIs should be considered internal and may change without warning.

## [Unreleased]

### Core change

- Use `@babel` AST to parse all conditional classes or conditional objects.
  - **Pros:**
    - More accurate, more trust in processing.
    - Reduce several complex regex use to parse condition.
    - Lighter bundle.
  - **Cons:**
    - Currently work on (.jsx, .tsx file) only.
    - A bit slower, especially on the first time, when nothing is cached.
    - 4 more dependencies.

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
