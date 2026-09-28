"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode7 = __toESM(require("vscode"));

// src/windows/tools/tree.provider.ts
var vscode5 = __toESM(require("vscode"));

// src/adaptersapi/ApiClient.js
var ApiClient = class _ApiClient {
  /**
   * The base URL against which to resolve every API call's (relative) path.
   * Overrides the default value set in spec file if present
   * @param {String} basePath
   */
  constructor(basePath2 = "http://localhost") {
    this.basePath = basePath2.replace(/\/+$/, "");
    this.authentications = {
      // ALWAYS KEEP 'PrivateToken' without changes!
      "PrivateToken": { type: "apiKey", "in": "header", name: "Authorization" }
      // reject any changes here
    };
    this.defaultHeaders = {
      "User-Agent": "OpenAPI-Generator/^7.0.0/Javascript"
    };
    this.timeout = 6e4;
    this.cache = true;
    this.enableCookies = false;
    this.requestAgent = null;
    this.plugins = null;
    this.rejectUnauthorized = true;
  }
  /**
   * Set SSL validation true / false
   * @param value true by default
   */
  setUnauthorized(value) {
    this.rejectUnauthorized = value;
  }
  /**
  * Returns a string representation for an actual parameter.
  * @param param The actual parameter.
  * @returns {String} The string representation of <code>param</code>.
  */
  paramToString(param) {
    if (param == void 0 || param == null) {
      return "";
    }
    if (param instanceof Date) {
      return param.toJSON();
    }
    if (_ApiClient.canBeJsonified(param)) {
      return JSON.stringify(param);
    }
    return param.toString();
  }
  /**
  * Returns a boolean indicating if the parameter could be JSON.stringified
  * @param param The actual parameter
  * @returns {Boolean} Flag indicating if <code>param</code> can be JSON.stringified
  */
  static canBeJsonified(str) {
    if (typeof str !== "string" && typeof str !== "object") return false;
    try {
      const type = str.toString();
      return type === "[object Object]" || type === "[object Array]";
    } catch (err) {
      return false;
    }
  }
  /**
   * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
   * NOTE: query parameters are not handled here.
   * @param {String} path The path to append to the base URL.
   * @param {Object} pathParams The parameter values to append.
   * @param {String} apiBasePath Base path defined in the path, operation level to override the default one
   * @returns {String} The encoded path with parameter values substituted.
   */
  buildUrl(path2, pathParams, apiBasePath) {
    if (!path2.match(/^\//)) {
      path2 = "/" + path2;
    }
    var url = this.basePath + path2;
    if (apiBasePath !== null && apiBasePath !== void 0) {
      url = apiBasePath + path2;
    }
    url = url.replace(/\{([\w-\.#]+)\}/g, (fullMatch, key) => {
      var value;
      if (pathParams.hasOwnProperty(key)) {
        value = this.paramToString(pathParams[key]);
      } else {
        value = fullMatch;
      }
      return encodeURIComponent(value);
    });
    return url;
  }
  /**
  * Checks whether the given content type represents JSON.<br>
  * JSON content type examples:<br>
  * <ul>
  * <li>application/json</li>
  * <li>application/json; charset=UTF8</li>
  * <li>APPLICATION/JSON</li>
  * </ul>
  * @param {String} contentType The MIME content type to check.
  * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
  */
  isJsonMime(contentType) {
    return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
  }
  /**
  * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
  * @param {Array.<String>} contentTypes
  * @returns {String} The chosen content type, preferring JSON.
  */
  jsonPreferredMime(contentTypes) {
    for (var i = 0; i < contentTypes.length; i++) {
      if (this.isJsonMime(contentTypes[i])) {
        return contentTypes[i];
      }
    }
    return contentTypes[0];
  }
  /**
  * Checks whether the given parameter value represents file-like content.
  * @param param The parameter to check.
  * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
  */
  isFileParam(param) {
    if (typeof require === "function") {
      let fs2;
      try {
        fs2 = require("fs");
      } catch (err) {
      }
      if (fs2 && fs2.ReadStream && param instanceof fs2.ReadStream) {
        return true;
      }
    }
    if (typeof Buffer === "function" && param instanceof Buffer) {
      return true;
    }
    if (typeof Blob === "function" && param instanceof Blob) {
      return true;
    }
    if (typeof File === "function" && param instanceof File) {
      return true;
    }
    return false;
  }
  /**
  * Normalizes parameter values:
  * <ul>
  * <li>remove nils</li>
  * <li>keep files and arrays</li>
  * <li>format to string with `paramToString` for other cases</li>
  * </ul>
  * @param {Object.<String, Object>} params The parameters as object properties.
  * @returns {Object.<String, Object>} normalized parameters.
  */
  normalizeParams(params) {
    var newParams = {};
    for (var key in params) {
      if (params.hasOwnProperty(key) && params[key] != void 0 && params[key] != null) {
        var value = params[key];
        if (this.isFileParam(value) || Array.isArray(value)) {
          newParams[key] = value;
        } else {
          newParams[key] = this.paramToString(value);
        }
      }
    }
    return newParams;
  }
  /**
  * Builds a string representation of an array-type actual parameter, according to the given collection format.
  * @param {Array} param An array parameter.
  * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
  * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
  * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
  */
  buildCollectionParam(param, collectionFormat) {
    if (param == null) {
      return null;
    }
    switch (collectionFormat) {
      case "csv":
        return param.map(this.paramToString, this).join(",");
      case "ssv":
        return param.map(this.paramToString, this).join(" ");
      case "tsv":
        return param.map(this.paramToString, this).join("	");
      case "pipes":
        return param.map(this.paramToString, this).join("|");
      case "multi":
        return param.map(this.paramToString, this);
      case "passthrough":
        return param;
      default:
        throw new Error("Unknown collection format: " + collectionFormat);
    }
  }
  /**
  * Applies authentication headers / query params for the request.
  * @param {Object.<String, String>} headers Mutable header map.
  * @param {Object.<String, Object>} queryParams Mutable query map.
  * @param {Array.<String>} authNames An array of authentication method names.
  */
  applyAuthToRequest(headers, queryParams, authNames) {
    authNames.forEach((authName) => {
      var auth = this.authentications[authName];
      if (!auth) {
        return;
      }
      switch (auth.type) {
        case "basic":
          if (auth.username || auth.password) {
            var basic = Buffer.from((auth.username || "") + ":" + (auth.password || "")).toString("base64");
            headers["Authorization"] = "Basic " + basic;
          }
          break;
        case "bearer":
          if (auth.accessToken) {
            var localVarBearerToken = typeof auth.accessToken === "function" ? auth.accessToken() : auth.accessToken;
            headers["Authorization"] = "Bearer " + localVarBearerToken;
          }
          break;
        case "apiKey":
          if (auth.apiKey) {
            var value;
            if (auth.apiKeyPrefix) {
              value = auth.apiKeyPrefix + " " + auth.apiKey;
            } else {
              value = auth.apiKey;
            }
            if (auth["in"] === "header") {
              headers[auth.name] = value;
            } else {
              queryParams[auth.name] = value;
            }
          }
          break;
        case "oauth2":
          if (auth.accessToken) {
            headers["Authorization"] = "Bearer " + auth.accessToken;
          }
          break;
        default:
          throw new Error("Unknown authentication type: " + auth.type);
      }
    });
  }
  /**
   * Deserializes an HTTP response body into a value of the specified type.
   * @param {Object} response A SuperAgent response object.
   * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
   * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
   * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
   * all properties on <code>data<code> will be converted to this type.
   * @returns A value of the specified type.
   */
  deserialize(response, returnType) {
    if (response == null || returnType == null || response.status == 204) {
      return null;
    }
    var data = response.body;
    if (data == null || typeof data === "object" && typeof data.length === "undefined" && !Object.keys(data).length) {
      data = response.text;
    }
    return _ApiClient.convertToType(data, returnType);
  }
  /**
   * Invokes the REST service using the supplied settings and parameters.
   * @param {String} path The base URL to invoke.
   * @param {String} httpMethod The HTTP method to use.
   * @param {Object.<String, String>} pathParams A map of path parameters and their values.
   * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
   * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
   * @param {Object.<String, Object>} formParams A map of form parameters and their values.
   * @param {Object} bodyParam The value to pass as the request body.
   * @param {Array.<String>} authNames An array of authentication type names.
   * @param {Array.<String>} contentTypes An array of request MIME types.
   * @param {Array.<String>} accepts An array of acceptable response MIME types.
   * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
   * constructor for a complex type.
   * @param {String} apiBasePath base path defined in the operation/path level to override the default one
   * @returns {Promise} A {@link https://www.promisejs.org/|Promise} object.
   */
  callApi(path2, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType, apiBasePath) {
    var url = this.buildUrl(path2, pathParams, apiBasePath);
    var headers = Object.assign({}, this.defaultHeaders);
    var normalizedQuery = Object.assign({}, queryParams);
    this.applyAuthToRequest(headers, normalizedQuery, authNames);
    if (httpMethod.toUpperCase() === "GET" && this.cache === false) {
      normalizedQuery["_"] = (/* @__PURE__ */ new Date()).getTime();
    }
    normalizedQuery = this.normalizeParams(normalizedQuery);
    var queryString = new URLSearchParams(normalizedQuery).toString();
    if (queryString) {
      url += (url.indexOf("?") >= 0 ? "&" : "?") + queryString;
    }
    Object.assign(headers, this.normalizeParams(headerParams));
    var contentType = this.jsonPreferredMime(contentTypes);
    var body = void 0;
    if (contentType === "application/x-www-form-urlencoded") {
      headers["Content-Type"] = contentType;
      body = new URLSearchParams(this.normalizeParams(formParams)).toString();
    } else if (contentType == "multipart/form-data") {
      var formData = new FormData();
      var _formParams = this.normalizeParams(formParams);
      for (var key in _formParams) {
        if (_formParams.hasOwnProperty(key)) {
          let _formParamsValue = _formParams[key];
          if (Array.isArray(_formParamsValue)) {
            _formParamsValue.forEach(function(item) {
              formData.append(key, item);
            });
          } else {
            formData.append(key, _formParamsValue);
          }
        }
      }
      body = formData;
      delete headers["Content-Type"];
    } else if (bodyParam !== null && bodyParam !== void 0) {
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = contentType || "application/json";
      }
      body = typeof bodyParam === "string" ? bodyParam : JSON.stringify(bodyParam);
    } else if (contentType && contentType != "multipart/form-data") {
      headers["Content-Type"] = contentType;
    }
    var accept = this.jsonPreferredMime(accepts);
    if (accept) {
      headers["Accept"] = accept;
    }
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timeoutId = null;
    if (controller && this.timeout > 0) {
      timeoutId = setTimeout(function() {
        controller.abort();
      }, this.timeout);
    }
    var self = this;
    return fetch(url, {
      method: httpMethod,
      headers,
      body,
      signal: controller ? controller.signal : void 0
    }).then(function(res) {
      return res.text().then(function(text) {
        var parsedBody = null;
        if (text) {
          try {
            parsedBody = JSON.parse(text);
          } catch (e) {
            parsedBody = text;
          }
        }
        var responseHeaders = {};
        if (res.headers && typeof res.headers.forEach === "function") {
          res.headers.forEach(function(value, name) {
            responseHeaders[name] = value;
          });
        }
        var response = {
          status: res.status,
          statusText: res.statusText,
          ok: res.ok,
          headers: responseHeaders,
          body: parsedBody,
          text
        };
        if (!res.ok) {
          var err = {
            status: response.status,
            statusText: response.statusText,
            body: response.body,
            response,
            error: new Error(response.statusText || "HTTP " + response.status)
          };
          throw err;
        }
        try {
          var data = self.deserialize(response, returnType);
          return { data, response };
        } catch (err2) {
          throw err2;
        }
      });
    }).finally(function() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    });
  }
  /**
  * Parses an ISO-8601 string representation or epoch representation of a date value.
  * @param {String} str The date value as a string.
  * @returns {Date} The parsed date object.
  */
  static parseDate(str) {
    if (isNaN(str)) {
      return new Date(str.replace(/(\d)(T)(\d)/i, "$1 $3"));
    }
    return /* @__PURE__ */ new Date(+str);
  }
  /**
  * Converts a value to the specified type.
  * @param {(String|Object)} data The data to convert, as a string or object.
  * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
  * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
  * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
  * all properties on <code>data<code> will be converted to this type.
  * @returns An instance of the specified type or null or undefined if data is null or undefined.
  */
  static convertToType(data, type) {
    if (data === null || data === void 0)
      return data;
    switch (type) {
      case "Boolean":
        return Boolean(data);
      case "Integer":
        return parseInt(data, 10);
      case "Number":
        return parseFloat(data);
      case "String":
        return String(data);
      case "Date":
        return _ApiClient.parseDate(String(data));
      case "Blob":
        return data;
      default:
        if (type === Object) {
          return data;
        } else if (typeof type.constructFromObject === "function") {
          return type.constructFromObject(data);
        } else if (Array.isArray(type)) {
          var itemType = type[0];
          return data.map((item) => {
            return _ApiClient.convertToType(item, itemType);
          });
        } else if (typeof type === "object") {
          var keyType, valueType;
          for (var k in type) {
            if (type.hasOwnProperty(k)) {
              keyType = k;
              valueType = type[k];
              break;
            }
          }
          var result = {};
          for (var k in data) {
            if (data.hasOwnProperty(k)) {
              var key = _ApiClient.convertToType(k, keyType);
              var value = _ApiClient.convertToType(data[k], valueType);
              result[key] = value;
            }
          }
          return result;
        } else {
          return data;
        }
    }
  }
  /**
    * Gets an array of host settings
    * @returns An array of host settings
    */
  hostSettings() {
    return [
      {
        "url": "",
        "description": "No description provided"
      }
    ];
  }
  getBasePathFromSettings(index, variables = {}) {
    var servers = this.hostSettings();
    if (index < 0 || index >= servers.length) {
      throw new Error("Invalid index " + index + " when selecting the host settings. Must be less than " + servers.length);
    }
    var server = servers[index];
    var url = server["url"];
    for (var variable_name in server["variables"]) {
      if (variable_name in variables) {
        let variable = server["variables"][variable_name];
        if (!("enum_values" in variable) || variable["enum_values"].includes(variables[variable_name])) {
          url = url.replace("{" + variable_name + "}", variables[variable_name]);
        } else {
          throw new Error("The variable `" + variable_name + "` in the host URL has invalid value " + variables[variable_name] + ". Must be " + server["variables"][variable_name]["enum_values"] + ".");
        }
      } else {
        url = url.replace("{" + variable_name + "}", server["variables"][variable_name]["default_value"]);
      }
    }
    return url;
  }
  /**
  * Constructs a new map or array model from REST data.
  * @param data {Object|Array} The REST data.
  * @param obj {Object|Array} The target object or array.
  */
  static constructFromObject(data, obj, itemType) {
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        if (data.hasOwnProperty(i))
          obj[i] = _ApiClient.convertToType(data[i], itemType);
      }
    } else {
      for (var k in data) {
        if (data.hasOwnProperty(k))
          obj[k] = _ApiClient.convertToType(data[k], itemType);
      }
    }
  }
};
ApiClient.CollectionFormatEnum = {
  /**
   * Comma-separated values. Value: <code>csv</code>
   * @const
   */
  CSV: ",",
  /**
   * Space-separated values. Value: <code>ssv</code>
   * @const
   */
  SSV: " ",
  /**
   * Tab-separated values. Value: <code>tsv</code>
   * @const
   */
  TSV: "	",
  /**
   * Pipe(|)-separated values. Value: <code>pipes</code>
   * @const
   */
  PIPES: "|",
  /**
   * Native array. Value: <code>multi</code>
   * @const
   */
  MULTI: "multi"
};
ApiClient.instance = new ApiClient();
var ApiClient_default = ApiClient;

// src/adaptersapi/model/AssignAttachmentApiModel.js
var AssignAttachmentApiModel = class _AssignAttachmentApiModel {
  /**
   * Constructs a new <code>AssignAttachmentApiModel</code>.
   * @alias module:model/AssignAttachmentApiModel
   * @param id {String} Unique ID of the attachment
   */
  constructor(id) {
    _AssignAttachmentApiModel.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>AssignAttachmentApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AssignAttachmentApiModel} obj Optional instance to populate.
   * @return {module:model/AssignAttachmentApiModel} The populated <code>AssignAttachmentApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AssignAttachmentApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AssignAttachmentApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AssignAttachmentApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AssignAttachmentApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
AssignAttachmentApiModel.RequiredProperties = ["id"];
AssignAttachmentApiModel.prototype["id"] = void 0;
var AssignAttachmentApiModel_default = AssignAttachmentApiModel;

// src/adaptersapi/model/AssignAutoTestCaseIdApiModel.js
var AssignAutoTestCaseIdApiModel = class _AssignAutoTestCaseIdApiModel {
  /**
   * Constructs a new <code>AssignAutoTestCaseIdApiModel</code>.
   * @alias module:model/AssignAutoTestCaseIdApiModel
   * @param id {String} Unique ID of the automated test case
   */
  constructor(id) {
    _AssignAutoTestCaseIdApiModel.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>AssignAutoTestCaseIdApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AssignAutoTestCaseIdApiModel} obj Optional instance to populate.
   * @return {module:model/AssignAutoTestCaseIdApiModel} The populated <code>AssignAutoTestCaseIdApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AssignAutoTestCaseIdApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AssignAutoTestCaseIdApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AssignAutoTestCaseIdApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AssignAutoTestCaseIdApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
AssignAutoTestCaseIdApiModel.RequiredProperties = ["id"];
AssignAutoTestCaseIdApiModel.prototype["id"] = void 0;

// src/adaptersapi/model/ParameterIterationModel.js
var ParameterIterationModel = class _ParameterIterationModel {
  /**
   * Constructs a new <code>ParameterIterationModel</code>.
   * @alias module:model/ParameterIterationModel
   * @param id {String} 
   */
  constructor(id) {
    _ParameterIterationModel.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>ParameterIterationModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ParameterIterationModel} obj Optional instance to populate.
   * @return {module:model/ParameterIterationModel} The populated <code>ParameterIterationModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ParameterIterationModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("sharedStepId")) {
        obj["sharedStepId"] = ApiClient_default.convertToType(data["sharedStepId"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ParameterIterationModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ParameterIterationModel</code>.
   */
  static validateJSON(data) {
    for (const property of _ParameterIterationModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["sharedStepId"] && !(typeof data["sharedStepId"] === "string" || data["sharedStepId"] instanceof String)) {
      throw new Error("Expected the field `sharedStepId` to be a primitive type in the JSON string but got " + data["sharedStepId"]);
    }
    return true;
  }
};
ParameterIterationModel.RequiredProperties = ["id"];
ParameterIterationModel.prototype["id"] = void 0;
ParameterIterationModel.prototype["sharedStepId"] = void 0;
var ParameterIterationModel_default = ParameterIterationModel;

// src/adaptersapi/model/AssignIterationApiModel.js
var AssignIterationApiModel = class _AssignIterationApiModel {
  /**
   * Constructs a new <code>AssignIterationApiModel</code>.
   * @alias module:model/AssignIterationApiModel
   * @param parameters {Array.<module:model/ParameterIterationModel>} 
   * @param id {String} Iteration identifier, must be empty for new or changed iteration
   */
  constructor(parameters, id) {
    _AssignIterationApiModel.initialize(this, parameters, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, parameters, id) {
    obj["parameters"] = parameters;
    obj["id"] = id;
  }
  /**
   * Constructs a <code>AssignIterationApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AssignIterationApiModel} obj Optional instance to populate.
   * @return {module:model/AssignIterationApiModel} The populated <code>AssignIterationApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AssignIterationApiModel();
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], [ParameterIterationModel_default]);
      }
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AssignIterationApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AssignIterationApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AssignIterationApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["parameters"]) {
      if (!Array.isArray(data["parameters"])) {
        throw new Error("Expected the field `parameters` to be an array in the JSON data but got " + data["parameters"]);
      }
      for (const item of data["parameters"]) {
        ParameterIterationModel_default.validateJSON(item);
      }
      ;
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
AssignIterationApiModel.RequiredProperties = ["parameters", "id"];
AssignIterationApiModel.prototype["parameters"] = void 0;
AssignIterationApiModel.prototype["id"] = void 0;
var AssignIterationApiModel_default = AssignIterationApiModel;

// src/adaptersapi/model/AttachmentApiResult.js
var AttachmentApiResult = class _AttachmentApiResult {
  /**
   * Constructs a new <code>AttachmentApiResult</code>.
   * @alias module:model/AttachmentApiResult
   * @param id {String} Unique ID of the attachment
   * @param fileId {String} Unique ID of the attachment file
   * @param type {String} MIME type of the attachment
   * @param size {Number} Size in bytes of the attachment file
   * @param name {String} Name of the attachment file
   */
  constructor(id, fileId, type, size, name) {
    _AttachmentApiResult.initialize(this, id, fileId, type, size, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, fileId, type, size, name) {
    obj["id"] = id;
    obj["fileId"] = fileId;
    obj["type"] = type;
    obj["size"] = size;
    obj["name"] = name;
  }
  /**
   * Constructs a <code>AttachmentApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AttachmentApiResult} obj Optional instance to populate.
   * @return {module:model/AttachmentApiResult} The populated <code>AttachmentApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AttachmentApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("fileId")) {
        obj["fileId"] = ApiClient_default.convertToType(data["fileId"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], "String");
      }
      if (data.hasOwnProperty("size")) {
        obj["size"] = ApiClient_default.convertToType(data["size"], "Number");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AttachmentApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AttachmentApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _AttachmentApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["fileId"] && !(typeof data["fileId"] === "string" || data["fileId"] instanceof String)) {
      throw new Error("Expected the field `fileId` to be a primitive type in the JSON string but got " + data["fileId"]);
    }
    if (data["type"] && !(typeof data["type"] === "string" || data["type"] instanceof String)) {
      throw new Error("Expected the field `type` to be a primitive type in the JSON string but got " + data["type"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
AttachmentApiResult.RequiredProperties = ["id", "fileId", "type", "size", "name"];
AttachmentApiResult.prototype["id"] = void 0;
AttachmentApiResult.prototype["fileId"] = void 0;
AttachmentApiResult.prototype["type"] = void 0;
AttachmentApiResult.prototype["size"] = void 0;
AttachmentApiResult.prototype["name"] = void 0;
var AttachmentApiResult_default = AttachmentApiResult;

// src/adaptersapi/model/AttachmentModel.js
var AttachmentModel = class _AttachmentModel {
  /**
   * Constructs a new <code>AttachmentModel</code>.
   * @alias module:model/AttachmentModel
   * @param fileId {String} Unique ID of the attachment file
   * @param type {String} MIME type of the attachment
   * @param size {Number} Size in bytes of the attachment file
   * @param createdDate {Date} Creation date of the attachment
   * @param createdById {String} Unique ID of the attachment creator
   * @param name {String} Name of the attachment file
   * @param id {String} Unique ID of the attachment
   */
  constructor(fileId, type, size, createdDate, createdById, name, id) {
    _AttachmentModel.initialize(this, fileId, type, size, createdDate, createdById, name, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, fileId, type, size, createdDate, createdById, name, id) {
    obj["fileId"] = fileId;
    obj["type"] = type;
    obj["size"] = size;
    obj["createdDate"] = createdDate;
    obj["createdById"] = createdById;
    obj["name"] = name;
    obj["id"] = id;
  }
  /**
   * Constructs a <code>AttachmentModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AttachmentModel} obj Optional instance to populate.
   * @return {module:model/AttachmentModel} The populated <code>AttachmentModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AttachmentModel();
      if (data.hasOwnProperty("fileId")) {
        obj["fileId"] = ApiClient_default.convertToType(data["fileId"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], "String");
      }
      if (data.hasOwnProperty("size")) {
        obj["size"] = ApiClient_default.convertToType(data["size"], "Number");
      }
      if (data.hasOwnProperty("createdDate")) {
        obj["createdDate"] = ApiClient_default.convertToType(data["createdDate"], "Date");
      }
      if (data.hasOwnProperty("modifiedDate")) {
        obj["modifiedDate"] = ApiClient_default.convertToType(data["modifiedDate"], "Date");
      }
      if (data.hasOwnProperty("createdById")) {
        obj["createdById"] = ApiClient_default.convertToType(data["createdById"], "String");
      }
      if (data.hasOwnProperty("modifiedById")) {
        obj["modifiedById"] = ApiClient_default.convertToType(data["modifiedById"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AttachmentModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AttachmentModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AttachmentModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["fileId"] && !(typeof data["fileId"] === "string" || data["fileId"] instanceof String)) {
      throw new Error("Expected the field `fileId` to be a primitive type in the JSON string but got " + data["fileId"]);
    }
    if (data["type"] && !(typeof data["type"] === "string" || data["type"] instanceof String)) {
      throw new Error("Expected the field `type` to be a primitive type in the JSON string but got " + data["type"]);
    }
    if (data["createdById"] && !(typeof data["createdById"] === "string" || data["createdById"] instanceof String)) {
      throw new Error("Expected the field `createdById` to be a primitive type in the JSON string but got " + data["createdById"]);
    }
    if (data["modifiedById"] && !(typeof data["modifiedById"] === "string" || data["modifiedById"] instanceof String)) {
      throw new Error("Expected the field `modifiedById` to be a primitive type in the JSON string but got " + data["modifiedById"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
AttachmentModel.RequiredProperties = ["fileId", "type", "size", "createdDate", "createdById", "name", "id"];
AttachmentModel.prototype["fileId"] = void 0;
AttachmentModel.prototype["type"] = void 0;
AttachmentModel.prototype["size"] = void 0;
AttachmentModel.prototype["createdDate"] = void 0;
AttachmentModel.prototype["modifiedDate"] = void 0;
AttachmentModel.prototype["createdById"] = void 0;
AttachmentModel.prototype["modifiedById"] = void 0;
AttachmentModel.prototype["name"] = void 0;
AttachmentModel.prototype["id"] = void 0;
var AttachmentModel_default = AttachmentModel;

// src/adaptersapi/model/AttachmentPutModel.js
var AttachmentPutModel = class _AttachmentPutModel {
  /**
   * Constructs a new <code>AttachmentPutModel</code>.
   * @alias module:model/AttachmentPutModel
   * @param id {String} Unique ID of the attachment
   */
  constructor(id) {
    _AttachmentPutModel.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>AttachmentPutModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AttachmentPutModel} obj Optional instance to populate.
   * @return {module:model/AttachmentPutModel} The populated <code>AttachmentPutModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AttachmentPutModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AttachmentPutModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AttachmentPutModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AttachmentPutModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
AttachmentPutModel.RequiredProperties = ["id"];
AttachmentPutModel.prototype["id"] = void 0;
var AttachmentPutModel_default = AttachmentPutModel;

// src/adaptersapi/model/AvailableTestResultOutcome.js
var AvailableTestResultOutcome = class {
  /**
   * value: "Passed"
   * @const
   */
  "Passed" = "Passed";
  /**
   * value: "Failed"
   * @const
   */
  "Failed" = "Failed";
  /**
   * value: "Blocked"
   * @const
   */
  "Blocked" = "Blocked";
  /**
   * value: "Skipped"
   * @const
   */
  "Skipped" = "Skipped";
  /**
   * value: "InProgress"
   * @const
   */
  "InProgress" = "InProgress";
  /**
  * Returns a <code>AvailableTestResultOutcome</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/AvailableTestResultOutcome} The enum <code>AvailableTestResultOutcome</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/AttachmentPutModelAutoTestStepResultsModel.js
var AttachmentPutModelAutoTestStepResultsModel = class _AttachmentPutModelAutoTestStepResultsModel {
  /**
   * Constructs a new <code>AttachmentPutModelAutoTestStepResultsModel</code>.
   * @alias module:model/AttachmentPutModelAutoTestStepResultsModel
   */
  constructor() {
    _AttachmentPutModelAutoTestStepResultsModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>AttachmentPutModelAutoTestStepResultsModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AttachmentPutModelAutoTestStepResultsModel} obj Optional instance to populate.
   * @return {module:model/AttachmentPutModelAutoTestStepResultsModel} The populated <code>AttachmentPutModelAutoTestStepResultsModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AttachmentPutModelAutoTestStepResultsModel();
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("info")) {
        obj["info"] = ApiClient_default.convertToType(data["info"], "String");
      }
      if (data.hasOwnProperty("startedOn")) {
        obj["startedOn"] = ApiClient_default.convertToType(data["startedOn"], "Date");
      }
      if (data.hasOwnProperty("completedOn")) {
        obj["completedOn"] = ApiClient_default.convertToType(data["completedOn"], "Date");
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], "Number");
      }
      if (data.hasOwnProperty("outcome")) {
        obj["outcome"] = ApiClient_default.convertToType(data["outcome"], AvailableTestResultOutcome);
      }
      if (data.hasOwnProperty("stepResults")) {
        obj["stepResults"] = ApiClient_default.convertToType(data["stepResults"], [_AttachmentPutModelAutoTestStepResultsModel]);
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentPutModel_default]);
      }
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], { "String": "String" });
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AttachmentPutModelAutoTestStepResultsModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AttachmentPutModelAutoTestStepResultsModel</code>.
   */
  static validateJSON(data) {
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["info"] && !(typeof data["info"] === "string" || data["info"] instanceof String)) {
      throw new Error("Expected the field `info` to be a primitive type in the JSON string but got " + data["info"]);
    }
    if (data["stepResults"]) {
      if (!Array.isArray(data["stepResults"])) {
        throw new Error("Expected the field `stepResults` to be an array in the JSON data but got " + data["stepResults"]);
      }
      for (const item of data["stepResults"]) {
        _AttachmentPutModelAutoTestStepResultsModel.validateJSON(item);
      }
      ;
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentPutModel_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
AttachmentPutModelAutoTestStepResultsModel.prototype["title"] = void 0;
AttachmentPutModelAutoTestStepResultsModel.prototype["description"] = void 0;
AttachmentPutModelAutoTestStepResultsModel.prototype["info"] = void 0;
AttachmentPutModelAutoTestStepResultsModel.prototype["startedOn"] = void 0;
AttachmentPutModelAutoTestStepResultsModel.prototype["completedOn"] = void 0;
AttachmentPutModelAutoTestStepResultsModel.prototype["duration"] = void 0;
AttachmentPutModelAutoTestStepResultsModel.prototype["outcome"] = void 0;
AttachmentPutModelAutoTestStepResultsModel.prototype["stepResults"] = void 0;
AttachmentPutModelAutoTestStepResultsModel.prototype["attachments"] = void 0;
AttachmentPutModelAutoTestStepResultsModel.prototype["parameters"] = void 0;
var AttachmentPutModelAutoTestStepResultsModel_default = AttachmentPutModelAutoTestStepResultsModel;

// src/adaptersapi/model/AttachmentUpdateRequest.js
var AttachmentUpdateRequest = class _AttachmentUpdateRequest {
  /**
   * Constructs a new <code>AttachmentUpdateRequest</code>.
   * @alias module:model/AttachmentUpdateRequest
   * @param id {String} Unique ID of the attachment
   */
  constructor(id) {
    _AttachmentUpdateRequest.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>AttachmentUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AttachmentUpdateRequest} obj Optional instance to populate.
   * @return {module:model/AttachmentUpdateRequest} The populated <code>AttachmentUpdateRequest</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AttachmentUpdateRequest();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AttachmentUpdateRequest</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AttachmentUpdateRequest</code>.
   */
  static validateJSON(data) {
    for (const property of _AttachmentUpdateRequest.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
AttachmentUpdateRequest.RequiredProperties = ["id"];
AttachmentUpdateRequest.prototype["id"] = void 0;
var AttachmentUpdateRequest_default = AttachmentUpdateRequest;

// src/adaptersapi/model/AutoTestStep.js
var AutoTestStep = class _AutoTestStep {
  /**
   * Constructs a new <code>AutoTestStep</code>.
   * @alias module:model/AutoTestStep
   * @param title {String} Step name.
   */
  constructor(title) {
    _AutoTestStep.initialize(this, title);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, title) {
    obj["title"] = title;
  }
  /**
   * Constructs a <code>AutoTestStep</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestStep} obj Optional instance to populate.
   * @return {module:model/AutoTestStep} The populated <code>AutoTestStep</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestStep();
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [_AutoTestStep]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestStep</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestStep</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestStep.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        _AutoTestStep.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
AutoTestStep.RequiredProperties = ["title"];
AutoTestStep.prototype["title"] = void 0;
AutoTestStep.prototype["description"] = void 0;
AutoTestStep.prototype["steps"] = void 0;
var AutoTestStep_default = AutoTestStep;

// src/adaptersapi/model/LabelApiModel.js
var LabelApiModel = class _LabelApiModel {
  /**
   * Constructs a new <code>LabelApiModel</code>.
   * @alias module:model/LabelApiModel
   * @param name {String} Name of the label
   */
  constructor(name) {
    _LabelApiModel.initialize(this, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name) {
    obj["name"] = name;
  }
  /**
   * Constructs a <code>LabelApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LabelApiModel} obj Optional instance to populate.
   * @return {module:model/LabelApiModel} The populated <code>LabelApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LabelApiModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LabelApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LabelApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _LabelApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
LabelApiModel.RequiredProperties = ["name"];
LabelApiModel.prototype["name"] = void 0;
var LabelApiModel_default = LabelApiModel;

// src/adaptersapi/model/LinkType.js
var LinkType = class {
  /**
   * value: "Related"
   * @const
   */
  "Related" = "Related";
  /**
   * value: "BlockedBy"
   * @const
   */
  "BlockedBy" = "BlockedBy";
  /**
   * value: "Defect"
   * @const
   */
  "Defect" = "Defect";
  /**
   * value: "Issue"
   * @const
   */
  "Issue" = "Issue";
  /**
   * value: "Requirement"
   * @const
   */
  "Requirement" = "Requirement";
  /**
   * value: "Repository"
   * @const
   */
  "Repository" = "Repository";
  /**
  * Returns a <code>LinkType</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/LinkType} The enum <code>LinkType</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/LinkApiResult.js
var LinkApiResult = class _LinkApiResult {
  /**
   * Constructs a new <code>LinkApiResult</code>.
   * @alias module:model/LinkApiResult
   * @param url {String} Address can be specified without protocol, but necessarily with the domain.
   * @param type {module:model/LinkType} Specifies the type of the link.
   */
  constructor(url, type) {
    _LinkApiResult.initialize(this, url, type);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, url, type) {
    obj["url"] = url;
    obj["type"] = type;
  }
  /**
   * Constructs a <code>LinkApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LinkApiResult} obj Optional instance to populate.
   * @return {module:model/LinkApiResult} The populated <code>LinkApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LinkApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("url")) {
        obj["url"] = ApiClient_default.convertToType(data["url"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], LinkType);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LinkApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LinkApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _LinkApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["url"] && !(typeof data["url"] === "string" || data["url"] instanceof String)) {
      throw new Error("Expected the field `url` to be a primitive type in the JSON string but got " + data["url"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    return true;
  }
};
LinkApiResult.RequiredProperties = ["url", "type"];
LinkApiResult.prototype["id"] = void 0;
LinkApiResult.prototype["title"] = void 0;
LinkApiResult.prototype["url"] = void 0;
LinkApiResult.prototype["description"] = void 0;
LinkApiResult.prototype["type"] = void 0;
var LinkApiResult_default = LinkApiResult;

// src/adaptersapi/model/AutoTest.js
var AutoTest = class _AutoTest {
  /**
   * Constructs a new <code>AutoTest</code>.
   * @alias module:model/AutoTest
   * @param externalId {String} External ID of the autotest
   * @param projectId {String} Unique ID of the autotest project
   * @param name {String} Name of the autotest
   * @param globalId {Number} Global ID of the autotest
   * @param id {String} Unique ID of the autotest
   */
  constructor(externalId, projectId, name, globalId, id) {
    _AutoTest.initialize(this, externalId, projectId, name, globalId, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, externalId, projectId, name, globalId, id) {
    obj["externalId"] = externalId;
    obj["projectId"] = projectId;
    obj["name"] = name;
    obj["globalId"] = globalId;
    obj["id"] = id;
  }
  /**
   * Constructs a <code>AutoTest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTest} obj Optional instance to populate.
   * @return {module:model/AutoTest} The populated <code>AutoTest</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTest();
      if (data.hasOwnProperty("externalId")) {
        obj["externalId"] = ApiClient_default.convertToType(data["externalId"], "String");
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [LinkApiResult_default]);
      }
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("namespace")) {
        obj["namespace"] = ApiClient_default.convertToType(data["namespace"], "String");
      }
      if (data.hasOwnProperty("classname")) {
        obj["classname"] = ApiClient_default.convertToType(data["classname"], "String");
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [AutoTestStep_default]);
      }
      if (data.hasOwnProperty("setup")) {
        obj["setup"] = ApiClient_default.convertToType(data["setup"], [AutoTestStep_default]);
      }
      if (data.hasOwnProperty("teardown")) {
        obj["teardown"] = ApiClient_default.convertToType(data["teardown"], [AutoTestStep_default]);
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("labels")) {
        obj["labels"] = ApiClient_default.convertToType(data["labels"], [LabelApiModel_default]);
      }
      if (data.hasOwnProperty("isFlaky")) {
        obj["isFlaky"] = ApiClient_default.convertToType(data["isFlaky"], "Boolean");
      }
      if (data.hasOwnProperty("externalKey")) {
        obj["externalKey"] = ApiClient_default.convertToType(data["externalKey"], "String");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTest</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTest</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTest.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["externalId"] && !(typeof data["externalId"] === "string" || data["externalId"] instanceof String)) {
      throw new Error("Expected the field `externalId` to be a primitive type in the JSON string but got " + data["externalId"]);
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        LinkApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["namespace"] && !(typeof data["namespace"] === "string" || data["namespace"] instanceof String)) {
      throw new Error("Expected the field `namespace` to be a primitive type in the JSON string but got " + data["namespace"]);
    }
    if (data["classname"] && !(typeof data["classname"] === "string" || data["classname"] instanceof String)) {
      throw new Error("Expected the field `classname` to be a primitive type in the JSON string but got " + data["classname"]);
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        AutoTestStep_default.validateJSON(item);
      }
      ;
    }
    if (data["setup"]) {
      if (!Array.isArray(data["setup"])) {
        throw new Error("Expected the field `setup` to be an array in the JSON data but got " + data["setup"]);
      }
      for (const item of data["setup"]) {
        AutoTestStep_default.validateJSON(item);
      }
      ;
    }
    if (data["teardown"]) {
      if (!Array.isArray(data["teardown"])) {
        throw new Error("Expected the field `teardown` to be an array in the JSON data but got " + data["teardown"]);
      }
      for (const item of data["teardown"]) {
        AutoTestStep_default.validateJSON(item);
      }
      ;
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["labels"]) {
      if (!Array.isArray(data["labels"])) {
        throw new Error("Expected the field `labels` to be an array in the JSON data but got " + data["labels"]);
      }
      for (const item of data["labels"]) {
        LabelApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["externalKey"] && !(typeof data["externalKey"] === "string" || data["externalKey"] instanceof String)) {
      throw new Error("Expected the field `externalKey` to be a primitive type in the JSON string but got " + data["externalKey"]);
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
AutoTest.RequiredProperties = ["externalId", "projectId", "name", "globalId", "id"];
AutoTest.prototype["externalId"] = void 0;
AutoTest.prototype["links"] = void 0;
AutoTest.prototype["projectId"] = void 0;
AutoTest.prototype["name"] = void 0;
AutoTest.prototype["namespace"] = void 0;
AutoTest.prototype["classname"] = void 0;
AutoTest.prototype["steps"] = void 0;
AutoTest.prototype["setup"] = void 0;
AutoTest.prototype["teardown"] = void 0;
AutoTest.prototype["title"] = void 0;
AutoTest.prototype["description"] = void 0;
AutoTest.prototype["labels"] = void 0;
AutoTest.prototype["isFlaky"] = void 0;
AutoTest.prototype["externalKey"] = void 0;
AutoTest.prototype["globalId"] = void 0;
AutoTest.prototype["id"] = void 0;
var AutoTest_default = AutoTest;

// src/adaptersapi/model/AutoTestStepApiResult.js
var AutoTestStepApiResult = class _AutoTestStepApiResult {
  /**
   * Constructs a new <code>AutoTestStepApiResult</code>.
   * @alias module:model/AutoTestStepApiResult
   * @param title {String} Step name.
   */
  constructor(title) {
    _AutoTestStepApiResult.initialize(this, title);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, title) {
    obj["title"] = title;
  }
  /**
   * Constructs a <code>AutoTestStepApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestStepApiResult} obj Optional instance to populate.
   * @return {module:model/AutoTestStepApiResult} The populated <code>AutoTestStepApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestStepApiResult();
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [_AutoTestStepApiResult]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestStepApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestStepApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestStepApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        _AutoTestStepApiResult.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
AutoTestStepApiResult.RequiredProperties = ["title"];
AutoTestStepApiResult.prototype["title"] = void 0;
AutoTestStepApiResult.prototype["description"] = void 0;
AutoTestStepApiResult.prototype["steps"] = void 0;
var AutoTestStepApiResult_default = AutoTestStepApiResult;

// src/adaptersapi/model/LabelApiResult.js
var LabelApiResult = class _LabelApiResult {
  /**
   * Constructs a new <code>LabelApiResult</code>.
   * @alias module:model/LabelApiResult
   * @param name {String} Name of the label
   * @param globalId {Number} Global ID of the label
   */
  constructor(name, globalId) {
    _LabelApiResult.initialize(this, name, globalId);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name, globalId) {
    obj["name"] = name;
    obj["globalId"] = globalId;
  }
  /**
   * Constructs a <code>LabelApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LabelApiResult} obj Optional instance to populate.
   * @return {module:model/LabelApiResult} The populated <code>LabelApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LabelApiResult();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LabelApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LabelApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _LabelApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
LabelApiResult.RequiredProperties = ["name", "globalId"];
LabelApiResult.prototype["name"] = void 0;
LabelApiResult.prototype["globalId"] = void 0;
var LabelApiResult_default = LabelApiResult;

// src/adaptersapi/model/LayerSource.js
var LayerSource = class {
  /**
   * value: "Manual"
   * @const
   */
  "Manual" = "Manual";
  /**
   * value: "Report"
   * @const
   */
  "Report" = "Report";
  /**
   * value: "Run"
   * @const
   */
  "Run" = "Run";
  /**
   * value: "Rule"
   * @const
   */
  "Rule" = "Rule";
  /**
  * Returns a <code>LayerSource</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/LayerSource} The enum <code>LayerSource</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/LayerApiResult.js
var LayerApiResult = class _LayerApiResult {
  /**
   * Constructs a new <code>LayerApiResult</code>.
   * Model of auto test layer for use in responses.
   * @alias module:model/LayerApiResult
   * @param name {String} Name of the test pyramid layer.
   * @param source {module:model/LayerSource} Source of the test pyramid layer.
   */
  constructor(name, source) {
    _LayerApiResult.initialize(this, name, source);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name, source) {
    obj["name"] = name;
    obj["source"] = source;
  }
  /**
   * Constructs a <code>LayerApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LayerApiResult} obj Optional instance to populate.
   * @return {module:model/LayerApiResult} The populated <code>LayerApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LayerApiResult();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("source")) {
        obj["source"] = ApiClient_default.convertToType(data["source"], LayerSource);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LayerApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LayerApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _LayerApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
LayerApiResult.RequiredProperties = ["name", "source"];
LayerApiResult.prototype["name"] = void 0;
LayerApiResult.prototype["source"] = void 0;
var LayerApiResult_default = LayerApiResult;

// src/adaptersapi/model/AutoTestApiResult.js
var AutoTestApiResult = class _AutoTestApiResult {
  /**
   * Constructs a new <code>AutoTestApiResult</code>.
   * @alias module:model/AutoTestApiResult
   * @param id {String} 
   * @param projectId {String} 
   * @param name {String} 
   * @param isFlaky {Boolean} 
   * @param globalId {Number} 
   */
  constructor(id, projectId, name, isFlaky, globalId) {
    _AutoTestApiResult.initialize(this, id, projectId, name, isFlaky, globalId);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, projectId, name, isFlaky, globalId) {
    obj["id"] = id;
    obj["projectId"] = projectId;
    obj["name"] = name;
    obj["isFlaky"] = isFlaky;
    obj["globalId"] = globalId;
  }
  /**
   * Constructs a <code>AutoTestApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestApiResult} obj Optional instance to populate.
   * @return {module:model/AutoTestApiResult} The populated <code>AutoTestApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("externalId")) {
        obj["externalId"] = ApiClient_default.convertToType(data["externalId"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("namespace")) {
        obj["namespace"] = ApiClient_default.convertToType(data["namespace"], "String");
      }
      if (data.hasOwnProperty("classname")) {
        obj["classname"] = ApiClient_default.convertToType(data["classname"], "String");
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [AutoTestStepApiResult_default]);
      }
      if (data.hasOwnProperty("setup")) {
        obj["setup"] = ApiClient_default.convertToType(data["setup"], [AutoTestStepApiResult_default]);
      }
      if (data.hasOwnProperty("teardown")) {
        obj["teardown"] = ApiClient_default.convertToType(data["teardown"], [AutoTestStepApiResult_default]);
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("isFlaky")) {
        obj["isFlaky"] = ApiClient_default.convertToType(data["isFlaky"], "Boolean");
      }
      if (data.hasOwnProperty("externalKey")) {
        obj["externalKey"] = ApiClient_default.convertToType(data["externalKey"], "String");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("layer")) {
        obj["layer"] = ApiClient_default.convertToType(data["layer"], LayerApiResult_default);
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [LinkApiResult_default]);
      }
      if (data.hasOwnProperty("labels")) {
        obj["labels"] = ApiClient_default.convertToType(data["labels"], [LabelApiResult_default]);
      }
      if (data.hasOwnProperty("tags")) {
        obj["tags"] = ApiClient_default.convertToType(data["tags"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["externalId"] && !(typeof data["externalId"] === "string" || data["externalId"] instanceof String)) {
      throw new Error("Expected the field `externalId` to be a primitive type in the JSON string but got " + data["externalId"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["namespace"] && !(typeof data["namespace"] === "string" || data["namespace"] instanceof String)) {
      throw new Error("Expected the field `namespace` to be a primitive type in the JSON string but got " + data["namespace"]);
    }
    if (data["classname"] && !(typeof data["classname"] === "string" || data["classname"] instanceof String)) {
      throw new Error("Expected the field `classname` to be a primitive type in the JSON string but got " + data["classname"]);
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        AutoTestStepApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["setup"]) {
      if (!Array.isArray(data["setup"])) {
        throw new Error("Expected the field `setup` to be an array in the JSON data but got " + data["setup"]);
      }
      for (const item of data["setup"]) {
        AutoTestStepApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["teardown"]) {
      if (!Array.isArray(data["teardown"])) {
        throw new Error("Expected the field `teardown` to be an array in the JSON data but got " + data["teardown"]);
      }
      for (const item of data["teardown"]) {
        AutoTestStepApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["externalKey"] && !(typeof data["externalKey"] === "string" || data["externalKey"] instanceof String)) {
      throw new Error("Expected the field `externalKey` to be a primitive type in the JSON string but got " + data["externalKey"]);
    }
    if (data["layer"]) {
      LayerApiResult_default.validateJSON(data["layer"]);
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        LinkApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["labels"]) {
      if (!Array.isArray(data["labels"])) {
        throw new Error("Expected the field `labels` to be an array in the JSON data but got " + data["labels"]);
      }
      for (const item of data["labels"]) {
        LabelApiResult_default.validateJSON(item);
      }
      ;
    }
    if (!Array.isArray(data["tags"])) {
      throw new Error("Expected the field `tags` to be an array in the JSON data but got " + data["tags"]);
    }
    return true;
  }
};
AutoTestApiResult.RequiredProperties = ["id", "projectId", "name", "isFlaky", "globalId"];
AutoTestApiResult.prototype["id"] = void 0;
AutoTestApiResult.prototype["projectId"] = void 0;
AutoTestApiResult.prototype["externalId"] = void 0;
AutoTestApiResult.prototype["name"] = void 0;
AutoTestApiResult.prototype["namespace"] = void 0;
AutoTestApiResult.prototype["classname"] = void 0;
AutoTestApiResult.prototype["steps"] = void 0;
AutoTestApiResult.prototype["setup"] = void 0;
AutoTestApiResult.prototype["teardown"] = void 0;
AutoTestApiResult.prototype["title"] = void 0;
AutoTestApiResult.prototype["description"] = void 0;
AutoTestApiResult.prototype["isFlaky"] = void 0;
AutoTestApiResult.prototype["externalKey"] = void 0;
AutoTestApiResult.prototype["globalId"] = void 0;
AutoTestApiResult.prototype["layer"] = void 0;
AutoTestApiResult.prototype["links"] = void 0;
AutoTestApiResult.prototype["labels"] = void 0;
AutoTestApiResult.prototype["tags"] = void 0;

// src/adaptersapi/model/AutoTestCaseApiModel.js
var AutoTestCaseApiModel = class _AutoTestCaseApiModel {
  /**
   * Constructs a new <code>AutoTestCaseApiModel</code>.
   * @alias module:model/AutoTestCaseApiModel
   * @param id {String} Unique identifier of the automated test case
   */
  constructor(id) {
    _AutoTestCaseApiModel.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>AutoTestCaseApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestCaseApiModel} obj Optional instance to populate.
   * @return {module:model/AutoTestCaseApiModel} The populated <code>AutoTestCaseApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestCaseApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestCaseApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestCaseApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestCaseApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
AutoTestCaseApiModel.RequiredProperties = ["id"];
AutoTestCaseApiModel.prototype["id"] = void 0;

// src/adaptersapi/model/AutoTestStepApiModel.js
var AutoTestStepApiModel = class _AutoTestStepApiModel {
  /**
   * Constructs a new <code>AutoTestStepApiModel</code>.
   * @alias module:model/AutoTestStepApiModel
   * @param title {String} Step name.
   */
  constructor(title) {
    _AutoTestStepApiModel.initialize(this, title);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, title) {
    obj["title"] = title;
  }
  /**
   * Constructs a <code>AutoTestStepApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestStepApiModel} obj Optional instance to populate.
   * @return {module:model/AutoTestStepApiModel} The populated <code>AutoTestStepApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestStepApiModel();
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [_AutoTestStepApiModel]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestStepApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestStepApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestStepApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        _AutoTestStepApiModel.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
AutoTestStepApiModel.RequiredProperties = ["title"];
AutoTestStepApiModel.prototype["title"] = void 0;
AutoTestStepApiModel.prototype["description"] = void 0;
AutoTestStepApiModel.prototype["steps"] = void 0;
var AutoTestStepApiModel_default = AutoTestStepApiModel;

// src/adaptersapi/model/LayerApiModel.js
var LayerApiModel = class _LayerApiModel {
  /**
   * Constructs a new <code>LayerApiModel</code>.
   * Model of auto test layer for use in requests.
   * @alias module:model/LayerApiModel
   * @param name {String} Name of the test pyramid layer.              Available layers:              * Unit * Component * API * UI * E2E * Contract
   * @param source {module:model/LayerSource} Source of the test pyramid layer.
   */
  constructor(name, source) {
    _LayerApiModel.initialize(this, name, source);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name, source) {
    obj["name"] = name;
    obj["source"] = source;
  }
  /**
   * Constructs a <code>LayerApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LayerApiModel} obj Optional instance to populate.
   * @return {module:model/LayerApiModel} The populated <code>LayerApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LayerApiModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("source")) {
        obj["source"] = ApiClient_default.convertToType(data["source"], LayerSource);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LayerApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LayerApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _LayerApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
LayerApiModel.RequiredProperties = ["name", "source"];
LayerApiModel.prototype["name"] = void 0;
LayerApiModel.prototype["source"] = void 0;
var LayerApiModel_default = LayerApiModel;

// src/adaptersapi/model/LinkCreateApiModel.js
var LinkCreateApiModel = class _LinkCreateApiModel {
  /**
   * Constructs a new <code>LinkCreateApiModel</code>.
   * @alias module:model/LinkCreateApiModel
   * @param url {String} Address can be specified without protocol, but necessarily with the domain.
   * @param type {module:model/LinkType} Specifies the type of the link.
   */
  constructor(url, type) {
    _LinkCreateApiModel.initialize(this, url, type);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, url, type) {
    obj["url"] = url;
    obj["type"] = type;
  }
  /**
   * Constructs a <code>LinkCreateApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LinkCreateApiModel} obj Optional instance to populate.
   * @return {module:model/LinkCreateApiModel} The populated <code>LinkCreateApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LinkCreateApiModel();
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("url")) {
        obj["url"] = ApiClient_default.convertToType(data["url"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], LinkType);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LinkCreateApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LinkCreateApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _LinkCreateApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["url"] && !(typeof data["url"] === "string" || data["url"] instanceof String)) {
      throw new Error("Expected the field `url` to be a primitive type in the JSON string but got " + data["url"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    return true;
  }
};
LinkCreateApiModel.RequiredProperties = ["url", "type"];
LinkCreateApiModel.prototype["title"] = void 0;
LinkCreateApiModel.prototype["url"] = void 0;
LinkCreateApiModel.prototype["description"] = void 0;
LinkCreateApiModel.prototype["type"] = void 0;
var LinkCreateApiModel_default = LinkCreateApiModel;

// src/adaptersapi/model/AutoTestCreateApiModel.js
var AutoTestCreateApiModel = class _AutoTestCreateApiModel {
  /**
   * Constructs a new <code>AutoTestCreateApiModel</code>.
   * @alias module:model/AutoTestCreateApiModel
   * @param projectId {String} Unique ID of the autotest project
   * @param externalId {String} External ID of the autotest
   * @param name {String} Name of the autotest
   */
  constructor(projectId, externalId, name) {
    _AutoTestCreateApiModel.initialize(this, projectId, externalId, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, projectId, externalId, name) {
    obj["projectId"] = projectId;
    obj["externalId"] = externalId;
    obj["name"] = name;
  }
  /**
   * Constructs a <code>AutoTestCreateApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestCreateApiModel} obj Optional instance to populate.
   * @return {module:model/AutoTestCreateApiModel} The populated <code>AutoTestCreateApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestCreateApiModel();
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("externalId")) {
        obj["externalId"] = ApiClient_default.convertToType(data["externalId"], "String");
      }
      if (data.hasOwnProperty("externalKey")) {
        obj["externalKey"] = ApiClient_default.convertToType(data["externalKey"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("namespace")) {
        obj["namespace"] = ApiClient_default.convertToType(data["namespace"], "String");
      }
      if (data.hasOwnProperty("classname")) {
        obj["classname"] = ApiClient_default.convertToType(data["classname"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("isFlaky")) {
        obj["isFlaky"] = ApiClient_default.convertToType(data["isFlaky"], "Boolean");
      }
      if (data.hasOwnProperty("layer")) {
        obj["layer"] = ApiClient_default.convertToType(data["layer"], LayerApiModel_default);
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [AutoTestStepApiModel_default]);
      }
      if (data.hasOwnProperty("setup")) {
        obj["setup"] = ApiClient_default.convertToType(data["setup"], [AutoTestStepApiModel_default]);
      }
      if (data.hasOwnProperty("teardown")) {
        obj["teardown"] = ApiClient_default.convertToType(data["teardown"], [AutoTestStepApiModel_default]);
      }
      if (data.hasOwnProperty("shouldCreateWorkItem")) {
        obj["shouldCreateWorkItem"] = ApiClient_default.convertToType(data["shouldCreateWorkItem"], "Boolean");
      }
      if (data.hasOwnProperty("labels")) {
        obj["labels"] = ApiClient_default.convertToType(data["labels"], [LabelApiModel_default]);
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [LinkCreateApiModel_default]);
      }
      if (data.hasOwnProperty("tags")) {
        obj["tags"] = ApiClient_default.convertToType(data["tags"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestCreateApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestCreateApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestCreateApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["externalId"] && !(typeof data["externalId"] === "string" || data["externalId"] instanceof String)) {
      throw new Error("Expected the field `externalId` to be a primitive type in the JSON string but got " + data["externalId"]);
    }
    if (data["externalKey"] && !(typeof data["externalKey"] === "string" || data["externalKey"] instanceof String)) {
      throw new Error("Expected the field `externalKey` to be a primitive type in the JSON string but got " + data["externalKey"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["namespace"] && !(typeof data["namespace"] === "string" || data["namespace"] instanceof String)) {
      throw new Error("Expected the field `namespace` to be a primitive type in the JSON string but got " + data["namespace"]);
    }
    if (data["classname"] && !(typeof data["classname"] === "string" || data["classname"] instanceof String)) {
      throw new Error("Expected the field `classname` to be a primitive type in the JSON string but got " + data["classname"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["layer"]) {
      LayerApiModel_default.validateJSON(data["layer"]);
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        AutoTestStepApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["setup"]) {
      if (!Array.isArray(data["setup"])) {
        throw new Error("Expected the field `setup` to be an array in the JSON data but got " + data["setup"]);
      }
      for (const item of data["setup"]) {
        AutoTestStepApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["teardown"]) {
      if (!Array.isArray(data["teardown"])) {
        throw new Error("Expected the field `teardown` to be an array in the JSON data but got " + data["teardown"]);
      }
      for (const item of data["teardown"]) {
        AutoTestStepApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["labels"]) {
      if (!Array.isArray(data["labels"])) {
        throw new Error("Expected the field `labels` to be an array in the JSON data but got " + data["labels"]);
      }
      for (const item of data["labels"]) {
        LabelApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        LinkCreateApiModel_default.validateJSON(item);
      }
      ;
    }
    if (!Array.isArray(data["tags"])) {
      throw new Error("Expected the field `tags` to be an array in the JSON data but got " + data["tags"]);
    }
    return true;
  }
};
AutoTestCreateApiModel.RequiredProperties = ["projectId", "externalId", "name"];
AutoTestCreateApiModel.prototype["projectId"] = void 0;
AutoTestCreateApiModel.prototype["externalId"] = void 0;
AutoTestCreateApiModel.prototype["externalKey"] = void 0;
AutoTestCreateApiModel.prototype["name"] = void 0;
AutoTestCreateApiModel.prototype["namespace"] = void 0;
AutoTestCreateApiModel.prototype["classname"] = void 0;
AutoTestCreateApiModel.prototype["title"] = void 0;
AutoTestCreateApiModel.prototype["description"] = void 0;
AutoTestCreateApiModel.prototype["isFlaky"] = void 0;
AutoTestCreateApiModel.prototype["layer"] = void 0;
AutoTestCreateApiModel.prototype["steps"] = void 0;
AutoTestCreateApiModel.prototype["setup"] = void 0;
AutoTestCreateApiModel.prototype["teardown"] = void 0;
AutoTestCreateApiModel.prototype["shouldCreateWorkItem"] = void 0;
AutoTestCreateApiModel.prototype["labels"] = void 0;
AutoTestCreateApiModel.prototype["links"] = void 0;
AutoTestCreateApiModel.prototype["tags"] = void 0;

// src/adaptersapi/model/AutoTestFilterApiModel.js
var AutoTestFilterApiModel = class _AutoTestFilterApiModel {
  /**
   * Constructs a new <code>AutoTestFilterApiModel</code>.
   * @alias module:model/AutoTestFilterApiModel
   */
  constructor() {
    _AutoTestFilterApiModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>AutoTestFilterApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestFilterApiModel} obj Optional instance to populate.
   * @return {module:model/AutoTestFilterApiModel} The populated <code>AutoTestFilterApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestFilterApiModel();
      if (data.hasOwnProperty("projectIds")) {
        obj["projectIds"] = ApiClient_default.convertToType(data["projectIds"], ["String"]);
      }
      if (data.hasOwnProperty("externalIds")) {
        obj["externalIds"] = ApiClient_default.convertToType(data["externalIds"], ["String"]);
      }
      if (data.hasOwnProperty("globalIds")) {
        obj["globalIds"] = ApiClient_default.convertToType(data["globalIds"], ["Number"]);
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isFlaky")) {
        obj["isFlaky"] = ApiClient_default.convertToType(data["isFlaky"], "Boolean");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("namespace")) {
        obj["namespace"] = ApiClient_default.convertToType(data["namespace"], "String");
      }
      if (data.hasOwnProperty("className")) {
        obj["className"] = ApiClient_default.convertToType(data["className"], "String");
      }
      if (data.hasOwnProperty("externalKey")) {
        obj["externalKey"] = ApiClient_default.convertToType(data["externalKey"], "String");
      }
      if (data.hasOwnProperty("tags")) {
        obj["tags"] = ApiClient_default.convertToType(data["tags"], ["String"]);
      }
      if (data.hasOwnProperty("excludeTags")) {
        obj["excludeTags"] = ApiClient_default.convertToType(data["excludeTags"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestFilterApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestFilterApiModel</code>.
   */
  static validateJSON(data) {
    if (!Array.isArray(data["projectIds"])) {
      throw new Error("Expected the field `projectIds` to be an array in the JSON data but got " + data["projectIds"]);
    }
    if (!Array.isArray(data["externalIds"])) {
      throw new Error("Expected the field `externalIds` to be an array in the JSON data but got " + data["externalIds"]);
    }
    if (!Array.isArray(data["globalIds"])) {
      throw new Error("Expected the field `globalIds` to be an array in the JSON data but got " + data["globalIds"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["namespace"] && !(typeof data["namespace"] === "string" || data["namespace"] instanceof String)) {
      throw new Error("Expected the field `namespace` to be a primitive type in the JSON string but got " + data["namespace"]);
    }
    if (data["className"] && !(typeof data["className"] === "string" || data["className"] instanceof String)) {
      throw new Error("Expected the field `className` to be a primitive type in the JSON string but got " + data["className"]);
    }
    if (data["externalKey"] && !(typeof data["externalKey"] === "string" || data["externalKey"] instanceof String)) {
      throw new Error("Expected the field `externalKey` to be a primitive type in the JSON string but got " + data["externalKey"]);
    }
    if (!Array.isArray(data["tags"])) {
      throw new Error("Expected the field `tags` to be an array in the JSON data but got " + data["tags"]);
    }
    if (!Array.isArray(data["excludeTags"])) {
      throw new Error("Expected the field `excludeTags` to be an array in the JSON data but got " + data["excludeTags"]);
    }
    return true;
  }
};
AutoTestFilterApiModel.prototype["projectIds"] = void 0;
AutoTestFilterApiModel.prototype["externalIds"] = void 0;
AutoTestFilterApiModel.prototype["globalIds"] = void 0;
AutoTestFilterApiModel.prototype["name"] = void 0;
AutoTestFilterApiModel.prototype["isFlaky"] = void 0;
AutoTestFilterApiModel.prototype["isDeleted"] = void 0;
AutoTestFilterApiModel.prototype["namespace"] = void 0;
AutoTestFilterApiModel.prototype["className"] = void 0;
AutoTestFilterApiModel.prototype["externalKey"] = void 0;
AutoTestFilterApiModel.prototype["tags"] = void 0;
AutoTestFilterApiModel.prototype["excludeTags"] = void 0;
var AutoTestFilterApiModel_default = AutoTestFilterApiModel;

// src/adaptersapi/model/AutoTestIdModel.js
var AutoTestIdModel = class _AutoTestIdModel {
  /**
   * Constructs a new <code>AutoTestIdModel</code>.
   * @alias module:model/AutoTestIdModel
   * @param id {String} 
   */
  constructor(id) {
    _AutoTestIdModel.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>AutoTestIdModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestIdModel} obj Optional instance to populate.
   * @return {module:model/AutoTestIdModel} The populated <code>AutoTestIdModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestIdModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestIdModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestIdModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestIdModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
AutoTestIdModel.RequiredProperties = ["id"];
AutoTestIdModel.prototype["id"] = void 0;
var AutoTestIdModel_default = AutoTestIdModel;

// src/adaptersapi/model/AutoTestStepModel.js
var AutoTestStepModel = class _AutoTestStepModel {
  /**
   * Constructs a new <code>AutoTestStepModel</code>.
   * @alias module:model/AutoTestStepModel
   * @param title {String} Step name.
   */
  constructor(title) {
    _AutoTestStepModel.initialize(this, title);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, title) {
    obj["title"] = title;
  }
  /**
   * Constructs a <code>AutoTestStepModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestStepModel} obj Optional instance to populate.
   * @return {module:model/AutoTestStepModel} The populated <code>AutoTestStepModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestStepModel();
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [_AutoTestStepModel]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestStepModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestStepModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestStepModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        _AutoTestStepModel.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
AutoTestStepModel.RequiredProperties = ["title"];
AutoTestStepModel.prototype["title"] = void 0;
AutoTestStepModel.prototype["description"] = void 0;
AutoTestStepModel.prototype["steps"] = void 0;
var AutoTestStepModel_default = AutoTestStepModel;

// src/adaptersapi/model/ConfigurationShortModel.js
var ConfigurationShortModel = class _ConfigurationShortModel {
  /**
   * Constructs a new <code>ConfigurationShortModel</code>.
   * @alias module:model/ConfigurationShortModel
   * @param id {String} 
   * @param name {String} 
   */
  constructor(id, name) {
    _ConfigurationShortModel.initialize(this, id, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, name) {
    obj["id"] = id;
    obj["name"] = name;
  }
  /**
   * Constructs a <code>ConfigurationShortModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConfigurationShortModel} obj Optional instance to populate.
   * @return {module:model/ConfigurationShortModel} The populated <code>ConfigurationShortModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ConfigurationShortModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ConfigurationShortModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ConfigurationShortModel</code>.
   */
  static validateJSON(data) {
    for (const property of _ConfigurationShortModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
ConfigurationShortModel.RequiredProperties = ["id", "name"];
ConfigurationShortModel.prototype["id"] = void 0;
ConfigurationShortModel.prototype["name"] = void 0;
var ConfigurationShortModel_default = ConfigurationShortModel;

// src/adaptersapi/model/LabelShortModel.js
var LabelShortModel = class _LabelShortModel {
  /**
   * Constructs a new <code>LabelShortModel</code>.
   * @alias module:model/LabelShortModel
   * @param globalId {Number} Global ID of the label
   * @param name {String} Name of the label
   */
  constructor(globalId, name) {
    _LabelShortModel.initialize(this, globalId, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, globalId, name) {
    obj["globalId"] = globalId;
    obj["name"] = name;
  }
  /**
   * Constructs a <code>LabelShortModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LabelShortModel} obj Optional instance to populate.
   * @return {module:model/LabelShortModel} The populated <code>LabelShortModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LabelShortModel();
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LabelShortModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LabelShortModel</code>.
   */
  static validateJSON(data) {
    for (const property of _LabelShortModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
LabelShortModel.RequiredProperties = ["globalId", "name"];
LabelShortModel.prototype["globalId"] = void 0;
LabelShortModel.prototype["name"] = void 0;
var LabelShortModel_default = LabelShortModel;

// src/adaptersapi/model/LinkPutModel.js
var LinkPutModel = class _LinkPutModel {
  /**
   * Constructs a new <code>LinkPutModel</code>.
   * @alias module:model/LinkPutModel
   * @param url {String} Address can be specified without protocol, but necessarily with the domain.
   * @param type {module:model/LinkType} Specifies the type of the link.
   * @param hasInfo {Boolean} 
   */
  constructor(url, type, hasInfo) {
    _LinkPutModel.initialize(this, url, type, hasInfo);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, url, type, hasInfo) {
    obj["url"] = url;
    obj["type"] = type;
    obj["hasInfo"] = hasInfo;
  }
  /**
   * Constructs a <code>LinkPutModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LinkPutModel} obj Optional instance to populate.
   * @return {module:model/LinkPutModel} The populated <code>LinkPutModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LinkPutModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("url")) {
        obj["url"] = ApiClient_default.convertToType(data["url"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], LinkType);
      }
      if (data.hasOwnProperty("hasInfo")) {
        obj["hasInfo"] = ApiClient_default.convertToType(data["hasInfo"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LinkPutModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LinkPutModel</code>.
   */
  static validateJSON(data) {
    for (const property of _LinkPutModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["url"] && !(typeof data["url"] === "string" || data["url"] instanceof String)) {
      throw new Error("Expected the field `url` to be a primitive type in the JSON string but got " + data["url"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    return true;
  }
};
LinkPutModel.RequiredProperties = ["url", "type", "hasInfo"];
LinkPutModel.prototype["id"] = void 0;
LinkPutModel.prototype["title"] = void 0;
LinkPutModel.prototype["url"] = void 0;
LinkPutModel.prototype["description"] = void 0;
LinkPutModel.prototype["type"] = void 0;
LinkPutModel.prototype["hasInfo"] = void 0;
var LinkPutModel_default = LinkPutModel;

// src/adaptersapi/model/TestStatusType.js
var TestStatusType = class {
  /**
   * value: "Failed"
   * @const
   */
  "Failed" = "Failed";
  /**
   * value: "InProgress"
   * @const
   */
  "InProgress" = "InProgress";
  /**
   * value: "Incomplete"
   * @const
   */
  "Incomplete" = "Incomplete";
  /**
   * value: "Succeeded"
   * @const
   */
  "Succeeded" = "Succeeded";
  /**
   * value: "Pending"
   * @const
   */
  "Pending" = "Pending";
  /**
  * Returns a <code>TestStatusType</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/TestStatusType} The enum <code>TestStatusType</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/TestStatusModel.js
var TestStatusModel = class _TestStatusModel {
  /**
   * Constructs a new <code>TestStatusModel</code>.
   * @alias module:model/TestStatusModel
   * @param id {String} 
   * @param name {String} 
   * @param type {module:model/TestStatusType} 
   * @param isSystem {Boolean} 
   * @param code {String} 
   */
  constructor(id, name, type, isSystem, code) {
    _TestStatusModel.initialize(this, id, name, type, isSystem, code);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, name, type, isSystem, code) {
    obj["id"] = id;
    obj["name"] = name;
    obj["type"] = type;
    obj["isSystem"] = isSystem;
    obj["code"] = code;
  }
  /**
   * Constructs a <code>TestStatusModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TestStatusModel} obj Optional instance to populate.
   * @return {module:model/TestStatusModel} The populated <code>TestStatusModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _TestStatusModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], TestStatusType);
      }
      if (data.hasOwnProperty("isSystem")) {
        obj["isSystem"] = ApiClient_default.convertToType(data["isSystem"], "Boolean");
      }
      if (data.hasOwnProperty("code")) {
        obj["code"] = ApiClient_default.convertToType(data["code"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>TestStatusModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TestStatusModel</code>.
   */
  static validateJSON(data) {
    for (const property of _TestStatusModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["code"] && !(typeof data["code"] === "string" || data["code"] instanceof String)) {
      throw new Error("Expected the field `code` to be a primitive type in the JSON string but got " + data["code"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    return true;
  }
};
TestStatusModel.RequiredProperties = ["id", "name", "type", "isSystem", "code"];
TestStatusModel.prototype["id"] = void 0;
TestStatusModel.prototype["name"] = void 0;
TestStatusModel.prototype["type"] = void 0;
TestStatusModel.prototype["isSystem"] = void 0;
TestStatusModel.prototype["code"] = void 0;
TestStatusModel.prototype["description"] = void 0;
var TestStatusModel_default = TestStatusModel;

// src/adaptersapi/model/AutoTestModel.js
var AutoTestModel = class _AutoTestModel {
  /**
   * Constructs a new <code>AutoTestModel</code>.
   * @alias module:model/AutoTestModel
   * @param globalId {Number} Global ID of the autotest
   * @param isDeleted {Boolean} Indicates if the autotest is deleted
   * @param mustBeApproved {Boolean} Indicates if the autotest has unapproved changes from linked work items
   * @param id {String} Unique ID of the autotest
   * @param createdDate {Date} Creation date of the autotest
   * @param createdById {String} Unique ID of the project creator
   * @param externalId {String} External ID of the autotest
   * @param projectId {String} Unique ID of the autotest project
   * @param name {String} Name of the autotest
   */
  constructor(globalId, isDeleted, mustBeApproved, id, createdDate, createdById, externalId, projectId, name) {
    _AutoTestModel.initialize(this, globalId, isDeleted, mustBeApproved, id, createdDate, createdById, externalId, projectId, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, globalId, isDeleted, mustBeApproved, id, createdDate, createdById, externalId, projectId, name) {
    obj["globalId"] = globalId;
    obj["isDeleted"] = isDeleted;
    obj["mustBeApproved"] = mustBeApproved;
    obj["id"] = id;
    obj["createdDate"] = createdDate;
    obj["createdById"] = createdById;
    obj["externalId"] = externalId;
    obj["projectId"] = projectId;
    obj["name"] = name;
  }
  /**
   * Constructs a <code>AutoTestModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestModel} obj Optional instance to populate.
   * @return {module:model/AutoTestModel} The populated <code>AutoTestModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestModel();
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("mustBeApproved")) {
        obj["mustBeApproved"] = ApiClient_default.convertToType(data["mustBeApproved"], "Boolean");
      }
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("createdDate")) {
        obj["createdDate"] = ApiClient_default.convertToType(data["createdDate"], "Date");
      }
      if (data.hasOwnProperty("modifiedDate")) {
        obj["modifiedDate"] = ApiClient_default.convertToType(data["modifiedDate"], "Date");
      }
      if (data.hasOwnProperty("createdById")) {
        obj["createdById"] = ApiClient_default.convertToType(data["createdById"], "String");
      }
      if (data.hasOwnProperty("modifiedById")) {
        obj["modifiedById"] = ApiClient_default.convertToType(data["modifiedById"], "String");
      }
      if (data.hasOwnProperty("lastTestRunId")) {
        obj["lastTestRunId"] = ApiClient_default.convertToType(data["lastTestRunId"], "String");
      }
      if (data.hasOwnProperty("lastTestRunName")) {
        obj["lastTestRunName"] = ApiClient_default.convertToType(data["lastTestRunName"], "String");
      }
      if (data.hasOwnProperty("lastTestResultId")) {
        obj["lastTestResultId"] = ApiClient_default.convertToType(data["lastTestResultId"], "String");
      }
      if (data.hasOwnProperty("lastTestResultConfiguration")) {
        obj["lastTestResultConfiguration"] = ApiClient_default.convertToType(data["lastTestResultConfiguration"], ConfigurationShortModel_default);
      }
      if (data.hasOwnProperty("lastTestResultOutcome")) {
        obj["lastTestResultOutcome"] = ApiClient_default.convertToType(data["lastTestResultOutcome"], "String");
      }
      if (data.hasOwnProperty("lastTestResultStatus")) {
        obj["lastTestResultStatus"] = ApiClient_default.convertToType(data["lastTestResultStatus"], TestStatusModel_default);
      }
      if (data.hasOwnProperty("stabilityPercentage")) {
        obj["stabilityPercentage"] = ApiClient_default.convertToType(data["stabilityPercentage"], "Number");
      }
      if (data.hasOwnProperty("externalId")) {
        obj["externalId"] = ApiClient_default.convertToType(data["externalId"], "String");
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [LinkPutModel_default]);
      }
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("namespace")) {
        obj["namespace"] = ApiClient_default.convertToType(data["namespace"], "String");
      }
      if (data.hasOwnProperty("classname")) {
        obj["classname"] = ApiClient_default.convertToType(data["classname"], "String");
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [AutoTestStepModel_default]);
      }
      if (data.hasOwnProperty("setup")) {
        obj["setup"] = ApiClient_default.convertToType(data["setup"], [AutoTestStepModel_default]);
      }
      if (data.hasOwnProperty("teardown")) {
        obj["teardown"] = ApiClient_default.convertToType(data["teardown"], [AutoTestStepModel_default]);
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("labels")) {
        obj["labels"] = ApiClient_default.convertToType(data["labels"], [LabelShortModel_default]);
      }
      if (data.hasOwnProperty("isFlaky")) {
        obj["isFlaky"] = ApiClient_default.convertToType(data["isFlaky"], "Boolean");
      }
      if (data.hasOwnProperty("externalKey")) {
        obj["externalKey"] = ApiClient_default.convertToType(data["externalKey"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["createdById"] && !(typeof data["createdById"] === "string" || data["createdById"] instanceof String)) {
      throw new Error("Expected the field `createdById` to be a primitive type in the JSON string but got " + data["createdById"]);
    }
    if (data["modifiedById"] && !(typeof data["modifiedById"] === "string" || data["modifiedById"] instanceof String)) {
      throw new Error("Expected the field `modifiedById` to be a primitive type in the JSON string but got " + data["modifiedById"]);
    }
    if (data["lastTestRunId"] && !(typeof data["lastTestRunId"] === "string" || data["lastTestRunId"] instanceof String)) {
      throw new Error("Expected the field `lastTestRunId` to be a primitive type in the JSON string but got " + data["lastTestRunId"]);
    }
    if (data["lastTestRunName"] && !(typeof data["lastTestRunName"] === "string" || data["lastTestRunName"] instanceof String)) {
      throw new Error("Expected the field `lastTestRunName` to be a primitive type in the JSON string but got " + data["lastTestRunName"]);
    }
    if (data["lastTestResultId"] && !(typeof data["lastTestResultId"] === "string" || data["lastTestResultId"] instanceof String)) {
      throw new Error("Expected the field `lastTestResultId` to be a primitive type in the JSON string but got " + data["lastTestResultId"]);
    }
    if (data["lastTestResultConfiguration"]) {
      ConfigurationShortModel_default.validateJSON(data["lastTestResultConfiguration"]);
    }
    if (data["lastTestResultOutcome"] && !(typeof data["lastTestResultOutcome"] === "string" || data["lastTestResultOutcome"] instanceof String)) {
      throw new Error("Expected the field `lastTestResultOutcome` to be a primitive type in the JSON string but got " + data["lastTestResultOutcome"]);
    }
    if (data["lastTestResultStatus"]) {
      TestStatusModel_default.validateJSON(data["lastTestResultStatus"]);
    }
    if (data["externalId"] && !(typeof data["externalId"] === "string" || data["externalId"] instanceof String)) {
      throw new Error("Expected the field `externalId` to be a primitive type in the JSON string but got " + data["externalId"]);
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        LinkPutModel_default.validateJSON(item);
      }
      ;
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["namespace"] && !(typeof data["namespace"] === "string" || data["namespace"] instanceof String)) {
      throw new Error("Expected the field `namespace` to be a primitive type in the JSON string but got " + data["namespace"]);
    }
    if (data["classname"] && !(typeof data["classname"] === "string" || data["classname"] instanceof String)) {
      throw new Error("Expected the field `classname` to be a primitive type in the JSON string but got " + data["classname"]);
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        AutoTestStepModel_default.validateJSON(item);
      }
      ;
    }
    if (data["setup"]) {
      if (!Array.isArray(data["setup"])) {
        throw new Error("Expected the field `setup` to be an array in the JSON data but got " + data["setup"]);
      }
      for (const item of data["setup"]) {
        AutoTestStepModel_default.validateJSON(item);
      }
      ;
    }
    if (data["teardown"]) {
      if (!Array.isArray(data["teardown"])) {
        throw new Error("Expected the field `teardown` to be an array in the JSON data but got " + data["teardown"]);
      }
      for (const item of data["teardown"]) {
        AutoTestStepModel_default.validateJSON(item);
      }
      ;
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["labels"]) {
      if (!Array.isArray(data["labels"])) {
        throw new Error("Expected the field `labels` to be an array in the JSON data but got " + data["labels"]);
      }
      for (const item of data["labels"]) {
        LabelShortModel_default.validateJSON(item);
      }
      ;
    }
    if (data["externalKey"] && !(typeof data["externalKey"] === "string" || data["externalKey"] instanceof String)) {
      throw new Error("Expected the field `externalKey` to be a primitive type in the JSON string but got " + data["externalKey"]);
    }
    return true;
  }
};
AutoTestModel.RequiredProperties = ["globalId", "isDeleted", "mustBeApproved", "id", "createdDate", "createdById", "externalId", "projectId", "name"];
AutoTestModel.prototype["globalId"] = void 0;
AutoTestModel.prototype["isDeleted"] = void 0;
AutoTestModel.prototype["mustBeApproved"] = void 0;
AutoTestModel.prototype["id"] = void 0;
AutoTestModel.prototype["createdDate"] = void 0;
AutoTestModel.prototype["modifiedDate"] = void 0;
AutoTestModel.prototype["createdById"] = void 0;
AutoTestModel.prototype["modifiedById"] = void 0;
AutoTestModel.prototype["lastTestRunId"] = void 0;
AutoTestModel.prototype["lastTestRunName"] = void 0;
AutoTestModel.prototype["lastTestResultId"] = void 0;
AutoTestModel.prototype["lastTestResultConfiguration"] = void 0;
AutoTestModel.prototype["lastTestResultOutcome"] = void 0;
AutoTestModel.prototype["lastTestResultStatus"] = void 0;
AutoTestModel.prototype["stabilityPercentage"] = void 0;
AutoTestModel.prototype["externalId"] = void 0;
AutoTestModel.prototype["links"] = void 0;
AutoTestModel.prototype["projectId"] = void 0;
AutoTestModel.prototype["name"] = void 0;
AutoTestModel.prototype["namespace"] = void 0;
AutoTestModel.prototype["classname"] = void 0;
AutoTestModel.prototype["steps"] = void 0;
AutoTestModel.prototype["setup"] = void 0;
AutoTestModel.prototype["teardown"] = void 0;
AutoTestModel.prototype["title"] = void 0;
AutoTestModel.prototype["description"] = void 0;
AutoTestModel.prototype["labels"] = void 0;
AutoTestModel.prototype["isFlaky"] = void 0;
AutoTestModel.prototype["externalKey"] = void 0;
var AutoTestModel_default = AutoTestModel;

// src/adaptersapi/model/FailureCategoryModel.js
var FailureCategoryModel = class {
  /**
   * value: "InfrastructureDefect"
   * @const
   */
  "InfrastructureDefect" = "InfrastructureDefect";
  /**
   * value: "ProductDefect"
   * @const
   */
  "ProductDefect" = "ProductDefect";
  /**
   * value: "TestDefect"
   * @const
   */
  "TestDefect" = "TestDefect";
  /**
   * value: "NoDefect"
   * @const
   */
  "NoDefect" = "NoDefect";
  /**
   * value: "NoAnalytics"
   * @const
   */
  "NoAnalytics" = "NoAnalytics";
  /**
  * Returns a <code>FailureCategoryModel</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/FailureCategoryModel} The enum <code>FailureCategoryModel</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/AutoTestResultReasonShort.js
var AutoTestResultReasonShort = class _AutoTestResultReasonShort {
  /**
   * Constructs a new <code>AutoTestResultReasonShort</code>.
   * @alias module:model/AutoTestResultReasonShort
   * @param failureCategory {module:model/FailureCategoryModel} 
   * @param name {String} 
   */
  constructor(failureCategory, name) {
    _AutoTestResultReasonShort.initialize(this, failureCategory, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, failureCategory, name) {
    obj["failureCategory"] = failureCategory;
    obj["name"] = name;
  }
  /**
   * Constructs a <code>AutoTestResultReasonShort</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestResultReasonShort} obj Optional instance to populate.
   * @return {module:model/AutoTestResultReasonShort} The populated <code>AutoTestResultReasonShort</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestResultReasonShort();
      if (data.hasOwnProperty("failureCategory")) {
        obj["failureCategory"] = ApiClient_default.convertToType(data["failureCategory"], FailureCategoryModel);
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestResultReasonShort</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestResultReasonShort</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestResultReasonShort.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
AutoTestResultReasonShort.RequiredProperties = ["failureCategory", "name"];
AutoTestResultReasonShort.prototype["failureCategory"] = void 0;
AutoTestResultReasonShort.prototype["name"] = void 0;
var AutoTestResultReasonShort_default = AutoTestResultReasonShort;

// src/adaptersapi/model/LinkPostModel.js
var LinkPostModel = class _LinkPostModel {
  /**
   * Constructs a new <code>LinkPostModel</code>.
   * @alias module:model/LinkPostModel
   * @param url {String} Address can be specified without protocol, but necessarily with the domain.
   * @param type {module:model/LinkType} Specifies the type of the link.
   * @param hasInfo {Boolean} 
   */
  constructor(url, type, hasInfo) {
    _LinkPostModel.initialize(this, url, type, hasInfo);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, url, type, hasInfo) {
    obj["url"] = url;
    obj["type"] = type;
    obj["hasInfo"] = hasInfo;
  }
  /**
   * Constructs a <code>LinkPostModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LinkPostModel} obj Optional instance to populate.
   * @return {module:model/LinkPostModel} The populated <code>LinkPostModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LinkPostModel();
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("url")) {
        obj["url"] = ApiClient_default.convertToType(data["url"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], LinkType);
      }
      if (data.hasOwnProperty("hasInfo")) {
        obj["hasInfo"] = ApiClient_default.convertToType(data["hasInfo"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LinkPostModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LinkPostModel</code>.
   */
  static validateJSON(data) {
    for (const property of _LinkPostModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["url"] && !(typeof data["url"] === "string" || data["url"] instanceof String)) {
      throw new Error("Expected the field `url` to be a primitive type in the JSON string but got " + data["url"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    return true;
  }
};
LinkPostModel.RequiredProperties = ["url", "type", "hasInfo"];
LinkPostModel.prototype["title"] = void 0;
LinkPostModel.prototype["url"] = void 0;
LinkPostModel.prototype["description"] = void 0;
LinkPostModel.prototype["type"] = void 0;
LinkPostModel.prototype["hasInfo"] = void 0;
var LinkPostModel_default = LinkPostModel;

// src/adaptersapi/model/AutoTestResultsForTestRunModel.js
var AutoTestResultsForTestRunModel = class _AutoTestResultsForTestRunModel {
  /**
   * Constructs a new <code>AutoTestResultsForTestRunModel</code>.
   * @alias module:model/AutoTestResultsForTestRunModel
   * @param configurationId {String} Specifies the GUID of the autotest configuration, which was specified when the test run was created.
   * @param autoTestExternalId {String} Specifies the external ID of the autotest, which was specified when the test run was created.
   */
  constructor(configurationId, autoTestExternalId) {
    _AutoTestResultsForTestRunModel.initialize(this, configurationId, autoTestExternalId);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, configurationId, autoTestExternalId) {
    obj["configurationId"] = configurationId;
    obj["autoTestExternalId"] = autoTestExternalId;
  }
  /**
   * Constructs a <code>AutoTestResultsForTestRunModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestResultsForTestRunModel} obj Optional instance to populate.
   * @return {module:model/AutoTestResultsForTestRunModel} The populated <code>AutoTestResultsForTestRunModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestResultsForTestRunModel();
      if (data.hasOwnProperty("configurationId")) {
        obj["configurationId"] = ApiClient_default.convertToType(data["configurationId"], "String");
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [LinkPostModel_default]);
      }
      if (data.hasOwnProperty("failureReasonNames")) {
        obj["failureReasonNames"] = ApiClient_default.convertToType(data["failureReasonNames"], [FailureCategoryModel]);
      }
      if (data.hasOwnProperty("autoTestExternalId")) {
        obj["autoTestExternalId"] = ApiClient_default.convertToType(data["autoTestExternalId"], "String");
      }
      if (data.hasOwnProperty("outcome")) {
        obj["outcome"] = ApiClient_default.convertToType(data["outcome"], AvailableTestResultOutcome);
      }
      if (data.hasOwnProperty("statusCode")) {
        obj["statusCode"] = ApiClient_default.convertToType(data["statusCode"], "String");
      }
      if (data.hasOwnProperty("statusType")) {
        obj["statusType"] = ApiClient_default.convertToType(data["statusType"], TestStatusType);
      }
      if (data.hasOwnProperty("message")) {
        obj["message"] = ApiClient_default.convertToType(data["message"], "String");
      }
      if (data.hasOwnProperty("traces")) {
        obj["traces"] = ApiClient_default.convertToType(data["traces"], "String");
      }
      if (data.hasOwnProperty("startedOn")) {
        obj["startedOn"] = ApiClient_default.convertToType(data["startedOn"], "Date");
      }
      if (data.hasOwnProperty("completedOn")) {
        obj["completedOn"] = ApiClient_default.convertToType(data["completedOn"], "Date");
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], "Number");
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentPutModel_default]);
      }
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], { "String": "String" });
      }
      if (data.hasOwnProperty("properties")) {
        obj["properties"] = ApiClient_default.convertToType(data["properties"], { "String": "String" });
      }
      if (data.hasOwnProperty("stepResults")) {
        obj["stepResults"] = ApiClient_default.convertToType(data["stepResults"], [AttachmentPutModelAutoTestStepResultsModel_default]);
      }
      if (data.hasOwnProperty("setupResults")) {
        obj["setupResults"] = ApiClient_default.convertToType(data["setupResults"], [AttachmentPutModelAutoTestStepResultsModel_default]);
      }
      if (data.hasOwnProperty("teardownResults")) {
        obj["teardownResults"] = ApiClient_default.convertToType(data["teardownResults"], [AttachmentPutModelAutoTestStepResultsModel_default]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestResultsForTestRunModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestResultsForTestRunModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestResultsForTestRunModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["configurationId"] && !(typeof data["configurationId"] === "string" || data["configurationId"] instanceof String)) {
      throw new Error("Expected the field `configurationId` to be a primitive type in the JSON string but got " + data["configurationId"]);
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        LinkPostModel_default.validateJSON(item);
      }
      ;
    }
    if (!Array.isArray(data["failureReasonNames"])) {
      throw new Error("Expected the field `failureReasonNames` to be an array in the JSON data but got " + data["failureReasonNames"]);
    }
    if (data["autoTestExternalId"] && !(typeof data["autoTestExternalId"] === "string" || data["autoTestExternalId"] instanceof String)) {
      throw new Error("Expected the field `autoTestExternalId` to be a primitive type in the JSON string but got " + data["autoTestExternalId"]);
    }
    if (data["statusCode"] && !(typeof data["statusCode"] === "string" || data["statusCode"] instanceof String)) {
      throw new Error("Expected the field `statusCode` to be a primitive type in the JSON string but got " + data["statusCode"]);
    }
    if (data["message"] && !(typeof data["message"] === "string" || data["message"] instanceof String)) {
      throw new Error("Expected the field `message` to be a primitive type in the JSON string but got " + data["message"]);
    }
    if (data["traces"] && !(typeof data["traces"] === "string" || data["traces"] instanceof String)) {
      throw new Error("Expected the field `traces` to be a primitive type in the JSON string but got " + data["traces"]);
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentPutModel_default.validateJSON(item);
      }
      ;
    }
    if (data["stepResults"]) {
      if (!Array.isArray(data["stepResults"])) {
        throw new Error("Expected the field `stepResults` to be an array in the JSON data but got " + data["stepResults"]);
      }
      for (const item of data["stepResults"]) {
        AttachmentPutModelAutoTestStepResultsModel_default.validateJSON(item);
      }
      ;
    }
    if (data["setupResults"]) {
      if (!Array.isArray(data["setupResults"])) {
        throw new Error("Expected the field `setupResults` to be an array in the JSON data but got " + data["setupResults"]);
      }
      for (const item of data["setupResults"]) {
        AttachmentPutModelAutoTestStepResultsModel_default.validateJSON(item);
      }
      ;
    }
    if (data["teardownResults"]) {
      if (!Array.isArray(data["teardownResults"])) {
        throw new Error("Expected the field `teardownResults` to be an array in the JSON data but got " + data["teardownResults"]);
      }
      for (const item of data["teardownResults"]) {
        AttachmentPutModelAutoTestStepResultsModel_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
AutoTestResultsForTestRunModel.RequiredProperties = ["configurationId", "autoTestExternalId"];
AutoTestResultsForTestRunModel.prototype["configurationId"] = void 0;
AutoTestResultsForTestRunModel.prototype["links"] = void 0;
AutoTestResultsForTestRunModel.prototype["failureReasonNames"] = void 0;
AutoTestResultsForTestRunModel.prototype["autoTestExternalId"] = void 0;
AutoTestResultsForTestRunModel.prototype["outcome"] = void 0;
AutoTestResultsForTestRunModel.prototype["statusCode"] = void 0;
AutoTestResultsForTestRunModel.prototype["statusType"] = void 0;
AutoTestResultsForTestRunModel.prototype["message"] = void 0;
AutoTestResultsForTestRunModel.prototype["traces"] = void 0;
AutoTestResultsForTestRunModel.prototype["startedOn"] = void 0;
AutoTestResultsForTestRunModel.prototype["completedOn"] = void 0;
AutoTestResultsForTestRunModel.prototype["duration"] = void 0;
AutoTestResultsForTestRunModel.prototype["attachments"] = void 0;
AutoTestResultsForTestRunModel.prototype["parameters"] = void 0;
AutoTestResultsForTestRunModel.prototype["properties"] = void 0;
AutoTestResultsForTestRunModel.prototype["stepResults"] = void 0;
AutoTestResultsForTestRunModel.prototype["setupResults"] = void 0;
AutoTestResultsForTestRunModel.prototype["teardownResults"] = void 0;

// src/adaptersapi/model/AutoTestSearchIncludeApiModel.js
var AutoTestSearchIncludeApiModel = class _AutoTestSearchIncludeApiModel {
  /**
   * Constructs a new <code>AutoTestSearchIncludeApiModel</code>.
   * @alias module:model/AutoTestSearchIncludeApiModel
   */
  constructor() {
    _AutoTestSearchIncludeApiModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>AutoTestSearchIncludeApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestSearchIncludeApiModel} obj Optional instance to populate.
   * @return {module:model/AutoTestSearchIncludeApiModel} The populated <code>AutoTestSearchIncludeApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestSearchIncludeApiModel();
      if (data.hasOwnProperty("includeSteps")) {
        obj["includeSteps"] = ApiClient_default.convertToType(data["includeSteps"], "Boolean");
      }
      if (data.hasOwnProperty("includeLinks")) {
        obj["includeLinks"] = ApiClient_default.convertToType(data["includeLinks"], "Boolean");
      }
      if (data.hasOwnProperty("includeLabels")) {
        obj["includeLabels"] = ApiClient_default.convertToType(data["includeLabels"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestSearchIncludeApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestSearchIncludeApiModel</code>.
   */
  static validateJSON(data) {
    return true;
  }
};
AutoTestSearchIncludeApiModel.prototype["includeSteps"] = void 0;
AutoTestSearchIncludeApiModel.prototype["includeLinks"] = void 0;
AutoTestSearchIncludeApiModel.prototype["includeLabels"] = void 0;
var AutoTestSearchIncludeApiModel_default = AutoTestSearchIncludeApiModel;

// src/adaptersapi/model/AutoTestSearchApiModel.js
var AutoTestSearchApiModel = class _AutoTestSearchApiModel {
  /**
   * Constructs a new <code>AutoTestSearchApiModel</code>.
   * @alias module:model/AutoTestSearchApiModel
   */
  constructor() {
    _AutoTestSearchApiModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>AutoTestSearchApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestSearchApiModel} obj Optional instance to populate.
   * @return {module:model/AutoTestSearchApiModel} The populated <code>AutoTestSearchApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestSearchApiModel();
      if (data.hasOwnProperty("filter")) {
        obj["filter"] = ApiClient_default.convertToType(data["filter"], AutoTestFilterApiModel_default);
      }
      if (data.hasOwnProperty("includes")) {
        obj["includes"] = ApiClient_default.convertToType(data["includes"], AutoTestSearchIncludeApiModel_default);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestSearchApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestSearchApiModel</code>.
   */
  static validateJSON(data) {
    if (data["filter"]) {
      AutoTestFilterApiModel_default.validateJSON(data["filter"]);
    }
    if (data["includes"]) {
      AutoTestSearchIncludeApiModel_default.validateJSON(data["includes"]);
    }
    return true;
  }
};
AutoTestSearchApiModel.prototype["filter"] = void 0;
AutoTestSearchApiModel.prototype["includes"] = void 0;

// src/adaptersapi/model/AutoTestStepResult.js
var AutoTestStepResult = class _AutoTestStepResult {
  /**
   * Constructs a new <code>AutoTestStepResult</code>.
   * @alias module:model/AutoTestStepResult
   */
  constructor() {
    _AutoTestStepResult.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>AutoTestStepResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestStepResult} obj Optional instance to populate.
   * @return {module:model/AutoTestStepResult} The populated <code>AutoTestStepResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestStepResult();
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("info")) {
        obj["info"] = ApiClient_default.convertToType(data["info"], "String");
      }
      if (data.hasOwnProperty("startedOn")) {
        obj["startedOn"] = ApiClient_default.convertToType(data["startedOn"], "Date");
      }
      if (data.hasOwnProperty("completedOn")) {
        obj["completedOn"] = ApiClient_default.convertToType(data["completedOn"], "Date");
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], "Number");
      }
      if (data.hasOwnProperty("outcome")) {
        obj["outcome"] = ApiClient_default.convertToType(data["outcome"], AvailableTestResultOutcome);
      }
      if (data.hasOwnProperty("stepResults")) {
        obj["stepResults"] = ApiClient_default.convertToType(data["stepResults"], [_AutoTestStepResult]);
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentApiResult_default]);
      }
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], { "String": "String" });
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestStepResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestStepResult</code>.
   */
  static validateJSON(data) {
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["info"] && !(typeof data["info"] === "string" || data["info"] instanceof String)) {
      throw new Error("Expected the field `info` to be a primitive type in the JSON string but got " + data["info"]);
    }
    if (data["stepResults"]) {
      if (!Array.isArray(data["stepResults"])) {
        throw new Error("Expected the field `stepResults` to be an array in the JSON data but got " + data["stepResults"]);
      }
      for (const item of data["stepResults"]) {
        _AutoTestStepResult.validateJSON(item);
      }
      ;
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentApiResult_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
AutoTestStepResult.prototype["title"] = void 0;
AutoTestStepResult.prototype["description"] = void 0;
AutoTestStepResult.prototype["info"] = void 0;
AutoTestStepResult.prototype["startedOn"] = void 0;
AutoTestStepResult.prototype["completedOn"] = void 0;
AutoTestStepResult.prototype["duration"] = void 0;
AutoTestStepResult.prototype["outcome"] = void 0;
AutoTestStepResult.prototype["stepResults"] = void 0;
AutoTestStepResult.prototype["attachments"] = void 0;
AutoTestStepResult.prototype["parameters"] = void 0;
var AutoTestStepResult_default = AutoTestStepResult;

// src/adaptersapi/model/AutoTestStepResultUpdateRequest.js
var AutoTestStepResultUpdateRequest = class _AutoTestStepResultUpdateRequest {
  /**
   * Constructs a new <code>AutoTestStepResultUpdateRequest</code>.
   * @alias module:model/AutoTestStepResultUpdateRequest
   */
  constructor() {
    _AutoTestStepResultUpdateRequest.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>AutoTestStepResultUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestStepResultUpdateRequest} obj Optional instance to populate.
   * @return {module:model/AutoTestStepResultUpdateRequest} The populated <code>AutoTestStepResultUpdateRequest</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestStepResultUpdateRequest();
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("info")) {
        obj["info"] = ApiClient_default.convertToType(data["info"], "String");
      }
      if (data.hasOwnProperty("startedOn")) {
        obj["startedOn"] = ApiClient_default.convertToType(data["startedOn"], "Date");
      }
      if (data.hasOwnProperty("completedOn")) {
        obj["completedOn"] = ApiClient_default.convertToType(data["completedOn"], "Date");
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], "Number");
      }
      if (data.hasOwnProperty("outcome")) {
        obj["outcome"] = ApiClient_default.convertToType(data["outcome"], AvailableTestResultOutcome);
      }
      if (data.hasOwnProperty("stepResults")) {
        obj["stepResults"] = ApiClient_default.convertToType(data["stepResults"], [_AutoTestStepResultUpdateRequest]);
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentUpdateRequest_default]);
      }
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], { "String": "String" });
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestStepResultUpdateRequest</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestStepResultUpdateRequest</code>.
   */
  static validateJSON(data) {
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["info"] && !(typeof data["info"] === "string" || data["info"] instanceof String)) {
      throw new Error("Expected the field `info` to be a primitive type in the JSON string but got " + data["info"]);
    }
    if (data["stepResults"]) {
      if (!Array.isArray(data["stepResults"])) {
        throw new Error("Expected the field `stepResults` to be an array in the JSON data but got " + data["stepResults"]);
      }
      for (const item of data["stepResults"]) {
        _AutoTestStepResultUpdateRequest.validateJSON(item);
      }
      ;
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentUpdateRequest_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
AutoTestStepResultUpdateRequest.prototype["title"] = void 0;
AutoTestStepResultUpdateRequest.prototype["description"] = void 0;
AutoTestStepResultUpdateRequest.prototype["info"] = void 0;
AutoTestStepResultUpdateRequest.prototype["startedOn"] = void 0;
AutoTestStepResultUpdateRequest.prototype["completedOn"] = void 0;
AutoTestStepResultUpdateRequest.prototype["duration"] = void 0;
AutoTestStepResultUpdateRequest.prototype["outcome"] = void 0;
AutoTestStepResultUpdateRequest.prototype["stepResults"] = void 0;
AutoTestStepResultUpdateRequest.prototype["attachments"] = void 0;
AutoTestStepResultUpdateRequest.prototype["parameters"] = void 0;
var AutoTestStepResultUpdateRequest_default = AutoTestStepResultUpdateRequest;

// src/adaptersapi/model/LinkUpdateApiModel.js
var LinkUpdateApiModel = class _LinkUpdateApiModel {
  /**
   * Constructs a new <code>LinkUpdateApiModel</code>.
   * @alias module:model/LinkUpdateApiModel
   * @param url {String} Address can be specified without protocol, but necessarily with the domain.
   * @param type {module:model/LinkType} Specifies the type of the link.
   */
  constructor(url, type) {
    _LinkUpdateApiModel.initialize(this, url, type);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, url, type) {
    obj["url"] = url;
    obj["type"] = type;
  }
  /**
   * Constructs a <code>LinkUpdateApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LinkUpdateApiModel} obj Optional instance to populate.
   * @return {module:model/LinkUpdateApiModel} The populated <code>LinkUpdateApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LinkUpdateApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("url")) {
        obj["url"] = ApiClient_default.convertToType(data["url"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], LinkType);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LinkUpdateApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LinkUpdateApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _LinkUpdateApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["url"] && !(typeof data["url"] === "string" || data["url"] instanceof String)) {
      throw new Error("Expected the field `url` to be a primitive type in the JSON string but got " + data["url"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    return true;
  }
};
LinkUpdateApiModel.RequiredProperties = ["url", "type"];
LinkUpdateApiModel.prototype["id"] = void 0;
LinkUpdateApiModel.prototype["title"] = void 0;
LinkUpdateApiModel.prototype["url"] = void 0;
LinkUpdateApiModel.prototype["description"] = void 0;
LinkUpdateApiModel.prototype["type"] = void 0;
var LinkUpdateApiModel_default = LinkUpdateApiModel;

// src/adaptersapi/model/AutoTestUpdateApiModel.js
var AutoTestUpdateApiModel = class _AutoTestUpdateApiModel {
  /**
   * Constructs a new <code>AutoTestUpdateApiModel</code>.
   * @alias module:model/AutoTestUpdateApiModel
   * @param projectId {String} Unique ID of the autotest project
   * @param externalId {String} External ID of the autotest
   * @param name {String} Name of the autotest
   * @param resetLayer {Boolean} Indicates if the autotest layer should be reset.
   */
  constructor(projectId, externalId, name, resetLayer) {
    _AutoTestUpdateApiModel.initialize(this, projectId, externalId, name, resetLayer);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, projectId, externalId, name, resetLayer) {
    obj["projectId"] = projectId;
    obj["externalId"] = externalId;
    obj["name"] = name;
    obj["resetLayer"] = resetLayer;
  }
  /**
   * Constructs a <code>AutoTestUpdateApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestUpdateApiModel} obj Optional instance to populate.
   * @return {module:model/AutoTestUpdateApiModel} The populated <code>AutoTestUpdateApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestUpdateApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("externalId")) {
        obj["externalId"] = ApiClient_default.convertToType(data["externalId"], "String");
      }
      if (data.hasOwnProperty("externalKey")) {
        obj["externalKey"] = ApiClient_default.convertToType(data["externalKey"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("namespace")) {
        obj["namespace"] = ApiClient_default.convertToType(data["namespace"], "String");
      }
      if (data.hasOwnProperty("classname")) {
        obj["classname"] = ApiClient_default.convertToType(data["classname"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("isFlaky")) {
        obj["isFlaky"] = ApiClient_default.convertToType(data["isFlaky"], "Boolean");
      }
      if (data.hasOwnProperty("layer")) {
        obj["layer"] = ApiClient_default.convertToType(data["layer"], LayerApiModel_default);
      }
      if (data.hasOwnProperty("resetLayer")) {
        obj["resetLayer"] = ApiClient_default.convertToType(data["resetLayer"], "Boolean");
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [AutoTestStepApiModel_default]);
      }
      if (data.hasOwnProperty("setup")) {
        obj["setup"] = ApiClient_default.convertToType(data["setup"], [AutoTestStepApiModel_default]);
      }
      if (data.hasOwnProperty("teardown")) {
        obj["teardown"] = ApiClient_default.convertToType(data["teardown"], [AutoTestStepApiModel_default]);
      }
      if (data.hasOwnProperty("labels")) {
        obj["labels"] = ApiClient_default.convertToType(data["labels"], [LabelApiModel_default]);
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [LinkUpdateApiModel_default]);
      }
      if (data.hasOwnProperty("tags")) {
        obj["tags"] = ApiClient_default.convertToType(data["tags"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestUpdateApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestUpdateApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestUpdateApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["externalId"] && !(typeof data["externalId"] === "string" || data["externalId"] instanceof String)) {
      throw new Error("Expected the field `externalId` to be a primitive type in the JSON string but got " + data["externalId"]);
    }
    if (data["externalKey"] && !(typeof data["externalKey"] === "string" || data["externalKey"] instanceof String)) {
      throw new Error("Expected the field `externalKey` to be a primitive type in the JSON string but got " + data["externalKey"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["namespace"] && !(typeof data["namespace"] === "string" || data["namespace"] instanceof String)) {
      throw new Error("Expected the field `namespace` to be a primitive type in the JSON string but got " + data["namespace"]);
    }
    if (data["classname"] && !(typeof data["classname"] === "string" || data["classname"] instanceof String)) {
      throw new Error("Expected the field `classname` to be a primitive type in the JSON string but got " + data["classname"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["layer"]) {
      LayerApiModel_default.validateJSON(data["layer"]);
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        AutoTestStepApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["setup"]) {
      if (!Array.isArray(data["setup"])) {
        throw new Error("Expected the field `setup` to be an array in the JSON data but got " + data["setup"]);
      }
      for (const item of data["setup"]) {
        AutoTestStepApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["teardown"]) {
      if (!Array.isArray(data["teardown"])) {
        throw new Error("Expected the field `teardown` to be an array in the JSON data but got " + data["teardown"]);
      }
      for (const item of data["teardown"]) {
        AutoTestStepApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["labels"]) {
      if (!Array.isArray(data["labels"])) {
        throw new Error("Expected the field `labels` to be an array in the JSON data but got " + data["labels"]);
      }
      for (const item of data["labels"]) {
        LabelApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        LinkUpdateApiModel_default.validateJSON(item);
      }
      ;
    }
    if (!Array.isArray(data["tags"])) {
      throw new Error("Expected the field `tags` to be an array in the JSON data but got " + data["tags"]);
    }
    return true;
  }
};
AutoTestUpdateApiModel.RequiredProperties = ["projectId", "externalId", "name", "resetLayer"];
AutoTestUpdateApiModel.prototype["id"] = void 0;
AutoTestUpdateApiModel.prototype["projectId"] = void 0;
AutoTestUpdateApiModel.prototype["externalId"] = void 0;
AutoTestUpdateApiModel.prototype["externalKey"] = void 0;
AutoTestUpdateApiModel.prototype["name"] = void 0;
AutoTestUpdateApiModel.prototype["namespace"] = void 0;
AutoTestUpdateApiModel.prototype["classname"] = void 0;
AutoTestUpdateApiModel.prototype["title"] = void 0;
AutoTestUpdateApiModel.prototype["description"] = void 0;
AutoTestUpdateApiModel.prototype["isFlaky"] = void 0;
AutoTestUpdateApiModel.prototype["layer"] = void 0;
AutoTestUpdateApiModel.prototype["resetLayer"] = void 0;
AutoTestUpdateApiModel.prototype["steps"] = void 0;
AutoTestUpdateApiModel.prototype["setup"] = void 0;
AutoTestUpdateApiModel.prototype["teardown"] = void 0;
AutoTestUpdateApiModel.prototype["labels"] = void 0;
AutoTestUpdateApiModel.prototype["links"] = void 0;
AutoTestUpdateApiModel.prototype["tags"] = void 0;

// src/adaptersapi/model/AutoTestWorkItemIdentifierApiResult.js
var AutoTestWorkItemIdentifierApiResult = class _AutoTestWorkItemIdentifierApiResult {
  /**
   * Constructs a new <code>AutoTestWorkItemIdentifierApiResult</code>.
   * @alias module:model/AutoTestWorkItemIdentifierApiResult
   * @param id {String} WorkItem unique internal identifier
   * @param globalId {Number} WorkItem Global unique identifier
   */
  constructor(id, globalId) {
    _AutoTestWorkItemIdentifierApiResult.initialize(this, id, globalId);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, globalId) {
    obj["id"] = id;
    obj["globalId"] = globalId;
  }
  /**
   * Constructs a <code>AutoTestWorkItemIdentifierApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoTestWorkItemIdentifierApiResult} obj Optional instance to populate.
   * @return {module:model/AutoTestWorkItemIdentifierApiResult} The populated <code>AutoTestWorkItemIdentifierApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _AutoTestWorkItemIdentifierApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>AutoTestWorkItemIdentifierApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>AutoTestWorkItemIdentifierApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _AutoTestWorkItemIdentifierApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
AutoTestWorkItemIdentifierApiResult.RequiredProperties = ["id", "globalId"];
AutoTestWorkItemIdentifierApiResult.prototype["id"] = void 0;
AutoTestWorkItemIdentifierApiResult.prototype["globalId"] = void 0;

// src/adaptersapi/model/ConfigurationFilterModel.js
var ConfigurationFilterModel = class _ConfigurationFilterModel {
  /**
   * Constructs a new <code>ConfigurationFilterModel</code>.
   * @alias module:model/ConfigurationFilterModel
   */
  constructor() {
    _ConfigurationFilterModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>ConfigurationFilterModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConfigurationFilterModel} obj Optional instance to populate.
   * @return {module:model/ConfigurationFilterModel} The populated <code>ConfigurationFilterModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ConfigurationFilterModel();
      if (data.hasOwnProperty("projectIds")) {
        obj["projectIds"] = ApiClient_default.convertToType(data["projectIds"], ["String"]);
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("globalIds")) {
        obj["globalIds"] = ApiClient_default.convertToType(data["globalIds"], ["Number"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ConfigurationFilterModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ConfigurationFilterModel</code>.
   */
  static validateJSON(data) {
    if (!Array.isArray(data["projectIds"])) {
      throw new Error("Expected the field `projectIds` to be an array in the JSON data but got " + data["projectIds"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (!Array.isArray(data["globalIds"])) {
      throw new Error("Expected the field `globalIds` to be an array in the JSON data but got " + data["globalIds"]);
    }
    return true;
  }
};
ConfigurationFilterModel.prototype["projectIds"] = void 0;
ConfigurationFilterModel.prototype["name"] = void 0;
ConfigurationFilterModel.prototype["isDeleted"] = void 0;
ConfigurationFilterModel.prototype["globalIds"] = void 0;

// src/adaptersapi/model/ConfigurationModel.js
var ConfigurationModel = class _ConfigurationModel {
  /**
   * Constructs a new <code>ConfigurationModel</code>.
   * @alias module:model/ConfigurationModel
   * @param projectId {String} This property is used to link configuration with project
   * @param isDefault {Boolean} 
   * @param createdDate {Date} 
   * @param createdById {String} 
   * @param globalId {Number} 
   * @param id {String} Unique ID of the entity
   * @param isDeleted {Boolean} Indicates if the entity is deleted
   */
  constructor(projectId, isDefault, createdDate, createdById, globalId, id, isDeleted) {
    _ConfigurationModel.initialize(this, projectId, isDefault, createdDate, createdById, globalId, id, isDeleted);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, projectId, isDefault, createdDate, createdById, globalId, id, isDeleted) {
    obj["projectId"] = projectId;
    obj["isDefault"] = isDefault;
    obj["createdDate"] = createdDate;
    obj["createdById"] = createdById;
    obj["globalId"] = globalId;
    obj["id"] = id;
    obj["isDeleted"] = isDeleted;
  }
  /**
   * Constructs a <code>ConfigurationModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ConfigurationModel} obj Optional instance to populate.
   * @return {module:model/ConfigurationModel} The populated <code>ConfigurationModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ConfigurationModel();
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], { "String": "String" });
      }
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("isDefault")) {
        obj["isDefault"] = ApiClient_default.convertToType(data["isDefault"], "Boolean");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("createdDate")) {
        obj["createdDate"] = ApiClient_default.convertToType(data["createdDate"], "Date");
      }
      if (data.hasOwnProperty("modifiedDate")) {
        obj["modifiedDate"] = ApiClient_default.convertToType(data["modifiedDate"], "Date");
      }
      if (data.hasOwnProperty("createdById")) {
        obj["createdById"] = ApiClient_default.convertToType(data["createdById"], "String");
      }
      if (data.hasOwnProperty("modifiedById")) {
        obj["modifiedById"] = ApiClient_default.convertToType(data["modifiedById"], "String");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ConfigurationModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ConfigurationModel</code>.
   */
  static validateJSON(data) {
    for (const property of _ConfigurationModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["createdById"] && !(typeof data["createdById"] === "string" || data["createdById"] instanceof String)) {
      throw new Error("Expected the field `createdById` to be a primitive type in the JSON string but got " + data["createdById"]);
    }
    if (data["modifiedById"] && !(typeof data["modifiedById"] === "string" || data["modifiedById"] instanceof String)) {
      throw new Error("Expected the field `modifiedById` to be a primitive type in the JSON string but got " + data["modifiedById"]);
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
ConfigurationModel.RequiredProperties = ["projectId", "isDefault", "createdDate", "createdById", "globalId", "id", "isDeleted"];
ConfigurationModel.prototype["description"] = void 0;
ConfigurationModel.prototype["parameters"] = void 0;
ConfigurationModel.prototype["projectId"] = void 0;
ConfigurationModel.prototype["isDefault"] = void 0;
ConfigurationModel.prototype["name"] = void 0;
ConfigurationModel.prototype["createdDate"] = void 0;
ConfigurationModel.prototype["modifiedDate"] = void 0;
ConfigurationModel.prototype["createdById"] = void 0;
ConfigurationModel.prototype["modifiedById"] = void 0;
ConfigurationModel.prototype["globalId"] = void 0;
ConfigurationModel.prototype["id"] = void 0;
ConfigurationModel.prototype["isDeleted"] = void 0;

// src/adaptersapi/model/CreateLinkApiModel.js
var CreateLinkApiModel = class _CreateLinkApiModel {
  /**
   * Constructs a new <code>CreateLinkApiModel</code>.
   * @alias module:model/CreateLinkApiModel
   * @param url {String} Address can be specified without protocol, but necessarily with the domain.
   * @param type {module:model/LinkType} Specifies the type of the link.
   */
  constructor(url, type) {
    _CreateLinkApiModel.initialize(this, url, type);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, url, type) {
    obj["url"] = url;
    obj["type"] = type;
  }
  /**
   * Constructs a <code>CreateLinkApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CreateLinkApiModel} obj Optional instance to populate.
   * @return {module:model/CreateLinkApiModel} The populated <code>CreateLinkApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CreateLinkApiModel();
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("url")) {
        obj["url"] = ApiClient_default.convertToType(data["url"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], LinkType);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CreateLinkApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CreateLinkApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _CreateLinkApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["url"] && !(typeof data["url"] === "string" || data["url"] instanceof String)) {
      throw new Error("Expected the field `url` to be a primitive type in the JSON string but got " + data["url"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    return true;
  }
};
CreateLinkApiModel.RequiredProperties = ["url", "type"];
CreateLinkApiModel.prototype["title"] = void 0;
CreateLinkApiModel.prototype["url"] = void 0;
CreateLinkApiModel.prototype["description"] = void 0;
CreateLinkApiModel.prototype["type"] = void 0;
var CreateLinkApiModel_default = CreateLinkApiModel;

// src/adaptersapi/model/CreateEmptyTestRunApiModel.js
var CreateEmptyTestRunApiModel = class _CreateEmptyTestRunApiModel {
  /**
   * Constructs a new <code>CreateEmptyTestRunApiModel</code>.
   * @alias module:model/CreateEmptyTestRunApiModel
   * @param projectId {String} Project unique identifier              This property is to link test run with a project
   */
  constructor(projectId) {
    _CreateEmptyTestRunApiModel.initialize(this, projectId);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, projectId) {
    obj["projectId"] = projectId;
  }
  /**
   * Constructs a <code>CreateEmptyTestRunApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CreateEmptyTestRunApiModel} obj Optional instance to populate.
   * @return {module:model/CreateEmptyTestRunApiModel} The populated <code>CreateEmptyTestRunApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CreateEmptyTestRunApiModel();
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("launchSource")) {
        obj["launchSource"] = ApiClient_default.convertToType(data["launchSource"], "String");
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AssignAttachmentApiModel_default]);
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [CreateLinkApiModel_default]);
      }
      if (data.hasOwnProperty("tags")) {
        obj["tags"] = ApiClient_default.convertToType(data["tags"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CreateEmptyTestRunApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CreateEmptyTestRunApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _CreateEmptyTestRunApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["launchSource"] && !(typeof data["launchSource"] === "string" || data["launchSource"] instanceof String)) {
      throw new Error("Expected the field `launchSource` to be a primitive type in the JSON string but got " + data["launchSource"]);
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AssignAttachmentApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        CreateLinkApiModel_default.validateJSON(item);
      }
      ;
    }
    if (!Array.isArray(data["tags"])) {
      throw new Error("Expected the field `tags` to be an array in the JSON data but got " + data["tags"]);
    }
    return true;
  }
};
CreateEmptyTestRunApiModel.RequiredProperties = ["projectId"];
CreateEmptyTestRunApiModel.prototype["projectId"] = void 0;
CreateEmptyTestRunApiModel.prototype["name"] = void 0;
CreateEmptyTestRunApiModel.prototype["description"] = void 0;
CreateEmptyTestRunApiModel.prototype["launchSource"] = void 0;
CreateEmptyTestRunApiModel.prototype["attachments"] = void 0;
CreateEmptyTestRunApiModel.prototype["links"] = void 0;
CreateEmptyTestRunApiModel.prototype["tags"] = void 0;

// src/adaptersapi/model/CreateParameterApiModel.js
var CreateParameterApiModel = class _CreateParameterApiModel {
  /**
   * Constructs a new <code>CreateParameterApiModel</code>.
   * @alias module:model/CreateParameterApiModel
   * @param name {String} Key of the parameter
   * @param value {String} Value of the parameter
   */
  constructor(name, value) {
    _CreateParameterApiModel.initialize(this, name, value);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name, value) {
    obj["name"] = name;
    obj["value"] = value;
  }
  /**
   * Constructs a <code>CreateParameterApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CreateParameterApiModel} obj Optional instance to populate.
   * @return {module:model/CreateParameterApiModel} The populated <code>CreateParameterApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CreateParameterApiModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("value")) {
        obj["value"] = ApiClient_default.convertToType(data["value"], "String");
      }
      if (data.hasOwnProperty("projectIds")) {
        obj["projectIds"] = ApiClient_default.convertToType(data["projectIds"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CreateParameterApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CreateParameterApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _CreateParameterApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["value"] && !(typeof data["value"] === "string" || data["value"] instanceof String)) {
      throw new Error("Expected the field `value` to be a primitive type in the JSON string but got " + data["value"]);
    }
    if (!Array.isArray(data["projectIds"])) {
      throw new Error("Expected the field `projectIds` to be an array in the JSON data but got " + data["projectIds"]);
    }
    return true;
  }
};
CreateParameterApiModel.RequiredProperties = ["name", "value"];
CreateParameterApiModel.prototype["name"] = void 0;
CreateParameterApiModel.prototype["value"] = void 0;
CreateParameterApiModel.prototype["projectIds"] = void 0;

// src/adaptersapi/model/CreateProjectApiModel.js
var CreateProjectApiModel = class _CreateProjectApiModel {
  /**
   * Constructs a new <code>CreateProjectApiModel</code>.
   * @alias module:model/CreateProjectApiModel
   * @param name {String} Name of the project
   */
  constructor(name) {
    _CreateProjectApiModel.initialize(this, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name) {
    obj["name"] = name;
  }
  /**
   * Constructs a <code>CreateProjectApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CreateProjectApiModel} obj Optional instance to populate.
   * @return {module:model/CreateProjectApiModel} The populated <code>CreateProjectApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CreateProjectApiModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("isFavorite")) {
        obj["isFavorite"] = ApiClient_default.convertToType(data["isFavorite"], "Boolean");
      }
      if (data.hasOwnProperty("workflowId")) {
        obj["workflowId"] = ApiClient_default.convertToType(data["workflowId"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CreateProjectApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CreateProjectApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _CreateProjectApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["workflowId"] && !(typeof data["workflowId"] === "string" || data["workflowId"] instanceof String)) {
      throw new Error("Expected the field `workflowId` to be a primitive type in the JSON string but got " + data["workflowId"]);
    }
    return true;
  }
};
CreateProjectApiModel.RequiredProperties = ["name"];
CreateProjectApiModel.prototype["name"] = void 0;
CreateProjectApiModel.prototype["description"] = void 0;
CreateProjectApiModel.prototype["isFavorite"] = void 0;
CreateProjectApiModel.prototype["workflowId"] = void 0;

// src/adaptersapi/model/CreateStepApiModel.js
var CreateStepApiModel = class _CreateStepApiModel {
  /**
   * Constructs a new <code>CreateStepApiModel</code>.
   * @alias module:model/CreateStepApiModel
   */
  constructor() {
    _CreateStepApiModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>CreateStepApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CreateStepApiModel} obj Optional instance to populate.
   * @return {module:model/CreateStepApiModel} The populated <code>CreateStepApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CreateStepApiModel();
      if (data.hasOwnProperty("action")) {
        obj["action"] = ApiClient_default.convertToType(data["action"], "String");
      }
      if (data.hasOwnProperty("expected")) {
        obj["expected"] = ApiClient_default.convertToType(data["expected"], "String");
      }
      if (data.hasOwnProperty("testData")) {
        obj["testData"] = ApiClient_default.convertToType(data["testData"], "String");
      }
      if (data.hasOwnProperty("comments")) {
        obj["comments"] = ApiClient_default.convertToType(data["comments"], "String");
      }
      if (data.hasOwnProperty("workItemId")) {
        obj["workItemId"] = ApiClient_default.convertToType(data["workItemId"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CreateStepApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CreateStepApiModel</code>.
   */
  static validateJSON(data) {
    if (data["action"] && !(typeof data["action"] === "string" || data["action"] instanceof String)) {
      throw new Error("Expected the field `action` to be a primitive type in the JSON string but got " + data["action"]);
    }
    if (data["expected"] && !(typeof data["expected"] === "string" || data["expected"] instanceof String)) {
      throw new Error("Expected the field `expected` to be a primitive type in the JSON string but got " + data["expected"]);
    }
    if (data["testData"] && !(typeof data["testData"] === "string" || data["testData"] instanceof String)) {
      throw new Error("Expected the field `testData` to be a primitive type in the JSON string but got " + data["testData"]);
    }
    if (data["comments"] && !(typeof data["comments"] === "string" || data["comments"] instanceof String)) {
      throw new Error("Expected the field `comments` to be a primitive type in the JSON string but got " + data["comments"]);
    }
    if (data["workItemId"] && !(typeof data["workItemId"] === "string" || data["workItemId"] instanceof String)) {
      throw new Error("Expected the field `workItemId` to be a primitive type in the JSON string but got " + data["workItemId"]);
    }
    return true;
  }
};
CreateStepApiModel.prototype["action"] = void 0;
CreateStepApiModel.prototype["expected"] = void 0;
CreateStepApiModel.prototype["testData"] = void 0;
CreateStepApiModel.prototype["comments"] = void 0;
CreateStepApiModel.prototype["workItemId"] = void 0;
var CreateStepApiModel_default = CreateStepApiModel;

// src/adaptersapi/model/TagModel.js
var TagModel = class _TagModel {
  /**
   * Constructs a new <code>TagModel</code>.
   * @alias module:model/TagModel
   * @param name {String} 
   */
  constructor(name) {
    _TagModel.initialize(this, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name) {
    obj["name"] = name;
  }
  /**
   * Constructs a <code>TagModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TagModel} obj Optional instance to populate.
   * @return {module:model/TagModel} The populated <code>TagModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _TagModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>TagModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TagModel</code>.
   */
  static validateJSON(data) {
    for (const property of _TagModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
TagModel.RequiredProperties = ["name"];
TagModel.prototype["name"] = void 0;
var TagModel_default = TagModel;

// src/adaptersapi/model/WorkItemEntityTypeApiModel.js
var WorkItemEntityTypeApiModel = class {
  /**
   * value: "TestCases"
   * @const
   */
  "TestCases" = "TestCases";
  /**
   * value: "CheckLists"
   * @const
   */
  "CheckLists" = "CheckLists";
  /**
   * value: "SharedSteps"
   * @const
   */
  "SharedSteps" = "SharedSteps";
  /**
  * Returns a <code>WorkItemEntityTypeApiModel</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/WorkItemEntityTypeApiModel} The enum <code>WorkItemEntityTypeApiModel</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/WorkItemParameterKeyApiModel.js
var WorkItemParameterKeyApiModel = class _WorkItemParameterKeyApiModel {
  /**
   * Constructs a new <code>WorkItemParameterKeyApiModel</code>.
   * @alias module:model/WorkItemParameterKeyApiModel
   * @param id {String} ID of the parameter key to assign
   */
  constructor(id) {
    _WorkItemParameterKeyApiModel.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>WorkItemParameterKeyApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkItemParameterKeyApiModel} obj Optional instance to populate.
   * @return {module:model/WorkItemParameterKeyApiModel} The populated <code>WorkItemParameterKeyApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _WorkItemParameterKeyApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>WorkItemParameterKeyApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>WorkItemParameterKeyApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _WorkItemParameterKeyApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
WorkItemParameterKeyApiModel.RequiredProperties = ["id"];
WorkItemParameterKeyApiModel.prototype["id"] = void 0;
var WorkItemParameterKeyApiModel_default = WorkItemParameterKeyApiModel;

// src/adaptersapi/model/WorkItemPriorityApiModel.js
var WorkItemPriorityApiModel = class {
  /**
   * value: "Lowest"
   * @const
   */
  "Lowest" = "Lowest";
  /**
   * value: "Low"
   * @const
   */
  "Low" = "Low";
  /**
   * value: "Medium"
   * @const
   */
  "Medium" = "Medium";
  /**
   * value: "High"
   * @const
   */
  "High" = "High";
  /**
   * value: "Highest"
   * @const
   */
  "Highest" = "Highest";
  /**
  * Returns a <code>WorkItemPriorityApiModel</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/WorkItemPriorityApiModel} The enum <code>WorkItemPriorityApiModel</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/WorkItemStateApiModel.js
var WorkItemStateApiModel = class {
  /**
   * value: "NeedsWork"
   * @const
   */
  "NeedsWork" = "NeedsWork";
  /**
   * value: "NotReady"
   * @const
   */
  "NotReady" = "NotReady";
  /**
   * value: "Ready"
   * @const
   */
  "Ready" = "Ready";
  /**
  * Returns a <code>WorkItemStateApiModel</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/WorkItemStateApiModel} The enum <code>WorkItemStateApiModel</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/CreateWorkItemApiModel.js
var CreateWorkItemApiModel = class _CreateWorkItemApiModel {
  /**
   * Constructs a new <code>CreateWorkItemApiModel</code>.
   * @alias module:model/CreateWorkItemApiModel
   * @param projectId {String} Unique identifier of the project
   * @param name {String} Name of the work item
   * @param entityTypeName {module:model/WorkItemEntityTypeApiModel} Type of entity associated with this work item
   * @param duration {Number} Duration of the work item in milliseconds
   * @param state {module:model/WorkItemStateApiModel} Current state of the work item
   * @param priority {module:model/WorkItemPriorityApiModel} Priority level assigned to the work item
   */
  constructor(projectId, name, entityTypeName, duration, state, priority) {
    _CreateWorkItemApiModel.initialize(this, projectId, name, entityTypeName, duration, state, priority);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, projectId, name, entityTypeName, duration, state, priority) {
    obj["projectId"] = projectId;
    obj["name"] = name;
    obj["entityTypeName"] = entityTypeName;
    obj["duration"] = duration;
    obj["state"] = state;
    obj["priority"] = priority;
  }
  /**
   * Constructs a <code>CreateWorkItemApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CreateWorkItemApiModel} obj Optional instance to populate.
   * @return {module:model/CreateWorkItemApiModel} The populated <code>CreateWorkItemApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CreateWorkItemApiModel();
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("sectionId")) {
        obj["sectionId"] = ApiClient_default.convertToType(data["sectionId"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("entityTypeName")) {
        obj["entityTypeName"] = ApiClient_default.convertToType(data["entityTypeName"], WorkItemEntityTypeApiModel);
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], "Number");
      }
      if (data.hasOwnProperty("state")) {
        obj["state"] = ApiClient_default.convertToType(data["state"], WorkItemStateApiModel);
      }
      if (data.hasOwnProperty("priority")) {
        obj["priority"] = ApiClient_default.convertToType(data["priority"], WorkItemPriorityApiModel);
      }
      if (data.hasOwnProperty("attributes")) {
        obj["attributes"] = ApiClient_default.convertToType(data["attributes"], { "String": Object });
      }
      if (data.hasOwnProperty("tags")) {
        obj["tags"] = ApiClient_default.convertToType(data["tags"], [TagModel_default]);
      }
      if (data.hasOwnProperty("preconditionSteps")) {
        obj["preconditionSteps"] = ApiClient_default.convertToType(data["preconditionSteps"], [CreateStepApiModel_default]);
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [CreateStepApiModel_default]);
      }
      if (data.hasOwnProperty("postconditionSteps")) {
        obj["postconditionSteps"] = ApiClient_default.convertToType(data["postconditionSteps"], [CreateStepApiModel_default]);
      }
      if (data.hasOwnProperty("iterations")) {
        obj["iterations"] = ApiClient_default.convertToType(data["iterations"], [AssignIterationApiModel_default]);
      }
      if (data.hasOwnProperty("autoTests")) {
        obj["autoTests"] = ApiClient_default.convertToType(data["autoTests"], [AutoTestIdModel_default]);
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AssignAttachmentApiModel_default]);
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [CreateLinkApiModel_default]);
      }
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], [WorkItemParameterKeyApiModel_default]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CreateWorkItemApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CreateWorkItemApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _CreateWorkItemApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["sectionId"] && !(typeof data["sectionId"] === "string" || data["sectionId"] instanceof String)) {
      throw new Error("Expected the field `sectionId` to be a primitive type in the JSON string but got " + data["sectionId"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["tags"]) {
      if (!Array.isArray(data["tags"])) {
        throw new Error("Expected the field `tags` to be an array in the JSON data but got " + data["tags"]);
      }
      for (const item of data["tags"]) {
        TagModel_default.validateJSON(item);
      }
      ;
    }
    if (data["preconditionSteps"]) {
      if (!Array.isArray(data["preconditionSteps"])) {
        throw new Error("Expected the field `preconditionSteps` to be an array in the JSON data but got " + data["preconditionSteps"]);
      }
      for (const item of data["preconditionSteps"]) {
        CreateStepApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        CreateStepApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["postconditionSteps"]) {
      if (!Array.isArray(data["postconditionSteps"])) {
        throw new Error("Expected the field `postconditionSteps` to be an array in the JSON data but got " + data["postconditionSteps"]);
      }
      for (const item of data["postconditionSteps"]) {
        CreateStepApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["iterations"]) {
      if (!Array.isArray(data["iterations"])) {
        throw new Error("Expected the field `iterations` to be an array in the JSON data but got " + data["iterations"]);
      }
      for (const item of data["iterations"]) {
        AssignIterationApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["autoTests"]) {
      if (!Array.isArray(data["autoTests"])) {
        throw new Error("Expected the field `autoTests` to be an array in the JSON data but got " + data["autoTests"]);
      }
      for (const item of data["autoTests"]) {
        AutoTestIdModel_default.validateJSON(item);
      }
      ;
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AssignAttachmentApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        CreateLinkApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["parameters"]) {
      if (!Array.isArray(data["parameters"])) {
        throw new Error("Expected the field `parameters` to be an array in the JSON data but got " + data["parameters"]);
      }
      for (const item of data["parameters"]) {
        WorkItemParameterKeyApiModel_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
CreateWorkItemApiModel.RequiredProperties = ["projectId", "name", "entityTypeName", "duration", "state", "priority"];
CreateWorkItemApiModel.prototype["projectId"] = void 0;
CreateWorkItemApiModel.prototype["sectionId"] = void 0;
CreateWorkItemApiModel.prototype["name"] = void 0;
CreateWorkItemApiModel.prototype["description"] = void 0;
CreateWorkItemApiModel.prototype["entityTypeName"] = void 0;
CreateWorkItemApiModel.prototype["duration"] = void 0;
CreateWorkItemApiModel.prototype["state"] = void 0;
CreateWorkItemApiModel.prototype["priority"] = void 0;
CreateWorkItemApiModel.prototype["attributes"] = void 0;
CreateWorkItemApiModel.prototype["tags"] = void 0;
CreateWorkItemApiModel.prototype["preconditionSteps"] = void 0;
CreateWorkItemApiModel.prototype["steps"] = void 0;
CreateWorkItemApiModel.prototype["postconditionSteps"] = void 0;
CreateWorkItemApiModel.prototype["iterations"] = void 0;
CreateWorkItemApiModel.prototype["autoTests"] = void 0;
CreateWorkItemApiModel.prototype["attachments"] = void 0;
CreateWorkItemApiModel.prototype["links"] = void 0;
CreateWorkItemApiModel.prototype["parameters"] = void 0;

// src/adaptersapi/model/CustomAttributeOptionApiResult.js
var CustomAttributeOptionApiResult = class _CustomAttributeOptionApiResult {
  /**
   * Constructs a new <code>CustomAttributeOptionApiResult</code>.
   * @alias module:model/CustomAttributeOptionApiResult
   * @param id {String} Unique ID of the attribute option
   * @param isDeleted {Boolean} Indicates if the attributes option is deleted
   * @param isDefault {Boolean} Indicates if the attribute option is used by default
   */
  constructor(id, isDeleted, isDefault) {
    _CustomAttributeOptionApiResult.initialize(this, id, isDeleted, isDefault);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, isDeleted, isDefault) {
    obj["id"] = id;
    obj["isDeleted"] = isDeleted;
    obj["isDefault"] = isDefault;
  }
  /**
   * Constructs a <code>CustomAttributeOptionApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomAttributeOptionApiResult} obj Optional instance to populate.
   * @return {module:model/CustomAttributeOptionApiResult} The populated <code>CustomAttributeOptionApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CustomAttributeOptionApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("value")) {
        obj["value"] = ApiClient_default.convertToType(data["value"], "String");
      }
      if (data.hasOwnProperty("isDefault")) {
        obj["isDefault"] = ApiClient_default.convertToType(data["isDefault"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CustomAttributeOptionApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CustomAttributeOptionApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _CustomAttributeOptionApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["value"] && !(typeof data["value"] === "string" || data["value"] instanceof String)) {
      throw new Error("Expected the field `value` to be a primitive type in the JSON string but got " + data["value"]);
    }
    return true;
  }
};
CustomAttributeOptionApiResult.RequiredProperties = ["id", "isDeleted", "isDefault"];
CustomAttributeOptionApiResult.prototype["id"] = void 0;
CustomAttributeOptionApiResult.prototype["isDeleted"] = void 0;
CustomAttributeOptionApiResult.prototype["value"] = void 0;
CustomAttributeOptionApiResult.prototype["isDefault"] = void 0;
var CustomAttributeOptionApiResult_default = CustomAttributeOptionApiResult;

// src/adaptersapi/model/CustomAttributeType.js
var CustomAttributeType = class {
  /**
   * value: "string"
   * @const
   */
  "string" = "string";
  /**
   * value: "datetime"
   * @const
   */
  "datetime" = "datetime";
  /**
   * value: "options"
   * @const
   */
  "options" = "options";
  /**
   * value: "user"
   * @const
   */
  "user" = "user";
  /**
   * value: "multipleOptions"
   * @const
   */
  "multipleOptions" = "multipleOptions";
  /**
   * value: "checkbox"
   * @const
   */
  "checkbox" = "checkbox";
  /**
  * Returns a <code>CustomAttributeType</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/CustomAttributeType} The enum <code>CustomAttributeType</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/CustomAttributeApiResult.js
var CustomAttributeApiResult = class _CustomAttributeApiResult {
  /**
   * Constructs a new <code>CustomAttributeApiResult</code>.
   * @alias module:model/CustomAttributeApiResult
   * @param id {String} Unique ID of the attribute
   * @param options {Array.<module:model/CustomAttributeOptionApiResult>} Collection of the attribute options   Available for attributes of type `options` and `multiple options` only
   * @param type {module:model/CustomAttributeType} Type of the attribute
   * @param isDeleted {Boolean} Indicates if the attribute is deleted
   * @param name {String} Name of the attribute
   * @param isEnabled {Boolean} Indicates if the attribute is enabled
   * @param isRequired {Boolean} Indicates if the attribute value is mandatory to specify
   * @param isGlobal {Boolean} Indicates if the attribute is available across all projects
   * @param isReadOnly {Boolean} Indicates if the attribute is read-only
   * @param isSystem {Boolean} Indicates if the attribute is system
   * @param targets {Array.<String>} Collection of the attribute targets   Defines where the attribute can be used (e.g., TestCases, AutoTestCases, TestPlans)
   */
  constructor(id, options, type, isDeleted, name, isEnabled, isRequired, isGlobal, isReadOnly, isSystem, targets) {
    _CustomAttributeApiResult.initialize(this, id, options, type, isDeleted, name, isEnabled, isRequired, isGlobal, isReadOnly, isSystem, targets);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, options, type, isDeleted, name, isEnabled, isRequired, isGlobal, isReadOnly, isSystem, targets) {
    obj["id"] = id;
    obj["options"] = options;
    obj["type"] = type;
    obj["isDeleted"] = isDeleted;
    obj["name"] = name;
    obj["isEnabled"] = isEnabled;
    obj["isRequired"] = isRequired;
    obj["isGlobal"] = isGlobal;
    obj["isReadOnly"] = isReadOnly;
    obj["isSystem"] = isSystem;
    obj["targets"] = targets;
  }
  /**
   * Constructs a <code>CustomAttributeApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomAttributeApiResult} obj Optional instance to populate.
   * @return {module:model/CustomAttributeApiResult} The populated <code>CustomAttributeApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CustomAttributeApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("code")) {
        obj["code"] = ApiClient_default.convertToType(data["code"], "String");
      }
      if (data.hasOwnProperty("options")) {
        obj["options"] = ApiClient_default.convertToType(data["options"], [CustomAttributeOptionApiResult_default]);
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], CustomAttributeType);
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isEnabled")) {
        obj["isEnabled"] = ApiClient_default.convertToType(data["isEnabled"], "Boolean");
      }
      if (data.hasOwnProperty("isRequired")) {
        obj["isRequired"] = ApiClient_default.convertToType(data["isRequired"], "Boolean");
      }
      if (data.hasOwnProperty("isGlobal")) {
        obj["isGlobal"] = ApiClient_default.convertToType(data["isGlobal"], "Boolean");
      }
      if (data.hasOwnProperty("isReadOnly")) {
        obj["isReadOnly"] = ApiClient_default.convertToType(data["isReadOnly"], "Boolean");
      }
      if (data.hasOwnProperty("isSystem")) {
        obj["isSystem"] = ApiClient_default.convertToType(data["isSystem"], "Boolean");
      }
      if (data.hasOwnProperty("targets")) {
        obj["targets"] = ApiClient_default.convertToType(data["targets"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CustomAttributeApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CustomAttributeApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _CustomAttributeApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["code"] && !(typeof data["code"] === "string" || data["code"] instanceof String)) {
      throw new Error("Expected the field `code` to be a primitive type in the JSON string but got " + data["code"]);
    }
    if (data["options"]) {
      if (!Array.isArray(data["options"])) {
        throw new Error("Expected the field `options` to be an array in the JSON data but got " + data["options"]);
      }
      for (const item of data["options"]) {
        CustomAttributeOptionApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (!Array.isArray(data["targets"])) {
      throw new Error("Expected the field `targets` to be an array in the JSON data but got " + data["targets"]);
    }
    return true;
  }
};
CustomAttributeApiResult.RequiredProperties = ["id", "options", "type", "isDeleted", "name", "isEnabled", "isRequired", "isGlobal", "isReadOnly", "isSystem", "targets"];
CustomAttributeApiResult.prototype["id"] = void 0;
CustomAttributeApiResult.prototype["code"] = void 0;
CustomAttributeApiResult.prototype["options"] = void 0;
CustomAttributeApiResult.prototype["type"] = void 0;
CustomAttributeApiResult.prototype["isDeleted"] = void 0;
CustomAttributeApiResult.prototype["name"] = void 0;
CustomAttributeApiResult.prototype["isEnabled"] = void 0;
CustomAttributeApiResult.prototype["isRequired"] = void 0;
CustomAttributeApiResult.prototype["isGlobal"] = void 0;
CustomAttributeApiResult.prototype["isReadOnly"] = void 0;
CustomAttributeApiResult.prototype["isSystem"] = void 0;
CustomAttributeApiResult.prototype["targets"] = void 0;
var CustomAttributeApiResult_default = CustomAttributeApiResult;

// src/adaptersapi/model/CustomAttributeOptionModel.js
var CustomAttributeOptionModel = class _CustomAttributeOptionModel {
  /**
   * Constructs a new <code>CustomAttributeOptionModel</code>.
   * @alias module:model/CustomAttributeOptionModel
   * @param id {String} Unique ID of the attribute option
   * @param isDeleted {Boolean} Indicates if the attributes option is deleted
   * @param isDefault {Boolean} Indicates if the attribute option is used by default
   */
  constructor(id, isDeleted, isDefault) {
    _CustomAttributeOptionModel.initialize(this, id, isDeleted, isDefault);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, isDeleted, isDefault) {
    obj["id"] = id;
    obj["isDeleted"] = isDeleted;
    obj["isDefault"] = isDefault;
  }
  /**
   * Constructs a <code>CustomAttributeOptionModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomAttributeOptionModel} obj Optional instance to populate.
   * @return {module:model/CustomAttributeOptionModel} The populated <code>CustomAttributeOptionModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CustomAttributeOptionModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("value")) {
        obj["value"] = ApiClient_default.convertToType(data["value"], "String");
      }
      if (data.hasOwnProperty("isDefault")) {
        obj["isDefault"] = ApiClient_default.convertToType(data["isDefault"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CustomAttributeOptionModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CustomAttributeOptionModel</code>.
   */
  static validateJSON(data) {
    for (const property of _CustomAttributeOptionModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["value"] && !(typeof data["value"] === "string" || data["value"] instanceof String)) {
      throw new Error("Expected the field `value` to be a primitive type in the JSON string but got " + data["value"]);
    }
    return true;
  }
};
CustomAttributeOptionModel.RequiredProperties = ["id", "isDeleted", "isDefault"];
CustomAttributeOptionModel.prototype["id"] = void 0;
CustomAttributeOptionModel.prototype["isDeleted"] = void 0;
CustomAttributeOptionModel.prototype["value"] = void 0;
CustomAttributeOptionModel.prototype["isDefault"] = void 0;
var CustomAttributeOptionModel_default = CustomAttributeOptionModel;

// src/adaptersapi/model/CustomAttributeTypesEnum.js
var CustomAttributeTypesEnum = class {
  /**
   * value: "string"
   * @const
   */
  "string" = "string";
  /**
   * value: "datetime"
   * @const
   */
  "datetime" = "datetime";
  /**
   * value: "options"
   * @const
   */
  "options" = "options";
  /**
   * value: "user"
   * @const
   */
  "user" = "user";
  /**
   * value: "multipleOptions"
   * @const
   */
  "multipleOptions" = "multipleOptions";
  /**
   * value: "checkbox"
   * @const
   */
  "checkbox" = "checkbox";
  /**
  * Returns a <code>CustomAttributeTypesEnum</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/CustomAttributeTypesEnum} The enum <code>CustomAttributeTypesEnum</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/CustomAttributeModel.js
var CustomAttributeModel = class _CustomAttributeModel {
  /**
   * Constructs a new <code>CustomAttributeModel</code>.
   * @alias module:model/CustomAttributeModel
   * @param id {String} Unique ID of the attribute.
   * @param type {module:model/CustomAttributeTypesEnum} Type of the attribute.
   * @param options {Array.<module:model/CustomAttributeOptionModel>} Collection of the attribute options.
   * @param targets {Array.<String>} Collection of the attribute targets.   Defines where the attribute can be used (e.g., TestCases, AutoTestCases, TestPlans).
   * @param isReadOnly {Boolean} Indicates if the attribute is read-only.
   * @param isDeleted {Boolean} Indicates if the attribute is deleted.
   * @param isSystem {Boolean} Indicates if the attribute is system.
   * @param name {String} Name of the attribute
   * @param isEnabled {Boolean} Indicates if the attribute is enabled
   * @param isRequired {Boolean} Indicates if the attribute value is mandatory to specify
   * @param isGlobal {Boolean} Indicates if the attribute is available across all projects
   */
  constructor(id, type, options, targets, isReadOnly, isDeleted, isSystem, name, isEnabled, isRequired, isGlobal) {
    _CustomAttributeModel.initialize(this, id, type, options, targets, isReadOnly, isDeleted, isSystem, name, isEnabled, isRequired, isGlobal);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, type, options, targets, isReadOnly, isDeleted, isSystem, name, isEnabled, isRequired, isGlobal) {
    obj["id"] = id;
    obj["type"] = type;
    obj["options"] = options;
    obj["targets"] = targets;
    obj["isReadOnly"] = isReadOnly;
    obj["isDeleted"] = isDeleted;
    obj["isSystem"] = isSystem;
    obj["name"] = name;
    obj["isEnabled"] = isEnabled;
    obj["isRequired"] = isRequired;
    obj["isGlobal"] = isGlobal;
  }
  /**
   * Constructs a <code>CustomAttributeModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomAttributeModel} obj Optional instance to populate.
   * @return {module:model/CustomAttributeModel} The populated <code>CustomAttributeModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CustomAttributeModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("code")) {
        obj["code"] = ApiClient_default.convertToType(data["code"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], CustomAttributeTypesEnum);
      }
      if (data.hasOwnProperty("options")) {
        obj["options"] = ApiClient_default.convertToType(data["options"], [CustomAttributeOptionModel_default]);
      }
      if (data.hasOwnProperty("targets")) {
        obj["targets"] = ApiClient_default.convertToType(data["targets"], ["String"]);
      }
      if (data.hasOwnProperty("isReadOnly")) {
        obj["isReadOnly"] = ApiClient_default.convertToType(data["isReadOnly"], "Boolean");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("isSystem")) {
        obj["isSystem"] = ApiClient_default.convertToType(data["isSystem"], "Boolean");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isEnabled")) {
        obj["isEnabled"] = ApiClient_default.convertToType(data["isEnabled"], "Boolean");
      }
      if (data.hasOwnProperty("isRequired")) {
        obj["isRequired"] = ApiClient_default.convertToType(data["isRequired"], "Boolean");
      }
      if (data.hasOwnProperty("isGlobal")) {
        obj["isGlobal"] = ApiClient_default.convertToType(data["isGlobal"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CustomAttributeModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CustomAttributeModel</code>.
   */
  static validateJSON(data) {
    for (const property of _CustomAttributeModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["code"] && !(typeof data["code"] === "string" || data["code"] instanceof String)) {
      throw new Error("Expected the field `code` to be a primitive type in the JSON string but got " + data["code"]);
    }
    if (data["options"]) {
      if (!Array.isArray(data["options"])) {
        throw new Error("Expected the field `options` to be an array in the JSON data but got " + data["options"]);
      }
      for (const item of data["options"]) {
        CustomAttributeOptionModel_default.validateJSON(item);
      }
      ;
    }
    if (!Array.isArray(data["targets"])) {
      throw new Error("Expected the field `targets` to be an array in the JSON data but got " + data["targets"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
CustomAttributeModel.RequiredProperties = ["id", "type", "options", "targets", "isReadOnly", "isDeleted", "isSystem", "name", "isEnabled", "isRequired", "isGlobal"];
CustomAttributeModel.prototype["id"] = void 0;
CustomAttributeModel.prototype["code"] = void 0;
CustomAttributeModel.prototype["type"] = void 0;
CustomAttributeModel.prototype["options"] = void 0;
CustomAttributeModel.prototype["targets"] = void 0;
CustomAttributeModel.prototype["isReadOnly"] = void 0;
CustomAttributeModel.prototype["isDeleted"] = void 0;
CustomAttributeModel.prototype["isSystem"] = void 0;
CustomAttributeModel.prototype["name"] = void 0;
CustomAttributeModel.prototype["isEnabled"] = void 0;
CustomAttributeModel.prototype["isRequired"] = void 0;
CustomAttributeModel.prototype["isGlobal"] = void 0;

// src/adaptersapi/model/CustomAttributeOptionPostApiModel.js
var CustomAttributeOptionPostApiModel = class _CustomAttributeOptionPostApiModel {
  /**
   * Constructs a new <code>CustomAttributeOptionPostApiModel</code>.
   * @alias module:model/CustomAttributeOptionPostApiModel
   * @param isDefault {Boolean} Indicates if the attribute option is used by default
   */
  constructor(isDefault) {
    _CustomAttributeOptionPostApiModel.initialize(this, isDefault);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, isDefault) {
    obj["isDefault"] = isDefault;
  }
  /**
   * Constructs a <code>CustomAttributeOptionPostApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomAttributeOptionPostApiModel} obj Optional instance to populate.
   * @return {module:model/CustomAttributeOptionPostApiModel} The populated <code>CustomAttributeOptionPostApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CustomAttributeOptionPostApiModel();
      if (data.hasOwnProperty("value")) {
        obj["value"] = ApiClient_default.convertToType(data["value"], "String");
      }
      if (data.hasOwnProperty("isDefault")) {
        obj["isDefault"] = ApiClient_default.convertToType(data["isDefault"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CustomAttributeOptionPostApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CustomAttributeOptionPostApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _CustomAttributeOptionPostApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["value"] && !(typeof data["value"] === "string" || data["value"] instanceof String)) {
      throw new Error("Expected the field `value` to be a primitive type in the JSON string but got " + data["value"]);
    }
    return true;
  }
};
CustomAttributeOptionPostApiModel.RequiredProperties = ["isDefault"];
CustomAttributeOptionPostApiModel.prototype["value"] = void 0;
CustomAttributeOptionPostApiModel.prototype["isDefault"] = void 0;
var CustomAttributeOptionPostApiModel_default = CustomAttributeOptionPostApiModel;

// src/adaptersapi/model/CustomAttributeOptionUpdateApiModel.js
var CustomAttributeOptionUpdateApiModel = class _CustomAttributeOptionUpdateApiModel {
  /**
   * Constructs a new <code>CustomAttributeOptionUpdateApiModel</code>.
   * @alias module:model/CustomAttributeOptionUpdateApiModel
   * @param id {String} Unique ID of the attribute option
   * @param isDefault {Boolean} Indicates if the attribute option is used by default
   * @param isDeleted {Boolean} Indicates if the attributes option is deleted
   */
  constructor(id, isDefault, isDeleted) {
    _CustomAttributeOptionUpdateApiModel.initialize(this, id, isDefault, isDeleted);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, isDefault, isDeleted) {
    obj["id"] = id;
    obj["isDefault"] = isDefault;
    obj["isDeleted"] = isDeleted;
  }
  /**
   * Constructs a <code>CustomAttributeOptionUpdateApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomAttributeOptionUpdateApiModel} obj Optional instance to populate.
   * @return {module:model/CustomAttributeOptionUpdateApiModel} The populated <code>CustomAttributeOptionUpdateApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CustomAttributeOptionUpdateApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("value")) {
        obj["value"] = ApiClient_default.convertToType(data["value"], "String");
      }
      if (data.hasOwnProperty("isDefault")) {
        obj["isDefault"] = ApiClient_default.convertToType(data["isDefault"], "Boolean");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CustomAttributeOptionUpdateApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CustomAttributeOptionUpdateApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _CustomAttributeOptionUpdateApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["value"] && !(typeof data["value"] === "string" || data["value"] instanceof String)) {
      throw new Error("Expected the field `value` to be a primitive type in the JSON string but got " + data["value"]);
    }
    return true;
  }
};
CustomAttributeOptionUpdateApiModel.RequiredProperties = ["id", "isDefault", "isDeleted"];
CustomAttributeOptionUpdateApiModel.prototype["id"] = void 0;
CustomAttributeOptionUpdateApiModel.prototype["value"] = void 0;
CustomAttributeOptionUpdateApiModel.prototype["isDefault"] = void 0;
CustomAttributeOptionUpdateApiModel.prototype["isDeleted"] = void 0;
var CustomAttributeOptionUpdateApiModel_default = CustomAttributeOptionUpdateApiModel;

// src/adaptersapi/model/CustomAttributePutModel.js
var CustomAttributePutModel = class _CustomAttributePutModel {
  /**
   * Constructs a new <code>CustomAttributePutModel</code>.
   * @alias module:model/CustomAttributePutModel
   * @param id {String} Unique ID of the attribute
   * @param type {module:model/CustomAttributeTypesEnum} Type of the attribute
   * @param isDeleted {Boolean} Indicates if the entity is deleted
   * @param name {String} Name of the attribute
   * @param isEnabled {Boolean} Indicates if the attribute is enabled
   * @param isRequired {Boolean} Indicates if the attribute value is mandatory to specify
   * @param isGlobal {Boolean} Indicates if the attribute is available across all projects
   */
  constructor(id, type, isDeleted, name, isEnabled, isRequired, isGlobal) {
    _CustomAttributePutModel.initialize(this, id, type, isDeleted, name, isEnabled, isRequired, isGlobal);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, type, isDeleted, name, isEnabled, isRequired, isGlobal) {
    obj["id"] = id;
    obj["type"] = type;
    obj["isDeleted"] = isDeleted;
    obj["name"] = name;
    obj["isEnabled"] = isEnabled;
    obj["isRequired"] = isRequired;
    obj["isGlobal"] = isGlobal;
  }
  /**
   * Constructs a <code>CustomAttributePutModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomAttributePutModel} obj Optional instance to populate.
   * @return {module:model/CustomAttributePutModel} The populated <code>CustomAttributePutModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CustomAttributePutModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("options")) {
        obj["options"] = ApiClient_default.convertToType(data["options"], [CustomAttributeOptionModel_default]);
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], CustomAttributeTypesEnum);
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isEnabled")) {
        obj["isEnabled"] = ApiClient_default.convertToType(data["isEnabled"], "Boolean");
      }
      if (data.hasOwnProperty("isRequired")) {
        obj["isRequired"] = ApiClient_default.convertToType(data["isRequired"], "Boolean");
      }
      if (data.hasOwnProperty("isGlobal")) {
        obj["isGlobal"] = ApiClient_default.convertToType(data["isGlobal"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CustomAttributePutModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CustomAttributePutModel</code>.
   */
  static validateJSON(data) {
    for (const property of _CustomAttributePutModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["options"]) {
      if (!Array.isArray(data["options"])) {
        throw new Error("Expected the field `options` to be an array in the JSON data but got " + data["options"]);
      }
      for (const item of data["options"]) {
        CustomAttributeOptionModel_default.validateJSON(item);
      }
      ;
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
CustomAttributePutModel.RequiredProperties = ["id", "type", "isDeleted", "name", "isEnabled", "isRequired", "isGlobal"];
CustomAttributePutModel.prototype["id"] = void 0;
CustomAttributePutModel.prototype["options"] = void 0;
CustomAttributePutModel.prototype["type"] = void 0;
CustomAttributePutModel.prototype["isDeleted"] = void 0;
CustomAttributePutModel.prototype["name"] = void 0;
CustomAttributePutModel.prototype["isEnabled"] = void 0;
CustomAttributePutModel.prototype["isRequired"] = void 0;
CustomAttributePutModel.prototype["isGlobal"] = void 0;

// src/adaptersapi/model/CustomAttributeSearchApiModel.js
var CustomAttributeSearchApiModel = class _CustomAttributeSearchApiModel {
  /**
   * Constructs a new <code>CustomAttributeSearchApiModel</code>.
   * @alias module:model/CustomAttributeSearchApiModel
   */
  constructor() {
    _CustomAttributeSearchApiModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>CustomAttributeSearchApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomAttributeSearchApiModel} obj Optional instance to populate.
   * @return {module:model/CustomAttributeSearchApiModel} The populated <code>CustomAttributeSearchApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CustomAttributeSearchApiModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("projectIds")) {
        obj["projectIds"] = ApiClient_default.convertToType(data["projectIds"], ["String"]);
      }
      if (data.hasOwnProperty("customAttributeIds")) {
        obj["customAttributeIds"] = ApiClient_default.convertToType(data["customAttributeIds"], ["String"]);
      }
      if (data.hasOwnProperty("customAttributeTypes")) {
        obj["customAttributeTypes"] = ApiClient_default.convertToType(data["customAttributeTypes"], [CustomAttributeType]);
      }
      if (data.hasOwnProperty("isGlobal")) {
        obj["isGlobal"] = ApiClient_default.convertToType(data["isGlobal"], "Boolean");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CustomAttributeSearchApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CustomAttributeSearchApiModel</code>.
   */
  static validateJSON(data) {
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (!Array.isArray(data["projectIds"])) {
      throw new Error("Expected the field `projectIds` to be an array in the JSON data but got " + data["projectIds"]);
    }
    if (!Array.isArray(data["customAttributeIds"])) {
      throw new Error("Expected the field `customAttributeIds` to be an array in the JSON data but got " + data["customAttributeIds"]);
    }
    if (!Array.isArray(data["customAttributeTypes"])) {
      throw new Error("Expected the field `customAttributeTypes` to be an array in the JSON data but got " + data["customAttributeTypes"]);
    }
    return true;
  }
};
CustomAttributeSearchApiModel.prototype["name"] = void 0;
CustomAttributeSearchApiModel.prototype["projectIds"] = void 0;
CustomAttributeSearchApiModel.prototype["customAttributeIds"] = void 0;
CustomAttributeSearchApiModel.prototype["customAttributeTypes"] = void 0;
CustomAttributeSearchApiModel.prototype["isGlobal"] = void 0;
CustomAttributeSearchApiModel.prototype["isDeleted"] = void 0;

// src/adaptersapi/model/ProjectTypeModel.js
var ProjectTypeModel = class {
  /**
   * value: "Regular"
   * @const
   */
  "Regular" = "Regular";
  /**
   * value: "Demo"
   * @const
   */
  "Demo" = "Demo";
  /**
  * Returns a <code>ProjectTypeModel</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/ProjectTypeModel} The enum <code>ProjectTypeModel</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/ProjectShortestApiResult.js
var ProjectShortestApiResult = class _ProjectShortestApiResult {
  /**
   * Constructs a new <code>ProjectShortestApiResult</code>.
   * @alias module:model/ProjectShortestApiResult
   * @param id {String} Unique ID of project
   * @param isDeleted {Boolean} Indicates whether the project is deleted
   * @param globalId {Number} Global ID of project
   * @param name {String} Name of project
   * @param type {module:model/ProjectTypeModel} Type of the project
   */
  constructor(id, isDeleted, globalId, name, type) {
    _ProjectShortestApiResult.initialize(this, id, isDeleted, globalId, name, type);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, isDeleted, globalId, name, type) {
    obj["id"] = id;
    obj["isDeleted"] = isDeleted;
    obj["globalId"] = globalId;
    obj["name"] = name;
    obj["type"] = type;
  }
  /**
   * Constructs a <code>ProjectShortestApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProjectShortestApiResult} obj Optional instance to populate.
   * @return {module:model/ProjectShortestApiResult} The populated <code>ProjectShortestApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ProjectShortestApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], ProjectTypeModel);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ProjectShortestApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ProjectShortestApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _ProjectShortestApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
ProjectShortestApiResult.RequiredProperties = ["id", "isDeleted", "globalId", "name", "type"];
ProjectShortestApiResult.prototype["id"] = void 0;
ProjectShortestApiResult.prototype["isDeleted"] = void 0;
ProjectShortestApiResult.prototype["globalId"] = void 0;
ProjectShortestApiResult.prototype["name"] = void 0;
ProjectShortestApiResult.prototype["type"] = void 0;
var ProjectShortestApiResult_default = ProjectShortestApiResult;

// src/adaptersapi/model/CustomAttributeSearchApiResult.js
var CustomAttributeSearchApiResult = class _CustomAttributeSearchApiResult {
  /**
   * Constructs a new <code>CustomAttributeSearchApiResult</code>.
   * @alias module:model/CustomAttributeSearchApiResult
   * @param workItemUsage {Array.<module:model/ProjectShortestApiResult>} Projects where attribute is used in work items
   * @param testPlanUsage {Array.<module:model/ProjectShortestApiResult>} Projects where attribute is used in test plans
   * @param id {String} Unique ID of the attribute
   * @param options {Array.<module:model/CustomAttributeOptionApiResult>} Collection of the attribute options   Available for attributes of type `options` and `multiple options` only
   * @param type {module:model/CustomAttributeType} Type of the attribute
   * @param isDeleted {Boolean} Indicates if the attribute is deleted
   * @param name {String} Name of the attribute
   * @param isEnabled {Boolean} Indicates if the attribute is enabled
   * @param isRequired {Boolean} Indicates if the attribute value is mandatory to specify
   * @param isGlobal {Boolean} Indicates if the attribute is available across all projects
   * @param isReadOnly {Boolean} Indicates if the attribute is read-only
   * @param isSystem {Boolean} Indicates if the attribute is system
   * @param targets {Array.<String>} Collection of the attribute targets   Defines where the attribute can be used (e.g., TestCases, AutoTestCases, TestPlans)
   */
  constructor(workItemUsage, testPlanUsage, id, options, type, isDeleted, name, isEnabled, isRequired, isGlobal, isReadOnly, isSystem, targets) {
    _CustomAttributeSearchApiResult.initialize(this, workItemUsage, testPlanUsage, id, options, type, isDeleted, name, isEnabled, isRequired, isGlobal, isReadOnly, isSystem, targets);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, workItemUsage, testPlanUsage, id, options, type, isDeleted, name, isEnabled, isRequired, isGlobal, isReadOnly, isSystem, targets) {
    obj["workItemUsage"] = workItemUsage;
    obj["testPlanUsage"] = testPlanUsage;
    obj["id"] = id;
    obj["options"] = options;
    obj["type"] = type;
    obj["isDeleted"] = isDeleted;
    obj["name"] = name;
    obj["isEnabled"] = isEnabled;
    obj["isRequired"] = isRequired;
    obj["isGlobal"] = isGlobal;
    obj["isReadOnly"] = isReadOnly;
    obj["isSystem"] = isSystem;
    obj["targets"] = targets;
  }
  /**
   * Constructs a <code>CustomAttributeSearchApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomAttributeSearchApiResult} obj Optional instance to populate.
   * @return {module:model/CustomAttributeSearchApiResult} The populated <code>CustomAttributeSearchApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _CustomAttributeSearchApiResult();
      if (data.hasOwnProperty("workItemUsage")) {
        obj["workItemUsage"] = ApiClient_default.convertToType(data["workItemUsage"], [ProjectShortestApiResult_default]);
      }
      if (data.hasOwnProperty("testPlanUsage")) {
        obj["testPlanUsage"] = ApiClient_default.convertToType(data["testPlanUsage"], [ProjectShortestApiResult_default]);
      }
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("code")) {
        obj["code"] = ApiClient_default.convertToType(data["code"], "String");
      }
      if (data.hasOwnProperty("options")) {
        obj["options"] = ApiClient_default.convertToType(data["options"], [CustomAttributeOptionApiResult_default]);
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], CustomAttributeType);
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isEnabled")) {
        obj["isEnabled"] = ApiClient_default.convertToType(data["isEnabled"], "Boolean");
      }
      if (data.hasOwnProperty("isRequired")) {
        obj["isRequired"] = ApiClient_default.convertToType(data["isRequired"], "Boolean");
      }
      if (data.hasOwnProperty("isGlobal")) {
        obj["isGlobal"] = ApiClient_default.convertToType(data["isGlobal"], "Boolean");
      }
      if (data.hasOwnProperty("isReadOnly")) {
        obj["isReadOnly"] = ApiClient_default.convertToType(data["isReadOnly"], "Boolean");
      }
      if (data.hasOwnProperty("isSystem")) {
        obj["isSystem"] = ApiClient_default.convertToType(data["isSystem"], "Boolean");
      }
      if (data.hasOwnProperty("targets")) {
        obj["targets"] = ApiClient_default.convertToType(data["targets"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>CustomAttributeSearchApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>CustomAttributeSearchApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _CustomAttributeSearchApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["workItemUsage"]) {
      if (!Array.isArray(data["workItemUsage"])) {
        throw new Error("Expected the field `workItemUsage` to be an array in the JSON data but got " + data["workItemUsage"]);
      }
      for (const item of data["workItemUsage"]) {
        ProjectShortestApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["testPlanUsage"]) {
      if (!Array.isArray(data["testPlanUsage"])) {
        throw new Error("Expected the field `testPlanUsage` to be an array in the JSON data but got " + data["testPlanUsage"]);
      }
      for (const item of data["testPlanUsage"]) {
        ProjectShortestApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["code"] && !(typeof data["code"] === "string" || data["code"] instanceof String)) {
      throw new Error("Expected the field `code` to be a primitive type in the JSON string but got " + data["code"]);
    }
    if (data["options"]) {
      if (!Array.isArray(data["options"])) {
        throw new Error("Expected the field `options` to be an array in the JSON data but got " + data["options"]);
      }
      for (const item of data["options"]) {
        CustomAttributeOptionApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (!Array.isArray(data["targets"])) {
      throw new Error("Expected the field `targets` to be an array in the JSON data but got " + data["targets"]);
    }
    return true;
  }
};
CustomAttributeSearchApiResult.RequiredProperties = ["workItemUsage", "testPlanUsage", "id", "options", "type", "isDeleted", "name", "isEnabled", "isRequired", "isGlobal", "isReadOnly", "isSystem", "targets"];
CustomAttributeSearchApiResult.prototype["workItemUsage"] = void 0;
CustomAttributeSearchApiResult.prototype["testPlanUsage"] = void 0;
CustomAttributeSearchApiResult.prototype["id"] = void 0;
CustomAttributeSearchApiResult.prototype["code"] = void 0;
CustomAttributeSearchApiResult.prototype["options"] = void 0;
CustomAttributeSearchApiResult.prototype["type"] = void 0;
CustomAttributeSearchApiResult.prototype["isDeleted"] = void 0;
CustomAttributeSearchApiResult.prototype["name"] = void 0;
CustomAttributeSearchApiResult.prototype["isEnabled"] = void 0;
CustomAttributeSearchApiResult.prototype["isRequired"] = void 0;
CustomAttributeSearchApiResult.prototype["isGlobal"] = void 0;
CustomAttributeSearchApiResult.prototype["isReadOnly"] = void 0;
CustomAttributeSearchApiResult.prototype["isSystem"] = void 0;
CustomAttributeSearchApiResult.prototype["targets"] = void 0;

// src/adaptersapi/model/DateTimeRangeSelectorModel.js
var DateTimeRangeSelectorModel = class _DateTimeRangeSelectorModel {
  /**
   * Constructs a new <code>DateTimeRangeSelectorModel</code>.
   * @alias module:model/DateTimeRangeSelectorModel
   */
  constructor() {
    _DateTimeRangeSelectorModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>DateTimeRangeSelectorModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DateTimeRangeSelectorModel} obj Optional instance to populate.
   * @return {module:model/DateTimeRangeSelectorModel} The populated <code>DateTimeRangeSelectorModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _DateTimeRangeSelectorModel();
      if (data.hasOwnProperty("from")) {
        obj["from"] = ApiClient_default.convertToType(data["from"], "Date");
      }
      if (data.hasOwnProperty("to")) {
        obj["to"] = ApiClient_default.convertToType(data["to"], "Date");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>DateTimeRangeSelectorModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>DateTimeRangeSelectorModel</code>.
   */
  static validateJSON(data) {
    return true;
  }
};
DateTimeRangeSelectorModel.prototype["from"] = void 0;
DateTimeRangeSelectorModel.prototype["to"] = void 0;
var DateTimeRangeSelectorModel_default = DateTimeRangeSelectorModel;

// src/adaptersapi/model/TestStatusApiType.js
var TestStatusApiType = class {
  /**
   * value: "Pending"
   * @const
   */
  "Pending" = "Pending";
  /**
   * value: "InProgress"
   * @const
   */
  "InProgress" = "InProgress";
  /**
   * value: "Succeeded"
   * @const
   */
  "Succeeded" = "Succeeded";
  /**
   * value: "Failed"
   * @const
   */
  "Failed" = "Failed";
  /**
   * value: "Incomplete"
   * @const
   */
  "Incomplete" = "Incomplete";
  /**
  * Returns a <code>TestStatusApiType</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/TestStatusApiType} The enum <code>TestStatusApiType</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/WorkflowStatusApiResult.js
var WorkflowStatusApiResult = class _WorkflowStatusApiResult {
  /**
   * Constructs a new <code>WorkflowStatusApiResult</code>.
   * @alias module:model/WorkflowStatusApiResult
   * @param id {String} 
   * @param code {String} 
   * @param type {module:model/TestStatusApiType} Collection of possible status types
   */
  constructor(id, code, type) {
    _WorkflowStatusApiResult.initialize(this, id, code, type);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, code, type) {
    obj["id"] = id;
    obj["code"] = code;
    obj["type"] = type;
  }
  /**
   * Constructs a <code>WorkflowStatusApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkflowStatusApiResult} obj Optional instance to populate.
   * @return {module:model/WorkflowStatusApiResult} The populated <code>WorkflowStatusApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _WorkflowStatusApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("code")) {
        obj["code"] = ApiClient_default.convertToType(data["code"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], TestStatusApiType);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>WorkflowStatusApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>WorkflowStatusApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _WorkflowStatusApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["code"] && !(typeof data["code"] === "string" || data["code"] instanceof String)) {
      throw new Error("Expected the field `code` to be a primitive type in the JSON string but got " + data["code"]);
    }
    return true;
  }
};
WorkflowStatusApiResult.RequiredProperties = ["id", "code", "type"];
WorkflowStatusApiResult.prototype["id"] = void 0;
WorkflowStatusApiResult.prototype["code"] = void 0;
WorkflowStatusApiResult.prototype["type"] = void 0;
var WorkflowStatusApiResult_default = WorkflowStatusApiResult;

// src/adaptersapi/model/WorkflowApiResult.js
var WorkflowApiResult = class _WorkflowApiResult {
  /**
   * Constructs a new <code>WorkflowApiResult</code>.
   * @alias module:model/WorkflowApiResult
   * @param id {String} 
   * @param statuses {Array.<module:model/WorkflowStatusApiResult>} 
   */
  constructor(id, statuses) {
    _WorkflowApiResult.initialize(this, id, statuses);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, statuses) {
    obj["id"] = id;
    obj["statuses"] = statuses;
  }
  /**
   * Constructs a <code>WorkflowApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkflowApiResult} obj Optional instance to populate.
   * @return {module:model/WorkflowApiResult} The populated <code>WorkflowApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _WorkflowApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("statuses")) {
        obj["statuses"] = ApiClient_default.convertToType(data["statuses"], [WorkflowStatusApiResult_default]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>WorkflowApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>WorkflowApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _WorkflowApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["statuses"]) {
      if (!Array.isArray(data["statuses"])) {
        throw new Error("Expected the field `statuses` to be an array in the JSON data but got " + data["statuses"]);
      }
      for (const item of data["statuses"]) {
        WorkflowStatusApiResult_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
WorkflowApiResult.RequiredProperties = ["id", "statuses"];
WorkflowApiResult.prototype["id"] = void 0;
WorkflowApiResult.prototype["statuses"] = void 0;
var WorkflowApiResult_default = WorkflowApiResult;

// src/adaptersapi/model/DetailedProjectApiResult.js
var DetailedProjectApiResult = class _DetailedProjectApiResult {
  /**
   * Constructs a new <code>DetailedProjectApiResult</code>.
   * @alias module:model/DetailedProjectApiResult
   * @param workflow {module:model/WorkflowApiResult} ID of the workflow used in project
   * @param id {String} Unique ID of the project
   * @param name {String} Name of the project
   * @param isFavorite {Boolean} Indicates if the project is marked as favorite
   * @param isDeleted {Boolean} Indicates if the project is deleted
   * @param globalId {Number} Global ID of the project
   * @param workflowId {String} ID of the workflow used in project
   */
  constructor(workflow, id, name, isFavorite, isDeleted, globalId, workflowId) {
    _DetailedProjectApiResult.initialize(this, workflow, id, name, isFavorite, isDeleted, globalId, workflowId);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, workflow, id, name, isFavorite, isDeleted, globalId, workflowId) {
    obj["workflow"] = workflow;
    obj["id"] = id;
    obj["name"] = name;
    obj["isFavorite"] = isFavorite;
    obj["isDeleted"] = isDeleted;
    obj["globalId"] = globalId;
    obj["workflowId"] = workflowId;
  }
  /**
   * Constructs a <code>DetailedProjectApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/DetailedProjectApiResult} obj Optional instance to populate.
   * @return {module:model/DetailedProjectApiResult} The populated <code>DetailedProjectApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _DetailedProjectApiResult();
      if (data.hasOwnProperty("attributesScheme")) {
        obj["attributesScheme"] = ApiClient_default.convertToType(data["attributesScheme"], [CustomAttributeApiResult_default]);
      }
      if (data.hasOwnProperty("workflow")) {
        obj["workflow"] = ApiClient_default.convertToType(data["workflow"], WorkflowApiResult_default);
      }
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isFavorite")) {
        obj["isFavorite"] = ApiClient_default.convertToType(data["isFavorite"], "Boolean");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("workflowId")) {
        obj["workflowId"] = ApiClient_default.convertToType(data["workflowId"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>DetailedProjectApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>DetailedProjectApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _DetailedProjectApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["attributesScheme"]) {
      if (!Array.isArray(data["attributesScheme"])) {
        throw new Error("Expected the field `attributesScheme` to be an array in the JSON data but got " + data["attributesScheme"]);
      }
      for (const item of data["attributesScheme"]) {
        CustomAttributeApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["workflow"]) {
      WorkflowApiResult_default.validateJSON(data["workflow"]);
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["workflowId"] && !(typeof data["workflowId"] === "string" || data["workflowId"] instanceof String)) {
      throw new Error("Expected the field `workflowId` to be a primitive type in the JSON string but got " + data["workflowId"]);
    }
    return true;
  }
};
DetailedProjectApiResult.RequiredProperties = ["workflow", "id", "name", "isFavorite", "isDeleted", "globalId", "workflowId"];
DetailedProjectApiResult.prototype["attributesScheme"] = void 0;
DetailedProjectApiResult.prototype["workflow"] = void 0;
DetailedProjectApiResult.prototype["id"] = void 0;
DetailedProjectApiResult.prototype["description"] = void 0;
DetailedProjectApiResult.prototype["name"] = void 0;
DetailedProjectApiResult.prototype["isFavorite"] = void 0;
DetailedProjectApiResult.prototype["isDeleted"] = void 0;
DetailedProjectApiResult.prototype["globalId"] = void 0;
DetailedProjectApiResult.prototype["workflowId"] = void 0;

// src/adaptersapi/model/GlobalCustomAttributePostApiModel.js
var GlobalCustomAttributePostApiModel = class _GlobalCustomAttributePostApiModel {
  /**
   * Constructs a new <code>GlobalCustomAttributePostApiModel</code>.
   * @alias module:model/GlobalCustomAttributePostApiModel
   * @param name {String} Name of attribute
   * @param type {module:model/CustomAttributeType} Type of attribute
   */
  constructor(name, type) {
    _GlobalCustomAttributePostApiModel.initialize(this, name, type);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name, type) {
    obj["name"] = name;
    obj["type"] = type;
  }
  /**
   * Constructs a <code>GlobalCustomAttributePostApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/GlobalCustomAttributePostApiModel} obj Optional instance to populate.
   * @return {module:model/GlobalCustomAttributePostApiModel} The populated <code>GlobalCustomAttributePostApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _GlobalCustomAttributePostApiModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isEnabled")) {
        obj["isEnabled"] = ApiClient_default.convertToType(data["isEnabled"], "Boolean");
      }
      if (data.hasOwnProperty("isRequired")) {
        obj["isRequired"] = ApiClient_default.convertToType(data["isRequired"], "Boolean");
      }
      if (data.hasOwnProperty("options")) {
        obj["options"] = ApiClient_default.convertToType(data["options"], [CustomAttributeOptionPostApiModel_default]);
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], CustomAttributeType);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>GlobalCustomAttributePostApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>GlobalCustomAttributePostApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _GlobalCustomAttributePostApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["options"]) {
      if (!Array.isArray(data["options"])) {
        throw new Error("Expected the field `options` to be an array in the JSON data but got " + data["options"]);
      }
      for (const item of data["options"]) {
        CustomAttributeOptionPostApiModel_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
GlobalCustomAttributePostApiModel.RequiredProperties = ["name", "type"];
GlobalCustomAttributePostApiModel.prototype["name"] = void 0;
GlobalCustomAttributePostApiModel.prototype["isEnabled"] = void 0;
GlobalCustomAttributePostApiModel.prototype["isRequired"] = void 0;
GlobalCustomAttributePostApiModel.prototype["options"] = void 0;
GlobalCustomAttributePostApiModel.prototype["type"] = void 0;

// src/adaptersapi/model/GlobalCustomAttributeUpdateApiModel.js
var GlobalCustomAttributeUpdateApiModel = class _GlobalCustomAttributeUpdateApiModel {
  /**
   * Constructs a new <code>GlobalCustomAttributeUpdateApiModel</code>.
   * @alias module:model/GlobalCustomAttributeUpdateApiModel
   * @param name {String} Name of attribute
   */
  constructor(name) {
    _GlobalCustomAttributeUpdateApiModel.initialize(this, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name) {
    obj["name"] = name;
  }
  /**
   * Constructs a <code>GlobalCustomAttributeUpdateApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/GlobalCustomAttributeUpdateApiModel} obj Optional instance to populate.
   * @return {module:model/GlobalCustomAttributeUpdateApiModel} The populated <code>GlobalCustomAttributeUpdateApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _GlobalCustomAttributeUpdateApiModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("options")) {
        obj["options"] = ApiClient_default.convertToType(data["options"], [CustomAttributeOptionUpdateApiModel_default]);
      }
      if (data.hasOwnProperty("isEnabled")) {
        obj["isEnabled"] = ApiClient_default.convertToType(data["isEnabled"], "Boolean");
      }
      if (data.hasOwnProperty("isRequired")) {
        obj["isRequired"] = ApiClient_default.convertToType(data["isRequired"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>GlobalCustomAttributeUpdateApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>GlobalCustomAttributeUpdateApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _GlobalCustomAttributeUpdateApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["options"]) {
      if (!Array.isArray(data["options"])) {
        throw new Error("Expected the field `options` to be an array in the JSON data but got " + data["options"]);
      }
      for (const item of data["options"]) {
        CustomAttributeOptionUpdateApiModel_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
GlobalCustomAttributeUpdateApiModel.RequiredProperties = ["name"];
GlobalCustomAttributeUpdateApiModel.prototype["name"] = void 0;
GlobalCustomAttributeUpdateApiModel.prototype["options"] = void 0;
GlobalCustomAttributeUpdateApiModel.prototype["isEnabled"] = void 0;
GlobalCustomAttributeUpdateApiModel.prototype["isRequired"] = void 0;

// src/adaptersapi/model/GuidExtractionModel.js
var GuidExtractionModel = class _GuidExtractionModel {
  /**
   * Constructs a new <code>GuidExtractionModel</code>.
   * @alias module:model/GuidExtractionModel
   */
  constructor() {
    _GuidExtractionModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>GuidExtractionModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/GuidExtractionModel} obj Optional instance to populate.
   * @return {module:model/GuidExtractionModel} The populated <code>GuidExtractionModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _GuidExtractionModel();
      if (data.hasOwnProperty("include")) {
        obj["include"] = ApiClient_default.convertToType(data["include"], ["String"]);
      }
      if (data.hasOwnProperty("exclude")) {
        obj["exclude"] = ApiClient_default.convertToType(data["exclude"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>GuidExtractionModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>GuidExtractionModel</code>.
   */
  static validateJSON(data) {
    if (!Array.isArray(data["include"])) {
      throw new Error("Expected the field `include` to be an array in the JSON data but got " + data["include"]);
    }
    if (!Array.isArray(data["exclude"])) {
      throw new Error("Expected the field `exclude` to be an array in the JSON data but got " + data["exclude"]);
    }
    return true;
  }
};
GuidExtractionModel.prototype["include"] = void 0;
GuidExtractionModel.prototype["exclude"] = void 0;
var GuidExtractionModel_default = GuidExtractionModel;

// src/adaptersapi/model/Int32RangeSelectorModel.js
var Int32RangeSelectorModel = class _Int32RangeSelectorModel {
  /**
   * Constructs a new <code>Int32RangeSelectorModel</code>.
   * @alias module:model/Int32RangeSelectorModel
   */
  constructor() {
    _Int32RangeSelectorModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>Int32RangeSelectorModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Int32RangeSelectorModel} obj Optional instance to populate.
   * @return {module:model/Int32RangeSelectorModel} The populated <code>Int32RangeSelectorModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _Int32RangeSelectorModel();
      if (data.hasOwnProperty("from")) {
        obj["from"] = ApiClient_default.convertToType(data["from"], "Number");
      }
      if (data.hasOwnProperty("to")) {
        obj["to"] = ApiClient_default.convertToType(data["to"], "Number");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>Int32RangeSelectorModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Int32RangeSelectorModel</code>.
   */
  static validateJSON(data) {
    return true;
  }
};
Int32RangeSelectorModel.prototype["from"] = void 0;
Int32RangeSelectorModel.prototype["to"] = void 0;
var Int32RangeSelectorModel_default = Int32RangeSelectorModel;

// src/adaptersapi/model/Int64RangeSelectorModel.js
var Int64RangeSelectorModel = class _Int64RangeSelectorModel {
  /**
   * Constructs a new <code>Int64RangeSelectorModel</code>.
   * @alias module:model/Int64RangeSelectorModel
   */
  constructor() {
    _Int64RangeSelectorModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>Int64RangeSelectorModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Int64RangeSelectorModel} obj Optional instance to populate.
   * @return {module:model/Int64RangeSelectorModel} The populated <code>Int64RangeSelectorModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _Int64RangeSelectorModel();
      if (data.hasOwnProperty("from")) {
        obj["from"] = ApiClient_default.convertToType(data["from"], "Number");
      }
      if (data.hasOwnProperty("to")) {
        obj["to"] = ApiClient_default.convertToType(data["to"], "Number");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>Int64RangeSelectorModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Int64RangeSelectorModel</code>.
   */
  static validateJSON(data) {
    return true;
  }
};
Int64RangeSelectorModel.prototype["from"] = void 0;
Int64RangeSelectorModel.prototype["to"] = void 0;
var Int64RangeSelectorModel_default = Int64RangeSelectorModel;

// src/adaptersapi/model/ParameterShortApiResult.js
var ParameterShortApiResult = class _ParameterShortApiResult {
  /**
   * Constructs a new <code>ParameterShortApiResult</code>.
   * @alias module:model/ParameterShortApiResult
   * @param id {String} 
   * @param parameterKeyId {String} 
   * @param value {String} Value of the parameter
   * @param name {String} Key of the parameter
   */
  constructor(id, parameterKeyId, value, name) {
    _ParameterShortApiResult.initialize(this, id, parameterKeyId, value, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, parameterKeyId, value, name) {
    obj["id"] = id;
    obj["parameterKeyId"] = parameterKeyId;
    obj["value"] = value;
    obj["name"] = name;
  }
  /**
   * Constructs a <code>ParameterShortApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ParameterShortApiResult} obj Optional instance to populate.
   * @return {module:model/ParameterShortApiResult} The populated <code>ParameterShortApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ParameterShortApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("parameterKeyId")) {
        obj["parameterKeyId"] = ApiClient_default.convertToType(data["parameterKeyId"], "String");
      }
      if (data.hasOwnProperty("value")) {
        obj["value"] = ApiClient_default.convertToType(data["value"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ParameterShortApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ParameterShortApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _ParameterShortApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["parameterKeyId"] && !(typeof data["parameterKeyId"] === "string" || data["parameterKeyId"] instanceof String)) {
      throw new Error("Expected the field `parameterKeyId` to be a primitive type in the JSON string but got " + data["parameterKeyId"]);
    }
    if (data["value"] && !(typeof data["value"] === "string" || data["value"] instanceof String)) {
      throw new Error("Expected the field `value` to be a primitive type in the JSON string but got " + data["value"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
ParameterShortApiResult.RequiredProperties = ["id", "parameterKeyId", "value", "name"];
ParameterShortApiResult.prototype["id"] = void 0;
ParameterShortApiResult.prototype["parameterKeyId"] = void 0;
ParameterShortApiResult.prototype["value"] = void 0;
ParameterShortApiResult.prototype["name"] = void 0;
var ParameterShortApiResult_default = ParameterShortApiResult;

// src/adaptersapi/model/IterationApiResult.js
var IterationApiResult = class _IterationApiResult {
  /**
   * Constructs a new <code>IterationApiResult</code>.
   * @alias module:model/IterationApiResult
   * @param id {String} 
   */
  constructor(id) {
    _IterationApiResult.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>IterationApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/IterationApiResult} obj Optional instance to populate.
   * @return {module:model/IterationApiResult} The populated <code>IterationApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _IterationApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], [ParameterShortApiResult_default]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>IterationApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>IterationApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _IterationApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["parameters"]) {
      if (!Array.isArray(data["parameters"])) {
        throw new Error("Expected the field `parameters` to be an array in the JSON data but got " + data["parameters"]);
      }
      for (const item of data["parameters"]) {
        ParameterShortApiResult_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
IterationApiResult.RequiredProperties = ["id"];
IterationApiResult.prototype["id"] = void 0;
IterationApiResult.prototype["parameters"] = void 0;
var IterationApiResult_default = IterationApiResult;

// src/adaptersapi/model/ParameterShortModel.js
var ParameterShortModel = class _ParameterShortModel {
  /**
   * Constructs a new <code>ParameterShortModel</code>.
   * @alias module:model/ParameterShortModel
   * @param id {String} 
   * @param parameterKeyId {String} 
   * @param value {String} Value of the parameter
   * @param name {String} Key of the parameter
   * @param projectIds {Array.<String>} 
   */
  constructor(id, parameterKeyId, value, name, projectIds) {
    _ParameterShortModel.initialize(this, id, parameterKeyId, value, name, projectIds);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, parameterKeyId, value, name, projectIds) {
    obj["id"] = id;
    obj["parameterKeyId"] = parameterKeyId;
    obj["value"] = value;
    obj["name"] = name;
    obj["projectIds"] = projectIds;
  }
  /**
   * Constructs a <code>ParameterShortModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ParameterShortModel} obj Optional instance to populate.
   * @return {module:model/ParameterShortModel} The populated <code>ParameterShortModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ParameterShortModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("sharedStepId")) {
        obj["sharedStepId"] = ApiClient_default.convertToType(data["sharedStepId"], "String");
      }
      if (data.hasOwnProperty("parameterKeyId")) {
        obj["parameterKeyId"] = ApiClient_default.convertToType(data["parameterKeyId"], "String");
      }
      if (data.hasOwnProperty("value")) {
        obj["value"] = ApiClient_default.convertToType(data["value"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("projectIds")) {
        obj["projectIds"] = ApiClient_default.convertToType(data["projectIds"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ParameterShortModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ParameterShortModel</code>.
   */
  static validateJSON(data) {
    for (const property of _ParameterShortModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["sharedStepId"] && !(typeof data["sharedStepId"] === "string" || data["sharedStepId"] instanceof String)) {
      throw new Error("Expected the field `sharedStepId` to be a primitive type in the JSON string but got " + data["sharedStepId"]);
    }
    if (data["parameterKeyId"] && !(typeof data["parameterKeyId"] === "string" || data["parameterKeyId"] instanceof String)) {
      throw new Error("Expected the field `parameterKeyId` to be a primitive type in the JSON string but got " + data["parameterKeyId"]);
    }
    if (data["value"] && !(typeof data["value"] === "string" || data["value"] instanceof String)) {
      throw new Error("Expected the field `value` to be a primitive type in the JSON string but got " + data["value"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (!Array.isArray(data["projectIds"])) {
      throw new Error("Expected the field `projectIds` to be an array in the JSON data but got " + data["projectIds"]);
    }
    return true;
  }
};
ParameterShortModel.RequiredProperties = ["id", "parameterKeyId", "value", "name", "projectIds"];
ParameterShortModel.prototype["id"] = void 0;
ParameterShortModel.prototype["sharedStepId"] = void 0;
ParameterShortModel.prototype["parameterKeyId"] = void 0;
ParameterShortModel.prototype["value"] = void 0;
ParameterShortModel.prototype["name"] = void 0;
ParameterShortModel.prototype["projectIds"] = void 0;
var ParameterShortModel_default = ParameterShortModel;

// src/adaptersapi/model/IterationModel.js
var IterationModel = class _IterationModel {
  /**
   * Constructs a new <code>IterationModel</code>.
   * @alias module:model/IterationModel
   * @param id {String} 
   */
  constructor(id) {
    _IterationModel.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>IterationModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/IterationModel} obj Optional instance to populate.
   * @return {module:model/IterationModel} The populated <code>IterationModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _IterationModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], [ParameterShortModel_default]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>IterationModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>IterationModel</code>.
   */
  static validateJSON(data) {
    for (const property of _IterationModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["parameters"]) {
      if (!Array.isArray(data["parameters"])) {
        throw new Error("Expected the field `parameters` to be an array in the JSON data but got " + data["parameters"]);
      }
      for (const item of data["parameters"]) {
        ParameterShortModel_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
IterationModel.RequiredProperties = ["id"];
IterationModel.prototype["id"] = void 0;
IterationModel.prototype["parameters"] = void 0;
var IterationModel_default = IterationModel;

// src/adaptersapi/model/LinkModel.js
var LinkModel = class _LinkModel {
  /**
   * Constructs a new <code>LinkModel</code>.
   * @alias module:model/LinkModel
   * @param url {String} Address can be specified without protocol, but necessarily with the domain.
   * @param type {module:model/LinkType} Specifies the type of the link.
   * @param hasInfo {Boolean} 
   */
  constructor(url, type, hasInfo) {
    _LinkModel.initialize(this, url, type, hasInfo);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, url, type, hasInfo) {
    obj["url"] = url;
    obj["type"] = type;
    obj["hasInfo"] = hasInfo;
  }
  /**
   * Constructs a <code>LinkModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LinkModel} obj Optional instance to populate.
   * @return {module:model/LinkModel} The populated <code>LinkModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LinkModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("url")) {
        obj["url"] = ApiClient_default.convertToType(data["url"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], LinkType);
      }
      if (data.hasOwnProperty("hasInfo")) {
        obj["hasInfo"] = ApiClient_default.convertToType(data["hasInfo"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LinkModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LinkModel</code>.
   */
  static validateJSON(data) {
    for (const property of _LinkModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["url"] && !(typeof data["url"] === "string" || data["url"] instanceof String)) {
      throw new Error("Expected the field `url` to be a primitive type in the JSON string but got " + data["url"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    return true;
  }
};
LinkModel.RequiredProperties = ["url", "type", "hasInfo"];
LinkModel.prototype["id"] = void 0;
LinkModel.prototype["title"] = void 0;
LinkModel.prototype["url"] = void 0;
LinkModel.prototype["description"] = void 0;
LinkModel.prototype["type"] = void 0;
LinkModel.prototype["hasInfo"] = void 0;
var LinkModel_default = LinkModel;

// src/adaptersapi/model/LinkShortApiResult.js
var LinkShortApiResult = class _LinkShortApiResult {
  /**
   * Constructs a new <code>LinkShortApiResult</code>.
   * @alias module:model/LinkShortApiResult
   * @param id {String} 
   * @param url {String} 
   */
  constructor(id, url) {
    _LinkShortApiResult.initialize(this, id, url);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, url) {
    obj["id"] = id;
    obj["url"] = url;
  }
  /**
   * Constructs a <code>LinkShortApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/LinkShortApiResult} obj Optional instance to populate.
   * @return {module:model/LinkShortApiResult} The populated <code>LinkShortApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _LinkShortApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("url")) {
        obj["url"] = ApiClient_default.convertToType(data["url"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>LinkShortApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>LinkShortApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _LinkShortApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["url"] && !(typeof data["url"] === "string" || data["url"] instanceof String)) {
      throw new Error("Expected the field `url` to be a primitive type in the JSON string but got " + data["url"]);
    }
    if (data["type"] && !(typeof data["type"] === "string" || data["type"] instanceof String)) {
      throw new Error("Expected the field `type` to be a primitive type in the JSON string but got " + data["type"]);
    }
    return true;
  }
};
LinkShortApiResult.RequiredProperties = ["id", "url"];
LinkShortApiResult.prototype["id"] = void 0;
LinkShortApiResult.prototype["title"] = void 0;
LinkShortApiResult.prototype["url"] = void 0;
LinkShortApiResult.prototype["type"] = void 0;
var LinkShortApiResult_default = LinkShortApiResult;

// src/adaptersapi/model/ManualRerunApiResult.js
var ManualRerunApiResult = class _ManualRerunApiResult {
  /**
   * Constructs a new <code>ManualRerunApiResult</code>.
   * @alias module:model/ManualRerunApiResult
   * @param testResultsCount {Number} 
   */
  constructor(testResultsCount) {
    _ManualRerunApiResult.initialize(this, testResultsCount);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, testResultsCount) {
    obj["testResultsCount"] = testResultsCount;
  }
  /**
   * Constructs a <code>ManualRerunApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ManualRerunApiResult} obj Optional instance to populate.
   * @return {module:model/ManualRerunApiResult} The populated <code>ManualRerunApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ManualRerunApiResult();
      if (data.hasOwnProperty("testResultsCount")) {
        obj["testResultsCount"] = ApiClient_default.convertToType(data["testResultsCount"], "Number");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ManualRerunApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ManualRerunApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _ManualRerunApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    return true;
  }
};
ManualRerunApiResult.RequiredProperties = ["testResultsCount"];
ManualRerunApiResult.prototype["testResultsCount"] = void 0;

// src/adaptersapi/model/ManualRerunTestResultApiModel.js
var ManualRerunTestResultApiModel = class _ManualRerunTestResultApiModel {
  /**
   * Constructs a new <code>ManualRerunTestResultApiModel</code>.
   * @alias module:model/ManualRerunTestResultApiModel
   */
  constructor() {
    _ManualRerunTestResultApiModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>ManualRerunTestResultApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ManualRerunTestResultApiModel} obj Optional instance to populate.
   * @return {module:model/ManualRerunTestResultApiModel} The populated <code>ManualRerunTestResultApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ManualRerunTestResultApiModel();
      if (data.hasOwnProperty("testResultIds")) {
        obj["testResultIds"] = ApiClient_default.convertToType(data["testResultIds"], GuidExtractionModel_default);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ManualRerunTestResultApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ManualRerunTestResultApiModel</code>.
   */
  static validateJSON(data) {
    if (data["testResultIds"]) {
      GuidExtractionModel_default.validateJSON(data["testResultIds"]);
    }
    return true;
  }
};
ManualRerunTestResultApiModel.prototype["testResultIds"] = void 0;
var ManualRerunTestResultApiModel_default = ManualRerunTestResultApiModel;

// src/adaptersapi/model/TestResultOutcome.js
var TestResultOutcome = class {
  /**
   * value: "InProgress"
   * @const
   */
  "InProgress" = "InProgress";
  /**
   * value: "Passed"
   * @const
   */
  "Passed" = "Passed";
  /**
   * value: "Failed"
   * @const
   */
  "Failed" = "Failed";
  /**
   * value: "Skipped"
   * @const
   */
  "Skipped" = "Skipped";
  /**
   * value: "Blocked"
   * @const
   */
  "Blocked" = "Blocked";
  /**
  * Returns a <code>TestResultOutcome</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/TestResultOutcome} The enum <code>TestResultOutcome</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/TestResultsFilterApiModel.js
var TestResultsFilterApiModel = class _TestResultsFilterApiModel {
  /**
   * Constructs a new <code>TestResultsFilterApiModel</code>.
   * @alias module:model/TestResultsFilterApiModel
   */
  constructor() {
    _TestResultsFilterApiModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>TestResultsFilterApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TestResultsFilterApiModel} obj Optional instance to populate.
   * @return {module:model/TestResultsFilterApiModel} The populated <code>TestResultsFilterApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _TestResultsFilterApiModel();
      if (data.hasOwnProperty("configurationIds")) {
        obj["configurationIds"] = ApiClient_default.convertToType(data["configurationIds"], ["String"]);
      }
      if (data.hasOwnProperty("outcomes")) {
        obj["outcomes"] = ApiClient_default.convertToType(data["outcomes"], [TestResultOutcome]);
      }
      if (data.hasOwnProperty("statusCodes")) {
        obj["statusCodes"] = ApiClient_default.convertToType(data["statusCodes"], ["String"]);
      }
      if (data.hasOwnProperty("statusTypes")) {
        obj["statusTypes"] = ApiClient_default.convertToType(data["statusTypes"], [TestStatusApiType]);
      }
      if (data.hasOwnProperty("failureCategories")) {
        obj["failureCategories"] = ApiClient_default.convertToType(data["failureCategories"], [FailureCategoryModel]);
      }
      if (data.hasOwnProperty("namespace")) {
        obj["namespace"] = ApiClient_default.convertToType(data["namespace"], "String");
      }
      if (data.hasOwnProperty("className")) {
        obj["className"] = ApiClient_default.convertToType(data["className"], "String");
      }
      if (data.hasOwnProperty("autoTestGlobalIds")) {
        obj["autoTestGlobalIds"] = ApiClient_default.convertToType(data["autoTestGlobalIds"], ["Number"]);
      }
      if (data.hasOwnProperty("autoTestTags")) {
        obj["autoTestTags"] = ApiClient_default.convertToType(data["autoTestTags"], ["String"]);
      }
      if (data.hasOwnProperty("excludeAutoTestTags")) {
        obj["excludeAutoTestTags"] = ApiClient_default.convertToType(data["excludeAutoTestTags"], ["String"]);
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], Int64RangeSelectorModel_default);
      }
      if (data.hasOwnProperty("testRunIds")) {
        obj["testRunIds"] = ApiClient_default.convertToType(data["testRunIds"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>TestResultsFilterApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TestResultsFilterApiModel</code>.
   */
  static validateJSON(data) {
    if (!Array.isArray(data["configurationIds"])) {
      throw new Error("Expected the field `configurationIds` to be an array in the JSON data but got " + data["configurationIds"]);
    }
    if (!Array.isArray(data["outcomes"])) {
      throw new Error("Expected the field `outcomes` to be an array in the JSON data but got " + data["outcomes"]);
    }
    if (!Array.isArray(data["statusCodes"])) {
      throw new Error("Expected the field `statusCodes` to be an array in the JSON data but got " + data["statusCodes"]);
    }
    if (!Array.isArray(data["statusTypes"])) {
      throw new Error("Expected the field `statusTypes` to be an array in the JSON data but got " + data["statusTypes"]);
    }
    if (!Array.isArray(data["failureCategories"])) {
      throw new Error("Expected the field `failureCategories` to be an array in the JSON data but got " + data["failureCategories"]);
    }
    if (data["namespace"] && !(typeof data["namespace"] === "string" || data["namespace"] instanceof String)) {
      throw new Error("Expected the field `namespace` to be a primitive type in the JSON string but got " + data["namespace"]);
    }
    if (data["className"] && !(typeof data["className"] === "string" || data["className"] instanceof String)) {
      throw new Error("Expected the field `className` to be a primitive type in the JSON string but got " + data["className"]);
    }
    if (!Array.isArray(data["autoTestGlobalIds"])) {
      throw new Error("Expected the field `autoTestGlobalIds` to be an array in the JSON data but got " + data["autoTestGlobalIds"]);
    }
    if (!Array.isArray(data["autoTestTags"])) {
      throw new Error("Expected the field `autoTestTags` to be an array in the JSON data but got " + data["autoTestTags"]);
    }
    if (!Array.isArray(data["excludeAutoTestTags"])) {
      throw new Error("Expected the field `excludeAutoTestTags` to be an array in the JSON data but got " + data["excludeAutoTestTags"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["duration"]) {
      Int64RangeSelectorModel_default.validateJSON(data["duration"]);
    }
    if (!Array.isArray(data["testRunIds"])) {
      throw new Error("Expected the field `testRunIds` to be an array in the JSON data but got " + data["testRunIds"]);
    }
    return true;
  }
};
TestResultsFilterApiModel.prototype["configurationIds"] = void 0;
TestResultsFilterApiModel.prototype["outcomes"] = void 0;
TestResultsFilterApiModel.prototype["statusCodes"] = void 0;
TestResultsFilterApiModel.prototype["statusTypes"] = void 0;
TestResultsFilterApiModel.prototype["failureCategories"] = void 0;
TestResultsFilterApiModel.prototype["namespace"] = void 0;
TestResultsFilterApiModel.prototype["className"] = void 0;
TestResultsFilterApiModel.prototype["autoTestGlobalIds"] = void 0;
TestResultsFilterApiModel.prototype["autoTestTags"] = void 0;
TestResultsFilterApiModel.prototype["excludeAutoTestTags"] = void 0;
TestResultsFilterApiModel.prototype["name"] = void 0;
TestResultsFilterApiModel.prototype["duration"] = void 0;
TestResultsFilterApiModel.prototype["testRunIds"] = void 0;
var TestResultsFilterApiModel_default = TestResultsFilterApiModel;

// src/adaptersapi/model/ManualRerunSelectTestResultsApiModel.js
var ManualRerunSelectTestResultsApiModel = class _ManualRerunSelectTestResultsApiModel {
  /**
   * Constructs a new <code>ManualRerunSelectTestResultsApiModel</code>.
   * @alias module:model/ManualRerunSelectTestResultsApiModel
   */
  constructor() {
    _ManualRerunSelectTestResultsApiModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>ManualRerunSelectTestResultsApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ManualRerunSelectTestResultsApiModel} obj Optional instance to populate.
   * @return {module:model/ManualRerunSelectTestResultsApiModel} The populated <code>ManualRerunSelectTestResultsApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ManualRerunSelectTestResultsApiModel();
      if (data.hasOwnProperty("filter")) {
        obj["filter"] = ApiClient_default.convertToType(data["filter"], TestResultsFilterApiModel_default);
      }
      if (data.hasOwnProperty("extractionModel")) {
        obj["extractionModel"] = ApiClient_default.convertToType(data["extractionModel"], ManualRerunTestResultApiModel_default);
      }
      if (data.hasOwnProperty("webhookIds")) {
        obj["webhookIds"] = ApiClient_default.convertToType(data["webhookIds"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ManualRerunSelectTestResultsApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ManualRerunSelectTestResultsApiModel</code>.
   */
  static validateJSON(data) {
    if (data["filter"]) {
      TestResultsFilterApiModel_default.validateJSON(data["filter"]);
    }
    if (data["extractionModel"]) {
      ManualRerunTestResultApiModel_default.validateJSON(data["extractionModel"]);
    }
    if (!Array.isArray(data["webhookIds"])) {
      throw new Error("Expected the field `webhookIds` to be an array in the JSON data but got " + data["webhookIds"]);
    }
    return true;
  }
};
ManualRerunSelectTestResultsApiModel.prototype["filter"] = void 0;
ManualRerunSelectTestResultsApiModel.prototype["extractionModel"] = void 0;
ManualRerunSelectTestResultsApiModel.prototype["webhookIds"] = void 0;

// src/adaptersapi/model/Operation.js
var Operation = class _Operation {
  /**
   * Constructs a new <code>Operation</code>.
   * @alias module:model/Operation
   */
  constructor() {
    _Operation.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>Operation</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Operation} obj Optional instance to populate.
   * @return {module:model/Operation} The populated <code>Operation</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _Operation();
      if (data.hasOwnProperty("value")) {
        obj["value"] = ApiClient_default.convertToType(data["value"], Object);
      }
      if (data.hasOwnProperty("path")) {
        obj["path"] = ApiClient_default.convertToType(data["path"], "String");
      }
      if (data.hasOwnProperty("op")) {
        obj["op"] = ApiClient_default.convertToType(data["op"], "String");
      }
      if (data.hasOwnProperty("from")) {
        obj["from"] = ApiClient_default.convertToType(data["from"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>Operation</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>Operation</code>.
   */
  static validateJSON(data) {
    if (data["path"] && !(typeof data["path"] === "string" || data["path"] instanceof String)) {
      throw new Error("Expected the field `path` to be a primitive type in the JSON string but got " + data["path"]);
    }
    if (data["op"] && !(typeof data["op"] === "string" || data["op"] instanceof String)) {
      throw new Error("Expected the field `op` to be a primitive type in the JSON string but got " + data["op"]);
    }
    if (data["from"] && !(typeof data["from"] === "string" || data["from"] instanceof String)) {
      throw new Error("Expected the field `from` to be a primitive type in the JSON string but got " + data["from"]);
    }
    return true;
  }
};
Operation.prototype["value"] = void 0;
Operation.prototype["path"] = void 0;
Operation.prototype["op"] = void 0;
Operation.prototype["from"] = void 0;

// src/adaptersapi/model/ParameterApiResult.js
var ParameterApiResult = class _ParameterApiResult {
  /**
   * Constructs a new <code>ParameterApiResult</code>.
   * @alias module:model/ParameterApiResult
   * @param id {String} 
   * @param parameterKeyId {String} 
   * @param name {String} 
   * @param value {String} 
   * @param isDeleted {Boolean} 
   * @param projectIds {Array.<String>} 
   */
  constructor(id, parameterKeyId, name, value, isDeleted, projectIds) {
    _ParameterApiResult.initialize(this, id, parameterKeyId, name, value, isDeleted, projectIds);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, parameterKeyId, name, value, isDeleted, projectIds) {
    obj["id"] = id;
    obj["parameterKeyId"] = parameterKeyId;
    obj["name"] = name;
    obj["value"] = value;
    obj["isDeleted"] = isDeleted;
    obj["projectIds"] = projectIds;
  }
  /**
   * Constructs a <code>ParameterApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ParameterApiResult} obj Optional instance to populate.
   * @return {module:model/ParameterApiResult} The populated <code>ParameterApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ParameterApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("parameterKeyId")) {
        obj["parameterKeyId"] = ApiClient_default.convertToType(data["parameterKeyId"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("value")) {
        obj["value"] = ApiClient_default.convertToType(data["value"], "String");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("projectIds")) {
        obj["projectIds"] = ApiClient_default.convertToType(data["projectIds"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ParameterApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ParameterApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _ParameterApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["parameterKeyId"] && !(typeof data["parameterKeyId"] === "string" || data["parameterKeyId"] instanceof String)) {
      throw new Error("Expected the field `parameterKeyId` to be a primitive type in the JSON string but got " + data["parameterKeyId"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["value"] && !(typeof data["value"] === "string" || data["value"] instanceof String)) {
      throw new Error("Expected the field `value` to be a primitive type in the JSON string but got " + data["value"]);
    }
    if (!Array.isArray(data["projectIds"])) {
      throw new Error("Expected the field `projectIds` to be an array in the JSON data but got " + data["projectIds"]);
    }
    return true;
  }
};
ParameterApiResult.RequiredProperties = ["id", "parameterKeyId", "name", "value", "isDeleted", "projectIds"];
ParameterApiResult.prototype["id"] = void 0;
ParameterApiResult.prototype["parameterKeyId"] = void 0;
ParameterApiResult.prototype["name"] = void 0;
ParameterApiResult.prototype["value"] = void 0;
ParameterApiResult.prototype["isDeleted"] = void 0;
ParameterApiResult.prototype["projectIds"] = void 0;

// src/adaptersapi/model/ParametersFilterApiModel.js
var ParametersFilterApiModel = class _ParametersFilterApiModel {
  /**
   * Constructs a new <code>ParametersFilterApiModel</code>.
   * @alias module:model/ParametersFilterApiModel
   */
  constructor() {
    _ParametersFilterApiModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>ParametersFilterApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ParametersFilterApiModel} obj Optional instance to populate.
   * @return {module:model/ParametersFilterApiModel} The populated <code>ParametersFilterApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ParametersFilterApiModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("projectIds")) {
        obj["projectIds"] = ApiClient_default.convertToType(data["projectIds"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ParametersFilterApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ParametersFilterApiModel</code>.
   */
  static validateJSON(data) {
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (!Array.isArray(data["projectIds"])) {
      throw new Error("Expected the field `projectIds` to be an array in the JSON data but got " + data["projectIds"]);
    }
    return true;
  }
};
ParametersFilterApiModel.prototype["name"] = void 0;
ParametersFilterApiModel.prototype["isDeleted"] = void 0;
ParametersFilterApiModel.prototype["projectIds"] = void 0;

// src/adaptersapi/model/ProblemDetails.js
var ProblemDetails = class _ProblemDetails {
  /**
   * Constructs a new <code>ProblemDetails</code>.
   * @alias module:model/ProblemDetails
   * @extends Object
   */
  constructor() {
    _ProblemDetails.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>ProblemDetails</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProblemDetails} obj Optional instance to populate.
   * @return {module:model/ProblemDetails} The populated <code>ProblemDetails</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ProblemDetails();
      ApiClient_default.constructFromObject(data, obj, "Object");
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("status")) {
        obj["status"] = ApiClient_default.convertToType(data["status"], "Number");
      }
      if (data.hasOwnProperty("detail")) {
        obj["detail"] = ApiClient_default.convertToType(data["detail"], "String");
      }
      if (data.hasOwnProperty("instance")) {
        obj["instance"] = ApiClient_default.convertToType(data["instance"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ProblemDetails</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ProblemDetails</code>.
   */
  static validateJSON(data) {
    if (data["type"] && !(typeof data["type"] === "string" || data["type"] instanceof String)) {
      throw new Error("Expected the field `type` to be a primitive type in the JSON string but got " + data["type"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["detail"] && !(typeof data["detail"] === "string" || data["detail"] instanceof String)) {
      throw new Error("Expected the field `detail` to be a primitive type in the JSON string but got " + data["detail"]);
    }
    if (data["instance"] && !(typeof data["instance"] === "string" || data["instance"] instanceof String)) {
      throw new Error("Expected the field `instance` to be a primitive type in the JSON string but got " + data["instance"]);
    }
    return true;
  }
};
ProblemDetails.prototype["type"] = void 0;
ProblemDetails.prototype["title"] = void 0;
ProblemDetails.prototype["status"] = void 0;
ProblemDetails.prototype["detail"] = void 0;
ProblemDetails.prototype["instance"] = void 0;

// src/adaptersapi/model/ProjectApiResult.js
var ProjectApiResult = class _ProjectApiResult {
  /**
   * Constructs a new <code>ProjectApiResult</code>.
   * @alias module:model/ProjectApiResult
   * @param id {String} Unique ID of the project
   * @param name {String} Name of the project
   * @param isFavorite {Boolean} Indicates if the project is marked as favorite
   * @param isDeleted {Boolean} Indicates if the project is deleted
   * @param globalId {Number} Global ID of the project
   * @param workflowId {String} ID of the workflow used in project
   */
  constructor(id, name, isFavorite, isDeleted, globalId, workflowId) {
    _ProjectApiResult.initialize(this, id, name, isFavorite, isDeleted, globalId, workflowId);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, name, isFavorite, isDeleted, globalId, workflowId) {
    obj["id"] = id;
    obj["name"] = name;
    obj["isFavorite"] = isFavorite;
    obj["isDeleted"] = isDeleted;
    obj["globalId"] = globalId;
    obj["workflowId"] = workflowId;
  }
  /**
   * Constructs a <code>ProjectApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProjectApiResult} obj Optional instance to populate.
   * @return {module:model/ProjectApiResult} The populated <code>ProjectApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ProjectApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isFavorite")) {
        obj["isFavorite"] = ApiClient_default.convertToType(data["isFavorite"], "Boolean");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("workflowId")) {
        obj["workflowId"] = ApiClient_default.convertToType(data["workflowId"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ProjectApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ProjectApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _ProjectApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["workflowId"] && !(typeof data["workflowId"] === "string" || data["workflowId"] instanceof String)) {
      throw new Error("Expected the field `workflowId` to be a primitive type in the JSON string but got " + data["workflowId"]);
    }
    return true;
  }
};
ProjectApiResult.RequiredProperties = ["id", "name", "isFavorite", "isDeleted", "globalId", "workflowId"];
ProjectApiResult.prototype["id"] = void 0;
ProjectApiResult.prototype["description"] = void 0;
ProjectApiResult.prototype["name"] = void 0;
ProjectApiResult.prototype["isFavorite"] = void 0;
ProjectApiResult.prototype["isDeleted"] = void 0;
ProjectApiResult.prototype["globalId"] = void 0;
ProjectApiResult.prototype["workflowId"] = void 0;

// src/adaptersapi/model/ProjectAttributesFilterModel.js
var ProjectAttributesFilterModel = class _ProjectAttributesFilterModel {
  /**
   * Constructs a new <code>ProjectAttributesFilterModel</code>.
   * @alias module:model/ProjectAttributesFilterModel
   * @param name {String} Specifies an attribute name to search for
   * @param types {Array.<module:model/CustomAttributeTypesEnum>} Specifies an attribute types to search for
   */
  constructor(name, types) {
    _ProjectAttributesFilterModel.initialize(this, name, types);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name, types) {
    obj["name"] = name;
    obj["types"] = types;
  }
  /**
   * Constructs a <code>ProjectAttributesFilterModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProjectAttributesFilterModel} obj Optional instance to populate.
   * @return {module:model/ProjectAttributesFilterModel} The populated <code>ProjectAttributesFilterModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ProjectAttributesFilterModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isRequired")) {
        obj["isRequired"] = ApiClient_default.convertToType(data["isRequired"], "Boolean");
      }
      if (data.hasOwnProperty("isGlobal")) {
        obj["isGlobal"] = ApiClient_default.convertToType(data["isGlobal"], "Boolean");
      }
      if (data.hasOwnProperty("types")) {
        obj["types"] = ApiClient_default.convertToType(data["types"], [CustomAttributeTypesEnum]);
      }
      if (data.hasOwnProperty("isEnabled")) {
        obj["isEnabled"] = ApiClient_default.convertToType(data["isEnabled"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ProjectAttributesFilterModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ProjectAttributesFilterModel</code>.
   */
  static validateJSON(data) {
    for (const property of _ProjectAttributesFilterModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (!Array.isArray(data["types"])) {
      throw new Error("Expected the field `types` to be an array in the JSON data but got " + data["types"]);
    }
    return true;
  }
};
ProjectAttributesFilterModel.RequiredProperties = ["name", "types"];
ProjectAttributesFilterModel.prototype["name"] = void 0;
ProjectAttributesFilterModel.prototype["isRequired"] = void 0;
ProjectAttributesFilterModel.prototype["isGlobal"] = void 0;
ProjectAttributesFilterModel.prototype["types"] = void 0;
ProjectAttributesFilterModel.prototype["isEnabled"] = void 0;

// src/adaptersapi/model/ProjectsFilterModel.js
var ProjectsFilterModel = class _ProjectsFilterModel {
  /**
   * Constructs a new <code>ProjectsFilterModel</code>.
   * @alias module:model/ProjectsFilterModel
   */
  constructor() {
    _ProjectsFilterModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>ProjectsFilterModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProjectsFilterModel} obj Optional instance to populate.
   * @return {module:model/ProjectsFilterModel} The populated <code>ProjectsFilterModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ProjectsFilterModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("isFavorite")) {
        obj["isFavorite"] = ApiClient_default.convertToType(data["isFavorite"], "Boolean");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("testCasesCount")) {
        obj["testCasesCount"] = ApiClient_default.convertToType(data["testCasesCount"], Int64RangeSelectorModel_default);
      }
      if (data.hasOwnProperty("checklistsCount")) {
        obj["checklistsCount"] = ApiClient_default.convertToType(data["checklistsCount"], Int64RangeSelectorModel_default);
      }
      if (data.hasOwnProperty("sharedStepsCount")) {
        obj["sharedStepsCount"] = ApiClient_default.convertToType(data["sharedStepsCount"], Int64RangeSelectorModel_default);
      }
      if (data.hasOwnProperty("autotestsCount")) {
        obj["autotestsCount"] = ApiClient_default.convertToType(data["autotestsCount"], Int64RangeSelectorModel_default);
      }
      if (data.hasOwnProperty("globalIds")) {
        obj["globalIds"] = ApiClient_default.convertToType(data["globalIds"], ["Number"]);
      }
      if (data.hasOwnProperty("createdDate")) {
        obj["createdDate"] = ApiClient_default.convertToType(data["createdDate"], DateTimeRangeSelectorModel_default);
      }
      if (data.hasOwnProperty("createdByIds")) {
        obj["createdByIds"] = ApiClient_default.convertToType(data["createdByIds"], ["String"]);
      }
      if (data.hasOwnProperty("types")) {
        obj["types"] = ApiClient_default.convertToType(data["types"], [ProjectTypeModel]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ProjectsFilterModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ProjectsFilterModel</code>.
   */
  static validateJSON(data) {
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["testCasesCount"]) {
      Int64RangeSelectorModel_default.validateJSON(data["testCasesCount"]);
    }
    if (data["checklistsCount"]) {
      Int64RangeSelectorModel_default.validateJSON(data["checklistsCount"]);
    }
    if (data["sharedStepsCount"]) {
      Int64RangeSelectorModel_default.validateJSON(data["sharedStepsCount"]);
    }
    if (data["autotestsCount"]) {
      Int64RangeSelectorModel_default.validateJSON(data["autotestsCount"]);
    }
    if (!Array.isArray(data["globalIds"])) {
      throw new Error("Expected the field `globalIds` to be an array in the JSON data but got " + data["globalIds"]);
    }
    if (data["createdDate"]) {
      DateTimeRangeSelectorModel_default.validateJSON(data["createdDate"]);
    }
    if (!Array.isArray(data["createdByIds"])) {
      throw new Error("Expected the field `createdByIds` to be an array in the JSON data but got " + data["createdByIds"]);
    }
    if (!Array.isArray(data["types"])) {
      throw new Error("Expected the field `types` to be an array in the JSON data but got " + data["types"]);
    }
    return true;
  }
};
ProjectsFilterModel.prototype["name"] = void 0;
ProjectsFilterModel.prototype["isFavorite"] = void 0;
ProjectsFilterModel.prototype["isDeleted"] = void 0;
ProjectsFilterModel.prototype["testCasesCount"] = void 0;
ProjectsFilterModel.prototype["checklistsCount"] = void 0;
ProjectsFilterModel.prototype["sharedStepsCount"] = void 0;
ProjectsFilterModel.prototype["autotestsCount"] = void 0;
ProjectsFilterModel.prototype["globalIds"] = void 0;
ProjectsFilterModel.prototype["createdDate"] = void 0;
ProjectsFilterModel.prototype["createdByIds"] = void 0;
ProjectsFilterModel.prototype["types"] = void 0;

// src/adaptersapi/model/SectionModel.js
var SectionModel = class _SectionModel {
  /**
   * Constructs a new <code>SectionModel</code>.
   * @alias module:model/SectionModel
   * @param isDeleted {Boolean} 
   * @param id {String} 
   * @param createdDate {Date} 
   * @param createdById {String} 
   * @param name {String} 
   */
  constructor(isDeleted, id, createdDate, createdById, name) {
    _SectionModel.initialize(this, isDeleted, id, createdDate, createdById, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, isDeleted, id, createdDate, createdById, name) {
    obj["isDeleted"] = isDeleted;
    obj["id"] = id;
    obj["createdDate"] = createdDate;
    obj["createdById"] = createdById;
    obj["name"] = name;
  }
  /**
   * Constructs a <code>SectionModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SectionModel} obj Optional instance to populate.
   * @return {module:model/SectionModel} The populated <code>SectionModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _SectionModel();
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("parentId")) {
        obj["parentId"] = ApiClient_default.convertToType(data["parentId"], "String");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("createdDate")) {
        obj["createdDate"] = ApiClient_default.convertToType(data["createdDate"], "Date");
      }
      if (data.hasOwnProperty("modifiedDate")) {
        obj["modifiedDate"] = ApiClient_default.convertToType(data["modifiedDate"], "Date");
      }
      if (data.hasOwnProperty("createdById")) {
        obj["createdById"] = ApiClient_default.convertToType(data["createdById"], "String");
      }
      if (data.hasOwnProperty("modifiedById")) {
        obj["modifiedById"] = ApiClient_default.convertToType(data["modifiedById"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>SectionModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>SectionModel</code>.
   */
  static validateJSON(data) {
    for (const property of _SectionModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["parentId"] && !(typeof data["parentId"] === "string" || data["parentId"] instanceof String)) {
      throw new Error("Expected the field `parentId` to be a primitive type in the JSON string but got " + data["parentId"]);
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["createdById"] && !(typeof data["createdById"] === "string" || data["createdById"] instanceof String)) {
      throw new Error("Expected the field `createdById` to be a primitive type in the JSON string but got " + data["createdById"]);
    }
    if (data["modifiedById"] && !(typeof data["modifiedById"] === "string" || data["modifiedById"] instanceof String)) {
      throw new Error("Expected the field `modifiedById` to be a primitive type in the JSON string but got " + data["modifiedById"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
SectionModel.RequiredProperties = ["isDeleted", "id", "createdDate", "createdById", "name"];
SectionModel.prototype["projectId"] = void 0;
SectionModel.prototype["parentId"] = void 0;
SectionModel.prototype["isDeleted"] = void 0;
SectionModel.prototype["id"] = void 0;
SectionModel.prototype["createdDate"] = void 0;
SectionModel.prototype["modifiedDate"] = void 0;
SectionModel.prototype["createdById"] = void 0;
SectionModel.prototype["modifiedById"] = void 0;
SectionModel.prototype["name"] = void 0;
var SectionModel_default = SectionModel;

// src/adaptersapi/model/StepPostModel.js
var StepPostModel = class _StepPostModel {
  /**
   * Constructs a new <code>StepPostModel</code>.
   * @alias module:model/StepPostModel
   */
  constructor() {
    _StepPostModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>StepPostModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StepPostModel} obj Optional instance to populate.
   * @return {module:model/StepPostModel} The populated <code>StepPostModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _StepPostModel();
      if (data.hasOwnProperty("action")) {
        obj["action"] = ApiClient_default.convertToType(data["action"], "String");
      }
      if (data.hasOwnProperty("expected")) {
        obj["expected"] = ApiClient_default.convertToType(data["expected"], "String");
      }
      if (data.hasOwnProperty("testData")) {
        obj["testData"] = ApiClient_default.convertToType(data["testData"], "String");
      }
      if (data.hasOwnProperty("comments")) {
        obj["comments"] = ApiClient_default.convertToType(data["comments"], "String");
      }
      if (data.hasOwnProperty("workItemId")) {
        obj["workItemId"] = ApiClient_default.convertToType(data["workItemId"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>StepPostModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>StepPostModel</code>.
   */
  static validateJSON(data) {
    if (data["action"] && !(typeof data["action"] === "string" || data["action"] instanceof String)) {
      throw new Error("Expected the field `action` to be a primitive type in the JSON string but got " + data["action"]);
    }
    if (data["expected"] && !(typeof data["expected"] === "string" || data["expected"] instanceof String)) {
      throw new Error("Expected the field `expected` to be a primitive type in the JSON string but got " + data["expected"]);
    }
    if (data["testData"] && !(typeof data["testData"] === "string" || data["testData"] instanceof String)) {
      throw new Error("Expected the field `testData` to be a primitive type in the JSON string but got " + data["testData"]);
    }
    if (data["comments"] && !(typeof data["comments"] === "string" || data["comments"] instanceof String)) {
      throw new Error("Expected the field `comments` to be a primitive type in the JSON string but got " + data["comments"]);
    }
    if (data["workItemId"] && !(typeof data["workItemId"] === "string" || data["workItemId"] instanceof String)) {
      throw new Error("Expected the field `workItemId` to be a primitive type in the JSON string but got " + data["workItemId"]);
    }
    return true;
  }
};
StepPostModel.prototype["action"] = void 0;
StepPostModel.prototype["expected"] = void 0;
StepPostModel.prototype["testData"] = void 0;
StepPostModel.prototype["comments"] = void 0;
StepPostModel.prototype["workItemId"] = void 0;
var StepPostModel_default = StepPostModel;

// src/adaptersapi/model/SectionPostModel.js
var SectionPostModel = class _SectionPostModel {
  /**
   * Constructs a new <code>SectionPostModel</code>.
   * @alias module:model/SectionPostModel
   * @param name {String} 
   * @param projectId {String} 
   * @param attachments {Array.<module:model/AttachmentPutModel>} 
   */
  constructor(name, projectId, attachments) {
    _SectionPostModel.initialize(this, name, projectId, attachments);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, name, projectId, attachments) {
    obj["name"] = name;
    obj["projectId"] = projectId;
    obj["attachments"] = attachments;
  }
  /**
   * Constructs a <code>SectionPostModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SectionPostModel} obj Optional instance to populate.
   * @return {module:model/SectionPostModel} The populated <code>SectionPostModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _SectionPostModel();
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("parentId")) {
        obj["parentId"] = ApiClient_default.convertToType(data["parentId"], "String");
      }
      if (data.hasOwnProperty("preconditionSteps")) {
        obj["preconditionSteps"] = ApiClient_default.convertToType(data["preconditionSteps"], [StepPostModel_default]);
      }
      if (data.hasOwnProperty("postconditionSteps")) {
        obj["postconditionSteps"] = ApiClient_default.convertToType(data["postconditionSteps"], [StepPostModel_default]);
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentPutModel_default]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>SectionPostModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>SectionPostModel</code>.
   */
  static validateJSON(data) {
    for (const property of _SectionPostModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["parentId"] && !(typeof data["parentId"] === "string" || data["parentId"] instanceof String)) {
      throw new Error("Expected the field `parentId` to be a primitive type in the JSON string but got " + data["parentId"]);
    }
    if (data["preconditionSteps"]) {
      if (!Array.isArray(data["preconditionSteps"])) {
        throw new Error("Expected the field `preconditionSteps` to be an array in the JSON data but got " + data["preconditionSteps"]);
      }
      for (const item of data["preconditionSteps"]) {
        StepPostModel_default.validateJSON(item);
      }
      ;
    }
    if (data["postconditionSteps"]) {
      if (!Array.isArray(data["postconditionSteps"])) {
        throw new Error("Expected the field `postconditionSteps` to be an array in the JSON data but got " + data["postconditionSteps"]);
      }
      for (const item of data["postconditionSteps"]) {
        StepPostModel_default.validateJSON(item);
      }
      ;
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentPutModel_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
SectionPostModel.RequiredProperties = ["name", "projectId", "attachments"];
SectionPostModel.prototype["name"] = void 0;
SectionPostModel.prototype["projectId"] = void 0;
SectionPostModel.prototype["parentId"] = void 0;
SectionPostModel.prototype["preconditionSteps"] = void 0;
SectionPostModel.prototype["postconditionSteps"] = void 0;
SectionPostModel.prototype["attachments"] = void 0;

// src/adaptersapi/model/SharedStepModel.js
var SharedStepModel = class _SharedStepModel {
  /**
   * Constructs a new <code>SharedStepModel</code>.
   * @alias module:model/SharedStepModel
   * @param versionId {String} 
   * @param globalId {Number} 
   * @param name {String} 
   * @param steps {Array.<module:model/StepModel>} 
   * @param isDeleted {Boolean} 
   */
  constructor(versionId, globalId, name, steps, isDeleted) {
    _SharedStepModel.initialize(this, versionId, globalId, name, steps, isDeleted);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, versionId, globalId, name, steps, isDeleted) {
    obj["versionId"] = versionId;
    obj["globalId"] = globalId;
    obj["name"] = name;
    obj["steps"] = steps;
    obj["isDeleted"] = isDeleted;
  }
  /**
   * Constructs a <code>SharedStepModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SharedStepModel} obj Optional instance to populate.
   * @return {module:model/SharedStepModel} The populated <code>SharedStepModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _SharedStepModel();
      if (data.hasOwnProperty("versionId")) {
        obj["versionId"] = ApiClient_default.convertToType(data["versionId"], "String");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [StepModel_default]);
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>SharedStepModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>SharedStepModel</code>.
   */
  static validateJSON(data) {
    for (const property of _SharedStepModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["versionId"] && !(typeof data["versionId"] === "string" || data["versionId"] instanceof String)) {
      throw new Error("Expected the field `versionId` to be a primitive type in the JSON string but got " + data["versionId"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        StepModel_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
SharedStepModel.RequiredProperties = ["versionId", "globalId", "name", "steps", "isDeleted"];
SharedStepModel.prototype["versionId"] = void 0;
SharedStepModel.prototype["globalId"] = void 0;
SharedStepModel.prototype["name"] = void 0;
SharedStepModel.prototype["steps"] = void 0;
SharedStepModel.prototype["isDeleted"] = void 0;
var SharedStepModel_default = SharedStepModel;

// src/adaptersapi/model/StepModel.js
var StepModel = class _StepModel {
  /**
   * Constructs a new <code>StepModel</code>.
   * @alias module:model/StepModel
   * @param id {String} 
   */
  constructor(id) {
    _StepModel.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>StepModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StepModel} obj Optional instance to populate.
   * @return {module:model/StepModel} The populated <code>StepModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _StepModel();
      if (data.hasOwnProperty("workItem")) {
        obj["workItem"] = ApiClient_default.convertToType(data["workItem"], SharedStepModel_default);
      }
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("action")) {
        obj["action"] = ApiClient_default.convertToType(data["action"], "String");
      }
      if (data.hasOwnProperty("expected")) {
        obj["expected"] = ApiClient_default.convertToType(data["expected"], "String");
      }
      if (data.hasOwnProperty("testData")) {
        obj["testData"] = ApiClient_default.convertToType(data["testData"], "String");
      }
      if (data.hasOwnProperty("comments")) {
        obj["comments"] = ApiClient_default.convertToType(data["comments"], "String");
      }
      if (data.hasOwnProperty("workItemId")) {
        obj["workItemId"] = ApiClient_default.convertToType(data["workItemId"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>StepModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>StepModel</code>.
   */
  static validateJSON(data) {
    for (const property of _StepModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["workItem"]) {
      SharedStepModel_default.validateJSON(data["workItem"]);
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["action"] && !(typeof data["action"] === "string" || data["action"] instanceof String)) {
      throw new Error("Expected the field `action` to be a primitive type in the JSON string but got " + data["action"]);
    }
    if (data["expected"] && !(typeof data["expected"] === "string" || data["expected"] instanceof String)) {
      throw new Error("Expected the field `expected` to be a primitive type in the JSON string but got " + data["expected"]);
    }
    if (data["testData"] && !(typeof data["testData"] === "string" || data["testData"] instanceof String)) {
      throw new Error("Expected the field `testData` to be a primitive type in the JSON string but got " + data["testData"]);
    }
    if (data["comments"] && !(typeof data["comments"] === "string" || data["comments"] instanceof String)) {
      throw new Error("Expected the field `comments` to be a primitive type in the JSON string but got " + data["comments"]);
    }
    if (data["workItemId"] && !(typeof data["workItemId"] === "string" || data["workItemId"] instanceof String)) {
      throw new Error("Expected the field `workItemId` to be a primitive type in the JSON string but got " + data["workItemId"]);
    }
    return true;
  }
};
StepModel.RequiredProperties = ["id"];
StepModel.prototype["workItem"] = void 0;
StepModel.prototype["id"] = void 0;
StepModel.prototype["action"] = void 0;
StepModel.prototype["expected"] = void 0;
StepModel.prototype["testData"] = void 0;
StepModel.prototype["comments"] = void 0;
StepModel.prototype["workItemId"] = void 0;
var StepModel_default = StepModel;

// src/adaptersapi/model/SectionWithStepsModel.js
var SectionWithStepsModel = class _SectionWithStepsModel {
  /**
   * Constructs a new <code>SectionWithStepsModel</code>.
   * @alias module:model/SectionWithStepsModel
   * @param isDeleted {Boolean} 
   * @param id {String} 
   * @param createdDate {Date} 
   * @param createdById {String} 
   * @param name {String} 
   */
  constructor(isDeleted, id, createdDate, createdById, name) {
    _SectionWithStepsModel.initialize(this, isDeleted, id, createdDate, createdById, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, isDeleted, id, createdDate, createdById, name) {
    obj["isDeleted"] = isDeleted;
    obj["id"] = id;
    obj["createdDate"] = createdDate;
    obj["createdById"] = createdById;
    obj["name"] = name;
  }
  /**
   * Constructs a <code>SectionWithStepsModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SectionWithStepsModel} obj Optional instance to populate.
   * @return {module:model/SectionWithStepsModel} The populated <code>SectionWithStepsModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _SectionWithStepsModel();
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentModel_default]);
      }
      if (data.hasOwnProperty("preconditionSteps")) {
        obj["preconditionSteps"] = ApiClient_default.convertToType(data["preconditionSteps"], [StepModel_default]);
      }
      if (data.hasOwnProperty("postconditionSteps")) {
        obj["postconditionSteps"] = ApiClient_default.convertToType(data["postconditionSteps"], [StepModel_default]);
      }
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("parentId")) {
        obj["parentId"] = ApiClient_default.convertToType(data["parentId"], "String");
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("createdDate")) {
        obj["createdDate"] = ApiClient_default.convertToType(data["createdDate"], "Date");
      }
      if (data.hasOwnProperty("modifiedDate")) {
        obj["modifiedDate"] = ApiClient_default.convertToType(data["modifiedDate"], "Date");
      }
      if (data.hasOwnProperty("createdById")) {
        obj["createdById"] = ApiClient_default.convertToType(data["createdById"], "String");
      }
      if (data.hasOwnProperty("modifiedById")) {
        obj["modifiedById"] = ApiClient_default.convertToType(data["modifiedById"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>SectionWithStepsModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>SectionWithStepsModel</code>.
   */
  static validateJSON(data) {
    for (const property of _SectionWithStepsModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentModel_default.validateJSON(item);
      }
      ;
    }
    if (data["preconditionSteps"]) {
      if (!Array.isArray(data["preconditionSteps"])) {
        throw new Error("Expected the field `preconditionSteps` to be an array in the JSON data but got " + data["preconditionSteps"]);
      }
      for (const item of data["preconditionSteps"]) {
        StepModel_default.validateJSON(item);
      }
      ;
    }
    if (data["postconditionSteps"]) {
      if (!Array.isArray(data["postconditionSteps"])) {
        throw new Error("Expected the field `postconditionSteps` to be an array in the JSON data but got " + data["postconditionSteps"]);
      }
      for (const item of data["postconditionSteps"]) {
        StepModel_default.validateJSON(item);
      }
      ;
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["parentId"] && !(typeof data["parentId"] === "string" || data["parentId"] instanceof String)) {
      throw new Error("Expected the field `parentId` to be a primitive type in the JSON string but got " + data["parentId"]);
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["createdById"] && !(typeof data["createdById"] === "string" || data["createdById"] instanceof String)) {
      throw new Error("Expected the field `createdById` to be a primitive type in the JSON string but got " + data["createdById"]);
    }
    if (data["modifiedById"] && !(typeof data["modifiedById"] === "string" || data["modifiedById"] instanceof String)) {
      throw new Error("Expected the field `modifiedById` to be a primitive type in the JSON string but got " + data["modifiedById"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
SectionWithStepsModel.RequiredProperties = ["isDeleted", "id", "createdDate", "createdById", "name"];
SectionWithStepsModel.prototype["attachments"] = void 0;
SectionWithStepsModel.prototype["preconditionSteps"] = void 0;
SectionWithStepsModel.prototype["postconditionSteps"] = void 0;
SectionWithStepsModel.prototype["projectId"] = void 0;
SectionWithStepsModel.prototype["parentId"] = void 0;
SectionWithStepsModel.prototype["isDeleted"] = void 0;
SectionWithStepsModel.prototype["id"] = void 0;
SectionWithStepsModel.prototype["createdDate"] = void 0;
SectionWithStepsModel.prototype["modifiedDate"] = void 0;
SectionWithStepsModel.prototype["createdById"] = void 0;
SectionWithStepsModel.prototype["modifiedById"] = void 0;
SectionWithStepsModel.prototype["name"] = void 0;

// src/adaptersapi/model/SharedStepResultApiModel.js
var SharedStepResultApiModel = class _SharedStepResultApiModel {
  /**
   * Constructs a new <code>SharedStepResultApiModel</code>.
   * @alias module:model/SharedStepResultApiModel
   * @param stepId {String} 
   * @param outcome {String} 
   */
  constructor(stepId, outcome) {
    _SharedStepResultApiModel.initialize(this, stepId, outcome);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, stepId, outcome) {
    obj["stepId"] = stepId;
    obj["outcome"] = outcome;
  }
  /**
   * Constructs a <code>SharedStepResultApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SharedStepResultApiModel} obj Optional instance to populate.
   * @return {module:model/SharedStepResultApiModel} The populated <code>SharedStepResultApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _SharedStepResultApiModel();
      if (data.hasOwnProperty("stepId")) {
        obj["stepId"] = ApiClient_default.convertToType(data["stepId"], "String");
      }
      if (data.hasOwnProperty("outcome")) {
        obj["outcome"] = ApiClient_default.convertToType(data["outcome"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>SharedStepResultApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>SharedStepResultApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _SharedStepResultApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["stepId"] && !(typeof data["stepId"] === "string" || data["stepId"] instanceof String)) {
      throw new Error("Expected the field `stepId` to be a primitive type in the JSON string but got " + data["stepId"]);
    }
    if (data["outcome"] && !(typeof data["outcome"] === "string" || data["outcome"] instanceof String)) {
      throw new Error("Expected the field `outcome` to be a primitive type in the JSON string but got " + data["outcome"]);
    }
    return true;
  }
};
SharedStepResultApiModel.RequiredProperties = ["stepId", "outcome"];
SharedStepResultApiModel.prototype["stepId"] = void 0;
SharedStepResultApiModel.prototype["outcome"] = void 0;
var SharedStepResultApiModel_default = SharedStepResultApiModel;

// src/adaptersapi/model/StepCommentApiModel.js
var StepCommentApiModel = class _StepCommentApiModel {
  /**
   * Constructs a new <code>StepCommentApiModel</code>.
   * @alias module:model/StepCommentApiModel
   * @param id {String} 
   * @param stepId {String} 
   * @param attachments {Array.<module:model/AttachmentApiResult>} 
   * @param testResultId {String} 
   * @param createdById {String} 
   * @param createdDate {Date} 
   */
  constructor(id, stepId, attachments, testResultId, createdById, createdDate) {
    _StepCommentApiModel.initialize(this, id, stepId, attachments, testResultId, createdById, createdDate);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, stepId, attachments, testResultId, createdById, createdDate) {
    obj["id"] = id;
    obj["stepId"] = stepId;
    obj["attachments"] = attachments;
    obj["testResultId"] = testResultId;
    obj["createdById"] = createdById;
    obj["createdDate"] = createdDate;
  }
  /**
   * Constructs a <code>StepCommentApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StepCommentApiModel} obj Optional instance to populate.
   * @return {module:model/StepCommentApiModel} The populated <code>StepCommentApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _StepCommentApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("text")) {
        obj["text"] = ApiClient_default.convertToType(data["text"], "String");
      }
      if (data.hasOwnProperty("stepId")) {
        obj["stepId"] = ApiClient_default.convertToType(data["stepId"], "String");
      }
      if (data.hasOwnProperty("parentStepId")) {
        obj["parentStepId"] = ApiClient_default.convertToType(data["parentStepId"], "String");
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentApiResult_default]);
      }
      if (data.hasOwnProperty("testResultId")) {
        obj["testResultId"] = ApiClient_default.convertToType(data["testResultId"], "String");
      }
      if (data.hasOwnProperty("createdById")) {
        obj["createdById"] = ApiClient_default.convertToType(data["createdById"], "String");
      }
      if (data.hasOwnProperty("modifiedById")) {
        obj["modifiedById"] = ApiClient_default.convertToType(data["modifiedById"], "String");
      }
      if (data.hasOwnProperty("createdDate")) {
        obj["createdDate"] = ApiClient_default.convertToType(data["createdDate"], "Date");
      }
      if (data.hasOwnProperty("modifiedDate")) {
        obj["modifiedDate"] = ApiClient_default.convertToType(data["modifiedDate"], "Date");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>StepCommentApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>StepCommentApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _StepCommentApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["text"] && !(typeof data["text"] === "string" || data["text"] instanceof String)) {
      throw new Error("Expected the field `text` to be a primitive type in the JSON string but got " + data["text"]);
    }
    if (data["stepId"] && !(typeof data["stepId"] === "string" || data["stepId"] instanceof String)) {
      throw new Error("Expected the field `stepId` to be a primitive type in the JSON string but got " + data["stepId"]);
    }
    if (data["parentStepId"] && !(typeof data["parentStepId"] === "string" || data["parentStepId"] instanceof String)) {
      throw new Error("Expected the field `parentStepId` to be a primitive type in the JSON string but got " + data["parentStepId"]);
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["testResultId"] && !(typeof data["testResultId"] === "string" || data["testResultId"] instanceof String)) {
      throw new Error("Expected the field `testResultId` to be a primitive type in the JSON string but got " + data["testResultId"]);
    }
    if (data["createdById"] && !(typeof data["createdById"] === "string" || data["createdById"] instanceof String)) {
      throw new Error("Expected the field `createdById` to be a primitive type in the JSON string but got " + data["createdById"]);
    }
    if (data["modifiedById"] && !(typeof data["modifiedById"] === "string" || data["modifiedById"] instanceof String)) {
      throw new Error("Expected the field `modifiedById` to be a primitive type in the JSON string but got " + data["modifiedById"]);
    }
    return true;
  }
};
StepCommentApiModel.RequiredProperties = ["id", "stepId", "attachments", "testResultId", "createdById", "createdDate"];
StepCommentApiModel.prototype["id"] = void 0;
StepCommentApiModel.prototype["text"] = void 0;
StepCommentApiModel.prototype["stepId"] = void 0;
StepCommentApiModel.prototype["parentStepId"] = void 0;
StepCommentApiModel.prototype["attachments"] = void 0;
StepCommentApiModel.prototype["testResultId"] = void 0;
StepCommentApiModel.prototype["createdById"] = void 0;
StepCommentApiModel.prototype["modifiedById"] = void 0;
StepCommentApiModel.prototype["createdDate"] = void 0;
StepCommentApiModel.prototype["modifiedDate"] = void 0;
var StepCommentApiModel_default = StepCommentApiModel;

// src/adaptersapi/model/StepResultApiModel.js
var StepResultApiModel = class _StepResultApiModel {
  /**
   * Constructs a new <code>StepResultApiModel</code>.
   * @alias module:model/StepResultApiModel
   * @param stepId {String} 
   * @param outcome {String} 
   */
  constructor(stepId, outcome) {
    _StepResultApiModel.initialize(this, stepId, outcome);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, stepId, outcome) {
    obj["stepId"] = stepId;
    obj["outcome"] = outcome;
  }
  /**
   * Constructs a <code>StepResultApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StepResultApiModel} obj Optional instance to populate.
   * @return {module:model/StepResultApiModel} The populated <code>StepResultApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _StepResultApiModel();
      if (data.hasOwnProperty("stepId")) {
        obj["stepId"] = ApiClient_default.convertToType(data["stepId"], "String");
      }
      if (data.hasOwnProperty("outcome")) {
        obj["outcome"] = ApiClient_default.convertToType(data["outcome"], "String");
      }
      if (data.hasOwnProperty("sharedStepVersionId")) {
        obj["sharedStepVersionId"] = ApiClient_default.convertToType(data["sharedStepVersionId"], "String");
      }
      if (data.hasOwnProperty("sharedStepResults")) {
        obj["sharedStepResults"] = ApiClient_default.convertToType(data["sharedStepResults"], [SharedStepResultApiModel_default]);
      }
      if (data.hasOwnProperty("comment")) {
        obj["comment"] = ApiClient_default.convertToType(data["comment"], StepCommentApiModel_default);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>StepResultApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>StepResultApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _StepResultApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["stepId"] && !(typeof data["stepId"] === "string" || data["stepId"] instanceof String)) {
      throw new Error("Expected the field `stepId` to be a primitive type in the JSON string but got " + data["stepId"]);
    }
    if (data["outcome"] && !(typeof data["outcome"] === "string" || data["outcome"] instanceof String)) {
      throw new Error("Expected the field `outcome` to be a primitive type in the JSON string but got " + data["outcome"]);
    }
    if (data["sharedStepVersionId"] && !(typeof data["sharedStepVersionId"] === "string" || data["sharedStepVersionId"] instanceof String)) {
      throw new Error("Expected the field `sharedStepVersionId` to be a primitive type in the JSON string but got " + data["sharedStepVersionId"]);
    }
    if (data["sharedStepResults"]) {
      if (!Array.isArray(data["sharedStepResults"])) {
        throw new Error("Expected the field `sharedStepResults` to be an array in the JSON data but got " + data["sharedStepResults"]);
      }
      for (const item of data["sharedStepResults"]) {
        SharedStepResultApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["comment"]) {
      StepCommentApiModel_default.validateJSON(data["comment"]);
    }
    return true;
  }
};
StepResultApiModel.RequiredProperties = ["stepId", "outcome"];
StepResultApiModel.prototype["stepId"] = void 0;
StepResultApiModel.prototype["outcome"] = void 0;
StepResultApiModel.prototype["sharedStepVersionId"] = void 0;
StepResultApiModel.prototype["sharedStepResults"] = void 0;
StepResultApiModel.prototype["comment"] = void 0;
var StepResultApiModel_default = StepResultApiModel;

// src/adaptersapi/model/TestResultLinkApiResult.js
var TestResultLinkApiResult = class _TestResultLinkApiResult {
  /**
   * Constructs a new <code>TestResultLinkApiResult</code>.
   * @alias module:model/TestResultLinkApiResult
   * @param url {String} Address can be specified without protocol, but necessarily with the domain.
   * @param type {module:model/LinkType} Specifies the type of the link.
   */
  constructor(url, type) {
    _TestResultLinkApiResult.initialize(this, url, type);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, url, type) {
    obj["url"] = url;
    obj["type"] = type;
  }
  /**
   * Constructs a <code>TestResultLinkApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TestResultLinkApiResult} obj Optional instance to populate.
   * @return {module:model/TestResultLinkApiResult} The populated <code>TestResultLinkApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _TestResultLinkApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("url")) {
        obj["url"] = ApiClient_default.convertToType(data["url"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], LinkType);
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>TestResultLinkApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TestResultLinkApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _TestResultLinkApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["url"] && !(typeof data["url"] === "string" || data["url"] instanceof String)) {
      throw new Error("Expected the field `url` to be a primitive type in the JSON string but got " + data["url"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    return true;
  }
};
TestResultLinkApiResult.RequiredProperties = ["url", "type"];
TestResultLinkApiResult.prototype["id"] = void 0;
TestResultLinkApiResult.prototype["title"] = void 0;
TestResultLinkApiResult.prototype["url"] = void 0;
TestResultLinkApiResult.prototype["description"] = void 0;
TestResultLinkApiResult.prototype["type"] = void 0;
TestResultLinkApiResult.prototype["name"] = void 0;
var TestResultLinkApiResult_default = TestResultLinkApiResult;

// src/adaptersapi/model/TestStatusApiResult.js
var TestStatusApiResult = class _TestStatusApiResult {
  /**
   * Constructs a new <code>TestStatusApiResult</code>.
   * @alias module:model/TestStatusApiResult
   * @param id {String} 
   * @param type {module:model/TestStatusApiType} Collection of possible status types
   * @param code {String} 
   */
  constructor(id, type, code) {
    _TestStatusApiResult.initialize(this, id, type, code);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, type, code) {
    obj["id"] = id;
    obj["type"] = type;
    obj["code"] = code;
  }
  /**
   * Constructs a <code>TestStatusApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TestStatusApiResult} obj Optional instance to populate.
   * @return {module:model/TestStatusApiResult} The populated <code>TestStatusApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _TestStatusApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], TestStatusApiType);
      }
      if (data.hasOwnProperty("code")) {
        obj["code"] = ApiClient_default.convertToType(data["code"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>TestStatusApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TestStatusApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _TestStatusApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["code"] && !(typeof data["code"] === "string" || data["code"] instanceof String)) {
      throw new Error("Expected the field `code` to be a primitive type in the JSON string but got " + data["code"]);
    }
    return true;
  }
};
TestStatusApiResult.RequiredProperties = ["id", "type", "code"];
TestStatusApiResult.prototype["id"] = void 0;
TestStatusApiResult.prototype["type"] = void 0;
TestStatusApiResult.prototype["code"] = void 0;
var TestStatusApiResult_default = TestStatusApiResult;

// src/adaptersapi/model/TestResultResponse.js
var TestResultResponse = class _TestResultResponse {
  /**
   * Constructs a new <code>TestResultResponse</code>.
   * @alias module:model/TestResultResponse
   * @param id {String} 
   * @param failureClassIds {Array.<String>} 
   * @param configurationId {String} 
   * @param testPointId {String} 
   * @param testRunId {String} 
   */
  constructor(id, failureClassIds, configurationId, testPointId, testRunId) {
    _TestResultResponse.initialize(this, id, failureClassIds, configurationId, testPointId, testRunId);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, failureClassIds, configurationId, testPointId, testRunId) {
    obj["id"] = id;
    obj["failureClassIds"] = failureClassIds;
    obj["configurationId"] = configurationId;
    obj["testPointId"] = testPointId;
    obj["testRunId"] = testRunId;
  }
  /**
   * Constructs a <code>TestResultResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TestResultResponse} obj Optional instance to populate.
   * @return {module:model/TestResultResponse} The populated <code>TestResultResponse</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _TestResultResponse();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("stepComments")) {
        obj["stepComments"] = ApiClient_default.convertToType(data["stepComments"], [StepCommentApiModel_default]);
      }
      if (data.hasOwnProperty("failureClassIds")) {
        obj["failureClassIds"] = ApiClient_default.convertToType(data["failureClassIds"], ["String"]);
      }
      if (data.hasOwnProperty("outcome")) {
        obj["outcome"] = ApiClient_default.convertToType(data["outcome"], TestResultOutcome);
      }
      if (data.hasOwnProperty("status")) {
        obj["status"] = ApiClient_default.convertToType(data["status"], TestStatusApiResult_default);
      }
      if (data.hasOwnProperty("comment")) {
        obj["comment"] = ApiClient_default.convertToType(data["comment"], "String");
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [LinkApiResult_default]);
      }
      if (data.hasOwnProperty("stepResults")) {
        obj["stepResults"] = ApiClient_default.convertToType(data["stepResults"], [StepResultApiModel_default]);
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentApiResult_default]);
      }
      if (data.hasOwnProperty("autoTestId")) {
        obj["autoTestId"] = ApiClient_default.convertToType(data["autoTestId"], "String");
      }
      if (data.hasOwnProperty("configurationId")) {
        obj["configurationId"] = ApiClient_default.convertToType(data["configurationId"], "String");
      }
      if (data.hasOwnProperty("testPointId")) {
        obj["testPointId"] = ApiClient_default.convertToType(data["testPointId"], "String");
      }
      if (data.hasOwnProperty("durationInMs")) {
        obj["durationInMs"] = ApiClient_default.convertToType(data["durationInMs"], "Number");
      }
      if (data.hasOwnProperty("traces")) {
        obj["traces"] = ApiClient_default.convertToType(data["traces"], "String");
      }
      if (data.hasOwnProperty("failureType")) {
        obj["failureType"] = ApiClient_default.convertToType(data["failureType"], "String");
      }
      if (data.hasOwnProperty("message")) {
        obj["message"] = ApiClient_default.convertToType(data["message"], "String");
      }
      if (data.hasOwnProperty("testRunId")) {
        obj["testRunId"] = ApiClient_default.convertToType(data["testRunId"], "String");
      }
      if (data.hasOwnProperty("autoTest")) {
        obj["autoTest"] = ApiClient_default.convertToType(data["autoTest"], AutoTest_default);
      }
      if (data.hasOwnProperty("autoTestStepResults")) {
        obj["autoTestStepResults"] = ApiClient_default.convertToType(data["autoTestStepResults"], [AutoTestStepResult_default]);
      }
      if (data.hasOwnProperty("setupResults")) {
        obj["setupResults"] = ApiClient_default.convertToType(data["setupResults"], [AutoTestStepResult_default]);
      }
      if (data.hasOwnProperty("teardownResults")) {
        obj["teardownResults"] = ApiClient_default.convertToType(data["teardownResults"], [AutoTestStepResult_default]);
      }
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], { "String": "String" });
      }
      if (data.hasOwnProperty("properties")) {
        obj["properties"] = ApiClient_default.convertToType(data["properties"], { "String": "String" });
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>TestResultResponse</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TestResultResponse</code>.
   */
  static validateJSON(data) {
    for (const property of _TestResultResponse.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["stepComments"]) {
      if (!Array.isArray(data["stepComments"])) {
        throw new Error("Expected the field `stepComments` to be an array in the JSON data but got " + data["stepComments"]);
      }
      for (const item of data["stepComments"]) {
        StepCommentApiModel_default.validateJSON(item);
      }
      ;
    }
    if (!Array.isArray(data["failureClassIds"])) {
      throw new Error("Expected the field `failureClassIds` to be an array in the JSON data but got " + data["failureClassIds"]);
    }
    if (data["status"]) {
      TestStatusApiResult_default.validateJSON(data["status"]);
    }
    if (data["comment"] && !(typeof data["comment"] === "string" || data["comment"] instanceof String)) {
      throw new Error("Expected the field `comment` to be a primitive type in the JSON string but got " + data["comment"]);
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        LinkApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["stepResults"]) {
      if (!Array.isArray(data["stepResults"])) {
        throw new Error("Expected the field `stepResults` to be an array in the JSON data but got " + data["stepResults"]);
      }
      for (const item of data["stepResults"]) {
        StepResultApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["autoTestId"] && !(typeof data["autoTestId"] === "string" || data["autoTestId"] instanceof String)) {
      throw new Error("Expected the field `autoTestId` to be a primitive type in the JSON string but got " + data["autoTestId"]);
    }
    if (data["configurationId"] && !(typeof data["configurationId"] === "string" || data["configurationId"] instanceof String)) {
      throw new Error("Expected the field `configurationId` to be a primitive type in the JSON string but got " + data["configurationId"]);
    }
    if (data["testPointId"] && !(typeof data["testPointId"] === "string" || data["testPointId"] instanceof String)) {
      throw new Error("Expected the field `testPointId` to be a primitive type in the JSON string but got " + data["testPointId"]);
    }
    if (data["traces"] && !(typeof data["traces"] === "string" || data["traces"] instanceof String)) {
      throw new Error("Expected the field `traces` to be a primitive type in the JSON string but got " + data["traces"]);
    }
    if (data["failureType"] && !(typeof data["failureType"] === "string" || data["failureType"] instanceof String)) {
      throw new Error("Expected the field `failureType` to be a primitive type in the JSON string but got " + data["failureType"]);
    }
    if (data["message"] && !(typeof data["message"] === "string" || data["message"] instanceof String)) {
      throw new Error("Expected the field `message` to be a primitive type in the JSON string but got " + data["message"]);
    }
    if (data["testRunId"] && !(typeof data["testRunId"] === "string" || data["testRunId"] instanceof String)) {
      throw new Error("Expected the field `testRunId` to be a primitive type in the JSON string but got " + data["testRunId"]);
    }
    if (data["autoTest"]) {
      AutoTest_default.validateJSON(data["autoTest"]);
    }
    if (data["autoTestStepResults"]) {
      if (!Array.isArray(data["autoTestStepResults"])) {
        throw new Error("Expected the field `autoTestStepResults` to be an array in the JSON data but got " + data["autoTestStepResults"]);
      }
      for (const item of data["autoTestStepResults"]) {
        AutoTestStepResult_default.validateJSON(item);
      }
      ;
    }
    if (data["setupResults"]) {
      if (!Array.isArray(data["setupResults"])) {
        throw new Error("Expected the field `setupResults` to be an array in the JSON data but got " + data["setupResults"]);
      }
      for (const item of data["setupResults"]) {
        AutoTestStepResult_default.validateJSON(item);
      }
      ;
    }
    if (data["teardownResults"]) {
      if (!Array.isArray(data["teardownResults"])) {
        throw new Error("Expected the field `teardownResults` to be an array in the JSON data but got " + data["teardownResults"]);
      }
      for (const item of data["teardownResults"]) {
        AutoTestStepResult_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
TestResultResponse.RequiredProperties = ["id", "failureClassIds", "configurationId", "testPointId", "testRunId"];
TestResultResponse.prototype["id"] = void 0;
TestResultResponse.prototype["stepComments"] = void 0;
TestResultResponse.prototype["failureClassIds"] = void 0;
TestResultResponse.prototype["outcome"] = void 0;
TestResultResponse.prototype["status"] = void 0;
TestResultResponse.prototype["comment"] = void 0;
TestResultResponse.prototype["links"] = void 0;
TestResultResponse.prototype["stepResults"] = void 0;
TestResultResponse.prototype["attachments"] = void 0;
TestResultResponse.prototype["autoTestId"] = void 0;
TestResultResponse.prototype["configurationId"] = void 0;
TestResultResponse.prototype["testPointId"] = void 0;
TestResultResponse.prototype["durationInMs"] = void 0;
TestResultResponse.prototype["traces"] = void 0;
TestResultResponse.prototype["failureType"] = void 0;
TestResultResponse.prototype["message"] = void 0;
TestResultResponse.prototype["testRunId"] = void 0;
TestResultResponse.prototype["autoTest"] = void 0;
TestResultResponse.prototype["autoTestStepResults"] = void 0;
TestResultResponse.prototype["setupResults"] = void 0;
TestResultResponse.prototype["teardownResults"] = void 0;
TestResultResponse.prototype["parameters"] = void 0;
TestResultResponse.prototype["properties"] = void 0;

// src/adaptersapi/model/TestResultShortResponse.js
var TestResultShortResponse = class _TestResultShortResponse {
  /**
   * Constructs a new <code>TestResultShortResponse</code>.
   * @alias module:model/TestResultShortResponse
   * @param id {String} Unique ID of the test result
   * @param name {String} Name of autotest represented by the test result
   * @param autotestGlobalId {Number} Global ID of autotest represented by the test result
   * @param autoTestTags {Array.<String>} Tags of the autotest represented by the test result
   * @param testRunId {String} Unique ID of test run where the test result is located
   * @param configurationId {String} Unique ID of configuration which the test result uses
   * @param configurationName {String} Name of configuration which the test result uses
   * @param status {module:model/TestStatusApiResult} 
   * @param resultReasons {Array.<module:model/AutoTestResultReasonShort>} Collection of result reasons which the test result have
   * @param links {Array.<module:model/TestResultLinkApiResult>} Collection of links attached to the test result
   * @param attachments {Array.<module:model/AttachmentApiResult>} Collection of files attached to the test result
   * @param rerunCompletedCount {Number} Run count
   */
  constructor(id, name, autotestGlobalId, autoTestTags, testRunId, configurationId, configurationName, status, resultReasons, links, attachments, rerunCompletedCount) {
    _TestResultShortResponse.initialize(this, id, name, autotestGlobalId, autoTestTags, testRunId, configurationId, configurationName, status, resultReasons, links, attachments, rerunCompletedCount);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, name, autotestGlobalId, autoTestTags, testRunId, configurationId, configurationName, status, resultReasons, links, attachments, rerunCompletedCount) {
    obj["id"] = id;
    obj["name"] = name;
    obj["autotestGlobalId"] = autotestGlobalId;
    obj["autoTestTags"] = autoTestTags;
    obj["testRunId"] = testRunId;
    obj["configurationId"] = configurationId;
    obj["configurationName"] = configurationName;
    obj["status"] = status;
    obj["resultReasons"] = resultReasons;
    obj["links"] = links;
    obj["attachments"] = attachments;
    obj["rerunCompletedCount"] = rerunCompletedCount;
  }
  /**
   * Constructs a <code>TestResultShortResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TestResultShortResponse} obj Optional instance to populate.
   * @return {module:model/TestResultShortResponse} The populated <code>TestResultShortResponse</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _TestResultShortResponse();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("autotestGlobalId")) {
        obj["autotestGlobalId"] = ApiClient_default.convertToType(data["autotestGlobalId"], "Number");
      }
      if (data.hasOwnProperty("autotestExternalId")) {
        obj["autotestExternalId"] = ApiClient_default.convertToType(data["autotestExternalId"], "String");
      }
      if (data.hasOwnProperty("autoTestTags")) {
        obj["autoTestTags"] = ApiClient_default.convertToType(data["autoTestTags"], ["String"]);
      }
      if (data.hasOwnProperty("testRunId")) {
        obj["testRunId"] = ApiClient_default.convertToType(data["testRunId"], "String");
      }
      if (data.hasOwnProperty("configurationId")) {
        obj["configurationId"] = ApiClient_default.convertToType(data["configurationId"], "String");
      }
      if (data.hasOwnProperty("configurationName")) {
        obj["configurationName"] = ApiClient_default.convertToType(data["configurationName"], "String");
      }
      if (data.hasOwnProperty("outcome")) {
        obj["outcome"] = ApiClient_default.convertToType(data["outcome"], "String");
      }
      if (data.hasOwnProperty("status")) {
        obj["status"] = ApiClient_default.convertToType(data["status"], TestStatusApiResult_default);
      }
      if (data.hasOwnProperty("resultReasons")) {
        obj["resultReasons"] = ApiClient_default.convertToType(data["resultReasons"], [AutoTestResultReasonShort_default]);
      }
      if (data.hasOwnProperty("comment")) {
        obj["comment"] = ApiClient_default.convertToType(data["comment"], "String");
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], "Number");
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [TestResultLinkApiResult_default]);
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentApiResult_default]);
      }
      if (data.hasOwnProperty("rerunCompletedCount")) {
        obj["rerunCompletedCount"] = ApiClient_default.convertToType(data["rerunCompletedCount"], "Number");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>TestResultShortResponse</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TestResultShortResponse</code>.
   */
  static validateJSON(data) {
    for (const property of _TestResultShortResponse.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["autotestExternalId"] && !(typeof data["autotestExternalId"] === "string" || data["autotestExternalId"] instanceof String)) {
      throw new Error("Expected the field `autotestExternalId` to be a primitive type in the JSON string but got " + data["autotestExternalId"]);
    }
    if (!Array.isArray(data["autoTestTags"])) {
      throw new Error("Expected the field `autoTestTags` to be an array in the JSON data but got " + data["autoTestTags"]);
    }
    if (data["testRunId"] && !(typeof data["testRunId"] === "string" || data["testRunId"] instanceof String)) {
      throw new Error("Expected the field `testRunId` to be a primitive type in the JSON string but got " + data["testRunId"]);
    }
    if (data["configurationId"] && !(typeof data["configurationId"] === "string" || data["configurationId"] instanceof String)) {
      throw new Error("Expected the field `configurationId` to be a primitive type in the JSON string but got " + data["configurationId"]);
    }
    if (data["configurationName"] && !(typeof data["configurationName"] === "string" || data["configurationName"] instanceof String)) {
      throw new Error("Expected the field `configurationName` to be a primitive type in the JSON string but got " + data["configurationName"]);
    }
    if (data["outcome"] && !(typeof data["outcome"] === "string" || data["outcome"] instanceof String)) {
      throw new Error("Expected the field `outcome` to be a primitive type in the JSON string but got " + data["outcome"]);
    }
    if (data["status"]) {
      TestStatusApiResult_default.validateJSON(data["status"]);
    }
    if (data["resultReasons"]) {
      if (!Array.isArray(data["resultReasons"])) {
        throw new Error("Expected the field `resultReasons` to be an array in the JSON data but got " + data["resultReasons"]);
      }
      for (const item of data["resultReasons"]) {
        AutoTestResultReasonShort_default.validateJSON(item);
      }
      ;
    }
    if (data["comment"] && !(typeof data["comment"] === "string" || data["comment"] instanceof String)) {
      throw new Error("Expected the field `comment` to be a primitive type in the JSON string but got " + data["comment"]);
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        TestResultLinkApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentApiResult_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
TestResultShortResponse.RequiredProperties = ["id", "name", "autotestGlobalId", "autoTestTags", "testRunId", "configurationId", "configurationName", "status", "resultReasons", "links", "attachments", "rerunCompletedCount"];
TestResultShortResponse.prototype["id"] = void 0;
TestResultShortResponse.prototype["name"] = void 0;
TestResultShortResponse.prototype["autotestGlobalId"] = void 0;
TestResultShortResponse.prototype["autotestExternalId"] = void 0;
TestResultShortResponse.prototype["autoTestTags"] = void 0;
TestResultShortResponse.prototype["testRunId"] = void 0;
TestResultShortResponse.prototype["configurationId"] = void 0;
TestResultShortResponse.prototype["configurationName"] = void 0;
TestResultShortResponse.prototype["outcome"] = void 0;
TestResultShortResponse.prototype["status"] = void 0;
TestResultShortResponse.prototype["resultReasons"] = void 0;
TestResultShortResponse.prototype["comment"] = void 0;
TestResultShortResponse.prototype["duration"] = void 0;
TestResultShortResponse.prototype["links"] = void 0;
TestResultShortResponse.prototype["attachments"] = void 0;
TestResultShortResponse.prototype["rerunCompletedCount"] = void 0;

// src/adaptersapi/model/TestResultStepCommentUpdateRequest.js
var TestResultStepCommentUpdateRequest = class _TestResultStepCommentUpdateRequest {
  /**
   * Constructs a new <code>TestResultStepCommentUpdateRequest</code>.
   * @alias module:model/TestResultStepCommentUpdateRequest
   * @param id {String} Entity unique identifier
   * @param text {String} 
   * @param stepId {String} 
   * @param attachments {Array.<module:model/AttachmentUpdateRequest>} 
   */
  constructor(id, text, stepId, attachments) {
    _TestResultStepCommentUpdateRequest.initialize(this, id, text, stepId, attachments);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, text, stepId, attachments) {
    obj["id"] = id;
    obj["text"] = text;
    obj["stepId"] = stepId;
    obj["attachments"] = attachments;
  }
  /**
   * Constructs a <code>TestResultStepCommentUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TestResultStepCommentUpdateRequest} obj Optional instance to populate.
   * @return {module:model/TestResultStepCommentUpdateRequest} The populated <code>TestResultStepCommentUpdateRequest</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _TestResultStepCommentUpdateRequest();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("text")) {
        obj["text"] = ApiClient_default.convertToType(data["text"], "String");
      }
      if (data.hasOwnProperty("stepId")) {
        obj["stepId"] = ApiClient_default.convertToType(data["stepId"], "String");
      }
      if (data.hasOwnProperty("parentStepId")) {
        obj["parentStepId"] = ApiClient_default.convertToType(data["parentStepId"], "String");
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentUpdateRequest_default]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>TestResultStepCommentUpdateRequest</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TestResultStepCommentUpdateRequest</code>.
   */
  static validateJSON(data) {
    for (const property of _TestResultStepCommentUpdateRequest.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["text"] && !(typeof data["text"] === "string" || data["text"] instanceof String)) {
      throw new Error("Expected the field `text` to be a primitive type in the JSON string but got " + data["text"]);
    }
    if (data["stepId"] && !(typeof data["stepId"] === "string" || data["stepId"] instanceof String)) {
      throw new Error("Expected the field `stepId` to be a primitive type in the JSON string but got " + data["stepId"]);
    }
    if (data["parentStepId"] && !(typeof data["parentStepId"] === "string" || data["parentStepId"] instanceof String)) {
      throw new Error("Expected the field `parentStepId` to be a primitive type in the JSON string but got " + data["parentStepId"]);
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentUpdateRequest_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
TestResultStepCommentUpdateRequest.RequiredProperties = ["id", "text", "stepId", "attachments"];
TestResultStepCommentUpdateRequest.prototype["id"] = void 0;
TestResultStepCommentUpdateRequest.prototype["text"] = void 0;
TestResultStepCommentUpdateRequest.prototype["stepId"] = void 0;
TestResultStepCommentUpdateRequest.prototype["parentStepId"] = void 0;
TestResultStepCommentUpdateRequest.prototype["attachments"] = void 0;
var TestResultStepCommentUpdateRequest_default = TestResultStepCommentUpdateRequest;

// src/adaptersapi/model/TestResultUpdateRequest.js
var TestResultUpdateRequest = class _TestResultUpdateRequest {
  /**
   * Constructs a new <code>TestResultUpdateRequest</code>.
   * @alias module:model/TestResultUpdateRequest
   */
  constructor() {
    _TestResultUpdateRequest.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>TestResultUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TestResultUpdateRequest} obj Optional instance to populate.
   * @return {module:model/TestResultUpdateRequest} The populated <code>TestResultUpdateRequest</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _TestResultUpdateRequest();
      if (data.hasOwnProperty("failureClassIds")) {
        obj["failureClassIds"] = ApiClient_default.convertToType(data["failureClassIds"], ["String"]);
      }
      if (data.hasOwnProperty("outcome")) {
        obj["outcome"] = ApiClient_default.convertToType(data["outcome"], TestResultOutcome);
      }
      if (data.hasOwnProperty("statusCode")) {
        obj["statusCode"] = ApiClient_default.convertToType(data["statusCode"], "String");
      }
      if (data.hasOwnProperty("statusType")) {
        obj["statusType"] = ApiClient_default.convertToType(data["statusType"], TestStatusType);
      }
      if (data.hasOwnProperty("comment")) {
        obj["comment"] = ApiClient_default.convertToType(data["comment"], "String");
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [CreateLinkApiModel_default]);
      }
      if (data.hasOwnProperty("stepResults")) {
        obj["stepResults"] = ApiClient_default.convertToType(data["stepResults"], [StepResultApiModel_default]);
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentUpdateRequest_default]);
      }
      if (data.hasOwnProperty("durationInMs")) {
        obj["durationInMs"] = ApiClient_default.convertToType(data["durationInMs"], "Number");
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], "Number");
      }
      if (data.hasOwnProperty("stepComments")) {
        obj["stepComments"] = ApiClient_default.convertToType(data["stepComments"], [TestResultStepCommentUpdateRequest_default]);
      }
      if (data.hasOwnProperty("setupResults")) {
        obj["setupResults"] = ApiClient_default.convertToType(data["setupResults"], [AutoTestStepResultUpdateRequest_default]);
      }
      if (data.hasOwnProperty("teardownResults")) {
        obj["teardownResults"] = ApiClient_default.convertToType(data["teardownResults"], [AutoTestStepResultUpdateRequest_default]);
      }
      if (data.hasOwnProperty("message")) {
        obj["message"] = ApiClient_default.convertToType(data["message"], "String");
      }
      if (data.hasOwnProperty("trace")) {
        obj["trace"] = ApiClient_default.convertToType(data["trace"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>TestResultUpdateRequest</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TestResultUpdateRequest</code>.
   */
  static validateJSON(data) {
    if (!Array.isArray(data["failureClassIds"])) {
      throw new Error("Expected the field `failureClassIds` to be an array in the JSON data but got " + data["failureClassIds"]);
    }
    if (data["statusCode"] && !(typeof data["statusCode"] === "string" || data["statusCode"] instanceof String)) {
      throw new Error("Expected the field `statusCode` to be a primitive type in the JSON string but got " + data["statusCode"]);
    }
    if (data["comment"] && !(typeof data["comment"] === "string" || data["comment"] instanceof String)) {
      throw new Error("Expected the field `comment` to be a primitive type in the JSON string but got " + data["comment"]);
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        CreateLinkApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["stepResults"]) {
      if (!Array.isArray(data["stepResults"])) {
        throw new Error("Expected the field `stepResults` to be an array in the JSON data but got " + data["stepResults"]);
      }
      for (const item of data["stepResults"]) {
        StepResultApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentUpdateRequest_default.validateJSON(item);
      }
      ;
    }
    if (data["stepComments"]) {
      if (!Array.isArray(data["stepComments"])) {
        throw new Error("Expected the field `stepComments` to be an array in the JSON data but got " + data["stepComments"]);
      }
      for (const item of data["stepComments"]) {
        TestResultStepCommentUpdateRequest_default.validateJSON(item);
      }
      ;
    }
    if (data["setupResults"]) {
      if (!Array.isArray(data["setupResults"])) {
        throw new Error("Expected the field `setupResults` to be an array in the JSON data but got " + data["setupResults"]);
      }
      for (const item of data["setupResults"]) {
        AutoTestStepResultUpdateRequest_default.validateJSON(item);
      }
      ;
    }
    if (data["teardownResults"]) {
      if (!Array.isArray(data["teardownResults"])) {
        throw new Error("Expected the field `teardownResults` to be an array in the JSON data but got " + data["teardownResults"]);
      }
      for (const item of data["teardownResults"]) {
        AutoTestStepResultUpdateRequest_default.validateJSON(item);
      }
      ;
    }
    if (data["message"] && !(typeof data["message"] === "string" || data["message"] instanceof String)) {
      throw new Error("Expected the field `message` to be a primitive type in the JSON string but got " + data["message"]);
    }
    if (data["trace"] && !(typeof data["trace"] === "string" || data["trace"] instanceof String)) {
      throw new Error("Expected the field `trace` to be a primitive type in the JSON string but got " + data["trace"]);
    }
    return true;
  }
};
TestResultUpdateRequest.prototype["failureClassIds"] = void 0;
TestResultUpdateRequest.prototype["outcome"] = void 0;
TestResultUpdateRequest.prototype["statusCode"] = void 0;
TestResultUpdateRequest.prototype["statusType"] = void 0;
TestResultUpdateRequest.prototype["comment"] = void 0;
TestResultUpdateRequest.prototype["links"] = void 0;
TestResultUpdateRequest.prototype["stepResults"] = void 0;
TestResultUpdateRequest.prototype["attachments"] = void 0;
TestResultUpdateRequest.prototype["durationInMs"] = void 0;
TestResultUpdateRequest.prototype["duration"] = void 0;
TestResultUpdateRequest.prototype["stepComments"] = void 0;
TestResultUpdateRequest.prototype["setupResults"] = void 0;
TestResultUpdateRequest.prototype["teardownResults"] = void 0;
TestResultUpdateRequest.prototype["message"] = void 0;
TestResultUpdateRequest.prototype["trace"] = void 0;

// src/adaptersapi/model/TestRunState.js
var TestRunState = class {
  /**
   * value: "NotStarted"
   * @const
   */
  "NotStarted" = "NotStarted";
  /**
   * value: "InProgress"
   * @const
   */
  "InProgress" = "InProgress";
  /**
   * value: "Stopped"
   * @const
   */
  "Stopped" = "Stopped";
  /**
   * value: "Completed"
   * @const
   */
  "Completed" = "Completed";
  /**
  * Returns a <code>TestRunState</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/TestRunState} The enum <code>TestRunState</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/TestRunApiResult.js
var TestRunApiResult = class _TestRunApiResult {
  /**
   * Constructs a new <code>TestRunApiResult</code>.
   * @alias module:model/TestRunApiResult
   * @param id {String} Test run unique identifier
   * @param name {String} Test run name
   * @param projectId {String} Project unique identifier              This property is used to link test run with project.
   * @param stateName {module:model/TestRunState} Test run state
   * @param status {module:model/TestStatusApiResult} Test run status
   * @param attachments {Array.<module:model/AttachmentApiResult>} Collection of attachments related to the test run
   * @param links {Array.<module:model/LinkApiResult>} Collection of links related to the test run
   * @param tags {Array.<String>} Collection of tags associated with the test run
   */
  constructor(id, name, projectId, stateName, status, attachments, links, tags) {
    _TestRunApiResult.initialize(this, id, name, projectId, stateName, status, attachments, links, tags);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, name, projectId, stateName, status, attachments, links, tags) {
    obj["id"] = id;
    obj["name"] = name;
    obj["projectId"] = projectId;
    obj["stateName"] = stateName;
    obj["status"] = status;
    obj["attachments"] = attachments;
    obj["links"] = links;
    obj["tags"] = tags;
  }
  /**
   * Constructs a <code>TestRunApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/TestRunApiResult} obj Optional instance to populate.
   * @return {module:model/TestRunApiResult} The populated <code>TestRunApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _TestRunApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("launchSource")) {
        obj["launchSource"] = ApiClient_default.convertToType(data["launchSource"], "String");
      }
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("stateName")) {
        obj["stateName"] = ApiClient_default.convertToType(data["stateName"], TestRunState);
      }
      if (data.hasOwnProperty("status")) {
        obj["status"] = ApiClient_default.convertToType(data["status"], TestStatusApiResult_default);
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentApiResult_default]);
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [LinkApiResult_default]);
      }
      if (data.hasOwnProperty("tags")) {
        obj["tags"] = ApiClient_default.convertToType(data["tags"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>TestRunApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>TestRunApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _TestRunApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["launchSource"] && !(typeof data["launchSource"] === "string" || data["launchSource"] instanceof String)) {
      throw new Error("Expected the field `launchSource` to be a primitive type in the JSON string but got " + data["launchSource"]);
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["status"]) {
      TestStatusApiResult_default.validateJSON(data["status"]);
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        LinkApiResult_default.validateJSON(item);
      }
      ;
    }
    if (!Array.isArray(data["tags"])) {
      throw new Error("Expected the field `tags` to be an array in the JSON data but got " + data["tags"]);
    }
    return true;
  }
};
TestRunApiResult.RequiredProperties = ["id", "name", "projectId", "stateName", "status", "attachments", "links", "tags"];
TestRunApiResult.prototype["id"] = void 0;
TestRunApiResult.prototype["name"] = void 0;
TestRunApiResult.prototype["description"] = void 0;
TestRunApiResult.prototype["launchSource"] = void 0;
TestRunApiResult.prototype["projectId"] = void 0;
TestRunApiResult.prototype["stateName"] = void 0;
TestRunApiResult.prototype["status"] = void 0;
TestRunApiResult.prototype["attachments"] = void 0;
TestRunApiResult.prototype["links"] = void 0;
TestRunApiResult.prototype["tags"] = void 0;

// src/adaptersapi/model/UpdateLinkApiModel.js
var UpdateLinkApiModel = class _UpdateLinkApiModel {
  /**
   * Constructs a new <code>UpdateLinkApiModel</code>.
   * @alias module:model/UpdateLinkApiModel
   * @param url {String} Address can be specified without protocol, but necessarily with the domain.
   * @param type {module:model/LinkType} Specifies the type of the link.
   */
  constructor(url, type) {
    _UpdateLinkApiModel.initialize(this, url, type);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, url, type) {
    obj["url"] = url;
    obj["type"] = type;
  }
  /**
   * Constructs a <code>UpdateLinkApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UpdateLinkApiModel} obj Optional instance to populate.
   * @return {module:model/UpdateLinkApiModel} The populated <code>UpdateLinkApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _UpdateLinkApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("url")) {
        obj["url"] = ApiClient_default.convertToType(data["url"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], LinkType);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>UpdateLinkApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>UpdateLinkApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _UpdateLinkApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["url"] && !(typeof data["url"] === "string" || data["url"] instanceof String)) {
      throw new Error("Expected the field `url` to be a primitive type in the JSON string but got " + data["url"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    return true;
  }
};
UpdateLinkApiModel.RequiredProperties = ["url", "type"];
UpdateLinkApiModel.prototype["id"] = void 0;
UpdateLinkApiModel.prototype["title"] = void 0;
UpdateLinkApiModel.prototype["url"] = void 0;
UpdateLinkApiModel.prototype["description"] = void 0;
UpdateLinkApiModel.prototype["type"] = void 0;
var UpdateLinkApiModel_default = UpdateLinkApiModel;

// src/adaptersapi/model/UpdateEmptyTestRunApiModel.js
var UpdateEmptyTestRunApiModel = class _UpdateEmptyTestRunApiModel {
  /**
   * Constructs a new <code>UpdateEmptyTestRunApiModel</code>.
   * @alias module:model/UpdateEmptyTestRunApiModel
   * @param id {String} Test run unique identifier
   * @param name {String} Test run name
   */
  constructor(id, name) {
    _UpdateEmptyTestRunApiModel.initialize(this, id, name);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, name) {
    obj["id"] = id;
    obj["name"] = name;
  }
  /**
   * Constructs a <code>UpdateEmptyTestRunApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UpdateEmptyTestRunApiModel} obj Optional instance to populate.
   * @return {module:model/UpdateEmptyTestRunApiModel} The populated <code>UpdateEmptyTestRunApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _UpdateEmptyTestRunApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("launchSource")) {
        obj["launchSource"] = ApiClient_default.convertToType(data["launchSource"], "String");
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AssignAttachmentApiModel_default]);
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [UpdateLinkApiModel_default]);
      }
      if (data.hasOwnProperty("tags")) {
        obj["tags"] = ApiClient_default.convertToType(data["tags"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>UpdateEmptyTestRunApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>UpdateEmptyTestRunApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _UpdateEmptyTestRunApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["launchSource"] && !(typeof data["launchSource"] === "string" || data["launchSource"] instanceof String)) {
      throw new Error("Expected the field `launchSource` to be a primitive type in the JSON string but got " + data["launchSource"]);
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AssignAttachmentApiModel_default.validateJSON(item);
      }
      ;
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        UpdateLinkApiModel_default.validateJSON(item);
      }
      ;
    }
    if (!Array.isArray(data["tags"])) {
      throw new Error("Expected the field `tags` to be an array in the JSON data but got " + data["tags"]);
    }
    return true;
  }
};
UpdateEmptyTestRunApiModel.RequiredProperties = ["id", "name"];
UpdateEmptyTestRunApiModel.prototype["id"] = void 0;
UpdateEmptyTestRunApiModel.prototype["name"] = void 0;
UpdateEmptyTestRunApiModel.prototype["description"] = void 0;
UpdateEmptyTestRunApiModel.prototype["launchSource"] = void 0;
UpdateEmptyTestRunApiModel.prototype["attachments"] = void 0;
UpdateEmptyTestRunApiModel.prototype["links"] = void 0;
UpdateEmptyTestRunApiModel.prototype["tags"] = void 0;

// src/adaptersapi/model/ValidationProblemDetails.js
var ValidationProblemDetails = class _ValidationProblemDetails {
  /**
   * Constructs a new <code>ValidationProblemDetails</code>.
   * @alias module:model/ValidationProblemDetails
   * @extends Object
   * @param errors {Object.<String, Array.<String>>} 
   */
  constructor(errors) {
    _ValidationProblemDetails.initialize(this, errors);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, errors) {
    obj["errors"] = errors;
  }
  /**
   * Constructs a <code>ValidationProblemDetails</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ValidationProblemDetails} obj Optional instance to populate.
   * @return {module:model/ValidationProblemDetails} The populated <code>ValidationProblemDetails</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _ValidationProblemDetails();
      ApiClient_default.constructFromObject(data, obj, "Object");
      if (data.hasOwnProperty("errors")) {
        obj["errors"] = ApiClient_default.convertToType(data["errors"], { "String": ["String"] });
      }
      if (data.hasOwnProperty("type")) {
        obj["type"] = ApiClient_default.convertToType(data["type"], "String");
      }
      if (data.hasOwnProperty("title")) {
        obj["title"] = ApiClient_default.convertToType(data["title"], "String");
      }
      if (data.hasOwnProperty("status")) {
        obj["status"] = ApiClient_default.convertToType(data["status"], "Number");
      }
      if (data.hasOwnProperty("detail")) {
        obj["detail"] = ApiClient_default.convertToType(data["detail"], "String");
      }
      if (data.hasOwnProperty("instance")) {
        obj["instance"] = ApiClient_default.convertToType(data["instance"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>ValidationProblemDetails</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>ValidationProblemDetails</code>.
   */
  static validateJSON(data) {
    for (const property of _ValidationProblemDetails.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["type"] && !(typeof data["type"] === "string" || data["type"] instanceof String)) {
      throw new Error("Expected the field `type` to be a primitive type in the JSON string but got " + data["type"]);
    }
    if (data["title"] && !(typeof data["title"] === "string" || data["title"] instanceof String)) {
      throw new Error("Expected the field `title` to be a primitive type in the JSON string but got " + data["title"]);
    }
    if (data["detail"] && !(typeof data["detail"] === "string" || data["detail"] instanceof String)) {
      throw new Error("Expected the field `detail` to be a primitive type in the JSON string but got " + data["detail"]);
    }
    if (data["instance"] && !(typeof data["instance"] === "string" || data["instance"] instanceof String)) {
      throw new Error("Expected the field `instance` to be a primitive type in the JSON string but got " + data["instance"]);
    }
    return true;
  }
};
ValidationProblemDetails.RequiredProperties = ["errors"];
ValidationProblemDetails.prototype["errors"] = void 0;
ValidationProblemDetails.prototype["type"] = void 0;
ValidationProblemDetails.prototype["title"] = void 0;
ValidationProblemDetails.prototype["status"] = void 0;
ValidationProblemDetails.prototype["detail"] = void 0;
ValidationProblemDetails.prototype["instance"] = void 0;

// src/adaptersapi/model/WorkItemParameterKeyApiResult.js
var WorkItemParameterKeyApiResult = class _WorkItemParameterKeyApiResult {
  /**
   * Constructs a new <code>WorkItemParameterKeyApiResult</code>.
   * @alias module:model/WorkItemParameterKeyApiResult
   * @param id {String} 
   */
  constructor(id) {
    _WorkItemParameterKeyApiResult.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>WorkItemParameterKeyApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkItemParameterKeyApiResult} obj Optional instance to populate.
   * @return {module:model/WorkItemParameterKeyApiResult} The populated <code>WorkItemParameterKeyApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _WorkItemParameterKeyApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>WorkItemParameterKeyApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>WorkItemParameterKeyApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _WorkItemParameterKeyApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
WorkItemParameterKeyApiResult.RequiredProperties = ["id"];
WorkItemParameterKeyApiResult.prototype["id"] = void 0;
var WorkItemParameterKeyApiResult_default = WorkItemParameterKeyApiResult;

// src/adaptersapi/model/WorkItemApiResult.js
var WorkItemApiResult = class _WorkItemApiResult {
  /**
   * Constructs a new <code>WorkItemApiResult</code>.
   * @alias module:model/WorkItemApiResult
   * @param id {String} Unique identifier of the work item
   * @param globalId {Number} Global identifier of the work item
   * @param projectId {String} Unique identifier of the project
   * @param sectionId {String} Unique identifier of the section within a project
   * @param name {String} Name of the work item
   * @param entityTypeName {module:model/WorkItemEntityTypeApiModel} Type of entity associated with this work item
   * @param duration {Number} Duration of the work item in milliseconds
   * @param state {module:model/WorkItemStateApiModel} State of the work item
   * @param priority {module:model/WorkItemPriorityApiModel} Priority level of the work item
   * @param isAutomated {Boolean} 
   * @param attributes {Object.<String, Object>} Set of custom attributes associated with the work item
   * @param tags {Array.<module:model/TagModel>} Set of tags applied to the work item
   * @param sectionPreconditionSteps {Array.<module:model/StepModel>} Set of section precondition steps that need to be executed before starting the work item steps
   * @param sectionPostconditionSteps {Array.<module:model/StepModel>} Set of section postcondition steps that need to be executed after completing the work item steps
   * @param preconditionSteps {Array.<module:model/StepModel>} Set of precondition steps that need to be executed before starting the main steps
   * @param steps {Array.<module:model/StepModel>} Main steps or actions defined for the work item
   * @param postconditionSteps {Array.<module:model/StepModel>} Set of postcondition steps that are executed after completing the main steps
   * @param iterations {Array.<module:model/IterationModel>} Associated iterations linked to the work item
   * @param autoTests {Array.<module:model/AutoTestModel>} Automated tests associated with the work item
   * @param attachments {Array.<module:model/AttachmentModel>} Files attached to the work item
   * @param links {Array.<module:model/LinkModel>} Set of links related to the work item
   * @param parameters {Array.<module:model/WorkItemParameterKeyApiResult>} Set of parameters related to the work item
   * @param isDeleted {Boolean} Indicates whether the work item is marked as deleted
   */
  constructor(id, globalId, projectId, sectionId, name, entityTypeName, duration, state, priority, isAutomated, attributes, tags, sectionPreconditionSteps, sectionPostconditionSteps, preconditionSteps, steps, postconditionSteps, iterations, autoTests, attachments, links, parameters, isDeleted) {
    _WorkItemApiResult.initialize(this, id, globalId, projectId, sectionId, name, entityTypeName, duration, state, priority, isAutomated, attributes, tags, sectionPreconditionSteps, sectionPostconditionSteps, preconditionSteps, steps, postconditionSteps, iterations, autoTests, attachments, links, parameters, isDeleted);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, globalId, projectId, sectionId, name, entityTypeName, duration, state, priority, isAutomated, attributes, tags, sectionPreconditionSteps, sectionPostconditionSteps, preconditionSteps, steps, postconditionSteps, iterations, autoTests, attachments, links, parameters, isDeleted) {
    obj["id"] = id;
    obj["globalId"] = globalId;
    obj["projectId"] = projectId;
    obj["sectionId"] = sectionId;
    obj["name"] = name;
    obj["entityTypeName"] = entityTypeName;
    obj["duration"] = duration;
    obj["state"] = state;
    obj["priority"] = priority;
    obj["isAutomated"] = isAutomated;
    obj["attributes"] = attributes;
    obj["tags"] = tags;
    obj["sectionPreconditionSteps"] = sectionPreconditionSteps;
    obj["sectionPostconditionSteps"] = sectionPostconditionSteps;
    obj["preconditionSteps"] = preconditionSteps;
    obj["steps"] = steps;
    obj["postconditionSteps"] = postconditionSteps;
    obj["iterations"] = iterations;
    obj["autoTests"] = autoTests;
    obj["attachments"] = attachments;
    obj["links"] = links;
    obj["parameters"] = parameters;
    obj["isDeleted"] = isDeleted;
  }
  /**
   * Constructs a <code>WorkItemApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkItemApiResult} obj Optional instance to populate.
   * @return {module:model/WorkItemApiResult} The populated <code>WorkItemApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _WorkItemApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("sectionId")) {
        obj["sectionId"] = ApiClient_default.convertToType(data["sectionId"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("description")) {
        obj["description"] = ApiClient_default.convertToType(data["description"], "String");
      }
      if (data.hasOwnProperty("entityTypeName")) {
        obj["entityTypeName"] = ApiClient_default.convertToType(data["entityTypeName"], WorkItemEntityTypeApiModel);
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], "Number");
      }
      if (data.hasOwnProperty("state")) {
        obj["state"] = ApiClient_default.convertToType(data["state"], WorkItemStateApiModel);
      }
      if (data.hasOwnProperty("priority")) {
        obj["priority"] = ApiClient_default.convertToType(data["priority"], WorkItemPriorityApiModel);
      }
      if (data.hasOwnProperty("isAutomated")) {
        obj["isAutomated"] = ApiClient_default.convertToType(data["isAutomated"], "Boolean");
      }
      if (data.hasOwnProperty("attributes")) {
        obj["attributes"] = ApiClient_default.convertToType(data["attributes"], { "String": Object });
      }
      if (data.hasOwnProperty("tags")) {
        obj["tags"] = ApiClient_default.convertToType(data["tags"], [TagModel_default]);
      }
      if (data.hasOwnProperty("sectionPreconditionSteps")) {
        obj["sectionPreconditionSteps"] = ApiClient_default.convertToType(data["sectionPreconditionSteps"], [StepModel_default]);
      }
      if (data.hasOwnProperty("sectionPostconditionSteps")) {
        obj["sectionPostconditionSteps"] = ApiClient_default.convertToType(data["sectionPostconditionSteps"], [StepModel_default]);
      }
      if (data.hasOwnProperty("preconditionSteps")) {
        obj["preconditionSteps"] = ApiClient_default.convertToType(data["preconditionSteps"], [StepModel_default]);
      }
      if (data.hasOwnProperty("steps")) {
        obj["steps"] = ApiClient_default.convertToType(data["steps"], [StepModel_default]);
      }
      if (data.hasOwnProperty("postconditionSteps")) {
        obj["postconditionSteps"] = ApiClient_default.convertToType(data["postconditionSteps"], [StepModel_default]);
      }
      if (data.hasOwnProperty("iterations")) {
        obj["iterations"] = ApiClient_default.convertToType(data["iterations"], [IterationModel_default]);
      }
      if (data.hasOwnProperty("autoTests")) {
        obj["autoTests"] = ApiClient_default.convertToType(data["autoTests"], [AutoTestModel_default]);
      }
      if (data.hasOwnProperty("attachments")) {
        obj["attachments"] = ApiClient_default.convertToType(data["attachments"], [AttachmentModel_default]);
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [LinkModel_default]);
      }
      if (data.hasOwnProperty("parameters")) {
        obj["parameters"] = ApiClient_default.convertToType(data["parameters"], [WorkItemParameterKeyApiResult_default]);
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>WorkItemApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>WorkItemApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _WorkItemApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["sectionId"] && !(typeof data["sectionId"] === "string" || data["sectionId"] instanceof String)) {
      throw new Error("Expected the field `sectionId` to be a primitive type in the JSON string but got " + data["sectionId"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["description"] && !(typeof data["description"] === "string" || data["description"] instanceof String)) {
      throw new Error("Expected the field `description` to be a primitive type in the JSON string but got " + data["description"]);
    }
    if (data["tags"]) {
      if (!Array.isArray(data["tags"])) {
        throw new Error("Expected the field `tags` to be an array in the JSON data but got " + data["tags"]);
      }
      for (const item of data["tags"]) {
        TagModel_default.validateJSON(item);
      }
      ;
    }
    if (data["sectionPreconditionSteps"]) {
      if (!Array.isArray(data["sectionPreconditionSteps"])) {
        throw new Error("Expected the field `sectionPreconditionSteps` to be an array in the JSON data but got " + data["sectionPreconditionSteps"]);
      }
      for (const item of data["sectionPreconditionSteps"]) {
        StepModel_default.validateJSON(item);
      }
      ;
    }
    if (data["sectionPostconditionSteps"]) {
      if (!Array.isArray(data["sectionPostconditionSteps"])) {
        throw new Error("Expected the field `sectionPostconditionSteps` to be an array in the JSON data but got " + data["sectionPostconditionSteps"]);
      }
      for (const item of data["sectionPostconditionSteps"]) {
        StepModel_default.validateJSON(item);
      }
      ;
    }
    if (data["preconditionSteps"]) {
      if (!Array.isArray(data["preconditionSteps"])) {
        throw new Error("Expected the field `preconditionSteps` to be an array in the JSON data but got " + data["preconditionSteps"]);
      }
      for (const item of data["preconditionSteps"]) {
        StepModel_default.validateJSON(item);
      }
      ;
    }
    if (data["steps"]) {
      if (!Array.isArray(data["steps"])) {
        throw new Error("Expected the field `steps` to be an array in the JSON data but got " + data["steps"]);
      }
      for (const item of data["steps"]) {
        StepModel_default.validateJSON(item);
      }
      ;
    }
    if (data["postconditionSteps"]) {
      if (!Array.isArray(data["postconditionSteps"])) {
        throw new Error("Expected the field `postconditionSteps` to be an array in the JSON data but got " + data["postconditionSteps"]);
      }
      for (const item of data["postconditionSteps"]) {
        StepModel_default.validateJSON(item);
      }
      ;
    }
    if (data["iterations"]) {
      if (!Array.isArray(data["iterations"])) {
        throw new Error("Expected the field `iterations` to be an array in the JSON data but got " + data["iterations"]);
      }
      for (const item of data["iterations"]) {
        IterationModel_default.validateJSON(item);
      }
      ;
    }
    if (data["autoTests"]) {
      if (!Array.isArray(data["autoTests"])) {
        throw new Error("Expected the field `autoTests` to be an array in the JSON data but got " + data["autoTests"]);
      }
      for (const item of data["autoTests"]) {
        AutoTestModel_default.validateJSON(item);
      }
      ;
    }
    if (data["attachments"]) {
      if (!Array.isArray(data["attachments"])) {
        throw new Error("Expected the field `attachments` to be an array in the JSON data but got " + data["attachments"]);
      }
      for (const item of data["attachments"]) {
        AttachmentModel_default.validateJSON(item);
      }
      ;
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        LinkModel_default.validateJSON(item);
      }
      ;
    }
    if (data["parameters"]) {
      if (!Array.isArray(data["parameters"])) {
        throw new Error("Expected the field `parameters` to be an array in the JSON data but got " + data["parameters"]);
      }
      for (const item of data["parameters"]) {
        WorkItemParameterKeyApiResult_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
WorkItemApiResult.RequiredProperties = ["id", "globalId", "projectId", "sectionId", "name", "entityTypeName", "duration", "state", "priority", "isAutomated", "attributes", "tags", "sectionPreconditionSteps", "sectionPostconditionSteps", "preconditionSteps", "steps", "postconditionSteps", "iterations", "autoTests", "attachments", "links", "parameters", "isDeleted"];
WorkItemApiResult.prototype["id"] = void 0;
WorkItemApiResult.prototype["globalId"] = void 0;
WorkItemApiResult.prototype["projectId"] = void 0;
WorkItemApiResult.prototype["sectionId"] = void 0;
WorkItemApiResult.prototype["name"] = void 0;
WorkItemApiResult.prototype["description"] = void 0;
WorkItemApiResult.prototype["entityTypeName"] = void 0;
WorkItemApiResult.prototype["duration"] = void 0;
WorkItemApiResult.prototype["state"] = void 0;
WorkItemApiResult.prototype["priority"] = void 0;
WorkItemApiResult.prototype["isAutomated"] = void 0;
WorkItemApiResult.prototype["attributes"] = void 0;
WorkItemApiResult.prototype["tags"] = void 0;
WorkItemApiResult.prototype["sectionPreconditionSteps"] = void 0;
WorkItemApiResult.prototype["sectionPostconditionSteps"] = void 0;
WorkItemApiResult.prototype["preconditionSteps"] = void 0;
WorkItemApiResult.prototype["steps"] = void 0;
WorkItemApiResult.prototype["postconditionSteps"] = void 0;
WorkItemApiResult.prototype["iterations"] = void 0;
WorkItemApiResult.prototype["autoTests"] = void 0;
WorkItemApiResult.prototype["attachments"] = void 0;
WorkItemApiResult.prototype["links"] = void 0;
WorkItemApiResult.prototype["parameters"] = void 0;
WorkItemApiResult.prototype["isDeleted"] = void 0;
var WorkItemApiResult_default = WorkItemApiResult;

// src/adaptersapi/model/WorkItemPriorityModel.js
var WorkItemPriorityModel = class {
  /**
   * value: "Lowest"
   * @const
   */
  "Lowest" = "Lowest";
  /**
   * value: "Low"
   * @const
   */
  "Low" = "Low";
  /**
   * value: "Medium"
   * @const
   */
  "Medium" = "Medium";
  /**
   * value: "High"
   * @const
   */
  "High" = "High";
  /**
   * value: "Highest"
   * @const
   */
  "Highest" = "Highest";
  /**
  * Returns a <code>WorkItemPriorityModel</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/WorkItemPriorityModel} The enum <code>WorkItemPriorityModel</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/WorkItemSourceTypeModel.js
var WorkItemSourceTypeModel = class {
  /**
   * value: "Manual"
   * @const
   */
  "Manual" = "Manual";
  /**
   * value: "AI"
   * @const
   */
  "AI" = "AI";
  /**
  * Returns a <code>WorkItemSourceTypeModel</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/WorkItemSourceTypeModel} The enum <code>WorkItemSourceTypeModel</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/WorkItemStates.js
var WorkItemStates = class {
  /**
   * value: "NeedsWork"
   * @const
   */
  "NeedsWork" = "NeedsWork";
  /**
   * value: "NotReady"
   * @const
   */
  "NotReady" = "NotReady";
  /**
   * value: "Ready"
   * @const
   */
  "Ready" = "Ready";
  /**
  * Returns a <code>WorkItemStates</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/WorkItemStates} The enum <code>WorkItemStates</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/WorkItemTypeModel.js
var WorkItemTypeModel = class {
  /**
   * value: "TestCases"
   * @const
   */
  "TestCases" = "TestCases";
  /**
   * value: "CheckLists"
   * @const
   */
  "CheckLists" = "CheckLists";
  /**
   * value: "SharedSteps"
   * @const
   */
  "SharedSteps" = "SharedSteps";
  /**
  * Returns a <code>WorkItemTypeModel</code> enum value from a Javascript object name.
  * @param {Object} data The plain JavaScript object containing the name of the enum value.
  * @return {module:model/WorkItemTypeModel} The enum <code>WorkItemTypeModel</code> value.
  */
  static constructFromObject(object) {
    return object;
  }
};

// src/adaptersapi/model/WorkItemFilterApiModel.js
var WorkItemFilterApiModel = class _WorkItemFilterApiModel {
  /**
   * Constructs a new <code>WorkItemFilterApiModel</code>.
   * @alias module:model/WorkItemFilterApiModel
   */
  constructor() {
    _WorkItemFilterApiModel.initialize(this);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj) {
  }
  /**
   * Constructs a <code>WorkItemFilterApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkItemFilterApiModel} obj Optional instance to populate.
   * @return {module:model/WorkItemFilterApiModel} The populated <code>WorkItemFilterApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _WorkItemFilterApiModel();
      if (data.hasOwnProperty("nameOrId")) {
        obj["nameOrId"] = ApiClient_default.convertToType(data["nameOrId"], "String");
      }
      if (data.hasOwnProperty("includeIds")) {
        obj["includeIds"] = ApiClient_default.convertToType(data["includeIds"], ["String"]);
      }
      if (data.hasOwnProperty("excludeIds")) {
        obj["excludeIds"] = ApiClient_default.convertToType(data["excludeIds"], ["String"]);
      }
      if (data.hasOwnProperty("projectIds")) {
        obj["projectIds"] = ApiClient_default.convertToType(data["projectIds"], ["String"]);
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("ids")) {
        obj["ids"] = ApiClient_default.convertToType(data["ids"], ["String"]);
      }
      if (data.hasOwnProperty("globalIds")) {
        obj["globalIds"] = ApiClient_default.convertToType(data["globalIds"], ["Number"]);
      }
      if (data.hasOwnProperty("attributes")) {
        obj["attributes"] = ApiClient_default.convertToType(data["attributes"], { "String": ["String"] });
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("sectionIds")) {
        obj["sectionIds"] = ApiClient_default.convertToType(data["sectionIds"], ["String"]);
      }
      if (data.hasOwnProperty("states")) {
        obj["states"] = ApiClient_default.convertToType(data["states"], [WorkItemStates]);
      }
      if (data.hasOwnProperty("priorities")) {
        obj["priorities"] = ApiClient_default.convertToType(data["priorities"], [WorkItemPriorityModel]);
      }
      if (data.hasOwnProperty("sourceTypes")) {
        obj["sourceTypes"] = ApiClient_default.convertToType(data["sourceTypes"], [WorkItemSourceTypeModel]);
      }
      if (data.hasOwnProperty("types")) {
        obj["types"] = ApiClient_default.convertToType(data["types"], [WorkItemTypeModel]);
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], Int32RangeSelectorModel_default);
      }
      if (data.hasOwnProperty("isAutomated")) {
        obj["isAutomated"] = ApiClient_default.convertToType(data["isAutomated"], "Boolean");
      }
      if (data.hasOwnProperty("tags")) {
        obj["tags"] = ApiClient_default.convertToType(data["tags"], ["String"]);
      }
      if (data.hasOwnProperty("excludeTags")) {
        obj["excludeTags"] = ApiClient_default.convertToType(data["excludeTags"], ["String"]);
      }
      if (data.hasOwnProperty("autoTestIds")) {
        obj["autoTestIds"] = ApiClient_default.convertToType(data["autoTestIds"], ["String"]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>WorkItemFilterApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>WorkItemFilterApiModel</code>.
   */
  static validateJSON(data) {
    if (data["nameOrId"] && !(typeof data["nameOrId"] === "string" || data["nameOrId"] instanceof String)) {
      throw new Error("Expected the field `nameOrId` to be a primitive type in the JSON string but got " + data["nameOrId"]);
    }
    if (!Array.isArray(data["includeIds"])) {
      throw new Error("Expected the field `includeIds` to be an array in the JSON data but got " + data["includeIds"]);
    }
    if (!Array.isArray(data["excludeIds"])) {
      throw new Error("Expected the field `excludeIds` to be an array in the JSON data but got " + data["excludeIds"]);
    }
    if (!Array.isArray(data["projectIds"])) {
      throw new Error("Expected the field `projectIds` to be an array in the JSON data but got " + data["projectIds"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (!Array.isArray(data["ids"])) {
      throw new Error("Expected the field `ids` to be an array in the JSON data but got " + data["ids"]);
    }
    if (!Array.isArray(data["globalIds"])) {
      throw new Error("Expected the field `globalIds` to be an array in the JSON data but got " + data["globalIds"]);
    }
    if (!Array.isArray(data["sectionIds"])) {
      throw new Error("Expected the field `sectionIds` to be an array in the JSON data but got " + data["sectionIds"]);
    }
    if (!Array.isArray(data["states"])) {
      throw new Error("Expected the field `states` to be an array in the JSON data but got " + data["states"]);
    }
    if (!Array.isArray(data["priorities"])) {
      throw new Error("Expected the field `priorities` to be an array in the JSON data but got " + data["priorities"]);
    }
    if (!Array.isArray(data["sourceTypes"])) {
      throw new Error("Expected the field `sourceTypes` to be an array in the JSON data but got " + data["sourceTypes"]);
    }
    if (!Array.isArray(data["types"])) {
      throw new Error("Expected the field `types` to be an array in the JSON data but got " + data["types"]);
    }
    if (data["duration"]) {
      Int32RangeSelectorModel_default.validateJSON(data["duration"]);
    }
    if (!Array.isArray(data["tags"])) {
      throw new Error("Expected the field `tags` to be an array in the JSON data but got " + data["tags"]);
    }
    if (!Array.isArray(data["excludeTags"])) {
      throw new Error("Expected the field `excludeTags` to be an array in the JSON data but got " + data["excludeTags"]);
    }
    if (!Array.isArray(data["autoTestIds"])) {
      throw new Error("Expected the field `autoTestIds` to be an array in the JSON data but got " + data["autoTestIds"]);
    }
    return true;
  }
};
WorkItemFilterApiModel.prototype["nameOrId"] = void 0;
WorkItemFilterApiModel.prototype["includeIds"] = void 0;
WorkItemFilterApiModel.prototype["excludeIds"] = void 0;
WorkItemFilterApiModel.prototype["projectIds"] = void 0;
WorkItemFilterApiModel.prototype["name"] = void 0;
WorkItemFilterApiModel.prototype["ids"] = void 0;
WorkItemFilterApiModel.prototype["globalIds"] = void 0;
WorkItemFilterApiModel.prototype["attributes"] = void 0;
WorkItemFilterApiModel.prototype["isDeleted"] = void 0;
WorkItemFilterApiModel.prototype["sectionIds"] = void 0;
WorkItemFilterApiModel.prototype["states"] = void 0;
WorkItemFilterApiModel.prototype["priorities"] = void 0;
WorkItemFilterApiModel.prototype["sourceTypes"] = void 0;
WorkItemFilterApiModel.prototype["types"] = void 0;
WorkItemFilterApiModel.prototype["duration"] = void 0;
WorkItemFilterApiModel.prototype["isAutomated"] = void 0;
WorkItemFilterApiModel.prototype["tags"] = void 0;
WorkItemFilterApiModel.prototype["excludeTags"] = void 0;
WorkItemFilterApiModel.prototype["autoTestIds"] = void 0;
var WorkItemFilterApiModel_default = WorkItemFilterApiModel;

// src/adaptersapi/model/WorkItemIdApiModel.js
var WorkItemIdApiModel = class _WorkItemIdApiModel {
  /**
   * Constructs a new <code>WorkItemIdApiModel</code>.
   * @alias module:model/WorkItemIdApiModel
   * @param id {String} Work Item ID or Global ID
   */
  constructor(id) {
    _WorkItemIdApiModel.initialize(this, id);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id) {
    obj["id"] = id;
  }
  /**
   * Constructs a <code>WorkItemIdApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkItemIdApiModel} obj Optional instance to populate.
   * @return {module:model/WorkItemIdApiModel} The populated <code>WorkItemIdApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _WorkItemIdApiModel();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>WorkItemIdApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>WorkItemIdApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _WorkItemIdApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    return true;
  }
};
WorkItemIdApiModel.RequiredProperties = ["id"];
WorkItemIdApiModel.prototype["id"] = void 0;

// src/adaptersapi/model/WorkItemSelectApiModel.js
var WorkItemSelectApiModel = class _WorkItemSelectApiModel {
  /**
   * Constructs a new <code>WorkItemSelectApiModel</code>.
   * @alias module:model/WorkItemSelectApiModel
   * @param filter {module:model/WorkItemFilterApiModel} 
   */
  constructor(filter) {
    _WorkItemSelectApiModel.initialize(this, filter);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, filter) {
    obj["filter"] = filter;
  }
  /**
   * Constructs a <code>WorkItemSelectApiModel</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkItemSelectApiModel} obj Optional instance to populate.
   * @return {module:model/WorkItemSelectApiModel} The populated <code>WorkItemSelectApiModel</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _WorkItemSelectApiModel();
      if (data.hasOwnProperty("filter")) {
        obj["filter"] = ApiClient_default.convertToType(data["filter"], WorkItemFilterApiModel_default);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>WorkItemSelectApiModel</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>WorkItemSelectApiModel</code>.
   */
  static validateJSON(data) {
    for (const property of _WorkItemSelectApiModel.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["filter"]) {
      WorkItemFilterApiModel_default.validateJSON(data["filter"]);
    }
    return true;
  }
};
WorkItemSelectApiModel.RequiredProperties = ["filter"];
WorkItemSelectApiModel.prototype["filter"] = void 0;

// src/adaptersapi/model/WorkItemShortApiResult.js
var WorkItemShortApiResult = class _WorkItemShortApiResult {
  /**
   * Constructs a new <code>WorkItemShortApiResult</code>.
   * @alias module:model/WorkItemShortApiResult
   * @param id {String} Work Item internal unique identifier
   * @param name {String} Work Item name
   * @param entityTypeName {String} Work Item type. Possible values: CheckLists, SharedSteps, TestCases
   * @param projectId {String} Project unique identifier
   * @param sectionId {String} Identifier of Section where Work Item is located
   * @param sectionName {String} Section name of Work Item
   * @param isAutomated {Boolean} Boolean flag determining whether Work Item is automated
   * @param globalId {Number} Work Item global identifier
   * @param duration {Number} Work Item duration
   * @param state {module:model/WorkItemStates} The current state of Work Item
   * @param priority {module:model/WorkItemPriorityModel} Work Item priority level
   * @param sourceType {module:model/WorkItemSourceTypeModel} Work Item priority level
   * @param isDeleted {Boolean} Flag determining whether Work Item is deleted
   * @param iterations {Array.<module:model/IterationApiResult>} Set of iterations related to Work Item
   * @param links {Array.<module:model/LinkShortApiResult>} Set of links related to Work Item
   */
  constructor(id, name, entityTypeName, projectId, sectionId, sectionName, isAutomated, globalId, duration, state, priority, sourceType, isDeleted, iterations, links) {
    _WorkItemShortApiResult.initialize(this, id, name, entityTypeName, projectId, sectionId, sectionName, isAutomated, globalId, duration, state, priority, sourceType, isDeleted, iterations, links);
  }
  /**
   * Initializes the fields of this object.
   * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
   * Only for internal use.
   */
  static initialize(obj, id, name, entityTypeName, projectId, sectionId, sectionName, isAutomated, globalId, duration, state, priority, sourceType, isDeleted, iterations, links) {
    obj["id"] = id;
    obj["name"] = name;
    obj["entityTypeName"] = entityTypeName;
    obj["projectId"] = projectId;
    obj["sectionId"] = sectionId;
    obj["sectionName"] = sectionName;
    obj["isAutomated"] = isAutomated;
    obj["globalId"] = globalId;
    obj["duration"] = duration;
    obj["state"] = state;
    obj["priority"] = priority;
    obj["sourceType"] = sourceType;
    obj["isDeleted"] = isDeleted;
    obj["iterations"] = iterations;
    obj["links"] = links;
  }
  /**
   * Constructs a <code>WorkItemShortApiResult</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkItemShortApiResult} obj Optional instance to populate.
   * @return {module:model/WorkItemShortApiResult} The populated <code>WorkItemShortApiResult</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new _WorkItemShortApiResult();
      if (data.hasOwnProperty("id")) {
        obj["id"] = ApiClient_default.convertToType(data["id"], "String");
      }
      if (data.hasOwnProperty("name")) {
        obj["name"] = ApiClient_default.convertToType(data["name"], "String");
      }
      if (data.hasOwnProperty("entityTypeName")) {
        obj["entityTypeName"] = ApiClient_default.convertToType(data["entityTypeName"], "String");
      }
      if (data.hasOwnProperty("projectId")) {
        obj["projectId"] = ApiClient_default.convertToType(data["projectId"], "String");
      }
      if (data.hasOwnProperty("sectionId")) {
        obj["sectionId"] = ApiClient_default.convertToType(data["sectionId"], "String");
      }
      if (data.hasOwnProperty("sectionName")) {
        obj["sectionName"] = ApiClient_default.convertToType(data["sectionName"], "String");
      }
      if (data.hasOwnProperty("isAutomated")) {
        obj["isAutomated"] = ApiClient_default.convertToType(data["isAutomated"], "Boolean");
      }
      if (data.hasOwnProperty("globalId")) {
        obj["globalId"] = ApiClient_default.convertToType(data["globalId"], "Number");
      }
      if (data.hasOwnProperty("duration")) {
        obj["duration"] = ApiClient_default.convertToType(data["duration"], "Number");
      }
      if (data.hasOwnProperty("attributes")) {
        obj["attributes"] = ApiClient_default.convertToType(data["attributes"], { "String": Object });
      }
      if (data.hasOwnProperty("state")) {
        obj["state"] = ApiClient_default.convertToType(data["state"], WorkItemStates);
      }
      if (data.hasOwnProperty("priority")) {
        obj["priority"] = ApiClient_default.convertToType(data["priority"], WorkItemPriorityModel);
      }
      if (data.hasOwnProperty("sourceType")) {
        obj["sourceType"] = ApiClient_default.convertToType(data["sourceType"], WorkItemSourceTypeModel);
      }
      if (data.hasOwnProperty("isDeleted")) {
        obj["isDeleted"] = ApiClient_default.convertToType(data["isDeleted"], "Boolean");
      }
      if (data.hasOwnProperty("tagNames")) {
        obj["tagNames"] = ApiClient_default.convertToType(data["tagNames"], ["String"]);
      }
      if (data.hasOwnProperty("iterations")) {
        obj["iterations"] = ApiClient_default.convertToType(data["iterations"], [IterationApiResult_default]);
      }
      if (data.hasOwnProperty("links")) {
        obj["links"] = ApiClient_default.convertToType(data["links"], [LinkShortApiResult_default]);
      }
    }
    return obj;
  }
  /**
   * Validates the JSON data with respect to <code>WorkItemShortApiResult</code>.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @return {boolean} to indicate whether the JSON data is valid with respect to <code>WorkItemShortApiResult</code>.
   */
  static validateJSON(data) {
    for (const property of _WorkItemShortApiResult.RequiredProperties) {
      if (!data.hasOwnProperty(property)) {
        throw new Error("The required field `" + property + "` is not found in the JSON data: " + JSON.stringify(data));
      }
    }
    if (data["id"] && !(typeof data["id"] === "string" || data["id"] instanceof String)) {
      throw new Error("Expected the field `id` to be a primitive type in the JSON string but got " + data["id"]);
    }
    if (data["name"] && !(typeof data["name"] === "string" || data["name"] instanceof String)) {
      throw new Error("Expected the field `name` to be a primitive type in the JSON string but got " + data["name"]);
    }
    if (data["entityTypeName"] && !(typeof data["entityTypeName"] === "string" || data["entityTypeName"] instanceof String)) {
      throw new Error("Expected the field `entityTypeName` to be a primitive type in the JSON string but got " + data["entityTypeName"]);
    }
    if (data["projectId"] && !(typeof data["projectId"] === "string" || data["projectId"] instanceof String)) {
      throw new Error("Expected the field `projectId` to be a primitive type in the JSON string but got " + data["projectId"]);
    }
    if (data["sectionId"] && !(typeof data["sectionId"] === "string" || data["sectionId"] instanceof String)) {
      throw new Error("Expected the field `sectionId` to be a primitive type in the JSON string but got " + data["sectionId"]);
    }
    if (data["sectionName"] && !(typeof data["sectionName"] === "string" || data["sectionName"] instanceof String)) {
      throw new Error("Expected the field `sectionName` to be a primitive type in the JSON string but got " + data["sectionName"]);
    }
    if (!Array.isArray(data["tagNames"])) {
      throw new Error("Expected the field `tagNames` to be an array in the JSON data but got " + data["tagNames"]);
    }
    if (data["iterations"]) {
      if (!Array.isArray(data["iterations"])) {
        throw new Error("Expected the field `iterations` to be an array in the JSON data but got " + data["iterations"]);
      }
      for (const item of data["iterations"]) {
        IterationApiResult_default.validateJSON(item);
      }
      ;
    }
    if (data["links"]) {
      if (!Array.isArray(data["links"])) {
        throw new Error("Expected the field `links` to be an array in the JSON data but got " + data["links"]);
      }
      for (const item of data["links"]) {
        LinkShortApiResult_default.validateJSON(item);
      }
      ;
    }
    return true;
  }
};
WorkItemShortApiResult.RequiredProperties = ["id", "name", "entityTypeName", "projectId", "sectionId", "sectionName", "isAutomated", "globalId", "duration", "state", "priority", "sourceType", "isDeleted", "iterations", "links"];
WorkItemShortApiResult.prototype["id"] = void 0;
WorkItemShortApiResult.prototype["name"] = void 0;
WorkItemShortApiResult.prototype["entityTypeName"] = void 0;
WorkItemShortApiResult.prototype["projectId"] = void 0;
WorkItemShortApiResult.prototype["sectionId"] = void 0;
WorkItemShortApiResult.prototype["sectionName"] = void 0;
WorkItemShortApiResult.prototype["isAutomated"] = void 0;
WorkItemShortApiResult.prototype["globalId"] = void 0;
WorkItemShortApiResult.prototype["duration"] = void 0;
WorkItemShortApiResult.prototype["attributes"] = void 0;
WorkItemShortApiResult.prototype["state"] = void 0;
WorkItemShortApiResult.prototype["priority"] = void 0;
WorkItemShortApiResult.prototype["sourceType"] = void 0;
WorkItemShortApiResult.prototype["isDeleted"] = void 0;
WorkItemShortApiResult.prototype["tagNames"] = void 0;
WorkItemShortApiResult.prototype["iterations"] = void 0;
WorkItemShortApiResult.prototype["links"] = void 0;
var WorkItemShortApiResult_default = WorkItemShortApiResult;

// src/adaptersapi/api/ProjectSectionsApi.js
var ProjectSectionsApi = class {
  /**
  * Constructs a new ProjectSectionsApi. 
  * @alias module:api/ProjectSectionsApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient_default.instance;
  }
  /**
   * Get project sections
   * @param {String} projectId 
   * @param {Object} opts Optional parameters
   * @param {Number} [skip] Amount of items to be skipped (offset)
   * @param {Number} [take] Amount of items to be taken (limit)
   * @param {String} [orderBy] SQL-like  ORDER BY statement (column1 ASC|DESC , column2 ASC|DESC)
   * @param {String} [searchField] Property name for searching
   * @param {String} [searchValue] Value for searching
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<module:model/SectionModel>} and HTTP response
   */
  adaptersProjectsProjectIdSectionsGetWithHttpInfo(projectId, opts) {
    opts = opts || {};
    let postBody = null;
    if (projectId === void 0 || projectId === null) {
      throw new Error("Missing the required parameter 'projectId' when calling adaptersProjectsProjectIdSectionsGet");
    }
    let pathParams = {
      "projectId": projectId
    };
    let queryParams = {
      "Skip": opts["skip"],
      "Take": opts["take"],
      "OrderBy": opts["orderBy"],
      "SearchField": opts["searchField"],
      "SearchValue": opts["searchValue"]
    };
    let headerParams = {};
    let formParams = {};
    let authNames = ["PrivateToken", "Identity.Application"];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = [SectionModel_default];
    return this.apiClient.callApi(
      "/adapters/projects/{projectId}/sections",
      "GET",
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }
  /**
   * Get project sections
   * @param {String} projectId 
   * @param {Object} opts Optional parameters
   * @param {Number} opts.skip Amount of items to be skipped (offset)
   * @param {Number} opts.take Amount of items to be taken (limit)
   * @param {String} opts.orderBy SQL-like  ORDER BY statement (column1 ASC|DESC , column2 ASC|DESC)
   * @param {String} opts.searchField Property name for searching
   * @param {String} opts.searchValue Value for searching
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/SectionModel>}
   */
  adaptersProjectsProjectIdSectionsGet(projectId, opts) {
    return this.adaptersProjectsProjectIdSectionsGetWithHttpInfo(projectId, opts).then(function(response_and_data) {
      return response_and_data.data;
    });
  }
};

// src/adaptersapi/api/WorkItemsApi.js
var WorkItemsApi = class {
  /**
  * Constructs a new WorkItemsApi. 
  * @alias module:api/WorkItemsApi
  * @class
  * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:ApiClient#instance} if unspecified.
  */
  constructor(apiClient) {
    this.apiClient = apiClient || ApiClient_default.instance;
  }
  /**
   * Get Test Case, Checklist or Shared Step by Id or GlobalId
   * @param {String} id Internal (UUID) or global (integer) identifier
   * @param {Object} opts Optional parameters
   * @param {String} [versionId] 
   * @param {Number} [versionNumber] 
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/WorkItemApiResult} and HTTP response
   */
  adaptersWorkItemsIdGetWithHttpInfo(id, opts) {
    opts = opts || {};
    let postBody = null;
    if (id === void 0 || id === null) {
      throw new Error("Missing the required parameter 'id' when calling adaptersWorkItemsIdGet");
    }
    let pathParams = {
      "id": id
    };
    let queryParams = {
      "versionId": opts["versionId"],
      "versionNumber": opts["versionNumber"]
    };
    let headerParams = {};
    let formParams = {};
    let authNames = ["PrivateToken", "Identity.Application"];
    let contentTypes = [];
    let accepts = ["application/json"];
    let returnType = WorkItemApiResult_default;
    return this.apiClient.callApi(
      "/adapters/workItems/{id}",
      "GET",
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }
  /**
   * Get Test Case, Checklist or Shared Step by Id or GlobalId
   * @param {String} id Internal (UUID) or global (integer) identifier
   * @param {Object} opts Optional parameters
   * @param {String} opts.versionId 
   * @param {Number} opts.versionNumber 
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/WorkItemApiResult}
   */
  adaptersWorkItemsIdGet(id, opts) {
    return this.adaptersWorkItemsIdGetWithHttpInfo(id, opts).then(function(response_and_data) {
      return response_and_data.data;
    });
  }
  /**
   * Creates work item
   * @param {Object} opts Optional parameters
   * @param {module:model/CreateWorkItemApiModel} [createWorkItemApiModel] 
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/WorkItemApiResult} and HTTP response
   */
  adaptersWorkItemsPostWithHttpInfo(opts) {
    opts = opts || {};
    let postBody = opts["createWorkItemApiModel"];
    let pathParams = {};
    let queryParams = {};
    let headerParams = {};
    let formParams = {};
    let authNames = ["PrivateToken", "Identity.Application"];
    let contentTypes = ["application/json"];
    let accepts = ["application/json"];
    let returnType = WorkItemApiResult_default;
    return this.apiClient.callApi(
      "/adapters/workItems",
      "POST",
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }
  /**
   * Creates work item
   * @param {Object} opts Optional parameters
   * @param {module:model/CreateWorkItemApiModel} opts.createWorkItemApiModel 
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/WorkItemApiResult}
   */
  adaptersWorkItemsPost(opts) {
    return this.adaptersWorkItemsPostWithHttpInfo(opts).then(function(response_and_data) {
      return response_and_data.data;
    });
  }
  /**
   * Search for work items
   * @param {Object} opts Optional parameters
   * @param {Number} [skip] Amount of items to be skipped (offset)
   * @param {Number} [take] Amount of items to be taken (limit)
   * @param {String} [orderBy] SQL-like  ORDER BY statement (column1 ASC|DESC , column2 ASC|DESC)
   * @param {String} [searchField] Property name for searching
   * @param {String} [searchValue] Value for searching
   * @param {module:model/WorkItemSelectApiModel} [workItemSelectApiModel] 
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<module:model/WorkItemShortApiResult>} and HTTP response
   */
  adaptersWorkItemsSearchPostWithHttpInfo(opts) {
    opts = opts || {};
    let postBody = opts["workItemSelectApiModel"];
    let pathParams = {};
    let queryParams = {
      "Skip": opts["skip"],
      "Take": opts["take"],
      "OrderBy": opts["orderBy"],
      "SearchField": opts["searchField"],
      "SearchValue": opts["searchValue"]
    };
    let headerParams = {};
    let formParams = {};
    let authNames = ["PrivateToken", "Identity.Application"];
    let contentTypes = ["application/json"];
    let accepts = ["application/json"];
    let returnType = [WorkItemShortApiResult_default];
    return this.apiClient.callApi(
      "/adapters/workItems/search",
      "POST",
      pathParams,
      queryParams,
      headerParams,
      formParams,
      postBody,
      authNames,
      contentTypes,
      accepts,
      returnType,
      null
    );
  }
  /**
   * Search for work items
   * @param {Object} opts Optional parameters
   * @param {Number} opts.skip Amount of items to be skipped (offset)
   * @param {Number} opts.take Amount of items to be taken (limit)
   * @param {String} opts.orderBy SQL-like  ORDER BY statement (column1 ASC|DESC , column2 ASC|DESC)
   * @param {String} opts.searchField Property name for searching
   * @param {String} opts.searchValue Value for searching
   * @param {module:model/WorkItemSelectApiModel} opts.workItemSelectApiModel 
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/WorkItemShortApiResult>}
   */
  adaptersWorkItemsSearchPost(opts) {
    return this.adaptersWorkItemsSearchPostWithHttpInfo(opts).then(function(response_and_data) {
      return response_and_data.data;
    });
  }
};

// src/clients/tms.client.handler.ts
var vscode = __toESM(require("vscode"));
function handleHttpError(err, message = "") {
  const status = err?.status ?? err?.statusCode;
  const body = err?.body !== void 0 ? typeof err.body === "string" ? err.body : JSON.stringify(err.body) : void 0;
  const details = body ?? err?.error?.message ?? err?.error ?? err?.message ?? "";
  vscode.window.showErrorMessage(
    `HttpError ${status ?? "unknown"}: ${message}. Error body: ${details}`
  );
}

// src/clients/tms.client.ts
var TmsClient = class {
  projectSectionsApi;
  workItemsApi;
  constructor(url, token) {
    const defaultClient = ApiClient_default.instance;
    defaultClient.basePath = url;
    const auth = defaultClient.authentications["PrivateToken"];
    auth.apiKeyPrefix = "PrivateToken";
    auth.apiKey = token;
    this.projectSectionsApi = new ProjectSectionsApi();
    this.workItemsApi = new WorkItemsApi();
  }
  async getSectionsByProjectId(id) {
    return await this.projectSectionsApi.adaptersProjectsProjectIdSectionsGet(id, {}).then((response) => response).catch((err) => {
      handleHttpError(err);
      return [];
    });
  }
  async getWorkItemsBySectionId(id) {
    if (id === void 0 || id === "") {
      return [];
    }
    const filter = {
      sectionIds: [id],
      isDeleted: false
    };
    const request = {
      filter
    };
    return await this.workItemsApi.adaptersWorkItemsSearchPost({ workItemSelectApiModel: request }).then((response) => response).catch((err) => {
      handleHttpError(err);
      return [];
    });
  }
  async getWorkItemById(id) {
    return await this.workItemsApi.adaptersWorkItemsIdGet(id, {}).then((response) => response).catch((err) => {
      handleHttpError(err);
      return void 0;
    });
  }
};

// src/configuration.ts
var vscode2 = __toESM(require("vscode"));
var TmsConfiguration = class {
  static getUrl() {
    const url = vscode2.workspace.getConfiguration("testitManagement").get("url");
    if (!url) {
      vscode2.window.showErrorMessage("Url is not found!").then();
      throw new Error("Url is not found!");
    }
    return url;
  }
  static getProjectId() {
    const projectId = vscode2.workspace.getConfiguration("testitManagement").get("projectId");
    if (!projectId) {
      vscode2.window.showErrorMessage("Project id is not found!").then();
      throw new Error("Project id is not found!");
    }
    return projectId;
  }
  static getToken() {
    const token = vscode2.workspace.getConfiguration("testitManagement").get("token");
    if (!token) {
      vscode2.window.showErrorMessage("Token is not found!").then();
      throw new Error("Token is not found!");
    }
    return token;
  }
  static getSelectedFramework() {
    const framework = vscode2.workspace.getConfiguration("testitManagement").get("framework");
    if (!framework) {
      vscode2.window.showErrorMessage("Framework is not found!").then();
      throw new Error("Framework is not found!");
    }
    return framework;
  }
};

// src/snippets/codeceptjs.snippet.ts
var CodeceptJSSnippet = class {
  static CODE_SNIPPET = "    Scenario('testName',\n    {\n        externalId: 'externalId',\n        displayName: 'displayName_',\n        title: 'title_',\n        description: 'description',\n        workitemIds: ['globalId']\n    },\n    ({ I }) => {\n        // See work item [globalId] for detailed steps description\n        // Pre:\n        //   preconditions\n        // Steps:\n        //   testSteps\n        // Post:\n        //   postconditions\n    });\n";
  static getComparator(id) {
    return `workitemIds: ['${id}']`;
  }
  static getNewSnippet(name, id) {
    return this.CODE_SNIPPET.replace("testName", name).replace("globalId", id).replace("title_", name).replace("displayName_", name);
  }
};

// src/snippets/gherkin.snippet.ts
var GherkinSnippet = class {
  static CODE_SNIPPET = "    Scenario('testName',\n    {\n        externalId: 'externalId',\n        displayName: 'displayName_',\n        title: 'title_',\n        description: 'description',\n        workitemIds: ['globalId']\n    },\n    ({ I }) => {\n        // See work item [globalId] for detailed steps description\n        // Pre:\n        //   preconditions\n        // Steps:\n        //   testSteps\n        // Post:\n        //   postconditions\n    });\n";
  static getComparator(id) {
    return `@WorkItemIds=${id}`;
  }
  static getNewSnippet(name, id) {
    return this.CODE_SNIPPET.replace("testName", name).replace("globalId", id).replace("title_", name).replace("displayName_", name);
  }
};

// src/snippets/junit.snippet.ts
var JunitSnippet = class {
  static CODE_SNIPPET = '    @WorkItemIds("globalId")\n    @Test\n    public void testName() {\n        // See work item [globalId] for detailed steps description\n        // Pre:\n        //   preconditions\n        // Steps:\n        //   testSteps\n        // Post:\n        //   postconditions\n    }\n';
  static getComparator(id) {
    return `@WorkItemIds("${id}")`;
  }
  static getNewSnippet(name, id) {
    return this.CODE_SNIPPET.replace("testName", name).replace("globalId", id);
  }
};

// src/snippets/mocha.snippet.ts
var MochaSnippet = class {
  static CODE_SNIPPET = '    it("testName", function () {\n        this.externalId = "externalId";\n        this.displayName = "displayName_";\n        this.title = "title_";\n        this.description = "description";\n        this.workItemsIds = ["globalId"];\n        \n        // See work item [globalId] for detailed steps description\n        // Pre:\n        //   preconditions\n        // Steps:\n        //   testSteps\n        // Post:\n        //   postconditions\n    });\n';
  static getComparator(id) {
    return `this.workItemsIds = ["${id}"];`;
  }
  static getNewSnippet(name, id) {
    return this.CODE_SNIPPET.replace("testName", name).replace("globalId", id).replace("title_", name).replace("displayName_", name);
  }
};

// src/snippets/mstest.nunit.snippet.ts
var MSTestOrNUnitSnippet = class {
  static CODE_SNIPPET = '    [ExternalId("externalId")]\n    [DisplayName("displayName_")]\n    [Title("title_")]\n    [Tms.Adapter.Attributes.Description("description")]\n    [WorkItemIds("globalId")]\n    [TestMethod]\n    public void testName()\n    {\n        // See work item [globalId] for detailed steps description\n        // Pre:\n        //   preconditions\n        // Steps:\n        //   testSteps\n        // Post:\n        //   postconditions\n    }\n';
  static getComparator(id) {
    return `[WorkItemIds("${id}")]`;
  }
  static getNewSnippet(name, id) {
    return this.CODE_SNIPPET.replace("testName", name).replace("globalId", id).replace("title_", name).replace("displayName_", name);
  }
};

// src/snippets/playwright.jest.snippet.ts
var PlaywrightOrJestSnippet = class {
  static CODE_SNIPPET = `    test('testName', () => {
        testit.externalId('externalId');
        testit.displayName('displayName_');
        testit.title('title_');
        testit.description('description');
        testit.workItemIds(["globalId"]);
        
        // See work item [globalId] for detailed steps description
        // Pre:
        //   preconditions
        // Steps:
        //   testSteps
        // Post:
        //   postconditions
    });
`;
  static getComparator(id) {
    return `testit.workItemIds(["${id}"]);`;
  }
  static getNewSnippet(name, id) {
    return this.CODE_SNIPPET.replace("testName", name).replace("globalId", id).replace("title_", name).replace("displayName_", name);
  }
};

// src/snippets/pytest.nose.snippet.ts
var PytestOrNoseSnippet = class {
  static CODE_SNIPPET = '    @testit.externalId("externalId")\n    @testit.displayName("displayName_")\n    @testit.title("title_")\n    @testit.description("description")\n    @testit.workItemIds("globalId")\n    def test_testName():\n        # See work item [globalId] for detailed steps description\n        # Pre:\n        #   preconditions\n        # Steps:\n        #   testSteps\n        # Post:\n        #   postconditions\n    \n';
  static getComparator(id) {
    return `@testit.workItemIds("${id}")`;
  }
  static getNewSnippet(name, id) {
    return this.CODE_SNIPPET.replace("testName", name).replace("globalId", id).replace("title_", name).replace("displayName_", name);
  }
};

// src/snippets/robotframework.snippet.ts
var RobotFrameworkSnippet = class {
  static CODE_SNIPPET = "    testName\n        [Tags]  testit.externalID:externalId\n        ...     testit.displayName:displayName_\n        ...     testit.title:title_\n        ...     testit.description:description\n        ...     testit.workitemsID:globalId\n        # See work item [globalId] for detailed steps description\n        # Pre:\n        #   preconditions\n        # Steps:\n        #   testSteps\n        # Post:\n        #   postconditions\n";
  static getComparator(id) {
    return `testit.workitemsID:${id}`;
  }
  static getNewSnippet(name, id) {
    return this.CODE_SNIPPET.replace("testName", name).replace("globalId", id).replace("title_", name).replace("displayName_", name);
  }
};

// src/snippets/testcafe.snippet.ts
var TestCafeSnippet = class {
  static CODE_SNIPPET = "    test.meta({\n        externalId: 'externalId',\n        displayName: 'displayName_',\n        title: 'title_',\n        description: 'description',\n        workItemIds: ['globalId'],\n    })('testName', async t => {\n        // See work item [globalId] for detailed steps description\n        // Pre:\n        //   preconditions\n        // Steps:\n        //   testSteps\n        // Post:\n        //   postconditions\n    });\n";
  static getComparator(id) {
    return `workItemIds: ['${id}'],`;
  }
  static getNewSnippet(name, id) {
    return this.CODE_SNIPPET.replace("testName", name).replace("globalId", id).replace("title_", name).replace("displayName_", name);
  }
};

// src/snippets/xunit.snippet.ts
var XUnitSnippet = class {
  static CODE_SNIPPET = '    [ExternalId("externalId")]\n    [Title("title_")]\n    [Description("description")]\n    [WorkItemIds("globalId")]\n    [TmsFact(DisplayName = "displayName_")]\n    public void testName()\n    {\n        // See work item [globalId] for detailed steps description\n        // Pre:\n        //   preconditions\n        // Steps:\n        //   testSteps\n        // Post:\n        //   postconditions\n    }\n';
  static getComparator(id) {
    return `[WorkItemIds("${id}")]`;
  }
  static getNewSnippet(name, id) {
    return this.CODE_SNIPPET.replace("testName", name).replace("globalId", id).replace("title_", name).replace("displayName_", name);
  }
};

// src/utils/snippet.utils.ts
var CodeSnippetUtils = class {
  static getNewSnippet(name, id) {
    const framework = TmsConfiguration.getSelectedFramework();
    switch (framework) {
      case "behave" /* BEHAVE */.toString():
        return GherkinSnippet.getNewSnippet(name, id);
      case "nose" /* NOSE */.toString():
        return PytestOrNoseSnippet.getNewSnippet(name, id);
      case "pytest" /* PYTEST */.toString():
        return PytestOrNoseSnippet.getNewSnippet(name, id);
      case "robotframework" /* ROBOTFRAMEWORK */.toString():
        return RobotFrameworkSnippet.getNewSnippet(name, id);
      case "junit" /* JUNIT */.toString():
        return JunitSnippet.getNewSnippet(name, id);
      case "mstest" /* MSTEST */.toString():
        return MSTestOrNUnitSnippet.getNewSnippet(name, id);
      case "nunit" /* NUNIT */.toString():
        return MSTestOrNUnitSnippet.getNewSnippet(name, id);
      case "xunit" /* XUNIT */.toString():
        return XUnitSnippet.getNewSnippet(name, id);
      case "specflow" /* SPECFLOW */.toString():
        return GherkinSnippet.getNewSnippet(name, id);
      case "codeceptjs" /* CODECEPTJS */.toString():
        return CodeceptJSSnippet.getNewSnippet(name, id);
      case "cucumber" /* CUCUMBER */.toString():
        return GherkinSnippet.getNewSnippet(name, id);
      case "jest" /* JEST */.toString():
        return PlaywrightOrJestSnippet.getNewSnippet(name, id);
      case "mocha" /* MOCHA */.toString():
        return MochaSnippet.getNewSnippet(name, id);
      case "playwright" /* PLAYWRIGHT */.toString():
        return PlaywrightOrJestSnippet.getNewSnippet(name, id);
      case "testcafe" /* TESTCAFE */.toString():
        return TestCafeSnippet.getNewSnippet(name, id);
      default:
        return JunitSnippet.getNewSnippet(name, id);
    }
  }
  getComparator(id) {
    const framework = TmsConfiguration.getSelectedFramework();
    switch (framework) {
      case "behave" /* BEHAVE */.toString():
        return GherkinSnippet.getComparator(id);
      case "nose" /* NOSE */.toString():
        return PytestOrNoseSnippet.getComparator(id);
      case "pytest" /* PYTEST */.toString():
        return PytestOrNoseSnippet.getComparator(id);
      case "robotframework" /* ROBOTFRAMEWORK */.toString():
        return RobotFrameworkSnippet.getComparator(id);
      case "junit" /* JUNIT */.toString():
        return JunitSnippet.getComparator(id);
      case "mstest" /* MSTEST */.toString():
        return MSTestOrNUnitSnippet.getComparator(id);
      case "nunit" /* NUNIT */.toString():
        return MSTestOrNUnitSnippet.getComparator(id);
      case "xunit" /* XUNIT */.toString():
        return XUnitSnippet.getComparator(id);
      case "specflow" /* SPECFLOW */.toString():
        return GherkinSnippet.getComparator(id);
      case "codeceptjs" /* CODECEPTJS */.toString():
        return CodeceptJSSnippet.getComparator(id);
      case "cucumber" /* CUCUMBER */.toString():
        return GherkinSnippet.getComparator(id);
      case "jest" /* JEST */.toString():
        return PlaywrightOrJestSnippet.getComparator(id);
      case "mocha" /* MOCHA */.toString():
        return MochaSnippet.getComparator(id);
      case "playwright" /* PLAYWRIGHT */.toString():
        return PlaywrightOrJestSnippet.getComparator(id);
      case "testcafe" /* TESTCAFE */.toString():
        return TestCafeSnippet.getComparator(id);
      default:
        return JunitSnippet.getComparator(id);
    }
  }
};

// src/utils/file.utils.ts
var fs = __toESM(require("node:fs"));
var path = __toESM(require("node:path"));
var vscode3 = __toESM(require("vscode"));

// src/parsers/pytest.parser.ts
var PytestParser = class {
  static ANNOTATION_SEPARATOR = "\\.";
  static EVERYTHING_IN_PARENTHESES = "\\([\\s\\S][^)]{1,}\\)";
  static ALLURE_OBJECT = "allure";
  static ALLURE_METHOD = this.ALLURE_OBJECT + this.ANNOTATION_SEPARATOR;
  static IMPORT_ALLURE_OBJECT = `import ${this.ALLURE_OBJECT}`;
  static ALLURE_TITLE = this.ALLURE_METHOD + "title";
  static ALLURE_DESCRIPTION = this.ALLURE_METHOD + "description";
  static ALLURE_DESCRIPTION_HTML = this.ALLURE_METHOD + "description_html";
  static ALLURE_LINK = this.ALLURE_METHOD + "link" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_ISSUE = this.ALLURE_METHOD + "issue" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_TESTCASE = this.ALLURE_METHOD + "testcase" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_TAG = this.ALLURE_METHOD + "tag";
  static ALLURE_LABEL = this.ALLURE_METHOD + "label";
  static ALLURE_ID = this.ALLURE_METHOD + "id";
  static ALLURE_EPIC = this.ALLURE_METHOD + "epic";
  static ALLURE_FEATURE = this.ALLURE_METHOD + "feature";
  static ALLURE_STORY = this.ALLURE_METHOD + "story";
  static ALLURE_PARENT_SUITE = this.ALLURE_METHOD + "parent_suite";
  static ALLURE_SUITE = this.ALLURE_METHOD + "suite";
  static ALLURE_SUB_SUITE = this.ALLURE_METHOD + "sub_suite";
  static ALLURE_STEP = this.ALLURE_METHOD + "step";
  static ALLURE_DYNAMIC = this.ALLURE_METHOD + "dynamic" + this.ANNOTATION_SEPARATOR;
  static ALLURE_DYNAMIC_TITLE = this.ALLURE_DYNAMIC + "title";
  static ALLURE_DYNAMIC_DESCRIPTION = this.ALLURE_DYNAMIC + "description";
  static ALLURE_DYNAMIC_DESCRIPTION_HTML = this.ALLURE_DYNAMIC + "description_html";
  static ALLURE_DYNAMIC_LINK = this.ALLURE_DYNAMIC + "link" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_DYNAMIC_ISSUE = this.ALLURE_DYNAMIC + "issue" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_DYNAMIC_TESTCASES = this.ALLURE_DYNAMIC + "testcase" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_DYNAMIC_TAG = this.ALLURE_DYNAMIC + "tag";
  static ALLURE_DYNAMIC_LABEL = this.ALLURE_DYNAMIC + "label";
  static ALLURE_DYNAMIC_ID = this.ALLURE_DYNAMIC + "id";
  static ALLURE_DYNAMIC_EPIC = this.ALLURE_DYNAMIC + "epic";
  static ALLURE_DYNAMIC_FEATURE = this.ALLURE_DYNAMIC + "feature";
  static ALLURE_DYNAMIC_STORY = this.ALLURE_DYNAMIC + "story";
  static ALLURE_DYNAMIC_PARENT_SUITE = this.ALLURE_DYNAMIC + "parent_suite";
  static ALLURE_DYNAMIC_SUITE = this.ALLURE_DYNAMIC + "suite";
  static ALLURE_DYNAMIC_SUB_SUITE = this.ALLURE_DYNAMIC + "sub_suite";
  static ALLURE_DYNAMIC_PARAMETER = this.ALLURE_DYNAMIC + "parameter";
  static ALLURE_DYNAMIC_ATTACHMENT_WRITE = this.ALLURE_METHOD + "attach" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_DYNAMIC_ATTACHMENT_READ = this.ALLURE_METHOD + "attach" + this.ANNOTATION_SEPARATOR + "file" + this.EVERYTHING_IN_PARENTHESES;
  static VARIABLE = `[^'",\\s)]+`;
  static VALUE = `'[^']*'|"[^"]*"`;
  static ASSIGNMENT = "\\s*=\\s*";
  static LINK_URL_PARAMETER_NAME = "url";
  static LINK_NAME_PARAMETER_NAME = "name";
  static LINK_PARAMETER_WITHOUT_NAME = "(?!" + this.LINK_URL_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.LINK_NAME_PARAMETER_NAME + this.ASSIGNMENT + ")";
  static LINK_URL_PARAMETER = `(?:\\(\\s*${this.LINK_PARAMETER_WITHOUT_NAME}|(?<=${this.LINK_URL_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.LINK_URL_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static LINK_NAME_PARAMETER = `(?:\\(\\s*(?:${this.VARIABLE}|${this.VALUE})\\s*,\\s*${this.LINK_PARAMETER_WITHOUT_NAME}|(?<=${this.LINK_NAME_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.LINK_NAME_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static ATTACHMENT_BODY_PARAMETER_NAME = "body";
  static ATTACHMENT_SOURCE_PARAMETER_NAME = "source";
  static ATTACHMENT_NAME_PARAMETER_NAME = "name";
  static ATTACHMENT_TYPE_PARAMETER_NAME = "attachment_type";
  static ATTACHMENT_EXTENSION_PARAMETER_NAME = "extension";
  static GENERAL_PARAMETER_WITHOUT_NAME = this.ATTACHMENT_NAME_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.ATTACHMENT_TYPE_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.ATTACHMENT_EXTENSION_PARAMETER_NAME + this.ASSIGNMENT;
  static ATTACHMENT_READ_PARAMETER_WITHOUT_NAME = "(?!" + this.ATTACHMENT_SOURCE_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.GENERAL_PARAMETER_WITHOUT_NAME + ")";
  static ATTACHMENT_WRITE_PARAMETER_WITHOUT_NAME = "(?!" + this.ATTACHMENT_BODY_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.GENERAL_PARAMETER_WITHOUT_NAME + ")";
  static ATTACHMENT_SOURCE_PARAMETER = `(?:\\(\\s*${this.ATTACHMENT_READ_PARAMETER_WITHOUT_NAME}|(?<=${this.ATTACHMENT_SOURCE_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.ATTACHMENT_SOURCE_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static ATTACHMENT_BODY_PARAMETER = `(?:\\(\\s*${this.ATTACHMENT_WRITE_PARAMETER_WITHOUT_NAME}|(?<=${this.ATTACHMENT_BODY_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.ATTACHMENT_BODY_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static ATTACHMENT_NAME_PARAMETER = `(?:\\(\\s*(?:${this.VARIABLE}|${this.VALUE})\\s*,\\s*${this.ATTACHMENT_READ_PARAMETER_WITHOUT_NAME}|(?<=${this.ATTACHMENT_NAME_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.ATTACHMENT_NAME_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static PARAMETER_NAME_PARAMETER_NAME = "name";
  static PARAMETER_VALUE_PARAMETER_NAME = "value";
  static PARAMETER_PARAMETER_WITHOUT_NAME = "(?!" + this.PARAMETER_NAME_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.PARAMETER_VALUE_PARAMETER_NAME + this.ASSIGNMENT + ")";
  static PARAMETER_NAME_PARAMETER = `(?:\\(\\s*${this.PARAMETER_PARAMETER_WITHOUT_NAME}|(?<=${this.PARAMETER_NAME_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.PARAMETER_NAME_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static PARAMETER_VALUE_PARAMETER = `(?:\\(\\s*(?:${this.VARIABLE}|${this.VALUE})\\s*,\\s*${this.PARAMETER_PARAMETER_WITHOUT_NAME}|(?<=${this.PARAMETER_VALUE_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.PARAMETER_VALUE_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static ANNOTATION_SEPARATOR_OBJECT = ".";
  static PARAMETERS_SEPARATOR_OBJECT = ", ";
  static TMS_OBJECT = "testit";
  static IMPORT_TMS_OBJECT = `import ${this.TMS_OBJECT}`;
  static TMS_METHOD_OBJECT = this.TMS_OBJECT + this.ANNOTATION_SEPARATOR_OBJECT;
  static TMS_DISPLAY_NAME = this.TMS_METHOD_OBJECT + "displayName";
  static TMS_DESCRIPTION = this.TMS_METHOD_OBJECT + "description";
  static TMS_LABELS = this.TMS_METHOD_OBJECT + "labels";
  static TMS_STEP = this.TMS_METHOD_OBJECT + "step";
  static TMS_LINKS = this.TMS_METHOD_OBJECT + "links";
  static TMS_NAMESPACE = this.TMS_METHOD_OBJECT + "nameSpace";
  static TMS_CLASSNAME = this.TMS_METHOD_OBJECT + "className";
  static TMS_ADD_DISPLAY_NAME = this.TMS_METHOD_OBJECT + "addDisplayName";
  static TMS_ADD_NAMESPACE = this.TMS_METHOD_OBJECT + "addNameSpace";
  static TMS_ADD_CLASSNAME = this.TMS_METHOD_OBJECT + "addClassName";
  static TMS_ADD_DESCRIPTION = this.TMS_METHOD_OBJECT + "addDescription";
  static TMS_ADD_LABELS = this.TMS_METHOD_OBJECT + "addLabels";
  static TMS_ADD_LINKS = this.TMS_METHOD_OBJECT + "addLinks";
  static TMS_ADD_PARAMETER = this.TMS_METHOD_OBJECT + "addParameter";
  static TMS_ADD_ATTACHMENTS = this.TMS_METHOD_OBJECT + "addAttachments";
  static patternActions;
  // Compile patterns lazily once
  static getPatternActions() {
    this.patternActions ??= /* @__PURE__ */ new Map([
      [new RegExp(this.IMPORT_ALLURE_OBJECT, "mg"), this.IMPORT_TMS_OBJECT],
      [new RegExp(this.ALLURE_TITLE, "mg"), this.TMS_DISPLAY_NAME],
      [new RegExp(this.ALLURE_DESCRIPTION, "mg"), this.TMS_DESCRIPTION],
      [new RegExp(this.ALLURE_DESCRIPTION_HTML, "mg"), this.TMS_DESCRIPTION],
      [new RegExp(this.ALLURE_TAG, "mg"), this.TMS_LABELS],
      [new RegExp(this.ALLURE_LABEL, "mg"), this.TMS_LABELS],
      [new RegExp(this.ALLURE_ID, "mg"), this.TMS_LABELS],
      [new RegExp(this.ALLURE_STEP, "mg"), this.TMS_STEP],
      [new RegExp(this.ALLURE_LINK, "mg"), this.parseLinkAnnotation.bind(this)],
      [new RegExp(this.ALLURE_ISSUE, "mg"), this.parseLinkAnnotation.bind(this)],
      [new RegExp(this.ALLURE_TESTCASE, "mg"), this.parseLinkAnnotation.bind(this)],
      [new RegExp(this.ALLURE_PARENT_SUITE, "mg"), this.TMS_NAMESPACE],
      [new RegExp(this.ALLURE_SUITE, "mg"), this.TMS_NAMESPACE],
      [new RegExp(this.ALLURE_SUB_SUITE, "mg"), this.TMS_CLASSNAME],
      [new RegExp(this.ALLURE_EPIC, "mg"), this.TMS_NAMESPACE],
      [new RegExp(this.ALLURE_FEATURE, "mg"), this.TMS_NAMESPACE],
      [new RegExp(this.ALLURE_STORY, "mg"), this.TMS_CLASSNAME],
      [new RegExp(this.ALLURE_DYNAMIC_TITLE, "mg"), this.TMS_ADD_DISPLAY_NAME],
      [new RegExp(this.ALLURE_DYNAMIC_DESCRIPTION, "mg"), this.TMS_ADD_DESCRIPTION],
      [new RegExp(this.ALLURE_DYNAMIC_DESCRIPTION_HTML, "mg"), this.TMS_ADD_DESCRIPTION],
      [new RegExp(this.ALLURE_DYNAMIC_LINK, "mg"), this.parseLinkMethod.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_ISSUE, "mg"), this.parseLinkMethod.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_TESTCASES, "mg"), this.parseLinkMethod.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_TAG, "mg"), this.TMS_ADD_LABELS],
      [new RegExp(this.ALLURE_DYNAMIC_LABEL, "mg"), this.TMS_ADD_LABELS],
      [new RegExp(this.ALLURE_DYNAMIC_ID, "mg"), this.TMS_ADD_LABELS],
      [new RegExp(this.ALLURE_DYNAMIC_EPIC, "mg"), this.TMS_ADD_NAMESPACE],
      [new RegExp(this.ALLURE_DYNAMIC_FEATURE, "mg"), this.TMS_ADD_NAMESPACE],
      [new RegExp(this.ALLURE_DYNAMIC_STORY, "mg"), this.TMS_ADD_CLASSNAME],
      [new RegExp(this.ALLURE_DYNAMIC_PARENT_SUITE, "mg"), this.TMS_ADD_NAMESPACE],
      [new RegExp(this.ALLURE_DYNAMIC_SUITE, "mg"), this.TMS_ADD_NAMESPACE],
      [new RegExp(this.ALLURE_DYNAMIC_SUB_SUITE, "mg"), this.TMS_ADD_CLASSNAME],
      [new RegExp(this.ALLURE_DYNAMIC_ATTACHMENT_WRITE, "mg"), this.parseWriteAttachMethod.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_ATTACHMENT_READ, "mg"), this.parseReadAttachMethod.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_PARAMETER, "mg"), this.parseParameterMethod.bind(this)]
    ]);
    return this.patternActions;
  }
  static getPatterns() {
    return this.getPatternActions().keys();
  }
  static parse(code) {
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
  static parseLinkAnnotation(code) {
    const urlPattern = new RegExp(this.LINK_URL_PARAMETER, "mg");
    const namePattern = new RegExp(this.LINK_NAME_PARAMETER, "mg");
    const urlMatch = Array.from(code.matchAll(urlPattern))[0];
    if (urlMatch == void 0) {
      throw new Error(`Can't getting url from annotation ${code}`);
    }
    const nameMatch = Array.from(code.matchAll(namePattern))[0];
    const url = urlMatch.groups[this.LINK_URL_PARAMETER_NAME];
    const name = nameMatch?.groups[this.LINK_NAME_PARAMETER_NAME];
    const titleBlock = name != null ? `${this.PARAMETERS_SEPARATOR_OBJECT}title=${name}` : "";
    return `${this.TMS_LINKS}(url=${url}${titleBlock})`;
  }
  static parseLinkMethod(code) {
    const urlPattern = new RegExp(this.LINK_URL_PARAMETER, "mg");
    const namePattern = new RegExp(this.LINK_NAME_PARAMETER, "mg");
    const urlMatch = Array.from(code.matchAll(urlPattern))[0];
    if (urlMatch == void 0) {
      throw new Error(`Can't getting url from method ${code}`);
    }
    const nameMatch = Array.from(code.matchAll(namePattern))[0];
    const url = urlMatch.groups[this.LINK_URL_PARAMETER_NAME];
    const name = nameMatch?.groups[this.LINK_NAME_PARAMETER_NAME];
    const titleBlock = name != null ? `${this.PARAMETERS_SEPARATOR_OBJECT}title=${name}` : "";
    return `${this.TMS_ADD_LINKS}(url=${url}${titleBlock})`;
  }
  static parseWriteAttachMethod(code) {
    const bodyPattern = new RegExp(this.ATTACHMENT_BODY_PARAMETER, "mg");
    const namePattern = new RegExp(this.ATTACHMENT_NAME_PARAMETER, "mg");
    const bodyMatch = Array.from(code.matchAll(bodyPattern))[0];
    if (bodyMatch == void 0) {
      throw new Error(`Can't getting body from method ${code}`);
    }
    const nameMatch = Array.from(code.matchAll(namePattern))[0];
    const body = bodyMatch.groups[this.ATTACHMENT_BODY_PARAMETER_NAME];
    const name = nameMatch?.groups[this.ATTACHMENT_NAME_PARAMETER_NAME];
    const nameBlock = name != null ? `${this.PARAMETERS_SEPARATOR_OBJECT}name=${name}` : "";
    return `${this.TMS_ADD_ATTACHMENTS}(${body}${this.PARAMETERS_SEPARATOR_OBJECT}is_text=True${nameBlock})`;
  }
  static parseReadAttachMethod(code) {
    const sourcePattern = new RegExp(this.ATTACHMENT_SOURCE_PARAMETER, "mg");
    const namePattern = new RegExp(this.ATTACHMENT_NAME_PARAMETER, "mg");
    const sourceMatch = Array.from(code.matchAll(sourcePattern))[0];
    if (sourceMatch == void 0) {
      throw new Error(`Can't getting source from method ${code}`);
    }
    const nameMatch = Array.from(code.matchAll(namePattern))[0];
    const source = sourceMatch.groups[this.ATTACHMENT_SOURCE_PARAMETER_NAME];
    const name = nameMatch?.groups[this.ATTACHMENT_NAME_PARAMETER_NAME];
    const nameBlock = name != null ? `${this.PARAMETERS_SEPARATOR_OBJECT}name=${name}` : "";
    return `${this.TMS_ADD_ATTACHMENTS}(${source}${nameBlock})`;
  }
  static parseParameterMethod(code) {
    const namePattern = new RegExp(this.PARAMETER_NAME_PARAMETER, "mg");
    const valuePattern = new RegExp(this.PARAMETER_VALUE_PARAMETER, "mg");
    const nameMatch = Array.from(code.matchAll(namePattern))[0];
    if (nameMatch == void 0) {
      throw new Error(`Can't getting name from method ${code}`);
    }
    const valueMatch = Array.from(code.matchAll(valuePattern))[0];
    if (valueMatch == void 0) {
      throw new Error(`Can't getting value from method ${code}`);
    }
    const name = nameMatch.groups[this.PARAMETER_NAME_PARAMETER_NAME];
    const value = valueMatch.groups[this.PARAMETER_VALUE_PARAMETER_NAME];
    return `${this.TMS_ADD_PARAMETER}(name=${name}${this.PARAMETERS_SEPARATOR_OBJECT}value=${value})`;
  }
};

// src/parsers/robotframework.parser.ts
var RobotFrameworkParser = class {
  static ANNOTATION_SEPARATOR = "\\.";
  static KEY_VALUE_SEPARATOR = ":";
  static EVERYTHING_AFTER_ANNOTATION = "[^\\s]{1,}";
  static ALLURE_OBJECT = "allure";
  static ALLURE_METHOD = this.ALLURE_OBJECT + this.ANNOTATION_SEPARATOR;
  static ALLURE_LINK_LABEL_NAME = "link";
  static ALLURE_ISSUE_LABEL_NAME = "issue";
  static ALLURE_TMS_LABEL_NAME = "tms";
  static ALLURE_LINK = this.ALLURE_METHOD + this.ALLURE_LINK_LABEL_NAME + this.EVERYTHING_AFTER_ANNOTATION;
  static ALLURE_ISSUE = this.ALLURE_METHOD + this.ALLURE_ISSUE_LABEL_NAME + this.EVERYTHING_AFTER_ANNOTATION;
  static ALLURE_TESTCASE = this.ALLURE_METHOD + this.ALLURE_TMS_LABEL_NAME + this.EVERYTHING_AFTER_ANNOTATION;
  static ALLURE_EPIC_LABEL_NAME = "epic";
  static ALLURE_FEATURE_LABEL_NAME = "feature";
  static ALLURE_STORY_LABEL_NAME = "story";
  static ALLURE_PARENT_SUITE_LABEL_NAME = "parentSuite";
  static ALLURE_SUITE_LABEL_NAME = "suite";
  static ALLURE_SUB_SUITE_LABEL_NAME = "subSuite";
  static ALLURE_PACKAGE_LABEL_NAME = "package";
  static ALLURE_TEST_CLASS_LABEL_NAME = "testClass";
  static ALLURE_TEST_METHOD_LABEL_NAME = "testMethod";
  static ALLURE_ID_LABEL_NAME = "as_id";
  static LABEL_OTHER_FUNCTIONS_NAMES = "(?!" + this.ALLURE_EPIC_LABEL_NAME + "|" + this.ALLURE_FEATURE_LABEL_NAME + "|" + this.ALLURE_STORY_LABEL_NAME + "|" + this.ALLURE_PARENT_SUITE_LABEL_NAME + "|" + this.ALLURE_SUITE_LABEL_NAME + "|" + this.ALLURE_SUB_SUITE_LABEL_NAME + "|" + this.ALLURE_PACKAGE_LABEL_NAME + "|" + this.ALLURE_TEST_CLASS_LABEL_NAME + "|" + this.ALLURE_TEST_METHOD_LABEL_NAME + ")";
  static ALLURE_LABEL = this.ALLURE_METHOD + `label[${this.ANNOTATION_SEPARATOR}|${this.KEY_VALUE_SEPARATOR}]`;
  static ALLURE_EPIC = this.ALLURE_LABEL + this.ALLURE_EPIC_LABEL_NAME + this.KEY_VALUE_SEPARATOR;
  static ALLURE_FEATURE = this.ALLURE_LABEL + this.ALLURE_FEATURE_LABEL_NAME + this.KEY_VALUE_SEPARATOR;
  static ALLURE_STORY = this.ALLURE_LABEL + this.ALLURE_STORY_LABEL_NAME + this.KEY_VALUE_SEPARATOR;
  static ALLURE_PARENT_SUITE = this.ALLURE_LABEL + this.ALLURE_PARENT_SUITE_LABEL_NAME + this.KEY_VALUE_SEPARATOR;
  static ALLURE_SUITE = this.ALLURE_LABEL + this.ALLURE_SUITE_LABEL_NAME + this.KEY_VALUE_SEPARATOR;
  static ALLURE_SUB_SUITE = this.ALLURE_LABEL + this.ALLURE_SUB_SUITE_LABEL_NAME + this.KEY_VALUE_SEPARATOR;
  static ALLURE_PACKAGE = this.ALLURE_LABEL + this.ALLURE_PACKAGE_LABEL_NAME + this.KEY_VALUE_SEPARATOR;
  static ALLURE_TEST_CLASS = this.ALLURE_LABEL + this.ALLURE_TEST_CLASS_LABEL_NAME + this.KEY_VALUE_SEPARATOR;
  static ALLURE_TEST_METHOD = this.ALLURE_LABEL + this.ALLURE_TEST_METHOD_LABEL_NAME + this.KEY_VALUE_SEPARATOR;
  static ALLURE_ID = this.ALLURE_METHOD + this.ALLURE_ID_LABEL_NAME + this.KEY_VALUE_SEPARATOR + this.KEY_VALUE_SEPARATOR;
  static ALLURE_OTHER_FUNCTIONS_LABELS = this.ALLURE_LABEL + this.LABEL_OTHER_FUNCTIONS_NAMES + this.EVERYTHING_AFTER_ANNOTATION;
  static LINK_NAME_ANNOTATION_NAME = "name";
  static LINK_URL_ANNOTATION_NAME = "url";
  static LINK_NAME_ANNOTATION = `(\\.(?!${this.ALLURE_LINK_LABEL_NAME}|${this.ALLURE_ISSUE_LABEL_NAME}|${this.ALLURE_TMS_LABEL_NAME})(?<${this.LINK_NAME_ANNOTATION_NAME}>[^\\s.:]+))?:`;
  static LINK_URL_ANNOTATION = `:(?<${this.LINK_URL_ANNOTATION_NAME}>\\S+)`;
  static LABEL_VALUE_ANNOTATION_NAME = "value";
  static LABEL_VALUE_ANNOTATION = `label[.|:](?<${this.LABEL_VALUE_ANNOTATION_NAME}>\\S+)`;
  static LABEL_ID_VALUE_ANNOTATION = `${this.ALLURE_METHOD}(?<${this.LABEL_VALUE_ANNOTATION_NAME}>\\S+)`;
  static IMPORT_ALLURE_OBJECT = `import ${this.ALLURE_OBJECT}`;
  static EVERYTHING_IN_PARENTHESES = "\\([\\s\\S][^)]{1,}\\)";
  static ALLURE_STEP = this.ALLURE_METHOD + "step";
  static ALLURE_DYNAMIC = this.ALLURE_METHOD + "dynamic" + this.ANNOTATION_SEPARATOR;
  static ALLURE_DYNAMIC_TITLE = this.ALLURE_DYNAMIC + "title";
  static ALLURE_DYNAMIC_DESCRIPTION = this.ALLURE_DYNAMIC + "description";
  static ALLURE_DYNAMIC_DESCRIPTION_HTML = this.ALLURE_DYNAMIC + "description_html";
  static ALLURE_DYNAMIC_LINK = this.ALLURE_DYNAMIC + "link" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_DYNAMIC_ISSUE = this.ALLURE_DYNAMIC + "issue" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_DYNAMIC_TESTCASES = this.ALLURE_DYNAMIC + "testcase" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_DYNAMIC_TAG = this.ALLURE_DYNAMIC + "tag";
  static ALLURE_DYNAMIC_LABEL = this.ALLURE_DYNAMIC + "label";
  static ALLURE_DYNAMIC_ID = this.ALLURE_DYNAMIC + "id";
  static ALLURE_DYNAMIC_EPIC = this.ALLURE_DYNAMIC + "epic";
  static ALLURE_DYNAMIC_FEATURE = this.ALLURE_DYNAMIC + "feature";
  static ALLURE_DYNAMIC_STORY = this.ALLURE_DYNAMIC + "story";
  static ALLURE_DYNAMIC_PARENT_SUITE = this.ALLURE_DYNAMIC + "parent_suite";
  static ALLURE_DYNAMIC_SUITE = this.ALLURE_DYNAMIC + "suite";
  static ALLURE_DYNAMIC_SUB_SUITE = this.ALLURE_DYNAMIC + "sub_suite";
  static ALLURE_DYNAMIC_PARAMETER = this.ALLURE_DYNAMIC + "parameter";
  static ALLURE_DYNAMIC_ATTACHMENT_WRITE = this.ALLURE_METHOD + "attach" + this.EVERYTHING_IN_PARENTHESES;
  static ALLURE_DYNAMIC_ATTACHMENT_READ = this.ALLURE_METHOD + "attach" + this.ANNOTATION_SEPARATOR + "file" + this.EVERYTHING_IN_PARENTHESES;
  static VARIABLE = `[^'",\\s)]+`;
  static VALUE = `'[^']*'|"[^"]*"`;
  static ASSIGNMENT = "\\s*=\\s*";
  static LINK_URL_PARAMETER_NAME = "url";
  static LINK_NAME_PARAMETER_NAME = "name";
  static LINK_PARAMETER_WITHOUT_NAME = "(?!" + this.LINK_URL_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.LINK_NAME_PARAMETER_NAME + this.ASSIGNMENT + ")";
  static LINK_URL_PARAMETER = `(?:\\(\\s*${this.LINK_PARAMETER_WITHOUT_NAME}|(?<=${this.LINK_URL_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.LINK_URL_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static LINK_NAME_PARAMETER = `(?:\\(\\s*(?:${this.VARIABLE}|${this.VALUE})\\s*,\\s*${this.LINK_PARAMETER_WITHOUT_NAME}|(?<=${this.LINK_NAME_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.LINK_NAME_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static ATTACHMENT_BODY_PARAMETER_NAME = "body";
  static ATTACHMENT_SOURCE_PARAMETER_NAME = "source";
  static ATTACHMENT_NAME_PARAMETER_NAME = "name";
  static ATTACHMENT_TYPE_PARAMETER_NAME = "attachment_type";
  static ATTACHMENT_EXTENSION_PARAMETER_NAME = "extension";
  static GENERAL_PARAMETER_WITHOUT_NAME = this.ATTACHMENT_NAME_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.ATTACHMENT_TYPE_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.ATTACHMENT_EXTENSION_PARAMETER_NAME + this.ASSIGNMENT;
  static ATTACHMENT_READ_PARAMETER_WITHOUT_NAME = "(?!" + this.ATTACHMENT_SOURCE_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.GENERAL_PARAMETER_WITHOUT_NAME + ")";
  static ATTACHMENT_WRITE_PARAMETER_WITHOUT_NAME = "(?!" + this.ATTACHMENT_BODY_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.GENERAL_PARAMETER_WITHOUT_NAME + ")";
  static ATTACHMENT_SOURCE_PARAMETER = `(?:\\(\\s*${this.ATTACHMENT_READ_PARAMETER_WITHOUT_NAME}|(?<=${this.ATTACHMENT_SOURCE_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.ATTACHMENT_SOURCE_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static ATTACHMENT_BODY_PARAMETER = `(?:\\(\\s*${this.ATTACHMENT_WRITE_PARAMETER_WITHOUT_NAME}|(?<=${this.ATTACHMENT_BODY_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.ATTACHMENT_BODY_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static ATTACHMENT_NAME_PARAMETER = `(?:\\(\\s*(?:${this.VARIABLE}|${this.VALUE})\\s*,\\s*${this.ATTACHMENT_READ_PARAMETER_WITHOUT_NAME}|(?<=${this.ATTACHMENT_NAME_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.ATTACHMENT_NAME_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static PARAMETER_NAME_PARAMETER_NAME = "name";
  static PARAMETER_VALUE_PARAMETER_NAME = "value";
  static PARAMETER_PARAMETER_WITHOUT_NAME = "(?!" + this.PARAMETER_NAME_PARAMETER_NAME + this.ASSIGNMENT + "|" + this.PARAMETER_VALUE_PARAMETER_NAME + this.ASSIGNMENT + ")";
  static PARAMETER_NAME_PARAMETER = `(?:\\(\\s*${this.PARAMETER_PARAMETER_WITHOUT_NAME}|(?<=${this.PARAMETER_NAME_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.PARAMETER_NAME_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static PARAMETER_VALUE_PARAMETER = `(?:\\(\\s*(?:${this.VARIABLE}|${this.VALUE})\\s*,\\s*${this.PARAMETER_PARAMETER_WITHOUT_NAME}|(?<=${this.PARAMETER_VALUE_PARAMETER_NAME})${this.ASSIGNMENT})(?<${this.PARAMETER_VALUE_PARAMETER_NAME}>${this.VARIABLE}|${this.VALUE})`;
  static TMS_OBJECT = "testit";
  static METHOD_SEPARATOR_OBJECT = ".";
  static ANNOTATION_SEPARATOR_OBJECT = ",";
  static PARAMETERS_SEPARATOR_OBJECT = ", ";
  static TMS_METHOD_OBJECT = this.TMS_OBJECT + this.METHOD_SEPARATOR_OBJECT;
  static TMS_LABELS = this.TMS_METHOD_OBJECT + "labels" + this.KEY_VALUE_SEPARATOR;
  static TMS_LINKS = this.TMS_METHOD_OBJECT + "links" + this.KEY_VALUE_SEPARATOR;
  static TMS_NAMESPACE = this.TMS_METHOD_OBJECT + "nameSpace" + this.KEY_VALUE_SEPARATOR;
  static TMS_CLASSNAME = this.TMS_METHOD_OBJECT + "className" + this.KEY_VALUE_SEPARATOR;
  static TMS_DISPLAY_NAME = this.TMS_METHOD_OBJECT + "displayName" + this.KEY_VALUE_SEPARATOR;
  static IMPORT_TMS_OBJECT = `import ${this.TMS_OBJECT}`;
  static TMS_STEP = this.TMS_METHOD_OBJECT + "step";
  static TMS_ADD_DISPLAY_NAME = this.TMS_METHOD_OBJECT + "addDisplayName";
  static TMS_ADD_NAMESPACE = this.TMS_METHOD_OBJECT + "addNameSpace";
  static TMS_ADD_CLASSNAME = this.TMS_METHOD_OBJECT + "addClassName";
  static TMS_ADD_DESCRIPTION = this.TMS_METHOD_OBJECT + "addDescription";
  static TMS_ADD_LABELS = this.TMS_METHOD_OBJECT + "addLabels";
  static TMS_ADD_LINKS = this.TMS_METHOD_OBJECT + "addLinks";
  static TMS_ADD_PARAMETER = this.TMS_METHOD_OBJECT + "addParameter";
  static TMS_ADD_ATTACHMENTS = this.TMS_METHOD_OBJECT + "addAttachments";
  static patternActions;
  // Compile patterns lazily once
  static getPatternActions() {
    this.patternActions ??= /* @__PURE__ */ new Map([
      [new RegExp(this.IMPORT_ALLURE_OBJECT, "mg"), this.IMPORT_TMS_OBJECT],
      [new RegExp(this.ALLURE_OTHER_FUNCTIONS_LABELS, "mg"), this.parseOtherFunctionsLabels.bind(this)],
      [new RegExp(this.ALLURE_STEP, "mg"), this.TMS_STEP],
      [new RegExp(this.ALLURE_LINK, "mg"), this.parseLinkAnnotation.bind(this)],
      [new RegExp(this.ALLURE_ISSUE, "mg"), this.parseLinkAnnotation.bind(this)],
      [new RegExp(this.ALLURE_TESTCASE, "mg"), this.parseLinkAnnotation.bind(this)],
      [new RegExp(this.ALLURE_PARENT_SUITE, "mg"), this.TMS_NAMESPACE],
      [new RegExp(this.ALLURE_SUITE, "mg"), this.TMS_NAMESPACE],
      [new RegExp(this.ALLURE_SUB_SUITE, "mg"), this.TMS_CLASSNAME],
      [new RegExp(this.ALLURE_EPIC, "mg"), this.TMS_NAMESPACE],
      [new RegExp(this.ALLURE_FEATURE, "mg"), this.TMS_NAMESPACE],
      [new RegExp(this.ALLURE_STORY, "mg"), this.TMS_CLASSNAME],
      [new RegExp(this.ALLURE_PACKAGE, "mg"), this.TMS_NAMESPACE],
      [new RegExp(this.ALLURE_TEST_CLASS, "mg"), this.TMS_CLASSNAME],
      [new RegExp(this.ALLURE_TEST_METHOD, "mg"), this.TMS_DISPLAY_NAME],
      [new RegExp(this.ALLURE_ID, "mg"), this.parseIdLabel.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_TITLE, "mg"), this.TMS_ADD_DISPLAY_NAME],
      [new RegExp(this.ALLURE_DYNAMIC_DESCRIPTION, "mg"), this.TMS_ADD_DESCRIPTION],
      [new RegExp(this.ALLURE_DYNAMIC_DESCRIPTION_HTML, "mg"), this.TMS_ADD_DESCRIPTION],
      [new RegExp(this.ALLURE_DYNAMIC_LINK, "mg"), this.parseLinkMethod.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_ISSUE, "mg"), this.parseLinkMethod.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_TESTCASES, "mg"), this.parseLinkMethod.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_TAG, "mg"), this.TMS_ADD_LABELS],
      [new RegExp(this.ALLURE_DYNAMIC_LABEL, "mg"), this.TMS_ADD_LABELS],
      [new RegExp(this.ALLURE_DYNAMIC_ID, "mg"), this.TMS_ADD_LABELS],
      [new RegExp(this.ALLURE_DYNAMIC_EPIC, "mg"), this.TMS_ADD_NAMESPACE],
      [new RegExp(this.ALLURE_DYNAMIC_FEATURE, "mg"), this.TMS_ADD_NAMESPACE],
      [new RegExp(this.ALLURE_DYNAMIC_STORY, "mg"), this.TMS_ADD_CLASSNAME],
      [new RegExp(this.ALLURE_DYNAMIC_PARENT_SUITE, "mg"), this.TMS_ADD_NAMESPACE],
      [new RegExp(this.ALLURE_DYNAMIC_SUITE, "mg"), this.TMS_ADD_NAMESPACE],
      [new RegExp(this.ALLURE_DYNAMIC_SUB_SUITE, "mg"), this.TMS_ADD_CLASSNAME],
      [new RegExp(this.ALLURE_DYNAMIC_ATTACHMENT_WRITE, "mg"), this.parseWriteAttachMethod.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_ATTACHMENT_READ, "mg"), this.parseReadAttachMethod.bind(this)],
      [new RegExp(this.ALLURE_DYNAMIC_PARAMETER, "mg"), this.parseParameterMethod.bind(this)]
    ]);
    return this.patternActions;
  }
  static getPatterns() {
    return this.getPatternActions().keys();
  }
  static parse(code) {
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
  static parseOtherFunctionsLabels(code) {
    const valuePattern = new RegExp(this.LABEL_VALUE_ANNOTATION, "mg");
    const valueMatch = Array.from(code.matchAll(valuePattern))[0];
    if (valueMatch == void 0) {
      throw new Error(`Can't getting value from annotation ${code}`);
    }
    const value = valueMatch.groups[this.LABEL_VALUE_ANNOTATION_NAME];
    return `${this.TMS_LABELS}\${{['${value}']}}`;
  }
  static parseIdLabel(code) {
    const valuePattern = new RegExp(this.LABEL_ID_VALUE_ANNOTATION, "mg");
    const valueMatch = Array.from(code.matchAll(valuePattern))[0];
    if (valueMatch == void 0) {
      throw new Error(`Can't getting value from annotation ${code}`);
    }
    const value = valueMatch.groups[this.LABEL_VALUE_ANNOTATION_NAME];
    return `${this.TMS_LABELS}\${{['${value}']}}`;
  }
  static parseLinkAnnotation(code) {
    const urlPattern = new RegExp(this.LINK_URL_ANNOTATION, "mg");
    const namePattern = new RegExp(this.LINK_NAME_ANNOTATION, "mg");
    const urlMatch = Array.from(code.matchAll(urlPattern))[0];
    if (urlMatch == void 0) {
      throw new Error(`Can't getting url from annotation ${code}`);
    }
    const nameMatch = Array.from(code.matchAll(namePattern))[0];
    const url = urlMatch.groups[this.LINK_URL_ANNOTATION_NAME];
    const name = nameMatch?.groups[this.LINK_NAME_ANNOTATION_NAME];
    const titleBlock = name != null ? `${this.ANNOTATION_SEPARATOR_OBJECT}"title":"${name}"` : "";
    return `${this.TMS_LINKS}\${{{"url":"${url}"${titleBlock}}}}`;
  }
  static parseLinkMethod(code) {
    const urlPattern = new RegExp(this.LINK_URL_PARAMETER, "mg");
    const namePattern = new RegExp(this.LINK_NAME_PARAMETER, "mg");
    const urlMatch = Array.from(code.matchAll(urlPattern))[0];
    if (urlMatch == void 0) {
      throw new Error(`Can't getting url from method ${code}`);
    }
    const nameMatch = Array.from(code.matchAll(namePattern))[0];
    const url = urlMatch.groups[this.LINK_URL_PARAMETER_NAME];
    const name = nameMatch?.groups[this.LINK_NAME_PARAMETER_NAME];
    const titleBlock = name != null ? `${this.PARAMETERS_SEPARATOR_OBJECT}title=${name}` : "";
    return `${this.TMS_ADD_LINKS}(url=${url}${titleBlock})`;
  }
  static parseWriteAttachMethod(code) {
    const bodyPattern = new RegExp(this.ATTACHMENT_BODY_PARAMETER, "mg");
    const namePattern = new RegExp(this.ATTACHMENT_NAME_PARAMETER, "mg");
    const bodyMatch = Array.from(code.matchAll(bodyPattern))[0];
    if (bodyMatch == void 0) {
      throw new Error(`Can't getting body from method ${code}`);
    }
    const nameMatch = Array.from(code.matchAll(namePattern))[0];
    const body = bodyMatch.groups[this.ATTACHMENT_BODY_PARAMETER_NAME];
    const name = nameMatch?.groups[this.ATTACHMENT_NAME_PARAMETER_NAME];
    const nameBlock = name != null ? `${this.PARAMETERS_SEPARATOR_OBJECT}name=${name}` : "";
    return `${this.TMS_ADD_ATTACHMENTS}(${body}${this.PARAMETERS_SEPARATOR_OBJECT}is_text=True${nameBlock})`;
  }
  static parseReadAttachMethod(code) {
    const sourcePattern = new RegExp(this.ATTACHMENT_SOURCE_PARAMETER, "mg");
    const namePattern = new RegExp(this.ATTACHMENT_NAME_PARAMETER, "mg");
    const sourceMatch = Array.from(code.matchAll(sourcePattern))[0];
    if (sourceMatch == void 0) {
      throw new Error(`Can't getting source from method ${code}`);
    }
    const nameMatch = Array.from(code.matchAll(namePattern))[0];
    const source = sourceMatch.groups[this.ATTACHMENT_SOURCE_PARAMETER_NAME];
    const name = nameMatch?.groups[this.ATTACHMENT_NAME_PARAMETER_NAME];
    const nameBlock = name != null ? `${this.PARAMETERS_SEPARATOR_OBJECT}name=${name}` : "";
    return `${this.TMS_ADD_ATTACHMENTS}(${source}${nameBlock})`;
  }
  static parseParameterMethod(code) {
    const namePattern = new RegExp(this.PARAMETER_NAME_PARAMETER, "mg");
    const valuePattern = new RegExp(this.PARAMETER_VALUE_PARAMETER, "mg");
    const nameMatch = Array.from(code.matchAll(namePattern))[0];
    if (nameMatch == void 0) {
      throw new Error(`Can't getting name from method ${code}`);
    }
    const valueMatch = Array.from(code.matchAll(valuePattern))[0];
    if (valueMatch == void 0) {
      throw new Error(`Can't getting value from method ${code}`);
    }
    const name = nameMatch.groups[this.PARAMETER_NAME_PARAMETER_NAME];
    const value = valueMatch.groups[this.PARAMETER_VALUE_PARAMETER_NAME];
    return `${this.TMS_ADD_PARAMETER}(name=${name}${this.PARAMETERS_SEPARATOR_OBJECT}value=${value})`;
  }
};

// src/parsers/types.ts
var FileInfo = class {
  constructor(filePath, oldContent, newContent) {
    this.filePath = filePath;
    this.oldContent = oldContent;
    this.newContent = newContent;
  }
};

// src/utils/parsing.annotations.utils.ts
var ParsingAnnotationsUtils = class {
  static getAllPatterns() {
    const framework = TmsConfiguration.getSelectedFramework();
    switch (framework) {
      case "pytest" /* PYTEST */.toString():
        return PytestParser.getPatterns();
      case "robotframework" /* ROBOTFRAMEWORK */.toString():
        return RobotFrameworkParser.getPatterns();
      default:
        return PytestParser.getPatterns();
    }
  }
  static parse(allureCode) {
    const framework = TmsConfiguration.getSelectedFramework();
    switch (framework) {
      case "pytest" /* PYTEST */.toString():
        return PytestParser.parse(allureCode);
      case "robotframework" /* ROBOTFRAMEWORK */.toString():
        return RobotFrameworkParser.parse(allureCode);
      default:
        return PytestParser.parse(allureCode);
    }
  }
};

// src/utils/file.utils.ts
var FileUtils = class {
  static getAllFileInfo(dirPath) {
    let infos = [];
    const ext = this.getExt();
    const names = fs.readdirSync(dirPath);
    for (const name of names) {
      const filepath = path.join(dirPath, name);
      const stats = fs.statSync(filepath);
      if (!stats.isFile()) {
        const innerInfos = this.getAllFileInfo(filepath);
        infos = infos.concat(innerInfos);
        continue;
      }
      const fileExt = path.extname(name);
      if (fileExt !== ext) continue;
      const info = this.buildFileInfo(filepath);
      if (info.oldContent !== info.newContent) {
        infos.push(info);
      }
    }
    return infos;
  }
  static getExt() {
    const framework = TmsConfiguration.getSelectedFramework();
    switch (framework) {
      case "behave" /* BEHAVE */.toString():
        return ".feature" /* GHERKIN */.toString();
      case "nose" /* NOSE */.toString():
        return ".py" /* PYTHON */.toString();
      case "pytest" /* PYTEST */.toString():
        return ".py" /* PYTHON */.toString();
      case "robotframework" /* ROBOTFRAMEWORK */.toString():
        return ".robot" /* ROBOT */.toString();
      case "junit" /* JUNIT */.toString():
        return ".java" /* JAVA */.toString();
      case "mstest" /* MSTEST */.toString():
        return ".cs" /* CSHARP */.toString();
      case "nunit" /* NUNIT */.toString():
        return ".cs" /* CSHARP */.toString();
      case "xunit" /* XUNIT */.toString():
        return ".cs" /* CSHARP */.toString();
      case "specflow" /* SPECFLOW */.toString():
        return ".feature" /* GHERKIN */.toString();
      case "codeceptjs" /* CODECEPTJS */.toString():
        return ".ts" /* TYPESCRIPT */.toString();
      case "cucumber" /* CUCUMBER */.toString():
        return ".feature" /* GHERKIN */.toString();
      case "jest" /* JEST */.toString():
        return ".ts" /* TYPESCRIPT */.toString();
      case "mocha" /* MOCHA */.toString():
        return ".ts" /* TYPESCRIPT */.toString();
      case "playwright" /* PLAYWRIGHT */.toString():
        return ".ts" /* TYPESCRIPT */.toString();
      case "testcafe" /* TESTCAFE */.toString():
        return ".ts" /* TYPESCRIPT */.toString();
      default:
        return ".java" /* JAVA */.toString();
    }
  }
  static buildFileInfo(path2) {
    const content = fs.readFileSync(path2, "utf-8");
    let newContent = content;
    const patterns = ParsingAnnotationsUtils.getAllPatterns();
    for (const pattern of patterns) {
      newContent = this.replacePattern(newContent, pattern);
    }
    return new FileInfo(path2, content, newContent);
  }
  static replacePattern(content, pattern) {
    var offsetAdjustment = 0;
    const matches = Array.from(content.matchAll(pattern));
    for (const match of matches) {
      const code = match[0];
      const matchStart = match["index"];
      const replacement = ParsingAnnotationsUtils.parse(code);
      const replacementStart = matchStart + offsetAdjustment;
      content = content.substring(0, replacementStart) + replacement + content.substring(replacementStart + code.length);
      offsetAdjustment += replacement.length - code.length;
    }
    return content;
  }
  static async replaceFile(info) {
    if (!info) {
      vscode3.window.showErrorMessage(`This object don't have info!`).then();
      return;
    }
    try {
      const document = await vscode3.workspace.openTextDocument(info.filePath);
      const editor = await vscode3.window.showTextDocument(document, {
        preview: false,
        preserveFocus: true
      });
      await new Promise((resolve2) => setTimeout(resolve2, 300));
      await editor.edit((editBuilder) => {
        const fullRange = new vscode3.Range(
          document.positionAt(0),
          document.positionAt(document.getText().length)
        );
        editBuilder.replace(fullRange, info.newContent);
      });
      await document.save();
    } catch (error) {
      vscode3.window.showErrorMessage(`Error: ${error}`).then();
    }
  }
};

// src/windows/tools/tree.item.ts
var import_path = require("path");
var vscode4 = __toESM(require("vscode"));
var basePath = (0, import_path.resolve)(__dirname, "..", "icons");
var iconPath = {
  testcases: (0, import_path.join)(basePath, "test_case", "testCase.svg"),
  checklists: (0, import_path.join)(basePath, "check_list", "checkList.svg"),
  sharedsteps: (0, import_path.join)(basePath, "shared_step", "sharedStep.svg")
};
var TreeItem2 = class extends vscode4.TreeItem {
  constructor(label, collapsibleState, type, id, children, info) {
    super(label, collapsibleState);
    this.label = label;
    this.collapsibleState = collapsibleState;
    this.type = type;
    this.id = id;
    this.children = children;
    this.info = info;
    this.id = id;
    this.label = label;
    this.children = children;
    this.iconPath = this.getIcon(type);
    this.contextValue = type;
    this.command = {
      command: "testitManagement.itemClick",
      title: "Click",
      arguments: [this]
    };
    this.info = info;
  }
  getIcon(type) {
    switch (type) {
      case "section":
        return new vscode4.ThemeIcon("folder");
      case "folder":
        return new vscode4.ThemeIcon("folder");
      case "TestCases":
        return iconPath.testcases;
      case "CheckLists":
        return iconPath.checklists;
      case "SharedSteps":
        return iconPath.sharedsteps;
      default:
        return new vscode4.ThemeIcon("file");
    }
  }
};

// src/windows/tools/tree.provider.ts
var TreeDataProvider = class {
  _onDidChangeTreeData = new vscode5.EventEmitter();
  onDidChangeTreeData = this._onDidChangeTreeData.event;
  tmsClient;
  currentView = "Tms";
  changeView(viewType) {
    this.currentView = viewType;
    this._onDidChangeTreeData.fire();
  }
  getTmsClient() {
    if (this.tmsClient === void 0) {
      this.tmsClient = new TmsClient(TmsConfiguration.getUrl(), TmsConfiguration.getToken());
    }
    return this.tmsClient;
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (!element) {
      return Promise.resolve(this.getRootItems());
    }
    return Promise.resolve(this.getChildItems(element));
  }
  async getRootItems() {
    if (this.currentView === "Tms") {
      return await this.getTmsTreeItems();
    }
    return this.getAllureTreeItems();
  }
  async getChildItems(element) {
    if (this.currentView === "Tms") {
      return await this.getTmsChildItems(element);
    }
    return element.children;
  }
  getAllureTreeItems() {
    const workspaceFolders = vscode5.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length == 0) {
      vscode5.window.showInformationMessage("No workspace opened");
      throw new Error("No workspace opened!");
    }
    const workspacePath = workspaceFolders[0].uri.fsPath;
    const infos = FileUtils.getAllFileInfo(workspacePath);
    const children = infos.map(
      (info) => new TreeItem2(
        info.filePath,
        vscode5.TreeItemCollapsibleState.None,
        "file",
        info.filePath,
        [],
        info
      )
    );
    const root = new TreeItem2(
      "Allure results",
      vscode5.TreeItemCollapsibleState.Collapsed,
      "folder",
      "Allure results",
      children
    );
    return [root];
  }
  async getTmsTreeItems() {
    const projectId = TmsConfiguration.getProjectId();
    const sections = await this.getTmsClient().getSectionsByProjectId(projectId);
    const rootSections = sections.filter((section) => section.parentId == void 0);
    return rootSections.map(
      (section) => new TreeItem2(
        section.name,
        vscode5.TreeItemCollapsibleState.Collapsed,
        "section",
        section.id,
        this.buildChildSections(sections, section.id)
      )
    );
  }
  buildChildSections(sections, parentId) {
    const childSections = sections.filter((section) => section.parentId === parentId);
    return childSections.map(
      (section) => new TreeItem2(
        section.name,
        vscode5.TreeItemCollapsibleState.Collapsed,
        "section",
        section.id,
        this.buildChildSections(sections, section.id)
      )
    );
  }
  async getTmsChildItems(element) {
    if (element.type !== "section") {
      return [];
    }
    const children = element.children ?? [];
    const workitems = await this.getTmsClient().getWorkItemsBySectionId(element.id);
    return children.concat(workitems.map(
      (workitem) => new TreeItem2(
        workitem.name,
        vscode5.TreeItemCollapsibleState.None,
        workitem.entityTypeName,
        workitem.globalId.toString(),
        []
      )
    ));
  }
};

// src/windows/tools/diff.provider.ts
var vscode6 = __toESM(require("vscode"));
var TextDiffProvider = class {
  static async showDiff(info) {
    const originalUri = vscode6.Uri.parse(`diff-original:${info.filePath}.original`);
    const modifiedUri = vscode6.Uri.parse(`diff-modified:${info.filePath}.modified`);
    const originalProvider = new InMemoryTextDocumentProvider(info.oldContent);
    const modifiedProvider = new InMemoryTextDocumentProvider(info.newContent);
    const disposableOrigin = vscode6.workspace.registerTextDocumentContentProvider("diff-original", originalProvider);
    const disposableModified = vscode6.workspace.registerTextDocumentContentProvider("diff-modified", modifiedProvider);
    await vscode6.commands.executeCommand(
      "vscode.diff",
      originalUri,
      modifiedUri,
      `Preview changes`,
      { preview: false }
    );
    setTimeout(() => {
      disposableOrigin.dispose();
      disposableModified.dispose();
    }, 1e3);
  }
};
var InMemoryTextDocumentProvider = class {
  _onDidChange = new vscode6.EventEmitter();
  content;
  constructor(content) {
    this.content = content;
  }
  provideTextDocumentContent(uri) {
    return this.content;
  }
  get onDidChange() {
    return this._onDidChange.event;
  }
  update(content) {
    this.content = content;
  }
};

// src/extension.ts
function activate(context) {
  const provider = new TreeDataProvider();
  vscode7.window.registerTreeDataProvider(
    "testitManagement",
    provider
  );
  const treeView = vscode7.window.createTreeView("testitManagement", {
    treeDataProvider: provider,
    showCollapseAll: true
  });
  vscode7.commands.registerCommand(
    "testitManagement.refreshEntry",
    () => provider.changeView("Tms")
  );
  vscode7.commands.registerCommand(
    "testitManagement.openSettings",
    () => vscode7.commands.executeCommand("workbench.action.openSettings", "@testit-management")
  );
  vscode7.commands.registerCommand("testitManagement.copyItem", (item) => {
    vscode7.env.clipboard.writeText(CodeSnippetUtils.getNewSnippet(item.label, item.id)).then();
    vscode7.window.showInformationMessage(`Copied: "${item.label}"`).then();
  });
  vscode7.commands.registerCommand(
    "testitManagement.parsingAllure",
    () => provider.changeView("Allure")
  );
  vscode7.commands.registerCommand("testitManagement.itemClick", (item) => {
    if (item.info) {
      TextDiffProvider.showDiff(item.info);
    }
  });
  vscode7.commands.registerCommand("testitManagement.replace", (item) => {
    FileUtils.replaceFile(item.info);
    provider.changeView("Allure");
  });
  vscode7.commands.registerCommand("testitManagement.replaceAll", (item) => {
    item.children.forEach((child) => FileUtils.replaceFile(child.info));
    provider.changeView("Allure");
  });
  context.subscriptions.push(
    treeView
  );
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
