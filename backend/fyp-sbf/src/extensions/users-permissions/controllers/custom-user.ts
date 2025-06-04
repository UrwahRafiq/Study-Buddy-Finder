// e.g. src/extensions/users-permissions/controllers/custom-user.js

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'plugin::users-permissions.user',
  ({ strapi }) => ({
    // existing logout...
    async logout(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('No authenticated user');
      await strapi.entityService.update(
        'plugin::users-permissions.user',
        user.id,
        { data: { onlineStatus: 'offline' } }
      );
      ctx.send({ message: 'Logged out and status set to offline' });
    },

    // ← new deleteMe action
    async deleteMe(ctx) {
      const user = ctx.state.user;
      if (!user) {
        return ctx.unauthorized('No authenticated user');
      }

      try {
        // this uses the plugin’s built-in remove under the hood
        await strapi.plugin('users-permissions').service('user').delete(user.id);
        ctx.send({ message: 'Account deleted' });
      } catch (err) {
        ctx.throw(500, 'Failed to delete account');
      }
    },
  })
);
