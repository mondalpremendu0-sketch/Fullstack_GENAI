function normalizeItem(item) {

  if (typeof item === "object") {
    return item;
  }

  if (typeof item !== "string") {
    return {};
  }

  try {

    return JSON.parse(item);

  } catch {

    return {
      question: item,
      skill: item,
      focus: item,
      suggestion: item
    };

  }
}


module.exports = normalizeItem;