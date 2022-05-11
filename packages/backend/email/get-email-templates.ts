import { EmptyObject } from './../../types/helpers.d';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
//
import Handlebars from 'handlebars';

type EmailTemplateType = 'WELCOME' | 'PASSWORD_RESET';

type EmailTemplateConfig =
  | {
      type: 'WELCOME';
      ctx?: EmptyObject;
    }
  | {
      type: 'PASSWORD_RESET';
      ctx: {
        reset_password_link: string;
      };
    };

const emailTemplateNemMap: Record<EmailTemplateType, string> = {
  WELCOME: 'welcome-email',
  PASSWORD_RESET: 'reset-password',
};

const generatedTemplates = new Map<
  EmailTemplateType,
  ReturnType<typeof Handlebars.compile>
>();

export const getEmailTemplate = async (config: EmailTemplateConfig) => {
  const { type, ctx = {} } = config;

  if (!generatedTemplates.has(type)) {
    const templateHtml = await readFile(
      resolve(__dirname, `templates/${emailTemplateNemMap[type]}.html`),
      'utf8'
    );

    const template = Handlebars.compile(templateHtml);
    generatedTemplates.set(type, template);
  }

  return generatedTemplates.get(type)!(ctx);
};
