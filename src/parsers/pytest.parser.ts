import { PatternAction } from "./types"

export class PytestParser {
    private static readonly ANNOTATION_SEPARATOR = "\\."
    private static readonly EVERYTHING_IN_PARENTHESES = "\\([\\s\\S][^)]{1,}\\)"
    private static readonly ALLURE_OBJECT = "allure"
    private static readonly ALLURE_METHOD = this.ALLURE_OBJECT + this.ANNOTATION_SEPARATOR
    private static readonly IMPORT_ALLURE_OBJECT = `import ${this.ALLURE_OBJECT}`
    private static readonly ALLURE_TITLE = this.ALLURE_METHOD + "title"
    private static readonly ALLURE_DESCRIPTION = this.ALLURE_METHOD + "description"
    private static readonly ALLURE_DESCRIPTION_HTML = this.ALLURE_METHOD + "description_html"
    private static readonly ALLURE_LINK = this.ALLURE_METHOD + "link" + this.EVERYTHING_IN_PARENTHESES
    private static readonly ALLURE_ISSUE = this.ALLURE_METHOD + "issue" + this.EVERYTHING_IN_PARENTHESES
    private static readonly ALLURE_TESTCASE = this.ALLURE_METHOD + "testcase" + this.EVERYTHING_IN_PARENTHESES
    private static readonly ALLURE_TAG = this.ALLURE_METHOD + "tag"
    private static readonly ALLURE_LABEL = this.ALLURE_METHOD + "label"
    private static readonly ALLURE_ID = this.ALLURE_METHOD + "id"
    private static readonly ALLURE_EPIC = this.ALLURE_METHOD + "epic"
    private static readonly ALLURE_FEATURE = this.ALLURE_METHOD + "feature"
    private static readonly ALLURE_STORY = this.ALLURE_METHOD + "story"
    private static readonly ALLURE_PARENT_SUITE = this.ALLURE_METHOD + "parent_suite"
    private static readonly ALLURE_SUITE = this.ALLURE_METHOD + "suite"
    private static readonly ALLURE_SUB_SUITE = this.ALLURE_METHOD + "sub_suite"
    private static readonly ALLURE_STEP = this.ALLURE_METHOD + "step"
    private static readonly ALLURE_DYNAMIC = this.ALLURE_METHOD + "dynamic" + this.ANNOTATION_SEPARATOR
    private static readonly ALLURE_DYNAMIC_TITLE = this.ALLURE_DYNAMIC + "title"
    private static readonly ALLURE_DYNAMIC_DESCRIPTION = this.ALLURE_DYNAMIC + "description"
    private static readonly ALLURE_DYNAMIC_DESCRIPTION_HTML = this.ALLURE_DYNAMIC + "description_html"
    private static readonly ALLURE_DYNAMIC_LINK = this.ALLURE_DYNAMIC + "link" + this.EVERYTHING_IN_PARENTHESES
    private static readonly ALLURE_DYNAMIC_ISSUE = this.ALLURE_DYNAMIC + "issue" + this.EVERYTHING_IN_PARENTHESES
    private static readonly ALLURE_DYNAMIC_TESTCASES = this.ALLURE_DYNAMIC + "testcase" + this.EVERYTHING_IN_PARENTHESES
    private static readonly ALLURE_DYNAMIC_TAG = this.ALLURE_DYNAMIC + "tag"
    private static readonly ALLURE_DYNAMIC_LABEL = this.ALLURE_DYNAMIC + "label"
    private static readonly ALLURE_DYNAMIC_ID = this.ALLURE_DYNAMIC + "id"
    private static readonly ALLURE_DYNAMIC_EPIC = this.ALLURE_DYNAMIC + "epic"
    private static readonly ALLURE_DYNAMIC_FEATURE = this.ALLURE_DYNAMIC + "feature"
    private static readonly ALLURE_DYNAMIC_STORY = this.ALLURE_DYNAMIC + "story"
    private static readonly ALLURE_DYNAMIC_PARENT_SUITE = this.ALLURE_DYNAMIC + "parent_suite"
    private static readonly ALLURE_DYNAMIC_SUITE = this.ALLURE_DYNAMIC + "suite"
    private static readonly ALLURE_DYNAMIC_SUB_SUITE = this.ALLURE_DYNAMIC + "sub_suite"
    private static readonly ALLURE_DYNAMIC_PARAMETER = this.ALLURE_DYNAMIC + "parameter"
    private static readonly ALLURE_DYNAMIC_ATTACHMENT_WRITE = this.ALLURE_METHOD + "attach" + this.EVERYTHING_IN_PARENTHESES
    private static readonly ALLURE_DYNAMIC_ATTACHMENT_READ = this.ALLURE_METHOD + "attach" + this.ANNOTATION_SEPARATOR +
            "file" + this.EVERYTHING_IN_PARENTHESES
    private static readonly VARIABLE = "[^'\",\\s)]+"
    private static readonly VALUE = "'[^']*'|\"[^\"]*\""
    private static readonly ASSIGNMENT = "\\s*=\\s*"

