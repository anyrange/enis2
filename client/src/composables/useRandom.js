import { computed } from "vue";
import { getRandomItem } from "@/utils";
import emojis from "@/assets/emojis.json";
import emoticons from "@/assets/emoticons.json";
import gifs from "../assets/gifs.json";

export default () => {
  const randomEmoji = computed(() => getRandomItem(emojis));
  const randomEmoticon = computed(() => getRandomItem(emoticons));
  const randomGIF = computed(() => {
    const { url, name } = getRandomItem(gifs);
    return {
      src: url,
      name: name,
    };
  });
  return {
    randomEmoji,
    randomEmoticon,
    randomGIF,
  };
};
