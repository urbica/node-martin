module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    process.stderr.write(error.stack);
    ctx.body = { error: error.message };
    ctx.status = error.status || 500;
  }
};
