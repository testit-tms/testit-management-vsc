export class JunitSnippet {
    private static CODE_SNIPPET =
    "    @WorkItemIds(\"globalId\")\n" +
    "    @Test\n" +
    "    public void testName() {\n" +
    "        // See work item [globalId] for detailed steps description\n" +
    "        // Pre:\n" +
    "        //   preconditions\n" +
    "        // Steps:\n" +
    "        //   testSteps\n" +
    "        // Post:\n" +
    "        //   postconditions\n" +
    "    }\n";

    public static getComparator(id: string): string {
        return `@WorkItemIds("${id}")`;
    }

    public static getNewSnippet(name: string, id: string): string {
        return this.CODE_SNIPPET
            .replace("testName", name)
            .replace("globalId", id);
    }
}
