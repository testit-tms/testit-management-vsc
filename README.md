# Test IT Management VSCode plugin

<!-- Plugin description -->
The **Test IT Management VSCode plugin** is a powerful tool for managing work items. It provides an ability to browse the
project's work items and hierarchies, generate unit tests for selected work item, locate non-automated work items.
<!-- Plugin description end -->
> **Note**
>
> Click the <kbd>Watch</kbd> button on the top to be notified about releases containing new features and fixes.

## Compatibility

| Test IT | Plugin Test IT Management |
|---------|---------------------------|
| Cloud   | 0.2.0                     |

## Download

You can download the latest version of the Test IT Management plugin from
the [releases](https://github.com/testit-tms/testit-management-vsc/releases) page.

## Setup

Configure connection in the `Manage -> Settings -> Extensions -> Test IT` menu.

```json
{
  "Url": "https://team-okp8.testit.software/",
  "Project ID": "3a651dfc-51a9-49aa-a8ee-0e50a6efcf36",
  "Token": "b241M2s1N1VrRUhwYTNLaWZP"
}
```

## Features

### Code snippet

Copy work item's code snippet using context menu, then paste it from clipboard in java file.

### Go to sources

Double-click on the tree item opens an editor with the autotest's first line focused (if exists).

### Search and replace Allure methods

You can see the documentation [here](docs/parsingAllureAnnotations/README.md).

## Contributing

You can help to develop the project. Any contributions are **greatly appreciated**.

* If you have suggestions for adding or removing features, feel free
  to [open an issue](https://github.com/testit-tms/testit-management-vsc/issues/new) to discuss it, or create a direct pull
  request.
* Make sure to check your spelling and grammar.
* Create individual PR for each suggestion.
* Read the [Code Of Conduct](https://github.com/testit-tms/testit-management-vsc/blob/main/CODE_OF_CONDUCT.md) before
  posting your first idea as well.

## License

Distributed under the Apache-2.0 License.
See [LICENSE](https://github.com/testit-tms/testit-management-vsc/blob/main/LICENSE.txt) for more information.
