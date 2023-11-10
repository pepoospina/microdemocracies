export interface PersonDetails {
  firstName?: string;
  lastName?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  nationality?: string;
  nationalID?: string;
  organization?: string;
}

export enum PlatformId {
  X = 'x',
  Facebook = 'facebook',
  Email = 'email',
  Instagram = 'instagram',
  Whatsapp = 'whatsapp',
  Mobile = 'mobile',
  Telegram = 'telegram',
  Discord = 'discord',
  Custom = 'custom',
}

export interface PlatformAccount {
  platform: PlatformId;
  username: string;
  proofUrl?: string;
}

export interface DetailsAndPlatforms {
  personal?: PersonDetails;
  platforms?: PlatformAccount[];
}

export interface PAP {
  person: DetailsAndPlatforms;
  account: string;
}

export interface Page {
  number: number;
  perPage: number;
  total?: number;
  totalPages?: number;
}

export interface Entity<T = any> {
  cid: string;
  object: T;
}

export type EntityCreate = Omit<Entity, 'hash'> & { hash?: string };

export type HexStr = `0x${string}`;

export interface AppAccount {
  account: HexStr;
  valid: boolean;
  voucher: number;
}

export interface AppProjectCreate {
  projectId: number;
  address: HexStr;
  whatStatement: string;
  whoStatement: string;
  selectedDetails: SelectedDetails;
}

export interface SelectedDetails {
  personal: {
    firstName: boolean;
    lastName: boolean;
    placeOfBirth: boolean;
    dateOfBirth: boolean;
    nationality: boolean;
    nationalID: boolean;
    organization: boolean;
  };
  platform: Record<PlatformId, boolean>;
}

export interface AppVouch {
  from: number;
  to: number;
  personCid: string;
  vouchDate: number;
}

export interface AppChallenge {
  creationDate: number;
  endDate: number;
  lastOutcome: number;
  nVoted: number;
  nFor: number;
  executed: boolean;
}

export type VoteOption = 1 | -1;

export interface AppStatement {
  author: number;
  statement: string;
  backers: number[] | undefined;
}

export type AppStatementCreate = Omit<AppStatement, 'backers'>;

export interface AppStatementBacking {
  backer: number;
  statement: string;
  statementId: string;
}

export interface SignedObject<T> {
  object: T;
  signature: HexStr;
}

export type StatementRead = SignedObject<AppStatement> & { id: string };
export type StatementBackerRead = SignedObject<AppStatementBacking> & {
  id: string;
};