    private static readonly LINK_URL_PARAMETER_NAME = "url"
    private static readonly LINK_NAME_PARAMETER_NAME = "name"
    private static readonly LINK_PARAMETER_WITHOUT_NAME = "(?!" + this.LINK_URL_PARAMETER_NAME + this.ASSIGNMENT + "|" +
            this.LINK_NAME_PARAMETER_NAME + this.ASSIGNMENT + ")"
    private static readonly LINK_URL_PARAMETER = `(?:\\(\\s*` +
            `${this.LINK_PARAMETER_WITHOUT_NAME}|(?<=${this.LINK_URL_PARAMETER_NAME})${this.ASSIGNMENT})` +
            `(?<${this.LINK_URL_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`
    private static readonly LINK_NAME_PARAMETER = "(?:" +
            `\\(\\s*(?:${this.VARIABLE}|${this.VALUE})\\s*,\\s*${this.LINK_PARAMETER_WITHOUT_NAME}|` +
            `(?<=${this.LINK_NAME_PARAMETER_NAME})${this.ASSIGNMENT})` +
            `(?<${this.LINK_NAME_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`

    private static readonly ATTACHMENT_BODY_PARAMETER_NAME = "body"
    private static readonly ATTACHMENT_SOURCE_PARAMETER_NAME = "source"
    private static readonly ATTACHMENT_NAME_PARAMETER_NAME = "name"
    private static readonly ATTACHMENT_TYPE_PARAMETER_NAME = "attachment_type"
    private static readonly ATTACHMENT_EXTENSION_PARAMETER_NAME = "extension"
    private static readonly GENERAL_PARAMETER_WITHOUT_NAME = this.ATTACHMENT_NAME_PARAMETER_NAME + this.ASSIGNMENT + "|" +
            this.ATTACHMENT_TYPE_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.ATTACHMENT_EXTENSION_PARAMETER_NAME + this.ASSIGNMENT
    private static readonly ATTACHMENT_READ_PARAMETER_WITHOUT_NAME = "(?!" + this.ATTACHMENT_SOURCE_PARAMETER_NAME + this.ASSIGNMENT +
            "|" + this.GENERAL_PARAMETER_WITHOUT_NAME + ")"
    private static readonly ATTACHMENT_WRITE_PARAMETER_WITHOUT_NAME = "(?!" + this.ATTACHMENT_BODY_PARAMETER_NAME + this.ASSIGNMENT +
            "|" + this.GENERAL_PARAMETER_WITHOUT_NAME + ")"
    private static readonly ATTACHMENT_SOURCE_PARAMETER = "(?:\\(\\s*" +
            `${this.ATTACHMENT_READ_PARAMETER_WITHOUT_NAME}|(?<=${this.ATTACHMENT_SOURCE_PARAMETER_NAME})${this.ASSIGNMENT})` +
            `(?<${this.ATTACHMENT_SOURCE_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`
    private static readonly ATTACHMENT_BODY_PARAMETER = "(?:\\(\\s*" +
            `${this.ATTACHMENT_WRITE_PARAMETER_WITHOUT_NAME}|(?<=${this.ATTACHMENT_BODY_PARAMETER_NAME})${this.ASSIGNMENT})` +
            `(?<${this.ATTACHMENT_BODY_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`
    private static readonly ATTACHMENT_NAME_PARAMETER = "(?:" +
            `\\(\\s*(?:${this.VARIABLE}|${this.VALUE})\\s*,\\s*${this.ATTACHMENT_READ_PARAMETER_WITHOUT_NAME}|` +
            `(?<=${this.ATTACHMENT_NAME_PARAMETER_NAME})${this.ASSIGNMENT})` +
            `(?<${this.ATTACHMENT_NAME_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`

