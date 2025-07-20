"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderEmail = void 0;
const fs_1 = __importDefault(require("fs"));
const mjml_1 = __importDefault(require("mjml"));
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = __importDefault(require("path"));
//import __dirname from "../config/misc.js";
const renderEmail = (template) => {
    const templatePath = path_1.default.join(__dirname, "../../assets/templates", `${template.name}.mjml`);
    const mjmlTemplate = fs_1.default.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars_1.default.compile(mjmlTemplate);
    const mjmlWithVariables = compiledTemplate(template.variables);
    const { html } = (0, mjml_1.default)(mjmlWithVariables);
    return html;
};
exports.renderEmail = renderEmail;
