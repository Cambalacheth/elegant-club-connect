
export interface Domain {
  id: string;
  name: string;
  path: string;
  description: string;
  status: "available" | "reserved" | "used";
  owner?: string;
  externalUrl?: string;
  currentLanguage?: string;
}

export interface UseDomainProps {
  randomize?: boolean;
  pageSize?: number;
  prioritizePaths?: string[];
  filterStatus?: ("available" | "reserved" | "used")[];
}