    private static readonly PARAMETER_NAME_PARAMETER_NAME = "name"
    private static readonly PARAMETER_VALUE_PARAMETER_NAME = "value"
    private static readonly PARAMETER_PARAMETER_WITHOUT_NAME = "(?!" + this.PARAMETER_NAME_PARAMETER_NAME + this.ASSIGNMENT + "|" +
            this.PARAMETER_VALUE_PARAMETER_NAME + this.ASSIGNMENT + ")"
    private static readonly PARAMETER_NAME_PARAMETER = "(?:\\(\\s*" +
            `${this.PARAMETER_PARAMETER_WITHOUT_NAME}|(?<=${this.PARAMETER_NAME_PARAMETER_NAME})${this.ASSIGNMENT})` +
            `(?<${this.PARAMETER_NAME_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`
    private static readonly PARAMETER_VALUE_PARAMETER = "(?:" +
            `\\(\\s*(?:${this.VARIABLE}|${this.VALUE})\\s*,\\s*${this.PARAMETER_PARAMETER_WITHOUT_NAME}|` +
            `(?<=${this.PARAMETER_VALUE_PARAMETER_NAME})${this.ASSIGNMENT})` +
            `(?<${this.PARAMETER_VALUE_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`

    private static readonly ANNOTATION_SEPARATOR_OBJECT = "."
    private static readonly PARAMETERS_SEPARATOR_OBJECT = ", "
    private static readonly TMS_OBJECT = "testit"
    private static readonly IMPORT_TMS_OBJECT = `import ${this.TMS_OBJECT}`
    private static readonly TMS_METHOD_OBJECT = this.TMS_OBJECT + this.ANNOTATION_SEPARATOR_OBJECT
    private static readonly TMS_DISPLAY_NAME = this.TMS_METHOD_OBJECT + "displayName"
    private static readonly TMS_DESCRIPTION = this.TMS_METHOD_OBJECT + "description"
    private static readonly TMS_LABELS = this.TMS_METHOD_OBJECT + "labels"
    private static readonly TMS_STEP = this.TMS_METHOD_OBJECT + "step"
    private static readonly TMS_LINKS = this.TMS_METHOD_OBJECT + "links"
    private static readonly TMS_NAMESPACE = this.TMS_METHOD_OBJECT + "nameSpace"
    private static readonly TMS_CLASSNAME = this.TMS_METHOD_OBJECT + "className"
    private static readonly TMS_ADD_DISPLAY_NAME = this.TMS_METHOD_OBJECT + "addDisplayName"
    private static readonly TMS_ADD_NAMESPACE = this.TMS_METHOD_OBJECT + "addNameSpace"
    private static readonly TMS_ADD_CLASSNAME = this.TMS_METHOD_OBJECT + "addClassName"
    private static readonly TMS_ADD_DESCRIPTION = this.TMS_METHOD_OBJECT + "addDescription"
    private static readonly TMS_ADD_LABELS = this.TMS_METHOD_OBJECT + "addLabels"
    private static readonly TMS_ADD_LINKS = this.TMS_METHOD_OBJECT + "addLinks"
    private static readonly TMS_ADD_PARAMETER = this.TMS_METHOD_OBJECT + "addParameter"
    private static readonly TMS_ADD_ATTACHMENTS = this.TMS_METHOD_OBJECT + "addAttachments"

    private static patternActions: Map<RegExp, PatternAction> | undefined;

