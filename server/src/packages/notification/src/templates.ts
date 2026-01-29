import { compile } from "handlebars";
import { join, resolve } from "node:path";
import { readFile } from "node:fs/promises";

export async function generateBody(templateName?: string, variables?: any) {
  if (!templateName) {
    return "Welcome, Testing email...";
  }

  const templateRoot = resolve(__dirname,"../","templates");
  const templatePath = join(templateRoot, `${templateName}.hbs`);
  const content = (await readFile(templatePath)).toString();
  const template = compile(content);
  const body = template(variables);
  return body;
}

export const templates = [
  {
    name: "emailVerificationOtp",
    subject: "Email Verification",
    body: async (variables: any) =>
      generateBody("emailVerificationOtp", variables),
  },
];
