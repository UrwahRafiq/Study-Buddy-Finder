const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController(
  'api::friend-request.friend-request',
  ({ strapi }) => ({
    async create(ctx) {
      const sender = ctx.state.user;
      const { receiver } = ctx.request.body.data || {};

      if (!receiver) return ctx.badRequest('Missing receiver id');
      if (receiver === sender.id) return ctx.badRequest('Cannot send request to yourself');

      const existing = await strapi.entityService.findMany(
        'api::friend-request.friend-request',
        {
          filters: { sender: sender.id, receiver, status: 'pending' }
        }
      );
      if (existing.length) return ctx.badRequest('Friend request already pending');

      ctx.request.body.data = { sender: sender.id, receiver, status: 'pending' };
      const createdRequest = await super.create(ctx);

      // Create a temporary chat
      await strapi.entityService.create('api::chat.chat', {
        data: {
          users: { connect: [{ id: sender.id }, { id: receiver }] },
          isTemp: true
        }
      });

      const senderInfo = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        sender.id,
        { fields: ['id', 'username', 'email'] }
      );

      strapi.io?.to(`user-${receiver}`).emit(`newFriendRequest-${receiver}`, {
        from: senderInfo,
        requestId: createdRequest.id,
      });

      return createdRequest;
    },

    async update(ctx) {
      const user = ctx.state.user;
      const id = ctx.params.id;
      const { status } = ctx.request.body.data || {};

      if (!['accepted', 'declined'].includes(status)) {
        return ctx.badRequest('Status must be "accepted" or "declined"');
      }

      const existing = await strapi.entityService.findOne(
        'api::friend-request.friend-request',
        id,
        { populate: ['sender', 'receiver'] }
      );
      if (!existing) return ctx.notFound('Friend request not found');
      if (existing.receiver.id !== user.id) {
        return ctx.unauthorized('Only the receiver can respond');
      }

      const updated = await strapi.entityService.update(
        'api::friend-request.friend-request',
        id,
        { data: { status }, populate: ['sender', 'receiver'] }
      );

      const sid = existing.sender.id;
      const rid = existing.receiver.id;

      const allChats = await strapi.entityService.findMany('api::chat.chat', {
        filters: { users: { id: { $in: [sid, rid] } } },
        populate: ['users']
      });
      const sharedChats = allChats.filter(chat =>
        chat.users.some(u => u.id === sid) && chat.users.some(u => u.id === rid)
      );

      let realChatId = null;

      if (status === 'accepted') {
        const existingPermanent = sharedChats.find(c => !c.isTemp);
        if (existingPermanent) {
          realChatId = existingPermanent.id;
        } else {
          const tempChat = sharedChats.find(c => c.isTemp);
          if (tempChat) {
            await strapi.entityService.update('api::chat.chat', tempChat.id, {
              data: { isTemp: false }
            });
            realChatId = tempChat.id;
          } else {
            const created = await strapi.entityService.create('api::chat.chat', {
              data: {
                users: { connect: [{ id: sid }, { id: rid }] },
                isTemp: false
              }
            });
            realChatId = created.id;
          }
        }

        // Delete any duplicate chats
        const duplicates = sharedChats.filter(c => c.id !== realChatId);
        for (const dup of duplicates) {
          await strapi.entityService.delete('api::chat.chat', dup.id);
        }

        // Create two bidirectional friend entries
        await Promise.all([
          strapi.entityService.create('api::friend.friend', {
            data: {
              user: sid,
              friend: rid,
              chat: realChatId
            }
          }),
          strapi.entityService.create('api::friend.friend', {
            data: {
              user: rid,
              friend: sid,
              chat: realChatId
            }
          })
        ]);
      }

      if (status === 'declined') {
        sharedChats
          .filter(c => c.isTemp)
          .forEach(async (c) => {
            await strapi.entityService.delete('api::chat.chat', c.id);
          });
      }

      strapi.io?.to(`user-${sid}`).emit(`friendRequestResponse-${sid}`, {
        fromUsername: existing.receiver.username,
        to: sid,
        status,
        chatId: realChatId,
      });

      return updated;
    },

    async findOne(ctx) {
      const { id } = ctx.params;
      const entity = await strapi.entityService.findOne(
        'api::friend-request.friend-request',
        id,
        { populate: ['sender'] }
      );
      if (!entity) return ctx.notFound('Not found');
      return entity;
    }
  })
);
