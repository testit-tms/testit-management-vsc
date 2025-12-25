export class TestCafeSnippet {
    private static readonly CODE_SNIPPET =
    "    test.meta({\n" +
    "        externalId: 'externalId',\n" +
    "        displayName: 'displayName_',\n" +
    "        title: 'title_',\n" +
    "        description: 'description',\n" +
    "        workItemIds: ['globalId'],\n" +
    "    })('testName', async t => {\n" +
    "        // See work item [globalId] for detailed steps description\n" +
    "        // Pre:\n" +
    "        //   preconditions\n" +
    "        // Steps:\n" +
    "        //   testSteps\n" +
    "        // Post:\n" +
    "        //   postconditions\n" +
    "    });\n";

    public static getComparator(id: string): string {
        return `workItemIds: ['${id}'],`;
    }

    public static getNewSnippet(name: string, id: string): string {
        return this.CODE_SNIPPET
            .replace("testName", name)
            .replace("globalId", id)
            .replace("title_", name)
            .replace("displayName_", name);
    }
}
