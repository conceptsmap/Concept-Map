import { createTransport, SendMailOptions } from "nodemailer";
import { config } from "./config";
import { templates } from "./templates";

const transporter = createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email,
    pass: config.password,
  },
});

export async function sendEmail({
  to = "",
  template,
  template_variables,
}: {
  to?: string;
  template?: string;
  template_variables?: any;
}) {
  if (!to) {
    throw new Error("Recipient email address ('to') is required.");
  }

  if (!template) {
    throw new Error("Template name is required.");
  }

  const options: SendMailOptions = {
    from: config.email,
    to,
  };

  try {
    await useTemplate(options, template, template_variables);
    await transporter.sendMail(options);
  } catch (error) {
    throw error;
  }
}

async function useTemplate(
  options: SendMailOptions,
  templateName: string,
  variables: any
) {
  const template = templates.find((t:{name:string}) => t.name === templateName);

  if (!template) {
    throw new Error(`Template "${templateName}" not found.`);
  }

  options.subject = variables?.subject || template.subject;

  if (template.body) {
    options.html = await template.body(variables);
  } else {
    throw new Error(`Template "${templateName}" does not have a valid body.`);
  }
}
