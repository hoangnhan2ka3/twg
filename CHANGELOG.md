# Changelog

[`twg`](https://github.com/hoangnhan2ka3/twg) adheres to [Semantic Versioning](http://semver.org/).

Undocumented APIs should be considered internal and may change without warning.

## [1.2.1] - 2024-08-23

### Chore

- Update `.npmignore` to ignore `/public` folder.
- Update funding button in README.

## [1.2.0] - 2024-08-23

### Core changes

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
