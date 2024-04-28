export function splitSentences(data) {
    return data
      .split(".")
      .map((sentence, index, array) => {
        if (index < array.length - 1) {
          return sentence.trim() + ".";
        } else {
          return sentence.trim();
        }
      })
      .filter((sentence) => sentence.trim() !== "");
  }