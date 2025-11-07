import { TmsConfiguration } from "../configuration";
import { FrameworkOption } from "../enums";
import {
    CodeceptJSSnippet,
    GherkinSnippet,
    JunitSnippet,
    MochaSnippet,
    MSTestOrNUnitSnippet,
    PlaywrightOrJestSnippet,
    PytestOrNoseSnippet,
    RobotFrameworkSnippet,
    TestCafeSnippet,
    XUnitSnippet
} from "../snippets";

export class CodeSnippetUtils {
    public static getNewSnippet(name: string, id: string): string {
        const framework = TmsConfiguration.getSelectedFramework();

        switch (framework) {
            case FrameworkOption.BEHAVE.toString(): return GherkinSnippet.getNewSnippet(name, id);
            case FrameworkOption.NOSE.toString(): return PytestOrNoseSnippet.getNewSnippet(name, id);
            case FrameworkOption.PYTEST.toString(): return PytestOrNoseSnippet.getNewSnippet(name, id);
            case FrameworkOption.ROBOTFRAMEWORK.toString(): return RobotFrameworkSnippet.getNewSnippet(name, id);
            case FrameworkOption.JUNIT.toString(): return JunitSnippet.getNewSnippet(name, id);
            case FrameworkOption.MSTEST.toString(): return MSTestOrNUnitSnippet.getNewSnippet(name, id);
            case FrameworkOption.NUNIT.toString(): return MSTestOrNUnitSnippet.getNewSnippet(name, id);
            case FrameworkOption.XUNIT.toString(): return XUnitSnippet.getNewSnippet(name, id);
            case FrameworkOption.SPECFLOW.toString(): return GherkinSnippet.getNewSnippet(name, id);
            case FrameworkOption.CODECEPTJS.toString(): return CodeceptJSSnippet.getNewSnippet(name, id);
            case FrameworkOption.CUCUMBER.toString(): return GherkinSnippet.getNewSnippet(name, id);
            case FrameworkOption.JEST.toString(): return PlaywrightOrJestSnippet.getNewSnippet(name, id);
            case FrameworkOption.MOCHA.toString(): return MochaSnippet.getNewSnippet(name, id);
            case FrameworkOption.PLAYWRIGHT.toString(): return PlaywrightOrJestSnippet.getNewSnippet(name, id);
            case FrameworkOption.TESTCAFE.toString(): return TestCafeSnippet.getNewSnippet(name, id);
            default: return JunitSnippet.getNewSnippet(name, id);
        }
    }

    public getComparator(id: string): string {
        const framework = TmsConfiguration.getSelectedFramework();

        switch (framework) {
            case FrameworkOption.BEHAVE.toString(): return GherkinSnippet.getComparator(id);
            case FrameworkOption.NOSE.toString(): return PytestOrNoseSnippet.getComparator(id);
            case FrameworkOption.PYTEST.toString(): return PytestOrNoseSnippet.getComparator(id);
            case FrameworkOption.ROBOTFRAMEWORK.toString(): return RobotFrameworkSnippet.getComparator(id);
            case FrameworkOption.JUNIT.toString(): return JunitSnippet.getComparator(id);
            case FrameworkOption.MSTEST.toString(): return MSTestOrNUnitSnippet.getComparator(id);
            case FrameworkOption.NUNIT.toString(): return MSTestOrNUnitSnippet.getComparator(id);
            case FrameworkOption.XUNIT.toString(): return XUnitSnippet.getComparator(id);
            case FrameworkOption.SPECFLOW.toString(): return GherkinSnippet.getComparator(id);
            case FrameworkOption.CODECEPTJS.toString(): return CodeceptJSSnippet.getComparator(id);
            case FrameworkOption.CUCUMBER.toString(): return GherkinSnippet.getComparator(id);
            case FrameworkOption.JEST.toString(): return PlaywrightOrJestSnippet.getComparator(id);
            case FrameworkOption.MOCHA.toString(): return MochaSnippet.getComparator(id);
            case FrameworkOption.PLAYWRIGHT.toString(): return PlaywrightOrJestSnippet.getComparator(id);
            case FrameworkOption.TESTCAFE.toString(): return TestCafeSnippet.getComparator(id);
            default: return JunitSnippet.getComparator(id);
        }
    }
}
