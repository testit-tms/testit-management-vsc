export class MSTestOrNUnitSnippet {
    private static readonly CODE_SNIPPET =
    "    [ExternalId(\"externalId\")]\n" +
    "    [DisplayName(\"displayName_\")]\n" +
    "    [Title(\"title_\")]\n" +
    "    [Tms.Adapter.Attributes.Description(\"description\")]\n" +
    "    [WorkItemIds(\"globalId\")]\n" +
    "    [TestMethod]\n" +
    "    public void testName()\n" +
    "    {\n" +
    "        // See work item [globalId] for detailed steps description\n" +
    "        // Pre:\n" +
    "        //   preconditions\n" +
    "        // Steps:\n" +
    "        //   testSteps\n" +
    "        // Post:\n" +
    "        //   postconditions\n" +
    "    }\n";

    public static getComparator(id: string): string {
        return `[WorkItemIds("${id}")]`;
    }

    public static getNewSnippet(name: string, id: string): string {
        return this.CODE_SNIPPET
            .replace("testName", name)
            .replace("globalId", id)
            .replace("title_", name)
            .replace("displayName_", name);
    }
}
