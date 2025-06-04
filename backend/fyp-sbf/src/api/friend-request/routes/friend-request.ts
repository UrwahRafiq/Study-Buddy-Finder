import { factories } from '@strapi/strapi';

export default factories.createCoreRouter(
  'api::friend-request.friend-request',
  {
    only: ['create', 'update', 'find', 'findOne', 'delete'],
    config: {
      create: { auth: { scope: [] } },
      update: { auth: { scope: [] } },
      find:   { auth: { scope: [] } },
      findOne:{ auth: { scope: [] } },
      delete: { auth: { scope: [] } },
    },
  }
);