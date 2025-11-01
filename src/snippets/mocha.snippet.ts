export class MochaSnippet {
    private static CODE_SNIPPET =
    "    it(\"testName\", function () {\n" +
    "        this.externalId = \"externalId\";\n" +
    "        this.displayName = \"displayName_\";\n" +
    "        this.title = \"title_\";\n" +
    "        this.description = \"description\";\n" +
    "        this.workItemsIds = [\"globalId\"];\n" +
    "        \n" +
    "        // See work item [globalId] for detailed steps description\n" +
    "        // Pre:\n" +
    "        //   preconditions\n" +
    "        // Steps:\n" +
    "        //   testSteps\n" +
    "        // Post:\n" +
    "        //   postconditions\n" +
    "    });\n";

    public static getComparator(id: string): string {
        return `this.workItemsIds = ["${id}"];`;
    }

    public static getNewSnippet(name: string, id: string): string {
        return this.CODE_SNIPPET
            .replace("testName", name)
            .replace("globalId", id)
            .replace("title_", name)
            .replace("displayName_", name);
    }
}
