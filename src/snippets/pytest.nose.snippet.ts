export class PytestOrNoseSnippet {
    private static CODE_SNIPPET =
    "    @testit.externalId(\"externalId\")\n" +
    "    @testit.displayName(\"displayName_\")\n" +
    "    @testit.title(\"title_\")\n" +
    "    @testit.description(\"description\")\n" +
    "    @testit.workItemIds(\"globalId\")\n" +
    "    def test_testName():\n" +
    "        # See work item [globalId] for detailed steps description\n" +
    "        # Pre:\n" +
    "        #   preconditions\n" +
    "        # Steps:\n" +
    "        #   testSteps\n" +
    "        # Post:\n" +
    "        #   postconditions\n" +
    "    \n";

    public static getComparator(id: string): string {
        return `@testit.workItemIds("${id}")`;
    }

    public static getNewSnippet(name: string, id: string): string {
        return this.CODE_SNIPPET
            .replace("testName", name)
            .replace("globalId", id)
            .replace("title_", name)
            .replace("displayName_", name);
    }
}
