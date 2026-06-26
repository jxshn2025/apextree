# ApexTree 许可证生成逻辑逆向分析文档

> 分析对象：`apextree@1.13.0` — `apextree.es.min.js`（ESM 格式，压缩后约 85KB）
>
> 仓库地址：https://github.com/apexcharts/apextree
>
> 分析日期：2026-06-27

---

## 一、分析思路

ApexTree 是一个闭源商业库，发布到 npm 的只有压缩后的 JS 文件，没有源码。分析步骤如下：

1. **定位入口** — 从公开 API `ApexTree.setLicense()` 入手，追踪调用链
2. **识别类结构** — 在压缩代码中识别出所有 class 及其职责
3. **提取许可相关类** — 找到 `License` 类（压缩后变量名 `S`）和 `Watermark` 类（压缩后变量名 `$`）
4. **逐方法还原** — 将压缩后的 static 方法还原为可读的源码逻辑

---

## 二、定位过程

### 2.1 从 README 入口开始

README.md 中明确记载了许可证设置方式：

```js
// README.md — "Setting the License" 章节
ApexTree.setLicense('your-license-key');
```

### 2.2 追踪 `setLicense` 静态方法

在 `apextree.es.min.js` 末尾找到导出的主类 `xe`（即 `ApexTree`）：

```js
// apextree.es.min.js — 文件末尾
class xe extends n {
  // ...
  static setLicense(e) { E.setLicense(e) }
  // ...
}
```

**关键发现**：`xe.setLicense()` 委托给了变量 `E`。

### 2.3 追踪变量 `E`

向上搜索 `E` 的赋值：

```js
S.licenseKey = null;
S.validationResult = null;
let E = S;
```

**结论**：`E` 就是许可证类 `S`，`S` 是压缩后的类名。

### 2.4 追踪水印机制

在 `xe` 的构造函数中找到：

```js
handleWatermark() {
  this.element && (
    E.isLicenseValid()
      ? A.remove(this.element)
      : A.add(this.element)
  )
}
```

搜索变量 `A` 的赋值：

```js
$.WATERMARK_ATTR = "data-apexcharts-watermark";
$.WATERMARK_TEXT = "APEXCHARTS";
let A = $;
```

**结论**：`A` 是水印类 `$`，当许可证无效时，在图表容器上叠加 `APEXCHARTS` 水印。

---

## 三、许可证类 `S` 完整还原

以下是压缩后代码中 `S` 类的完整还原，每个方法都标注了其在压缩代码中的原始位置。

### 3.1 类定义与静态属性

**压缩代码**（`apextree.es.min.js` 第 1 行）：
```js
S.licenseKey = null;
S.validationResult = null;
```

**还原**：
```js
class License {
  static licenseKey = null;       // 当前设置的许可证密钥
  static validationResult = null; // 缓存的验证结果
}
```

### 3.2 `decodeLicenseData(encoded)` — 解码

**压缩代码原文**：
```js
static decodeLicenseData(e) {
  try {
    const t = window.atob(e);
    const n = JSON.parse(t);
    return n.issueDate && n.expiryDate && n.plan
      ? {
          domains: Array.isArray(n.domains) ? n.domains : void 0,
          expiryDate: n.expiryDate,
          issueDate: n.issueDate,
          plan: n.plan,
          valid: !0
        }
      : null
  } catch {
    return null
  }
}
```

**还原**：
```js
static decodeLicenseData(encoded) {
  try {
    const decoded = window.atob(encoded);  // Base64 解码
    const data = JSON.parse(decoded);       // JSON 解析
    // 必须包含 issueDate、expiryDate、plan 三个字段
    if (data.issueDate && data.expiryDate && data.plan) {
      return {
        domains: Array.isArray(data.domains) ? data.domains : undefined,
        expiryDate: data.expiryDate,
        issueDate: data.issueDate,
        plan: data.plan,
        valid: true
      };
    }
    return null;
  } catch {
    return null;
  }
}
```

**关键信息**：
- 使用 `window.atob()` 做 Base64 解码（浏览器环境）
- 必须包含 `issueDate`、`expiryDate`、`plan` 三个字段才视为合法数据
- `domains` 是可选字段，必须是数组

### 3.3 `generateLicenseKey(issueDate, expiryDate, plan, domains)` — 生成

