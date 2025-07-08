import fs from "fs";
import mjml from "mjml";
import Handlebars from "handlebars";
import path from "path";
import __dirname from "../config/misc.js";

export const renderEmail = (template, variables) => {
    const templatePath = path.join(__dirname, "../templates", `${template}.mjml`);
    const mjmlTemplate = fs.readFileSync(templatePath, "utf-8");

    const compiledTemplate = Handlebars.compile(mjmlTemplate);
    const mjmlWithVariables = compiledTemplate(variables);

    const { html } = mjml(mjmlWithVariables);

    return html;
}