
export * from './employee/base';
export * from './payroll';
export * from './operations';
export * from './customer';
export * from './analytics';

// Message type used in chat/communication features
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Generic types that don't fit in other categories can go here