**压缩代码原文**：
```js
static generateLicenseKey(e, t, n = "standard", o) {
  const i = { expiryDate: t, issueDate: e, plan: n };
  o && o.length > 0 && (i.domains = o);
  return `APEX-${window.btoa(JSON.stringify(i))}`
}
```

**还原**：
```js
static generateLicenseKey(issueDate, expiryDate, plan = "standard", domains) {
  const data = { expiryDate, issueDate, plan };
  if (domains && domains.length > 0) {
    data.domains = domains;
  }
  return `APEX-${window.btoa(JSON.stringify(data))}`;
}
```

**关键信息**：
- 参数顺序：`issueDate`、`expiryDate`、`plan`、`domains`
- 默认计划为 `"standard"`
- 编码流程：`JSON.stringify()` → `window.btoa()` (Base64 编码) → 加 `APEX-` 前缀
- **没有签名、没有加密、没有 HMAC**，任何人都可以反向生成

### 3.4 `setLicense(key)` — 设置

**压缩代码原文**：
```js
static setLicense(e) {
  var t;
  this.licenseKey = e;
  this.validationResult = this.validateLicense(e);
  this.validationResult.valid || (
    t = `[Apex] ${this.validationResult.message}`,
    C.error(t)
  )
}
```

**还原**：
```js
static setLicense(key) {
  this.licenseKey = key;
  this.validationResult = this.validateLicense(key);
  if (!this.validationResult.valid) {
    const msg = `[Apex] ${this.validationResult.message}`;
    console.error(msg);
  }
}
```

**关键信息**：
- `C` 是 `globalThis.console` 的别名（在压缩代码中 `C = globalThis.console`）
- 验证失败只打印错误，不抛异常

### 3.5 `validateLicense(key)` — 验证

**压缩代码原文**：
```js
static validateLicense(e) {
  try {
    if (!e.startsWith("APEX-"))
      return { expired: !1, message: 'Invalid license key format. License key must start with "APEX-".', valid: !1 };
    const t = e.indexOf("-");
    const n = -1 !== t ? e.slice(t + 1) : "";
    if (!n)
      return { expired: !1, message: "Invalid license key format. Expected format: APEX-{encoded-data}.", valid: !1 };
    const o = this.decodeLicenseData(n);
    if (!o)
      return { expired: !1, message: "Invalid license key. Unable to decode license data.", valid: !1 };
    const i = new Date;
    if (new Date(o.expiryDate) < i)
      return { data: o, expired: !0, message: `License expired on ${o.expiryDate}. Please renew your license.`, valid: !1 };
    if (o.domains && o.domains.length > 0) {
      const e = "undefined" != typeof window ? window.location.hostname : "";
      if (!o.domains.some(t => e === t || e.endsWith(`.${t}`)))
        return { data: o, expired: !1, message: `License is not valid for this domain (${e}). Allowed domains: ${o.domains.join(", ")}.`, valid: !1 }
    }
    return { data: o, expired: !1, valid: !0 }
  } catch {
    return { expired: !1, message: "Invalid license key format or corrupted data.", valid: !1 }
  }
}
```

**还原**：
```js
static validateLicense(key) {
  try {
    // Step 1: 前缀检查
    if (!key.startsWith("APEX-")) {
      return {
        expired: false,
        message: 'Invalid license key format. License key must start with "APEX-".',
        valid: false
      };
    }

    // Step 2: 提取编码部分
    const dashIndex = key.indexOf("-");
    const encoded = dashIndex !== -1 ? key.slice(dashIndex + 1) : "";
    if (!encoded) {
      return {
        expired: false,
        message: "Invalid license key format. Expected format: APEX-{encoded-data}.",
        valid: false
      };
    }

    // Step 3: 解码
    const data = this.decodeLicenseData(encoded);
    if (!data) {
      return {
        expired: false,
        message: "Invalid license key. Unable to decode license data.",
        valid: false
      };
    }

    // Step 4: 过期检查
    const now = new Date();
    if (new Date(data.expiryDate) < now) {
      return {
        data,
        expired: true,
        message: `License expired on ${data.expiryDate}. Please renew your license.`,
        valid: false
      };
    }

    // Step 5: 域名绑定检查
    if (data.domains && data.domains.length > 0) {
      const hostname = typeof window !== "undefined" ? window.location.hostname : "";
      if (!data.domains.some(domain =>
        hostname === domain || hostname.endsWith(`.${domain}`)
      )) {
        return {
          data,
          expired: false,
          message: `License is not valid for this domain (${hostname}). Allowed domains: ${data.domains.join(", ")}.`,
          valid: false
        };
      }
    }

    // 全部通过
    return { data, expired: false, valid: true };
  } catch {
    return {
      expired: false,
      message: "Invalid license key format or corrupted data.",
      valid: false
    };
  }
}
```

