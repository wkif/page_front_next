import { create } from 'zustand';
import { persist } from "zustand/middleware"

let store = (set: any, get: any) => ({
    // 是否登录
    loginState: false,
    setLoginState: (val: boolean) => set((state: any) => ({ loginState: val })),
    // 用户信息
    userInfo: {} as {
        id: number
        username: string
        avatar: string
        email: string
    },
    setUserInfo: (data: any) => set((state: any) => ({ userInfo: data })),
    // 侧边栏是否展开
    isCollapse: false,
    setIsCollapse: (val: boolean) => set((state: any) => ({ isCollapse: val })),
    // 搜索引擎
    searchEngineId: 1,
    setSearchEngineId: (val: number) => set((state: any) => ({ searchEngineId: val })),
    // token
    token: "",
    setToken: (val: string) => set((state: any) => ({ token: val })),
    // 搜索历史
    searchHistory: [],
    addSearchHistory: (val: string, state = get()) => {
        if (state.searchHistory.indexOf(val) === -1) {
            set((state: any) => ({ searchHistory: [...state.searchHistory, val] }))
        } else {
            const index = state.searchHistory.indexOf(val)
            state.searchHistory.splice(index, 1)
            set((state: any) => ({ searchHistory: [...state.searchHistory, val] }))
        }
    },
    clearSearchHistory: () => set((state: any) => ({ searchHistory: [] })),
});
store = persist(store, { name: "app" }) as unknown as typeof store;
const useStore = create(store);
export default useStore;
