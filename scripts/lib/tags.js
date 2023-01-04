const getTags = async () => {
  // fetch the tags from the server
  const tags = await fetch(
    "https://raw.githubusercontent.com/bedrock-dot-dev/docs/master/tags.json"
  );
  return await tags.json();
};

module.exports = getTags;
