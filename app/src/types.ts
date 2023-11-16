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
  account: HexStr;
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

export interface AppProject {
  projectId: number;
  address: HexStr;
  whatStatement: string;
  whoStatement: string;
  selectedDetails: SelectedDetails;
}

export type AppProjectCreate = AppProject;

export enum PersonalDetailId {
  firstName = 'firstName',
  lastName = 'lastName',
  placeOfBirth = 'placeOfBirth',
  dateOfBirth = 'dateOfBirth',
  nationality = 'nationality',
  nationalID = 'nationalID',
  organization = 'organization',
}

export interface SelectedDetails {
  personal: Partial<Record<PersonalDetailId, boolean>>;
  platform: Partial<Record<PlatformId, boolean>>;
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

export interface SemaphoreProofStrings {
  merkleTreeRoot: string;
  signal: string;
  nullifierHash: string;
  externalNullifier: string;
  proof: PackedProofString;
}

export type PackedProofString = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
];

export interface AppStatement {
  projectId: number;
  statement: string;
  treeId: string;
  proof: SemaphoreProofStrings;
  backers: number[] | undefined;
}

export type AppStatementCreate = Omit<AppStatement, 'backers'>;

export interface AppStatementBacking {
  backer: number;
  statement: string;
  statementId: string;
  projectId: number;
}

export interface SignedObject<T> {
  object: T;
  signature: HexStr;
}

export type StatementRead = SignedObject<AppStatement> & { id: string };
export type StatementBackerRead = SignedObject<AppStatementBacking> & {
  id: string;
};

export interface AppPublicIdentity {
  publicId: string;
  owner: HexStr;
  aaAddress: HexStr;
  signature: HexStr;
}

export interface AppGetMerklePass {
  projectId: number;
  publicId: string;
}

export interface AppReturnMerklePass {
  merklePass: any;
  treeId: string;
}

export interface AppProjectMember {
  projectId: number;
  aaAddress: HexStr;
}

export interface AppProjectIndex {
  deployAt: number;
  indexedAt: number;
}

export interface AppTree {
  projectId: number;
  root: string;
}
