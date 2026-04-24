import "./style.css";
import "./components/task-card";
import { store } from "./core/store";

console.log("TaskFlow 初始状态：", store.state);

// 添加一个全局订阅，方便查看状态变更（生产环境可移除）
store.subscribe(() => {
  console.log("[状态更新]", store.state);
});
