
module.exports = (strapi) => {
    return {
      initialize() {
        strapi.app.use(async (ctx, next) => {
          // Set temp directory for file uploads
          if (ctx.request.url.startsWith('/api/upload')) {
            process.env.TMPDIR = './temp'; // Custom temp path
          }
          await next();
        });
      },
    };
  };