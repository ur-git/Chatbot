export interface Program   {
  id: string;
  description: string;
  totalHours: number;
  skills: string[];
}

export interface Asset {
  asset_id: string;
  title: string;
  description: string;
}

export interface Topic {
  topic_id: string;
  title: string;
  description: string;
  asset: Asset[];
}

export interface ProgramDetails {
  program_id: string;
  title: string;
  description: string;
  totalHours: number;
  skills: string[];
  programs?: Topic[];
}

