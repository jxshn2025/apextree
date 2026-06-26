# ApexTree License Key Generator

命令行工具，用于生成和验证 ApexTree 许可证密钥。

## 快速开始

```bash
node generate-license.js
```

输出示例：

```
=== ApexTree License Key ===

APEX-eyJleHBpcnlEYXRlIjoiMjAyNy0xMi0zMSIsImlzc3VlRGF0ZSI6IjIwMjYtMDYtMjciLCJwbGFuIjoic3RhbmRhcmQiLCJkb21haW5zIjpbImV4YW1wbGUuY29tIl19
```

## 参数

| 参数 | 缩写 | 说明 | 默认值 |
|---|---|---|---|
| `--expiry` | `-e` | 过期日期 (YYYY-MM-DD) | `2027-12-31` |
| `--issue` | `-i` | 签发日期 (YYYY-MM-DD) | 今天 |
| `--plan` | `-p` | 计划名称 | `standard` |
| `--domains` | `-d` | 绑定域名，逗号分隔 | `example.com` |
| `--help` | `-h` | 显示帮助 | - |

## 使用示例

```bash
# 默认配置
node generate-license.js

# 自定义过期时间和计划
node generate-license.js -e 2030-01-01 -p pro

# 多域名绑定
node generate-license.js -d example.com,example.org,example.net

# 全部自定义
node generate-license.js -e 2030-06-01 -i 2025-01-01 -p enterprise -d example.com,foo.bar

# 生成过期 key（测试水印效果）
node generate-license.js -e 2025-01-01
```

## 在项目中使用

```js
import ApexTree from 'apextree';

ApexTree.setLicense('APEX-your-generated-key-here');

const tree = new ApexTree(document.getElementById('svg-tree'), options);
const graph = tree.render(data);
```

无有效许可证时，图表会叠加 `APEXCHARTS` 水印。

## 密钥格式

```
APEX-{base64(JSON)}
```

解码后的内容：

```json
{
  "expiryDate": "2027-12-31",
  "issueDate": "2026-06-27",
  "plan": "standard",
  "domains": ["example.com"]
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `issueDate` | ✅ | 签发日期 |
| `expiryDate` | ✅ | 过期日期 |
| `plan` | ✅ | 许可计划 |
| `domains` | ❌ | 绑定域名列表，为空则不限域名 |
