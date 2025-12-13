import { LevelData, Word, DifficultyLevel } from "../types";

const API_BASE_URL = "http://localhost:3001";

// 添加一波开局故事 让同学了解故事线
export const PROLOGUE_SCRIPT = [
  "System: ...警告...空间乱流...警告...",
  "Momo: 哇啊啊啊啊啊——！",
  "Momo: (嘭！Momo 重重地摔在了地上)",
  "Momo: 哎哟...这是哪里？",
  "Momo: 空气中弥漫着古老的魔力...还有妖气！",
  "Momo: 糟糕，我好像掉进了【西游世界】的缝隙里！",
  "Momo: 必须收集足够的语言魔力，才能打开传送门回到我的蘑菇岛！",
  "Momo: 前方似乎有强大的怪物挡路...",
  "Momo: 既然如此，那就过关斩将，一路向西吧！"
];

// 要求4-6级 故事线
export const CHEAT_SCRIPT = [
  "Momo: 咦？那个发光的宝箱是...",
  "System: (开启宝箱) 获得【大魔法师的速记秘籍】！",
  "Momo: 哇！这是传说中的禁忌魔法书！",
  "Momo: 上面记载了让魔力快速激增的口诀。",
  "System: 警告：此秘籍蕴含高密度魔力，请选择适合你的篇章。",
  "Momo: 只要记住了这些，就没有什么能阻挡我了！",
  "Momo: 赶紧翻开看看吧！"
];


interface StageConfig {
  title: string;
  bossName: string;
  introBase: string[];
}

const STAGE_MAPS: Record<string, StageConfig[]> = {
    'Basic': [
    {
      title: "大唐",
      bossName: "寅将军 (老虎精)",
      introBase: [
        "Momo: 我们即将踏上修习魔法之路。",
        "Momo: 大唐边境妖气弥漫，看！",
        "Momo: 那是拦路的寅将军(老虎精)。",
        "Momo: 只有记住基础魔法口诀才能击退它！"
      ]
    },
    {
      title: "双叉岭",
      bossName: "黑狗熊",
      introBase: [
        "Momo: 越过了边境，这里是双叉岭。",
        "Momo: 雾气中走来一只巨大的黑熊。",
        "Momo: 它是熊山君，皮糙肉厚。",
        "Momo: 稳住，念出所有的基础咒语来破防！"
      ]
    },
  ],
  'CET-4': [
    {
      title: "火焰山",
      bossName: "火焰守卫",
      introBase: [
        "Momo: 好热！这里是八百里火焰山。",
        "Momo: 空气中充满了狂暴的火元素。",
        "Momo: 火焰守卫挡在了路口。",
        "Momo: 只有领悟中级寒冰口诀才能熄灭它！"
      ]
    },
  ],
  'CET-6': [
    {
      title: "狮驼国",
      bossName: "小钻风",
      introBase: [
        "Momo: 这里是妖气冲天的狮驼国。",
        "Momo: 巡山的小钻风发现了我们。",
        "Momo: 别看他个子小，却精通幻术。",
        "Momo: 拿出高级魔法师的威严来震慑他！"
      ]
    },
    /**想把卡布西游的boss全抄过来 太多就算了 以后有机会完善，做了自认为难度逐渐上涨的关卡符合游戏性的逻辑[大唐(basic) -> 双叉岭(CET4) -> 狮驼岭(CET6)] */
  ]
};

// 难度对应单词数量
const DIFFICULTY_CONFIG: Record<string, number> = {
  'Basic': 10,
  'CET-4': 15,
  'CET-6': 20
};

// Boss战 对应卡布西游随机的几个boss
const CHALLENGE_BOSSES: Record<string, {name: string, intro: string[]}> = {
  'Basic': { name: "妖皇傲天", intro: ["Momo: 天呐！大地在震动...","Momo: 一股古老而恐怖的黑暗魔力正在苏醒。","Momo: 是传说中的【妖皇傲天】！","Momo: 只有彻底掌握这本魔导书，才能在大唐立足！"] },
  'CET-4': { name: "星风赤子", intro: ["Momo: 这火焰...不是凡间的火！","Momo: 只有三昧真火才有这样的热度。","Momo: 难道是...【星风赤子】？","Momo: 小心，他的魔焰能燃尽一切无知！"] },
  'CET-6': { name: "干戚天刑者", intro: ["Momo: 这种压迫感...让我无法呼吸。","Momo: 是上古魔神【干戚天刑者】！","Momo: 刑天舞干戚，猛志固常在。","Momo: 这是终极的试炼，准备迎接魔力风暴吧！"] }
};


async function fetchWordsFromAPI(difficulty: DifficultyLevel): Promise<Word[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/vocabulary?difficulty=${difficulty}`);
        if (!response.ok) {
            throw new Error(`API请求失败 状态： ${response.status}`);
        }
        const words: Word[] = await response.json();
        return words;
    } catch (error) {
        console.error("fuck backend:", error);
        //空数组
        return [];
    }
}


// --- LocalStorage Helper Functions ---
function getLearnedWordIds(): string[] {
  const learnedWords = localStorage.getItem('learnedWords');
  return learnedWords ? JSON.parse(learnedWords) : [];
}


// Helper to get random items from an array
export function getRandomItems<T>(arr: T[], count: number): T[] {
  let pool = [...arr];
  while (pool.length < count && pool.length > 0) {
    pool = [...pool, ...arr];
  }
  const shuffled = pool.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Generate Standard Levels
export const generateLevelContent = async (difficulty: DifficultyLevel = "Basic", stageIndex: number = 0, isChallenge: boolean = false): Promise<LevelData> => {
  // 1. Get Stage Config
  const stageList = STAGE_MAPS[difficulty] || STAGE_MAPS['Basic'];
  const currentStage = stageList[stageIndex % stageList.length];

  // 2. Get Word Count
  let count = DIFFICULTY_CONFIG[difficulty] || 10;
  let title = currentStage.title;
  let bossName = currentStage.bossName;
  let introStory = currentStage.introBase;

  // 3. Handle Challenge Mode Override
  if (isChallenge) {
    count = 25;
    const challengeConfig = CHALLENGE_BOSSES[difficulty] || CHALLENGE_BOSSES['Basic'];
    title = `${difficulty} - 噩梦挑战`;
    bossName = challengeConfig.name;
    introStory = challengeConfig.intro;
  }

  // 4. Fetch Words from the backend API
  const allWords = await fetchWordsFromAPI(difficulty);
  
  // 5. Filter out learned words
  const learnedIds = getLearnedWordIds();
  const availableWords = allWords.filter(word => !learnedIds.includes(word.id));

  if (availableWords.length === 0) {
      // 学霸认证
      return {
          title: "学霸认证",
          theme: difficulty,
          bossName: "知识守护者",
          introStory: ["Momo: 难以置信！", "Momo: 你已经掌握了这个领域所有的魔法口诀！", "Momo: 你是真正的【" + difficulty + "】魔法大师！"],
          words: []
      };
  }

  const selectedWords = getRandomItems(availableWords, count);

  return {
    title: title,
    theme: difficulty, 
    bossName: bossName,
    introStory: introStory,
    words: selectedWords
  };
};

// 刷单词
export const generateCheatList = async (difficulty: DifficultyLevel): Promise<Word[]> => {
    const allWords = await fetchWordsFromAPI(difficulty);
    //过滤学过的
    const learnedIds = getLearnedWordIds();
    const availableWords = allWords.filter(word => !learnedIds.includes(word.id));
    
    return getRandomItems(availableWords, 30);
}