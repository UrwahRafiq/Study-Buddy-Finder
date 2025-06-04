module.exports = (plugin) => {
    // Override the /me controller
    plugin.controllers.user.me = async (ctx) => {
      const user = ctx.state.user;
  
      if (!user) {
        return ctx.unauthorized();
      }
  
      // Get the full user info including custom fields
      const fullUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        user.id,
        {
          populate: ['profilePicture'], // Add other relations if needed
        }
      );
  
      // Remove sensitive fields like password
      const { password, resetPasswordToken, confirmationToken, ...safeUser } = fullUser;
  
      ctx.body = safeUser;
    };
  
    return plugin;
  };
  