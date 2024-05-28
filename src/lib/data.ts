import bilibiliImg from "@/assets/img/bilibili.png"
import douyinImg from "@/assets/img/douyin.png"
import sspaiImg from "@/assets/img/sspai.png"
import weiboImg from "@/assets/img/weibo.png"
import zhihuImg from "@/assets/img/zhihu.png"
import krImg from "@/assets/img/36kr.png"
import ithomeImg from "@/assets/img/ithome.png"
import juejinImg from "@/assets/img/juejin.png"
import toutiaoImg from "@/assets/img/toutiao.png"
import doubanImg from "@/assets/img/douban-movie.png"
const searchEngineList = [
    {
        id: 0,
        name: "必应",
        link: "https://cn.bing.com/search?q=",
        icon: "https://files.codelife.cc/itab/search/bing.svg",
    },
    {
        id: 1,
        name: "谷歌",
        link: "https://www.google.com/search?q=",
        icon: "https://files.codelife.cc/itab/search/google.svg",
    },
    {
        id: 2,
        name: "百度",
        link: "https://www.baidu.com/s?wd=",
        icon: "https://files.codelife.cc/itab/search/baidu.svg",
    },
];

const statusOptions = [
    {
        label: "Done",
        value: "Done"
    },
    {
        label: "Doing",
        value: "Doing"
    },
    {
        label: "Todo",
        value: "Todo"
    },
    {
        label: "Cancel",
        value: "Cancel"
    },
    {
        label: "Test",
        value: "Test"
    }
]
const TaskLevel = [
    {
        value: 0,
        label: "Low"
    },
    {
        value: 1,
        label: "Medium"
    },
    {
        value: 2,
        label: "High"
    }
]
const typeData = [
    {
        id: 2,
        name: "哔哩哔哩",
        type: "bilibili",
        img: bilibiliImg,
        check: true
    },
    {
        id: 3,
        name: "微博",
        type: "weibo",
        img: weiboImg,
        check: false
    },
    {
        id: 4,
        name: "知乎",
        type: "zhihu",
        img: zhihuImg,
        check: false
    },
    {
        id: 5,
        name: "抖音",
        type: "douyin",
        img: douyinImg,
        check: false
    },
    {
        id: 6,
        name: "少数派",
        type: "sspai",
        img: sspaiImg,
        check: false
    },
    {
        id: 7,
        name: "36氪",
        type: "36kr",
        img: krImg,
        check: false
    },
    {
        id: 8,
        name: "IT之家",
        type: "ithome",
        img: ithomeImg,
        check: false
    },
    {
        id: 9,
        name: "稀土掘金",
        type: "juejin",
        img: juejinImg,
        check: false
    },
    {
        id: 10,
        name: "今日头条",
        type: "toutiao",
        img: toutiaoImg,
        check: false
    },
    {
        id: 11,
        name: "豆瓣电影",
        type: "douban-movie",
        img: doubanImg,
        check: false
    }
]

const GPTlink = 'https://gpt.kifroom.icu'

export {
    searchEngineList,
    statusOptions,
    TaskLevel,
    typeData,
    GPTlink
}