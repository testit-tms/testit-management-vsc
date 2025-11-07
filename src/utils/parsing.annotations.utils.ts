import { TmsConfiguration } from "../configuration"
import { FrameworkOption } from "../enums"
import { PytestParser, RobotFrameworkParser } from "../parsers"

export class ParsingAnnotationsUtils {
    public static getAllPatterns(): MapIterator<RegExp> {
        const framework = TmsConfiguration.getSelectedFramework();

        switch (framework) {
            case FrameworkOption.PYTEST.toString(): return PytestParser.getPatterns();
            case FrameworkOption.ROBOTFRAMEWORK.toString(): return RobotFrameworkParser.getPatterns();
            default: return PytestParser.getPatterns();
        }
    }

    public static parse(allureCode: string): string {
        const framework = TmsConfiguration.getSelectedFramework();

        switch (framework) {
            case FrameworkOption.PYTEST.toString(): return PytestParser.parse(allureCode);
            case FrameworkOption.ROBOTFRAMEWORK.toString(): return RobotFrameworkParser.parse(allureCode);
            default: return PytestParser.parse(allureCode);
        }
    }
}
