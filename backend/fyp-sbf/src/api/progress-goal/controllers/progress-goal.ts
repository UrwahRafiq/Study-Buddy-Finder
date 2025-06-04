import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::progress-goal.progress-goal', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to create a goal.');
    }

    ctx.request.body.data = {
      ...ctx.request.body.data,
      user: user.id,
    };

    const response = await super.create(ctx);
    return response;
  },

  async find(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('You must be logged in to view your goals.');
    }

    const existingFilters =
      typeof ctx.query?.filters === 'object' && ctx.query.filters !== null
        ? ctx.query.filters
        : {};

    ctx.query.filters = {
      ...existingFilters,
      user: {
        id: user.id,
      },
    };

    const response = await super.find(ctx);
    return response;
  },

  async update(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;

    if (!user) {
      return ctx.unauthorized('You must be logged in to update a goal.');
    }

    const goal = await strapi.entityService.findOne('api::progress-goal.progress-goal', id, {
      populate: ['user'],
    });

    // Type assertion to bypass TS error
    const goalWithUser = goal as typeof goal & { user: { id: number } };

    if (!goal || goalWithUser.user.id !== user.id) {
      return ctx.unauthorized('You are not allowed to update this goal.');
    }

    console.log('User ID:', user?.id);
    console.log('Goal ID:', id);
    console.log('Goal found:', goal);

    const response = await super.update(ctx);
    return response;
  },

  async delete(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;

    if (!user) {
      return ctx.unauthorized('You must be logged in to delete a goal.');
    }

    const goal = await strapi.entityService.findOne('api::progress-goal.progress-goal', id, {
      populate: ['user'],
    });

    // Type assertion to bypass TS error
    const goalWithUser = goal as typeof goal & { user: { id: number } };

    if (!goal || goalWithUser.user.id !== user.id) {
      return ctx.unauthorized('You are not allowed to delete this goal.');
    }

    const response = await super.delete(ctx);
    return response;
  }
}));
