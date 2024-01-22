export const RouteNames = {
  Base: ``,
  App: `app`,
  Start: 'start',
  AppHome: 'home',
  ProjectHome: 'p',
  Join: `join`,
  Invite: `invite`,
  InviteAccount: (hash: string) => `invite/${hash}`,
  MyVouches: `invites`,
  Members: `members`,
  Challenges: `challenges`,
  Member: `member`,
  MemberChallange: (id: number) => `member/${id}/challenge`,
  VoicePropose: `propose`,
};

export const AbsoluteRoutes = {
  App: '/',
  Projects: `/${RouteNames.App}/${RouteNames.AppHome}`,
  ProjectHome: (projectId: string) => `/${RouteNames.App}/${RouteNames.ProjectHome}/${projectId}`,
  ProjectMember: (projectId: string, tokenId: string) =>
    `/${RouteNames.App}/${RouteNames.ProjectHome}/${projectId}/${RouteNames.Member}/member/${tokenId}`,
};