    // Compile patterns lazily once
    private static getPatternActions(): Map<RegExp, PatternAction> {
        if (this.patternActions === undefined) {
            this.patternActions = new Map<RegExp, PatternAction>([
                [new RegExp(this.IMPORT_ALLURE_OBJECT, 'mg'), this.IMPORT_TMS_OBJECT],
                [new RegExp(this.ALLURE_TITLE, 'mg'), this.TMS_DISPLAY_NAME],
                [new RegExp(this.ALLURE_DESCRIPTION, 'mg'), this.TMS_DESCRIPTION],
                [new RegExp(this.ALLURE_DESCRIPTION_HTML, 'mg'), this.TMS_DESCRIPTION],
                [new RegExp(this.ALLURE_TAG, 'mg'), this.TMS_LABELS],
                [new RegExp(this.ALLURE_LABEL, 'mg'), this.TMS_LABELS],
                [new RegExp(this.ALLURE_ID, 'mg'), this.TMS_LABELS],
                [new RegExp(this.ALLURE_STEP, 'mg'), this.TMS_STEP],
                [new RegExp(this.ALLURE_LINK, 'mg'), this.parseLinkAnnotation.bind(this)],
                [new RegExp(this.ALLURE_ISSUE, 'mg'), this.parseLinkAnnotation.bind(this)],
                [new RegExp(this.ALLURE_TESTCASE, 'mg'), this.parseLinkAnnotation.bind(this)],
                [new RegExp(this.ALLURE_PARENT_SUITE, 'mg'), this.TMS_NAMESPACE],
                [new RegExp(this.ALLURE_SUITE, 'mg'), this.TMS_NAMESPACE],
                [new RegExp(this.ALLURE_SUB_SUITE, 'mg'), this.TMS_CLASSNAME],
                [new RegExp(this.ALLURE_EPIC, 'mg'), this.TMS_NAMESPACE],
                [new RegExp(this.ALLURE_FEATURE, 'mg'), this.TMS_NAMESPACE],
                [new RegExp(this.ALLURE_STORY, 'mg'), this.TMS_CLASSNAME],
                [new RegExp(this.ALLURE_DYNAMIC_TITLE, 'mg'), this.TMS_ADD_DISPLAY_NAME],
                [new RegExp(this.ALLURE_DYNAMIC_DESCRIPTION, 'mg'), this.TMS_ADD_DESCRIPTION],
                [new RegExp(this.ALLURE_DYNAMIC_DESCRIPTION_HTML, 'mg'), this.TMS_ADD_DESCRIPTION],
                [new RegExp(this.ALLURE_DYNAMIC_LINK, 'mg'), this.parseLinkMethod.bind(this)],
                [new RegExp(this.ALLURE_DYNAMIC_ISSUE, 'mg'), this.parseLinkMethod.bind(this)],
                [new RegExp(this.ALLURE_DYNAMIC_TESTCASES, 'mg'), this.parseLinkMethod.bind(this)],
                [new RegExp(this.ALLURE_DYNAMIC_TAG, 'mg'), this.TMS_ADD_LABELS],
                [new RegExp(this.ALLURE_DYNAMIC_LABEL, 'mg'), this.TMS_ADD_LABELS],
                [new RegExp(this.ALLURE_DYNAMIC_ID, 'mg'), this.TMS_ADD_LABELS],
                [new RegExp(this.ALLURE_DYNAMIC_EPIC, 'mg'), this.TMS_ADD_NAMESPACE],
                [new RegExp(this.ALLURE_DYNAMIC_FEATURE, 'mg'), this.TMS_ADD_NAMESPACE],
                [new RegExp(this.ALLURE_DYNAMIC_STORY, 'mg'), this.TMS_ADD_CLASSNAME],
                [new RegExp(this.ALLURE_DYNAMIC_PARENT_SUITE, 'mg'), this.TMS_ADD_NAMESPACE],
                [new RegExp(this.ALLURE_DYNAMIC_SUITE, 'mg'), this.TMS_ADD_NAMESPACE],
                [new RegExp(this.ALLURE_DYNAMIC_SUB_SUITE, 'mg'), this.TMS_ADD_CLASSNAME],
                [new RegExp(this.ALLURE_DYNAMIC_ATTACHMENT_WRITE, 'mg'), this.parseWriteAttachMethod.bind(this)],
                [new RegExp(this.ALLURE_DYNAMIC_ATTACHMENT_READ, 'mg'), this.parseReadAttachMethod.bind(this)],
                [new RegExp(this.ALLURE_DYNAMIC_PARAMETER, 'mg'), this.parseParameterMethod.bind(this)],
            ]);
        }

        return this.patternActions;
    }

    public static getPatterns(): MapIterator<RegExp> {
        return this.getPatternActions().keys();
    }

    public static parse(code: string): string {
        for (const [pattern, action] of this.getPatternActions()) {
            if (code.match(pattern)) {
                switch (typeof action) {
                    case "string":
                        return action;
                    case "function":
                        return action(code);
                    default:
                        throw new Error("Unknown action type in patternActions");
                }
            }
        }
        throw new Error(`No matching Allure pattern found in line "${code}"`);
    }

