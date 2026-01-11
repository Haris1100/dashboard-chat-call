export type RecordType = "message" | "call" | "user";

export type RecordStatus =
  | "open"
  | "resolved"
  | "missed"
  | "answered"
  | "active"
  | "inactive";

export type DashboardRecord = {
  id: string;
  type: RecordType;
  title: string;
  subtitle: string;
  status: RecordStatus;
  at: string;
  href: string;
};

export type ExternalPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type ExternalUser = {
  id: number;
  name: string;
  username: string;
  email: string;
};
