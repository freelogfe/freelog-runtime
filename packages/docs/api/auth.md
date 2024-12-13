

# 授权处理相关 API 文档



## `callAuth`

**用途**：呼出授权弹窗，适用于以下场景：
- 存在多个未授权展品但没有立即呼出。
- 用户关闭授权弹窗后，插件希望重新唤起。

### 使用方式

```javascript
freelogApp.callAuth();
```


## `addAuth`

**用途**：将未授权的展品添加到待授权队列，并可选择是否立即弹出授权窗口。

### 参数说明

| 参数       | 类型     | 说明                   |
|------------|----------|------------------------|
| `exhibitId` | `string` | 展品的唯一标识         |
| `options`   | `object` | 配置对象（可选）       |
| `options.immediate` | `boolean` | 是否立即弹出授权窗口（默认 `false`） |

### 使用方式

```javascript
const res = await freelogApp.addAuth(exhibitId, { immediate: true });
```

### 返回值

`addAuth` 方法返回一个对象，包含授权状态和相关数据。

| 字段       | 类型     | 说明                                       |
|------------|----------|--------------------------------------------|
| `status`   | `string` | 授权状态，可通过 `resultType` 枚举判断     |
| `data`     | `object` | 相关数据（如失败时的错误信息或展品信息） |

#### 状态枚举值

- `SUCCESS`：成功
- `FAILED`：失败
- `USER_CANCEL`：用户取消
- `DATA_ERROR`：数据错误
- `OFFLINE`：展品已下线

#### 示例

```javascript
const res = await freelogApp.addAuth("exhibit123", { immediate: true });

if (res.status === freelogApp.resultType.SUCCESS) {
  console.log("授权成功");
} else if (res.status === freelogApp.resultType.USER_CANCEL) {
  console.log("用户取消授权");
} else {
  console.error("授权失败:", res.data);
}
```


## `resultType`

**用途**：`resultType` 是一个枚举对象，用于标识授权操作的状态。

### 常见状态值

| 值              | 说明               |
|-----------------|--------------------|
| `SUCCESS`       | 授权成功           |
| `FAILED`        | 授权失败           |
| `USER_CANCEL`   | 用户取消操作       |
| `DATA_ERROR`    | 数据错误           |
| `OFFLINE`       | 展品已下线         |

### 示例

```javascript
const res = await freelogApp.addAuth("exhibit123");

switch (res.status) {
  case freelogApp.resultType.SUCCESS:
    console.log("授权成功");
    break;
  case freelogApp.resultType.FAILED:
    console.error("授权失败");
    break;
  case freelogApp.resultType.USER_CANCEL:
    console.warn("用户取消授权");
    break;
  case freelogApp.resultType.DATA_ERROR:
    console.error("数据错误:", res.data);
    break;
  case freelogApp.resultType.OFFLINE:
    console.error("展品已下线:", res.data);
    break;
  default:
    console.error("未知状态");
}
```
