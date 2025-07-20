import fs from "fs";
import mjml from "mjml";
import Handlebars from "handlebars";
import path from "path";
import emailTemplate from "../types/emailTemplates";
//import __dirname from "../config/misc.js";

export const renderEmail = (template: emailTemplate) => {
    const templatePath = path.join(__dirname, "../../assets/templates", `${template.name}.mjml`);
    const mjmlTemplate = fs.readFileSync(templatePath, "utf-8");

    const compiledTemplate = Handlebars.compile(mjmlTemplate);
    const mjmlWithVariables = compiledTemplate(template.variables);

    const { html } = mjml(mjmlWithVariables);

    return html;
}