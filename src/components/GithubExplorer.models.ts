export interface RepositoryShortInfo {
  full_name: string;
  name: string;
  private: boolean;
  html_url: string;
  open_issues: number;
}

export const DefaultRepositoryShortInfoKeys = [
  'name',
  'full_name',
  'private',
  'html_url',
  'open_issues',
];
