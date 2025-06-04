export default ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      providers: {
        google: {
          redirectUri: 'http://localhost:3000/google-auth',
        },
      },
    },
  },
});
