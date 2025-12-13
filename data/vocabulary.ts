import { Word } from "../types"; 
/**测试阶段 伪的一个SQLite 以为不用后端的 全写前端更省事
 * 因为找不到词库 etymology词源速记字段删除 而且词库在后端 这里的测试类就步入历史(舍弃)
*/
export const VOCABULARY_DB: Word[] = [

  {
    id: "b_001",
    term: "Adventure",
    phonetic: "/ədˈventʃər/",
    definition: "An unusual and exciting or daring experience.",
    translation: "冒险",
    difficulty: "Basic",
    tags: ["Game", "Life"],
    etymology: "ad- (to) + venire (come) → 即将发生的事",
    example: "They went on an adventure in the woods.",
    exampleTranslation: "他们去森林里探险了。"
  },
  {
    id: "b_002",
    term: "Magic",
    phonetic: "/ˈmædʒɪk/",
    definition: "The power of apparently influencing events by using mysterious or supernatural forces.",
    translation: "魔法",
    difficulty: "Basic",
    tags: ["Fantasy"],
    etymology: "magikos (Greek) → 属于法师的",
    example: "Do you believe in magic?",
    exampleTranslation: "你相信魔法吗？"
  },
  {
    id: "b_003",
    term: "Shield",
    phonetic: "/ʃiːld/",
    definition: "A broad piece of metal or another suitable material, held by straps or a handle attached on one side, used as a protection against blows or missiles.",
    translation: "盾牌",
    difficulty: "Basic",
    tags: ["Battle", "Item"],
    etymology: "scild (Old English) → 保护",
    example: "The knight raised his shield.",
    exampleTranslation: "骑士举起了他的盾牌。"
  },
  {
    id: "b_004",
    term: "Forest",
    phonetic: "/ˈfɒrɪst/",
    definition: "A large area covered chiefly with trees and undergrowth.",
    translation: "森林",
    difficulty: "Basic",
    tags: ["Nature", "Place"],
    etymology: "forestis (Latin) → 户外的",
    example: "Animals live in the forest.",
    exampleTranslation: "动物们住在森林里。"
  },
  {
    id: "b_005",
    term: "Journey",
    phonetic: "/ˈdʒɜːni/",
    definition: "An act of traveling from one place to another.",
    translation: "旅程",
    difficulty: "Basic",
    tags: ["Travel"],
    etymology: "journee (Old French) → 一天的工作/旅行",
    example: "Have a safe journey home.",
    exampleTranslation: "祝你回家路上平安。"
  },


  {
    id: "c4_001",
    term: "Abandon",
    phonetic: "/əˈbændən/",
    definition: "To leave a place, thing, or person, usually for ever.",
    translation: "放弃；抛弃",
    difficulty: "CET-4",
    tags: ["Emotion", "Action"],
    etymology: "a- (ad- 'to') + ban (control) → 放弃控制权",
    example: "We had to abandon the car and walk the rest of the way.",
    exampleTranslation: "我们不得不弃车步行走完剩下的路。"
  },
  {
    id: "c4_002",
    term: "Capacity",
    phonetic: "/kəˈpæsəti/",
    definition: "The maximum amount that something can contain.",
    translation: "容量；能力",
    difficulty: "CET-4",
    tags: ["Academic", "Science"],
    etymology: "cap (take/hold) + -ity (noun) → 能够容纳的量",
    example: "The stadium has a seating capacity of 50,000.",
    exampleTranslation: "这个体育场能容纳五万名观众。"
  },
  {
    id: "c4_003",
    term: "Estimate",
    phonetic: "/ˈestɪmeɪt/",
    definition: "Roughly calculate or judge the value, number, quantity, or extent of.",
    translation: "估计；估价",
    difficulty: "CET-4",
    tags: ["Business", "Math"],
    etymology: "aestimare (to value) → 评估价值",
    example: "They estimate that the journey will take at least two weeks.",
    exampleTranslation: "他们估计这趟旅程至少需要两周。"
  },
  {
    id: "c4_004",
    term: "Identify",
    phonetic: "/aɪˈdentɪfaɪ/",
    definition: "Establish or indicate who or what (someone or something) is.",
    translation: "识别；认出",
    difficulty: "CET-4",
    tags: ["Social", "Law"],
    etymology: "idem (same) + facere (make) → 确认为同一人",
    example: "She was able to identify her attacker.",
    exampleTranslation: "她能够认出袭击她的人。"
  },
  {
    id: "c4_005",
    term: "Unique",
    phonetic: "/juˈniːk/",
    definition: "Being the only one of its kind; unlike anything else.",
    translation: "独特的；唯一的",
    difficulty: "CET-4",
    tags: ["Description", "Art"],
    etymology: "uni- (one) → 独一无二的",
    example: "Each person's fingerprints are unique.",
    exampleTranslation: "每个人的指纹都是独一无二的。"
  },
  

  {
    id: "c6_001",
    term: "Hypothesis",
    phonetic: "/haɪˈpɒθəsɪs/",
    definition: "A supposition or proposed explanation made on the basis of limited evidence.",
    translation: "假设；假说",
    difficulty: "CET-6",
    tags: ["Academic", "Science"],
    etymology: "hypo- (under) + thesis (placing) → 放在下面的基础理论",
    example: "Several hypotheses for global warming have been suggested.",
    exampleTranslation: "关于全球变暖已经提出了几种假说。"
  },
  {
    id: "c6_002",
    term: "Ambiguous",
    phonetic: "/æmˈbɪɡjuəs/",
    definition: "Open to more than one interpretation; having a double meaning.",
    translation: "模棱两可的；含糊不清的",
    difficulty: "CET-6",
    tags: ["Literature", "Communication"],
    etymology: "ambi- (both ways) + agere (drive) → 向两边驱赶 → 不确定",
    example: "The ending of the movie was intentionally ambiguous.",
    exampleTranslation: "这部电影的结尾故意处理得模棱两可。"
  },
  {
    id: "c6_003",
    term: "Collaborate",
    phonetic: "/kəˈlæbəreɪt/",
    definition: "Work jointly on an activity, especially to produce or create something.",
    translation: "合作；协作",
    difficulty: "CET-6",
    tags: ["Business", "Work"],
    etymology: "col- (together) + laborare (work) → 共同工作",
    example: "Two writers collaborated on the script for the film.",
    exampleTranslation: "两位作家合作编写了这部电影的剧本。"
  },
  {
    id: "c6_004",
    term: "Plausible",
    phonetic: "/ˈplɔːzəbl/",
    definition: "Seeming reasonable or probable.",
    translation: "看似可信的",
    difficulty: "CET-6",
    tags: ["Logic", "Argument"],
    etymology: "plaudere (applaud) → 值得喝彩的 → 听起来不错的",
    example: "Her story sounded plausible, but I still had my doubts.",
    exampleTranslation: "她的故事听起来很可信，但我仍有疑虑。"
  },
  {
    id: "c6_005",
    term: "Simultaneous",
    phonetic: "/ˌsɪmlˈteɪniəs/",
    definition: "Occurring, operating, or done at the same time.",
    translation: "同时发生的",
    difficulty: "CET-6",
    tags: ["Time", "Science"],
    etymology: "simul (together) → 发生在同一时间",
    example: "There were simultaneous explosions in two separate cities.",
    exampleTranslation: "两个不同的城市同时发生了爆炸。"
  },
  {
    id: "c6_006",
    term: "Intuition",
    phonetic: "/ˌɪntjuˈɪʃn/",
    definition: "The ability to understand something immediately, without the need for conscious reasoning.",
    translation: "直觉",
    difficulty: "CET-6",
    tags: ["Psychology", "Mind"],
    etymology: "in- (at/on) + tueri (look) → 注视内心 → 直觉",
    example: "Intuition told her that something was wrong.",
    exampleTranslation: "直觉告诉她有些不对劲。"
  },
  {
    id: "c6_007",
    term: "Eloquent",
    phonetic: "/ˈeləkwənt/",
    definition: "Fluent or persuasive in speaking or writing.",
    translation: "雄辩的；口才流利的",
    difficulty: "CET-6",
    tags: ["Communication"],
    etymology: "e- (out) + loqui (speak) → 说出来的 → 善辩的",
    example: "He made an eloquent speech.",
    exampleTranslation: "他发表了一场精彩的演讲。"
  }
];