**关键信息**：
- 验证流程：前缀检查 → 提取编码部分 → Base64 解码 → 过期检查 → 域名绑定检查
- 域名匹配支持子域名：`hostname.endsWith(`.${domain}`)`
- 域名检查依赖 `window.location.hostname`，纯客户端校验
- **没有服务端验证、没有签名验证**

### 3.6 `isLicenseValid()` / `getLicenseStatus()` — 查询

**压缩代码原文**：
```js
static isLicenseValid() {
  return !!this.licenseKey && (
    this.validationResult || (this.validationResult = this.validateLicense(this.licenseKey)),
    this.validationResult.valid
  )
}
static getLicenseStatus() {
  return this.licenseKey
    ? (this.validationResult || (this.validationResult = this.validateLicense(this.licenseKey)),
       this.validationResult)
    : { expired: !1, valid: !1 }
}
```

**还原**：
```js
static isLicenseValid() {
  if (!this.licenseKey) return false;
  if (!this.validationResult) {
    this.validationResult = this.validateLicense(this.licenseKey);
  }
  return this.validationResult.valid;
}

static getLicenseStatus() {
  if (!this.licenseKey) {
    return { expired: false, valid: false };
  }
  if (!this.validationResult) {
    this.validationResult = this.validateLicense(this.licenseKey);
  }
  return this.validationResult;
}
```

**关键信息**：
- 使用惰性验证 + 缓存：首次调用时验证，后续直接返回缓存结果

---

## 四、水印类 `$` 完整还原

### 4.1 静态属性

```js
$.WATERMARK_ATTR = "data-apexcharts-watermark";
$.WATERMARK_TEXT = "APEXCHARTS";
```

### 4.2 `createWatermarkPattern()`

**压缩代码原文**：
```js
static createWatermarkPattern() {
  const e = this.WATERMARK_TEXT;
  return `url("data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif"
        font-size="18" font-weight="600" fill="rgba(134, 134, 134, 0.1)"
        transform="rotate(-35, 100, 60)"
      >${e}</text>
    </svg>
  `.trim())}")`
}
```

**还原**：
```js
static createWatermarkPattern() {
  const text = this.WATERMARK_TEXT; // "APEXCHARTS"
  return `url("data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="..." font-size="18" font-weight="600"
        fill="rgba(134, 134, 134, 0.1)"
        transform="rotate(-35, 100, 60)"
      >${text}</text>
    </svg>
  `.trim())}")`;
}
```

**关键信息**：
- 水印是一个旋转 -35° 的 SVG 文本，颜色极淡（rgba 透明度 0.1）
- 通过 CSS `background-image` + `background-repeat: repeat` 平铺覆盖整个容器
- 使用 `pointer-events: none` + `z-index: 10000` 确保水印在最上层且不阻挡交互

### 4.3 `add(container)` / `remove(container)`

```js
static add(container) {
  this.remove(container); // 先移除已有水印
  const div = document.createElement("div");
  div.setAttribute(this.WATERMARK_ATTR, ""); // data-apexcharts-watermark
  Object.assign(div.style, {
    backgroundImage: this.createWatermarkPattern(),
    backgroundRepeat: "repeat",
    bottom: "0", left: "0", right: "0", top: "0",
    position: "absolute",
    pointerEvents: "none",
    userSelect: "none",
    zIndex: "10000"
  });
  // 如果容器是 static 定位，改为 relative
  if (getComputedStyle(container).position === "static") {
    container.style.position = "relative";
  }
  container.appendChild(div);
}

static remove(container) {
  const el = container.querySelector(`[${this.WATERMARK_ATTR}]`);
  if (el) el.remove();
}
```

---

## 五、许可证在主类 `xe`（ApexTree）中的调用链

```
ApexTree.setLicense(key)
  └─ License.setLicense(key)
       ├─ License.licenseKey = key
       ├─ License.validateLicense(key)
       │    ├─ 检查 "APEX-" 前缀
       │    ├─ 提取 Base64 部分
       │    ├─ License.decodeLicenseData(encoded)
       │    │    ├─ window.atob(encoded)
       │    │    └─ JSON.parse() → { issueDate, expiryDate, plan, domains? }
       │    ├─ 过期检查: new Date(expiryDate) < new Date()
       │    └─ 域名检查: hostname 匹配 domains[]
       └─ 验证失败 → console.error()

