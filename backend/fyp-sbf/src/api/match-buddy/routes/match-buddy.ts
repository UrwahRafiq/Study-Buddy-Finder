import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::match-buddy.match-buddy', {
  config: {
    find: {
      auth: { scope: [] },
    },
  },
  only: ['find'], // Only allow 'find' action
});
