export const RouteNames = {
  AppHome: '',
  Start: 'start',
  ProjectHome: 'p',
  Join: `join`,
  Invite: `invite`,
  InviteAccount: (hash: string) => `invite/${hash}`,
  MyVouches: `invites`,
  Members: `members`,
  Challenges: `challenges`,
  Member: `member`,
  MemberChallange: (id: number) => `member/${id}/challenge`,
  VoiceBase: 'v',
  VoicePropose: `propose`,
  VoiceStatement: `s`,
};

export const AbsoluteRoutes = {
  App: '/',
  Projects: `/${RouteNames.AppHome}`,
  ProjectHome: (projectId: string) => `/${RouteNames.ProjectHome}/${projectId}`,
  ProjectMember: (projectId: string, tokenId: string) =>
    `/${RouteNames.ProjectHome}/${projectId}/${RouteNames.Member}/${tokenId}`,
};