ApexTree 构造函数
  └─ handleWatermark()
       └─ License.isLicenseValid()
            ├─ 有效 → Watermark.remove(container)
            └─ 无效 → Watermark.add(container)  ← 显示 "APEXCHARTS" 水印
```

---

## 六、许可证数据格式

### 密钥格式

```
APEX-{Base64编码的JSON}
```

### JSON 结构

```json
{
  "issueDate": "2025-01-01",    // 签发日期（字符串，YYYY-MM-DD）
  "expiryDate": "2026-12-31",   // 过期日期（字符串，YYYY-MM-DD）
  "plan": "standard",           // 计划名称（字符串）
  "domains": ["example.com"]    // 绑定域名（字符串数组，可选）
}
```

### 生成示例

```js
const data = {
  issueDate: "2025-01-01",
  expiryDate: "2026-12-31",
  plan: "standard",
  domains: ["example.com"]
};

// 编码过程
const json = JSON.stringify(data);
// '{"expiryDate":"2026-12-31","issueDate":"2025-01-01","plan":"standard","domains":["example.com"]}'

const base64 = btoa(json);
// 'eyJleHBpcnlEYXRlIjoiMjAyNi0xMi0zMSIsImlzc3VlRGF0ZSI6IjIwMjUtMDEtMDEiLCJwbGFuIjoic3RhbmRhcmQiLCJkb21haW5zIjpbImV4YW1wbGUuY29tIl19'

const key = `APEX-${base64}`;
// 'APEX-eyJleHBpcnlEYXRlIjoiMjAyNi0xMi0zMSIsImlzc3VlRGF0ZSI6IjIwMjUtMDEtMDEiLCJwbGFuIjoic3RhbmRhcmQiLCJkb21haW5zIjpbImV4YW1wbGUuY29tIl19'
```

---

## 七、验证逻辑的局限性

| 方面 | 现状 | 影响 |
|---|---|---|
| 签名/加密 | ❌ 无 | 任何人都可以生成合法密钥 |
| 服务端验证 | ❌ 无 | 纯客户端校验，可被绕过 |
| 域名绑定 | ⚠️ 客户端检查 | 依赖 `window.location.hostname`，Node.js 环境下为空字符串 |
| 过期检查 | ⚠️ 客户端检查 | 可通过修改系统时间绕过 |
| 水印移除 | ⚠️ DOM 操作 | 可通过删除水印 DOM 节点绕过 |

---

## 八、文件与代码位置索引

| 内容 | 文件 | 位置 |
|---|---|---|
| 许可证设置 API | `README.md` | "Setting the License" 章节 |
| `ApexTree.setLicense()` | `apextree.es.min.js` | 文件末尾 `class xe` 中的 `static setLicense(e){E.setLicense(e)}` |
| License 类定义 | `apextree.es.min.js` | `const S=class{...}` |
| License 解码 | `apextree.es.min.js` | `S` 类中 `static decodeLicenseData(e)` |
| License 生成 | `apextree.es.min.js` | `S` 类中 `static generateLicenseKey(e,t,n,o)` |
| License 验证 | `apextree.es.min.js` | `S` 类中 `static validateLicense(e)` |
| License 属性赋值 | `apextree.es.min.js` | `S.licenseKey=null;S.validationResult=null` |
| 变量别名 E = S | `apextree.es.min.js` | `let E=S` |
| Watermark 类定义 | `apextree.es.min.js` | `const $=class{...}` |
| Watermark 属性 | `apextree.es.min.js` | `$.WATERMARK_ATTR="data-apexcharts-watermark";$.WATERMARK_TEXT="APEXCHARTS"` |
| 变量别名 A = $ | `apextree.es.min.js` | `let A=$` |
| 水印触发点 | `apextree.es.min.js` | `xe` 类中 `handleWatermark()` → `E.isLicenseValid()?A.remove(this.element):A.add(this.element)` |
| TypeScript 类型声明 | `apextree.d.ts` | `static setLicense(key: string): void` |
