export interface JsonEmail {
  id: string;
  name?: string;
  createdAt?: string;
  body: RuleSet[]; // Allow additional properties
}

interface RuleSet {
  Enabled: boolean;
  Rules: EmailTemplateConfig[];
}

export interface SearchCondition {
  conditionType: string;
  expression: {
    type: string;
    propertyDef: string;
    indirectionLevels: string[];
  };
  typedValue: {
    dataType: string;
    value: {
      isNull: boolean;
    };
  };
}

export interface SearchConditionFilter {
  SearchConditions: SearchCondition[];
}

export interface Source {
  ObjType: string;
  Class: string;
  Workflow: string;
  State: string;
  SearchConditionFilters: SearchConditionFilter[];
}

export interface ToRecipient {
  RecipientType: string;
  Value: string;
}

export interface EmailBody {
  Type: string;
  BodyType: string;
  Body: string;
}

export interface Email {
  ValueFrom: string;
  ToRecipients: ToRecipient[];
  EmailBody: EmailBody[];
  Subject: string;
  Attachments: string[];
}

export interface EmailTemplateConfig {
  Name: string;
  Enabled: boolean;
  ConfigurationMode: string;
  Trigger: string;
  Source: Source;
  'E-mail': Email;
}
