export class CodeceptJSSnippet {
    private static CODE_SNIPPET =
    "    Scenario('testName',\n" + 
    "    {\n" +
    "        externalId: 'externalId',\n" +
    "        displayName: 'displayName_',\n" +
    "        title: 'title_',\n" +
    "        description: 'description',\n" +
    "        workitemIds: ['globalId']\n" +
    "    },\n" +
    "    ({ I }) => {\n" +
    "        // See work item [globalId] for detailed steps description\n" +
    "        // Pre:\n" +
    "        //   preconditions\n" +
    "        // Steps:\n" +
    "        //   testSteps\n" +
    "        // Post:\n" +
    "        //   postconditions\n" +
    "    });\n";

    public static getComparator(id: string): string {
        return `workitemIds: ['${id}']`;
    }

    public static getNewSnippet(name: string, id: string): string {
        return this.CODE_SNIPPET
            .replace("testName", name)
            .replace("globalId", id)
            .replace("title_", name)
            .replace("displayName_", name);
    }
}
