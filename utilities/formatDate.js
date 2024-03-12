const formatDate = (date) => {
  const now = new Date();
  const blogDate = new Date(date);

  const timeDiff = now - blogDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff === 1) {
    return "yesterday";
  } else {
    const options = { day: "numeric", month: "short" };
    return blogDate.toLocaleDateString(undefined, options);
  }
};

module.exports = formatDate;
