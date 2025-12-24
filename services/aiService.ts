
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface AIStoryResponse {
  en: string;
  zh: string;
}

const NARRATIVE_STYLES = [
  "Humorous and witty", 
  "Epic and legendary", 
  "Suspenseful and dark", 
  "Poetic and calm", 
  "Action-packed and intense",
  "Mysterious and cryptic"
];

const MOMO_PERSONALITIES = [
  "Cheerful and food-obsessed",
  "Wise and scholarly",
  "Timid but brave in key moments",
  "Arrogant but cute",
  "Sarcastic but helpful"
];

export const generatePrologue = async (): Promise<AIStoryResponse[]> => {
  const style = NARRATIVE_STYLES[Math.floor(Math.random() * NARRATIVE_STYLES.length)];
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a short 3-part dialogue (in both English and Chinese) between Momo (a cute mascot) and a Player who just transmigrated into the world of Journey to the West. 
    Narrative Style: ${style}. 
    Focus on the initial shock and the magical air of the Tang Dynasty border. Provide EN and ZH translations for each part. DO NOT use labels like 'EN:' or 'ZH:'.`,
  });
  
  return [
    { en: "Momo: Whoa! Did you see that? The sky just ripped open!", zh: "Momo: 哇！你看到了吗？天空中刚才裂开了一个口子！" },
    { en: "Where are we? This doesn't look like any city I know.", zh: "我们在哪？这看起来不像我认识的任何城市。" },
    { en: "Momo: We've fallen into the world of the Great Journey! Your words are now your only weapon.", zh: "Momo: 我们掉进了西行圣境！你的话语现在是你唯一的武器。" }
  ];
};

export const generateReplayStory = async (stageName: string, isReplay: boolean): Promise<AIStoryResponse[]> => {
  const style = NARRATIVE_STYLES[Math.floor(Math.random() * NARRATIVE_STYLES.length)];
  const personality = MOMO_PERSONALITIES[Math.floor(Math.random() * MOMO_PERSONALITIES.length)];
  
  const prompt = isReplay 
    ? `The player is REVISITING ${stageName}. 
       Momo's current personality: ${personality}. Style: ${style}.
       Generate a 2-part dialogue where Momo notices something NEW or ODD about this place during the second visit. Use humor if appropriate. Provide EN and ZH. DO NOT use labels like 'EN:' or 'ZH:'.`
    : `Generate a 2-part cinematic intro for ${stageName}. 
       Momo's personality: ${personality}. Style: ${style}.
       Focus on the unique atmosphere of the location and the looming threat. Provide EN and ZH. DO NOT use labels like 'EN:' or 'ZH:'.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return [
      { en: `Momo: Be careful, the shadows in ${stageName} are moving on their own.`, zh: `Momo: 小心，${stageName}的影子似乎在自行移动。` },
      { en: "Something powerful is hiding just ahead. Can you feel it?", zh: "一股强大的力量正在前方。你能感觉到吗？" }
    ];
  } catch (e) {
    return [{ en: "The air grows heavy with demon mist.", zh: "空气中弥漫着浓重的妖雾。" }, { en: "The battle is about to begin.", zh: "战斗即将开始。" }];
  }
};

export const generateDailyQuote = async (): Promise<AIStoryResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a cheerful, fun, and unique lifestyle motivational quote for English learners. It should be lighthearted and cover topics like good weather, delicious food (hotpot, BBQ), sports (running, swimming), or the joy of a good rest. Make it sound like a friend encouraging another friend. Provide exactly two lines: the first is English, the second is Chinese. DO NOT include any labels like 'EN:', 'ZH:', 'English:', 'Chinese:', 'EN.', or 'ZH.'. Just the plain text lines.",
    });
    const text = response.text || "";
    // Clean up common labels just in case
    const lines = text.split('\n')
      .map(l => l.replace(/^(EN|ZH|English|Chinese|中文|英文|EN\.|ZH\.)[:：.]?\s*/i, '').trim())
      .filter(l => l.length > 0);
      
    return { 
      en: lines[0] || "The sunshine is perfect today—finish your practice and let's go for a run!", 
      zh: lines[1] || "今天的阳光真灿烂，学完这一组就去外面跑个步吧！" 
    };
  } catch (e) {
    return { 
      en: "How about a big feast after mastering these new words?", 
      zh: "掌握了这些新单词，不如待会去大吃一顿庆祝下？" 
    };
  }
};
