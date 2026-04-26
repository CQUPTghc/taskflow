import "./style.css";

import { store } from "./core/store";
import { router } from "./core/router";

import { BoardPage } from "./pages/board-page";
import { SettingsPage } from "./pages/settings-page";
import { NotFoundPage } from "./pages/not-found-page";

import './components/app-link';

router.addRoute('/', BoardPage);


router.addRoute('/settings', SettingsPage);

router.init('#app');



console.log("TaskFlow 初始状态：", store.state);

// 添加一个全局订阅，方便查看状态变更（生产环境可移除）
store.subscribe(() => {
  console.log("[状态更新]", store.state);
});
