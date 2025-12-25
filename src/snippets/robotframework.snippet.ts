export class RobotFrameworkSnippet {
    private static readonly CODE_SNIPPET =
    "    testName\n" +
    "        [Tags]  testit.externalID:externalId\n" +
    "        ...     testit.displayName:displayName_\n" +
    "        ...     testit.title:title_\n" +
    "        ...     testit.description:description\n" +
    "        ...     testit.workitemsID:globalId\n" +
    "        # See work item [globalId] for detailed steps description\n" +
    "        # Pre:\n" +
    "        #   preconditions\n" +
    "        # Steps:\n" +
    "        #   testSteps\n" +
    "        # Post:\n" +
    "        #   postconditions\n";

    public static getComparator(id: string): string {
        return `testit.workitemsID:${id}`;
    }

    public static getNewSnippet(name: string, id: string): string {
        return this.CODE_SNIPPET
            .replace("testName", name)
            .replace("globalId", id)
            .replace("title_", name)
            .replace("displayName_", name);
    }
}
