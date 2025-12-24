
import { MapNode } from "../types";

export const JOURNEY_MAP: MapNode[] = [
  {
    id: "stage_01",
    name: "大唐国境",
    location: "长安郊外",
    type: "story",
    description: "取经之路的起点，遭遇寅将军。",
    medalsRequired: 0,
    script: [
      { en: "The journey of a thousand miles begins with a single step.", zh: "千里之行，始于足下。" },
      { en: "Xuanzang: Momo, the road ahead is full of demons.", zh: "玄奘：Momo，前方的路布满了妖魔。" }
    ]
  },
  {
    id: "stage_02",
    name: "两界山",
    location: "五行山下",
    type: "story",
    description: "揭开金帖，收服齐天大圣。",
    medalsRequired: 0,
    script: [
      { en: "Master, I have waited for you for 500 years!", zh: "师父，我等了你五百年了！" },
      { en: "Wukong: Let's show these monsters some real magic.", zh: "悟空：让这些妖怪见识下真正的魔法。" }
    ]
  },
  {
    id: "stage_03",
    name: "鹰愁涧",
    location: "蛇盘山",
    type: "battle",
    medalsRequired: 0,
    description: "小白龙化身为马，正式开启团队冒险。",
  },
  {
    id: "stage_04",
    name: "黑风山",
    location: "黑风洞",
    type: "battle",
    medalsRequired: 3,
    description: "黑熊精盗走锦襕袈裟。",
  },
  {
    id: "stage_05",
    name: "高老庄",
    location: "云栈洞",
    type: "battle",
    medalsRequired: 3,
    description: "天蓬元帅猪八戒加入取经团队。",
  },
  {
    id: "stage_06",
    name: "流沙河",
    location: "流沙界",
    type: "battle",
    medalsRequired: 3,
    description: "卷帘大将沙悟净归队。",
  },
  {
    id: "stage_07",
    name: "宝象国",
    location: "波月洞",
    type: "battle",
    medalsRequired: 8,
    description: "黄袍怪与百花羞公主的纠葛。",
  },
  {
    id: "stage_08",
    name: "平顶山",
    location: "莲花洞",
    type: "battle",
    medalsRequired: 8,
    description: "金角大王与银角大王的紫金红葫芦。",
  },
  {
    id: "stage_09",
    name: "火焰山",
    location: "翠云山",
    type: "battle",
    medalsRequired: 15,
    description: "三调芭蕉扇，智斗牛魔王与铁扇公主。",
  },
  {
    id: "stage_10",
    name: "狮驼岭",
    location: "极乐径",
    type: "battle",
    medalsRequired: 15,
    description: "三大魔王坐镇，取经路上最险一关。",
  }
];

export const REGION_BOSSES: Record<string, string> = {
  "stage_01": "寅将军",
  "stage_02": "五行山土地",
  "stage_03": "小白龙",
  "stage_04": "黑熊精",
  "stage_05": "猪八戒",
  "stage_06": "沙悟净",
  "stage_07": "黄袍怪",
  "stage_08": "金角银角",
  "stage_09": "牛魔王",
  "stage_10": "大鹏金翅雕"
};