    private static parseLinkAnnotation(code: string): string
    {
        const urlPattern = new RegExp(this.LINK_URL_PARAMETER, "mg");
        const namePattern = new RegExp(this.LINK_NAME_PARAMETER, "mg");

        const urlMatch = Array.from(code.matchAll(urlPattern))[0];

        if (urlMatch == undefined) {
            throw new Error(`Can't getting url from annotation ${code}`);
        }

        const nameMatch = Array.from(code.matchAll(namePattern))[0];

        const url = urlMatch.groups![this.LINK_URL_PARAMETER_NAME];
        const name = nameMatch?.groups![(this.LINK_NAME_PARAMETER_NAME)];
        const titleBlock = (name != null) ? `${this.PARAMETERS_SEPARATOR_OBJECT}title=${name}` : "";

        return `${this.TMS_LINKS}(url=${url}${titleBlock})`;
    }

    private static parseLinkMethod(code: string): string
    {
        const urlPattern = new RegExp(this.LINK_URL_PARAMETER, "mg");
        const namePattern = new RegExp(this.LINK_NAME_PARAMETER, "mg");

        const urlMatch = Array.from(code.matchAll(urlPattern))[0];

        if (urlMatch == undefined) {
            throw new Error(`Can't getting url from method ${code}`);
        }

        const nameMatch = Array.from(code.matchAll(namePattern))[0];

        const url = urlMatch.groups![this.LINK_URL_PARAMETER_NAME];
        const name = nameMatch?.groups![(this.LINK_NAME_PARAMETER_NAME)];
        const titleBlock = (name != null) ? `${this.PARAMETERS_SEPARATOR_OBJECT}title=${name}` : "";

        return `${this.TMS_ADD_LINKS}(url=${url}${titleBlock})`;
    }

    private static parseWriteAttachMethod(code: string): string
    {
        const bodyPattern = new RegExp(this.ATTACHMENT_BODY_PARAMETER, "mg");
        const namePattern = new RegExp(this.ATTACHMENT_NAME_PARAMETER, "mg");

        const bodyMatch = Array.from(code.matchAll(bodyPattern))[0];

        if (bodyMatch == undefined) {
            throw new Error(`Can't getting body from method ${code}`);
        }

        const nameMatch = Array.from(code.matchAll(namePattern))[0];

        const body = bodyMatch.groups![this.ATTACHMENT_BODY_PARAMETER_NAME];
        const name = nameMatch?.groups![(this.ATTACHMENT_NAME_PARAMETER_NAME)];
        const nameBlock = (name != null) ? `${this.PARAMETERS_SEPARATOR_OBJECT}name=${name}` : "";

        return `${this.TMS_ADD_ATTACHMENTS}(${body}${this.PARAMETERS_SEPARATOR_OBJECT}is_text=True${nameBlock})`;
    }

    private static parseReadAttachMethod(code: string): string
    {
        const sourcePattern = new RegExp(this.ATTACHMENT_SOURCE_PARAMETER, "mg");
        const namePattern = new RegExp(this.ATTACHMENT_NAME_PARAMETER, "mg");

        const sourceMatch = Array.from(code.matchAll(sourcePattern))[0];

        if (sourceMatch == undefined) {
            throw new Error(`Can't getting source from method ${code}`);
        }

        const nameMatch = Array.from(code.matchAll(namePattern))[0];

        const source = sourceMatch.groups![this.ATTACHMENT_SOURCE_PARAMETER_NAME];
        const name = nameMatch?.groups![(this.ATTACHMENT_NAME_PARAMETER_NAME)];
        const nameBlock = (name != null) ? `${this.PARAMETERS_SEPARATOR_OBJECT}name=${name}` : "";

        return `${this.TMS_ADD_ATTACHMENTS}(${source}${nameBlock})`
    }

    private static parseParameterMethod(code: string): string
    {
        const namePattern = new RegExp(this.PARAMETER_NAME_PARAMETER, "mg");
        const valuePattern = new RegExp(this.PARAMETER_VALUE_PARAMETER, "mg");

        const nameMatch = Array.from(code.matchAll(namePattern))[0];

        if (nameMatch == undefined) {
            throw new Error(`Can't getting name from method ${code}`);
        }

        const valueMatch = Array.from(code.matchAll(valuePattern))[0];

        if (valueMatch == undefined) {
            throw new Error(`Can't getting value from method ${code}`);
        }

        const name = nameMatch.groups![this.PARAMETER_NAME_PARAMETER_NAME];
        const value = valueMatch.groups![(this.PARAMETER_VALUE_PARAMETER_NAME)];

        return `${this.TMS_ADD_PARAMETER}(name=${name}${this.PARAMETERS_SEPARATOR_OBJECT}value=${value})`
    }
}
