// e.g. src/extensions/users-permissions/routes/custom-user.js

export default [
  {
    method: 'POST',
    path: '/user/logout',
    handler: 'custom-user.logout',
    config: { policies: [], auth: true },
  },
  {
    method: 'DELETE',
    path: '/users/me',
    handler: 'custom-user.deleteMe',
    config: {
      auth: true,     // ensures ctx.state.user is populated
      policies: [],
    },
  },
];
