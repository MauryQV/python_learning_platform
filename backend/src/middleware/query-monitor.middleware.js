export const queryMonitor = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (duration > 500) {
      console.warn(`SLOW QUERY: ${req.method} ${req.path} - ${duration}ms`);
    }
  });

  next();
};
