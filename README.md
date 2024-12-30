# Shift Clock

自动根据锁屏、解锁、开机、关机等事件记录工作时间。

## 特性

- 记录到本地 JSONL 文件

## TODO

- [x] 移除不必要的模板依赖
- [x] 移除不必要的模板代码
- [ ] 更新 App 图标
- [x] 使用轻量级数据库替代 JSONL 文件'
- [ ] 实现前端展示页面

## Database

### Original Record

| Field     | Type   | Description                                                    |
| --------- | ------ | -------------------------------------------------------------- |
| event     | string | Event type (e.g. 'lock-screen', 'unlock-screen', 'app-launch') |
| timestamp | number | Unix timestamp in milliseconds                                 |

### Shift Record

| Field          | Type   | Description                    |
| -------------- | ------ | ------------------------------ |
| startTimestamp | number | Unix timestamp in milliseconds |
| endTimestamp   | number | Unix timestamp in milliseconds |
