<template>
  <div ref="wrapRef" class="box-border h-full overflow-hidden">
    <!-- 空状态 -->
    <div v-if="isEmpty && !loading" class="h-full w-full flex items-center justify-center">
      <div v-if="isOwned" class="flex flex-col">
        <el-button type="default" class="!h-auto" @click="handleAddRoot">
          <div class="m-50px flex flex-col items-center justify-center">
            <el-icon size="50px"><Plus /></el-icon>
            <div class="mt-2">添加成员</div>
          </div>
        </el-button>
        <el-button class="mt-5" text type="primary" @click="handleBatchAdd">
          批量添加成员
        </el-button>
      </div>
      <span v-else class="text-muted">该族谱是空的~</span>
    </div>

    <!-- 树容器 -->
    <div
      v-show="!isEmpty"
      ref="domRef"
      class="h-full w-full select-none"
      :class="[
        { 'change-parent-mode': isChangingParent },
        `tree-direction-${direction}`,
        `tree-style-${styleMode}`,
        writingModeClass,
      ]"
      :style="{ '--tree-avatar-size': `${AVATAR_SIZE}px` }"
    />

    <!-- 变更父级提示条 -->
    <ChangeParentTipBar
      v-if="isChangingParent"
      ref="changeParentTipBarRef"
      @close="cancelChangeParent"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick, useSlots } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { ElButton, ElIcon } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ApexTree } from 'apextree'
import ChangeParentTipBar from './ChangeParentTipBar.vue'
import { useGenealogyApi } from '@/composables/useGenealogyApi'
import { useGenealogySearch } from '@/composables/useGenealogySearch'
import { useMemberActions } from '@/composables/useMemberActions'
import { buildTreeData } from '@/utils/genealogy'
import { AVATAR_MALE, AVATAR_FEMALE } from '@/constants/avatars'

// ==================== Props & Emits ====================
const props = defineProps({
  genealogy: { type: Object, default: null },
  getInitData: { type: Function, default: null },
  readonly: { type: Boolean, default: false },
  options: { type: Object, default: () => ({}) },
  immutable: { type: Boolean, default: false },
})

const emit = defineEmits([
  'updateMemberCountChanged',
  'treeRendered',
  'setAncestor',
  'crossChangeParent',
])

// ==================== 路由 & Store ====================
const route = useRoute()
const router = useRouter()
const slots = useSlots()

// ==================== Refs ====================
const wrapRef = ref(null)
const domRef = ref(null)
const changeParentTipBarRef = ref(null)
const tree = ref(null)
const isEmpty = ref(false)
const loading = ref(false)

// ==================== 响应式尺寸 ====================
const { width: containerWidth, height: containerHeight } = useElementSize(domRef)

// ==================== 方向 & 样式 ====================
const direction = props.immutable
  ? ref(localStorage.getItem('direction') || 'top')
  : useStorage('direction', 'top')

const styleMode = props.immutable
  ? ref('traditional')
  : useStorage('style-mode', 'traditional')

const writingModeClass = computed(() => {
  if (direction.value === 'top' || direction.value === 'bottom') {
    return `writing-mode-${props.genealogy?.writingMode}`
  }
  return ''
})

// ==================== 权限计算 ====================
const genealogyId = computed(() => route.query.id)
const isOwned = computed(() =>
  !!props.genealogy &&
  (props.genealogy.userId === currentUser.value._id || props.genealogy.collaboratorPermission > 0)
)
const isManager = computed(() =>
  !!props.genealogy &&
  (props.genealogy.userId === currentUser.value._id || props.genealogy.collaboratorPermission === 2)
)
const isAvatarEnabled = computed(() => {
  const { cosPermission = 'none', avatarEnabled = false } = props.genealogy || {}
  return cosPermission !== 'none' && avatarEnabled
})

// ==================== 变更父级状态 ====================
const isChangingParent = ref(false)
const changeParentData = ref(getEmptyChangeParentData())
const changeParentTarget = ref(null)
const highlightedNodes = ref([])
const collapsedDepth = ref(-1)

// ==================== API & 搜索 ====================
const {
  addRootMember,
  batchInputMembers,
  onMemberCountChange,
  relateToGenealogy,
  unRelateToGenealogy,
  migrateMembers,
  uploadAvatar,
} = useMemberActions({
  genealogyId,
  displayField: computed(() => props.genealogy?.displayField || 'remark'),
})

const { onSearch, onJump, onClear, data: searchData, searchAgain, reset: resetSearch } = useGenealogySearch()

// ==================== 缓存数据 ====================
let cachedRawData = null

// ==================== 数据获取 ====================
const { doFetch, doing: fetchLoading } = useGenealogyApi({
  url: '/genealogy/member/list',
  params: () => ({
    genealogyId: genealogyId.value,
    styleName: 0,
    subtitle: props.genealogy?.displayField || 'remark',
  }),
  onSuccess: (data) => {
    cachedRawData = data
    const treeData = buildTreeData(data, { startNodeId: route.query.memberId })
    if (tree.value) {
      tree.value.rerender(treeData[0])
    } else {
      initTree(treeData)
    }
    emit('updateMemberCountChanged', data.length, true)
  },
})

// ==================== 上下文菜单 ====================
function getContextMenuItems(treeInstance, node) {
  const items = [
    { label: '查看详情', action: (e) => viewMember(e.data, teleport.value) },
  ]

  if (node && node.parent && node.data.parentId) {
    items.push({ label: '只看其后代', action: (e) => handleViewFromNode(e) })
  }

  if ((node && !node.parent && node.data.parentId) || isSearching.value) {
    items.push({ label: '还原族谱树', action: (e) => handleViewAllNodes(e) })
  }

  if (node) {
    let maxDepth = 0
    node.root?.descendants().forEach((d) => {
      if (d.depth > maxDepth) maxDepth = d.depth
    })
    const isCollapsed = collapsedDepth.value === node.depth
    if (node.depth < maxDepth || isCollapsed) {
      items.push({
        label: `${isCollapsed ? '展开' : '收起'}同辈后代`,
        action: (e) => handleBatchCollapseExpandSiblingsChildren(isCollapsed ? -1 : e.depth, e),
      })
    }
  }

  if (isClipboardSupported.value) {
    items.push({
      label: '复制名字',
      type: 'icon',
      svgIcon: ICON_COPY,
      action: (e) => copyToClipboard(e.data.name),
    })
  }

  if (!isOwned.value || props.readonly) {
    return items.filter(Boolean)
  }

  // 编辑
  items.push({
    label: '编辑',
    type: 'icon',
    svgIcon: ICON_EDIT,
    action: (node) => {
      editMember(node.data, {
        type: 'edit',
        id: node.data._id,
        orderUsed: getSiblingBirthOrders(node),
        onUpdated: (updated) => {
          const rawData = getCacheRawData()
          const fields = pick(updated, ['name', 'remark', 'sex', 'dieYoung', 'subtitle', 'birthOrder'])
          const cached = rawData.find((item) => item.i === node.data._id)
          const orderChanged = cached?.bo !== fields.birthOrder
          if (cached) Object.assign(cached, mapFieldsToStorage(fields))
          Object.assign(node.data, fields)
          if (orderChanged) {
            handleRerenderTree()
          } else {
            treeInstance?.render({ keepOldPosition: true })
          }
          handleMemberUpdated(node)
        },
      }, teleport.value)
    },
  })

  // 头像
  if (props.genealogy?.cosPermission === 'read-write') {
    items.push({
      label: node?.data.avatar ? '更换头像' : '上传头像',
      action: (e) => handleUploadAvatar(e),
    })
  }

  // 添加子女
  items.push({
    label: '添加子女',
    action: (e) => {
      addMember(e.data, {
        type: 'addChild',
        id: e.data._id,
        orderUsed: getSiblingBirthOrders(e),
        onAdded: (newMember) => {
          getCacheRawData().push(mapFieldsToStorage(newMember))
          newMember.parent = e.data
          if (Array.isArray(e.data.children)) {
            e.data.children.push(newMember)
          } else {
            e.data.children = [newMember]
          }
          tree.value?.rerender(undefined, { keepOldPosition: true, keepZoom: true })
        },
      }, teleport.value)
    },
  })

  // 批量添加子女
  items.push({
    label: '批量添加子女',
    action: (e) => {
      const children = e.data.children || []
      const maxOrder = Math.max(...children.map((c) => c.birthOrder), -1)
      batchInputMembers({
        parentName: e.data.name,
        parentId: e.data._id,
        rootBirthOrder: Math.max(maxOrder + 1, children.length),
        onAdded: () => handleBatchAddSuccess(e.data._id),
      }, teleport.value)
    },
  })

  // 添加父亲（仅根节点）
  if (node?.depth === 0) {
    items.push({
      label: '添加父亲',
      action: (e) => {
        addMember(e.data, {
          type: 'addParent',
          id: e.data._id,
          orderUsed: getSiblingBirthOrders(e),
          onAdded: (newMember) => {
            getCacheRawData().push(mapFieldsToStorage(newMember))
            tree.value?.rerender(
              { ...newMember, children: [e.data] },
              { keepOldPosition: true, keepZoom: true }
            )
          },
        }, teleport.value)
      },
    })
  }

  // 变更父级
  if (node && node.depth > 0) {
    items.push({
      label: '变更父级',
      action: (n) => {
        handleChangingParent(n)
        treeInstance.disableHighlight(true)
        treeInstance.disableContextMenu(true)
      },
    })
  }

  // 关联族谱
  if (node?.data.relatedGenealogyId) {
    items.push({
      label: '进入关联族谱',
      type: 'icon',
      svgIcon: ICON_LINK,
      action: (e) => handleGotoGenealogy(e),
    })
  }

  if (node && isManager.value) {
    if (node.data.relatedGenealogyId) {
      items.push({
        label: '解除关联族谱',
        action: (e) => handleUnRelateGenealogy(e),
      })
    } else {
      items.push({
        label: '关联族谱',
        action: (e) => handleRelateGenealogy(e),
      })
    }
    items.push({
      label: '创建为新族谱',
      action: (e) => handleNewGenealogy(e),
    })
  }

  // 删除
  if (node && !node.hasChildren && isOwned.value) {
    items.push({
      label: '删除',
      type: 'icon',
      svgIcon: ICON_DELETE,
      action: (e) => {
        deleteMember(e.data, () => {
          if (!e.parent) {
            handleRemovedRoot()
            return
          }
          const rawData = getCacheRawData()
          const idx = rawData.findIndex((item) => item.i === e.data._id)
          if (idx > -1) rawData.splice(idx, 1)
          const childIdx = e.parent?.data?.children?.findIndex((c) => c._id === e.data._id)
          if (childIdx > -1) {
            e.parent?.data?.children?.splice(childIdx, 1)
            tree.value?.rerender(undefined, { keepOldPosition: true, keepZoom: true })
          }
        }, teleport.value)
      },
    })
  }

  return items.filter(Boolean)
}

// ==================== 树配置 ====================
function getTreeOptions(dir) {
  const avatarOffset = isAvatarEnabled.value ? AVATAR_SIZE : 0
  const familyNameOffset = props.genealogy?.displayFamilyName ? 6 : 0

  const sizeMap = {
    top: { nodeHeight: 66 + familyNameOffset + avatarOffset, nodeWidth: 46 },
    bottom: { nodeHeight: 66 + familyNameOffset + avatarOffset, nodeWidth: 46 },
    left: { nodeHeight: 46, nodeWidth: 66 + familyNameOffset + avatarOffset },
    right: { nodeHeight: 46, nodeWidth: 66 + familyNameOffset + avatarOffset },
  }

  if (styleMode.value === 'modern') {
    return {
      nodeHeight: 42,
      nodeWidth: 72 + avatarOffset,
      siblingSpacing: 20,
      direction: dir,
    }
  }

  return {
    ...sizeMap[dir],
    siblingSpacing: 1,
    direction: dir,
  }
}

function getDefaultTreeConfig(genealogy) {
  return {
    idKey: '_id',
    childrenSpacing: 30,
    enableExpandCollapse: true,
    canvasStyle: 'background: var(--main-bg-color);',
    contentKey: 'name',
    highlightOnHover: true,
    enableToolbar: true,
    borderWidth: 1,
    borderColor: 'var(--tree-node-border-color)',
    borderColorHover: 'var(--tree-hover-border-color)',
    edgeColor: 'var(--border-edge)',
    edgeColorHover: 'var(--tree-hover-border-color)',
    fontColor: 'var(--el-text-color-primary)',
    fontSize: 'var(--tree-font-size, 16px)',
    nodeBGColorHover: '',
    nodeClassName: (node) => {
      if (node.data.dieYoung) return 'member-die-young'
      return node.data.sex === 0 ? 'member-male' : 'member-female'
    },
    defaultZoom: 0.8,
    toolbarStyle:
      'display:flex;flex-direction:column;gap:5px;position:absolute;right:0;top:50%;transform:translateY(-50%);z-index:9;opacity:0.8;',
    nodeTemplate: (name, nodeData, options) => (el) => {
      const displayName = `${options.displayFamilyName && !isMaternalLine(nodeData) ? options.familyName : ''}${name}`
      const fontSize = displayName.length === 3 ? '0.8em' : displayName.length >= 4 ? '0.65em' : '1em'

      const nameEl = document.createElement('div')
      nameEl.className = 'member-name'
      nameEl.style.fontSize = fontSize
      nameEl.textContent = displayName

      let subtitleEl = null
      if (nodeData.subtitle) {
        subtitleEl = document.createElement('div')
        subtitleEl.className = 'member-name-sub'
        subtitleEl.textContent = nodeData.subtitle.slice(0, 8)
      }

      if (options.avatar) {
        el.classList.add('tree-node-avatar')
        const wrapper = document.createElement('div')
        wrapper.setAttribute('style', 'flex-grow:1')
        const img = document.createElement('img')
        img.setAttribute('data-id', nodeData._id)
        if (nodeData.avatar) {
          img.setAttribute('data-show', '1')
        } else {
          img.setAttribute('data-show', '0')
          img.classList.add('no-avatar')
        }
        img.src = nodeData.sex ? AVATAR_FEMALE : AVATAR_MALE
        el.appendChild(img)
        wrapper.classList.add('tree-node-wrapper')
        wrapper.appendChild(nameEl)
        if (subtitleEl) wrapper.appendChild(subtitleEl)
        el.appendChild(wrapper)
        return el
      }

      el.classList.add('tree-node-wrapper')
      el.appendChild(nameEl)
      if (subtitleEl) el.appendChild(subtitleEl)
      return el
    },
    fontFamily: 'var(--tree-font-family)',
    ...props.options,
    onRendered: (graph) => {
      emit('treeRendered', graph)
      setupAvatarObserver()
      setupAvatarObserver = createAvatarObserver()
    },
    sortChildNodes: (children, dir) => {
      return children.sort((a, b) => {
        if ((dir === 'top' || dir === 'bottom') && (props.genealogy?.writingMode || 'rl') === 'rl') {
          return b.birthOrder - a.birthOrder
        }
        return a.birthOrder - b.birthOrder
      })
    },
    displayMaxNodes: DISPLAY_MAX_NODES,
    onInitialCollapsedDepth: (depth) => {
      collapsedDepth.value = depth
    },
  }
}

// ==================== 树初始化 ====================
function initTree(data) {
  if (!data || data.length === 0) {
    isEmpty.value = true
    return
  }

  isEmpty.value = false
  const treeConfig = getDefaultTreeConfig(props.genealogy)
  const layoutOptions = getTreeOptions(direction.value)

  tree.value = new ApexTree(domRef.value, {
    width: containerWidth.value,
    height: containerHeight.value,
    avatar: isAvatarEnabled.value,
    ...treeConfig,
    ...layoutOptions,
    toolbar: {
      directions: ['top', 'left', 'bottom'],
      export: false,
      fullscreenTargetDom: wrapRef.value,
      language: {
        'zoom-in': '放大',
        'zoom-out': '缩小',
        'fit-screen': '显示全部',
        'full-screen': '全屏/退出全屏',
        top: '从上到下',
        left: '从左到右',
        'style-mode': '风格',
        print: '打印',
      },
      customButtons: [
        {
          id: 'style-mode',
          render: (el) => {
            el.innerHTML = ICON_STYLE_MODE
          },
          action: () => {
            styleMode.value = styleMode.value === 'modern' ? 'traditional' : 'modern'
            tree.value?.updateOptions(getTreeOptions(direction.value))
            searchAgain()
          },
        },
        {
          sort: 20,
          id: 'print',
          render: (el) => {
            el.innerHTML = ICON_PRINT
          },
          action: () => {
            const id = genealogyId.value || props.genealogy?._id || ''
            if (id) {
              window.open(`/print/zupu?id=${id}&from=${route.name}`, '_blank')
            }
          },
        },
      ],
    },
    contextmenu: {
      tips: () => (navigator.maxTouchPoints > 0 ? '再次点击显示菜单' : ''),
      itemHeight: 28,
      itemWidth: 108,
      list: (node) => getContextMenuItems(tree.value, node),
    },
    getLatestOptions: getTreeOptions,
    onChangeLayout: (dir, graph) => {
      direction.value = dir
      if (highlightedNodes.value.length > 0) {
        const keyword = searchData.value.keyword
        graph.rootNode?.descendants().forEach((n) => {
          if (n.data.name === keyword) graph.highlightNode(n)
        })
      }
    },
    onNodeClick: (node) => {
      if (!isChangingParent.value) return
      if (changeParentTarget.value?.descendants().includes(node) || changeParentTarget.value?.parent === node) {
        return
      }
      changeParentData.value.targetMemberId = node.data._id
      changeParentTipBarRef.value?.doChangeParent(changeParentData.value).then((success) => {
        cancelChangeParent()
        if (success) handleBatchAddSuccess(changeParentData.value.targetMemberId)
      }).finally(() => {
        Object.assign(changeParentData.value, getEmptyChangeParentData())
      })
    },
  })

  const result = tree.value.render(data[0])

  // 如果 URL 中有 memberId，定位到该节点
  if (route.query.memberId) {
    const targetNode = result.rootNode?.descendants().find((d) => d.data._id === route.query.memberId)
    if (targetNode) emit('setAncestor', targetNode.data)
  }
}

// ==================== 头像懒加载 ====================
let setupAvatarObserver = () => {}

function createAvatarObserver() {
  if (!isAvatarEnabled.value || !domRef.value) return () => {}

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          loadAvatar(img, () => observer.unobserve(img))
        }
      })
    },
    { root: document.body }
  )

  const images = domRef.value.querySelectorAll('img')
  images.forEach((img) => observer.observe(img))
  return () => images.forEach((img) => observer.unobserve(img))
}

function loadAvatar(img, callback = () => {}) {
  const memberId = img.dataset.id
  const shouldShow = img.dataset.show === '1'
  const isLoaded = img.dataset.loaded === '1'

  if (!memberId || !shouldShow || isLoaded) return

  img.dataset.loaded = '1'
  getAvatarUrl(memberId, 'sm')
    .then((url) => {
      if (url) {
        img.src = url
        callback(true)
      } else {
        img.dataset.loaded = '0'
        callback(false)
      }
    })
    .catch(() => {
      img.dataset.loaded = '0'
      callback(false)
    })
}

// ==================== 事件处理 ====================
function handleAddRoot() {
  addRootMember((newMember) => {
    isEmpty.value = false
    nextTick(() => initTree([newMember]), { once: true })
  })
}

function handleBatchAdd() {
  batchInputMembers({ rootBirthOrder: 0, onAdded: () => {
    isEmpty.value = false
    fetchLoading.value = false
    doFetch()
  }})
}

function handleViewFromNode(node) {
  resetSearch()
  emit('setAncestor', node.data)
  tree.value?.render(buildTreeData(cachedRawData, { startNodeId: node.data._id })[0], false)
  router.replace({ query: { ...route.query, memberId: node.data._id } })
}

function handleViewAllNodes(node) {
  resetSearch(false)
  highlightedNodes.value.length = 0
  emit('setAncestor', null)
  tree.value?.render(buildTreeData(cachedRawData)[0])

  const graph = tree.value?.graph
  if (node && graph) {
    const target = graph.rootNode?.descendants().find((d) => d.data._id === node.data._id)
    if (target) {
      graph.moveNodeToCenter(target)
      graph.zoomTo(graph.canvas.zoom() || 1)
    }
  }
  router.replace({ query: { id: route.query.id } })
}

function handleRerenderTree() {
  tree.value?.rerender(undefined, { keepOldPosition: true, keepZoom: true })
}

function handleBatchCollapseExpandSiblingsChildren(depth, node) {
  collapsedDepth.value = depth
  if (tree.value) {
    tree.value.graph.batchToggleChildren(depth, depth >= 0 ? 'collapse' : 'expand')
    tree.value.rerender(undefined, { keepOldPosition: false, keepZoom: true })
    const target = tree.value.graph.rootNode?.descendants().find((d) => d.data._id === node.data._id)
    tree.value.graph.moveNodeToCenter(target)
  }
}

function handleChangingParent(node) {
  isChangingParent.value = true
  changeParentTarget.value = node
  // 高亮变更中的节点
  node.descendants().concat(node.parent).forEach((n) => {
    tree.value?.element.querySelector(`[data-self="${n.data._id}"]`)?.classList.add('change-parent-pending')
  })
}

function cancelChangeParent() {
  isChangingParent.value = false
  if (changeParentTarget.value) {
    unhighlightNode(changeParentTarget.value, 'remove')
  }
  tree.value?.graph.disableHighlight(false)
  tree.value?.graph.disableContextMenu(false)
}

function unhighlightNode(node, action) {
  node?.descendants().concat(node.parent).forEach((n) => {
    tree.value?.element.querySelector(`[data-self="${n.data._id}"]`)?.classList[action]('change-parent-pending')
  })
}

function handleRemovedRoot() {
  isEmpty.value = true
  tree.value?.destroy()
  tree.value = undefined
}

async function handleBatchAddSuccess(parentId) {
  const currentZoom = tree.value?.graph.canvas.zoom()
  await doFetch()
  const graph = tree.value?.graph
  if (graph && parentId) {
    graph.rootNode?.each((node) => {
      if (node.data._id === parentId) {
        graph.moveNodeToCenter(node)
        graph.zoomTo(currentZoom || 1)
      }
    })
  }
}

function handleRelateGenealogy(node) {
  relateToGenealogy({
    memberId: node.data._id,
    callback: (id) => { node.data.relatedGenealogyId = id },
  }, teleport.value)
}

function handleUnRelateGenealogy(node) {
  unRelateToGenealogy({
    relatedGenealogyId: genealogyId.value,
    memberId: node.data._id,
    callback: () => { node.data.relatedGenealogyId = null },
  }, teleport.value)
}

function handleGotoGenealogy(node) {
  const targetId = node.data.relatedGenealogyId
  router.push({ name: 'genealogyDetail', query: { id: targetId } })
}

function handleNewGenealogy(node) {
  migrateMembers({
    genealogy: props.genealogy,
    member: node.data,
    callback: (newId) => {
      router.push({ name: 'genealogyDetail', query: { id: newId } })
    },
  }, teleport.value)
}

function handleUploadAvatar(node) {
  uploadAvatar({
    member: node.data,
    callback: async (result) => {
      if (!isAvatarEnabled.value) return
      const imgEl = teleport.value.querySelector(`img[data-id="${node.data._id}"]`)
      if (result === 'delete') {
        node.data.avatar = false
        imgEl.dataset.show = '0'
        imgEl.dataset.loaded = '0'
        imgEl.src = node.data.sex ? AVATAR_FEMALE : AVATAR_MALE
        imgEl.classList.add('no-avatar')
      } else {
        node.data.avatar = true
        imgEl.dataset.show = '1'
        imgEl.dataset.loaded = '0'
        loadAvatar(imgEl, () => imgEl.classList.remove('no-avatar'))
      }
    },
  }, teleport.value)
}

// ==================== 搜索 ====================
onSearch((keyword) => {
  const graph = tree.value?.graph
  if (!graph) return

  const results = buildTreeData(cachedRawData, {
    startNodeId: route.query.memberId,
    keyword,
  })

  if (results.length === 0) return

  tree.value?.render(results[0], false)
  graph.rootNode?.descendants().forEach((node) => {
    if (node.data.name === keyword) {
      graph.highlightNode(node)
      highlightedNodes.value.push(node)
    }
  })
  searchData.value.total = highlightedNodes.value.length
})

onJump((index) => {
  searchData.value.current = index
  tree.value?.graph.moveNodeToCenter(highlightedNodes.value[index])
})

onClear(() => {
  const results = buildTreeData(cachedRawData, { startNodeId: route.query.memberId })
  tree.value?.render(results[0], false)
  highlightedNodes.value.length = 0
})

// ==================== 容器尺寸监听 ====================
watch([containerWidth, containerHeight], ([w, h]) => {
  if (tree.value && w > 0 && h > 0) {
    const zoom = tree.value.graph.canvas.zoom()
    tree.value.graph.canvas.size(containerWidth.value, containerHeight.value)
    tree.value.graph.canvas.zoom(zoom)
  }
})

// ==================== 生命周期 ====================
onMounted(() => {
  const initData = props.getInitData()
  if (initData === null) {
    doFetch()
  } else {
    cachedRawData = initData
    initTree(buildTreeData(initData, { startNodeId: route.query.memberId }))
  }
})

onMemberCountChange((count) => emit('updateMemberCountChanged', count))

// ==================== 工具函数 ====================
function getSiblingBirthOrders(node) {
  return node.children?.map((c) => c.data.birthOrder) || []
}

function getCacheRawData() {
  return cachedRawData
}

function getEmptyChangeParentData() {
  return { genealogyId: '', memberId: '', targetGenealogyId: '', targetMemberId: '' }
}

function isMaternalLine(nodeData) {
  let parent = nodeData.parent
  while (parent) {
    if (!parent) return false
    if (parent.sex === 1) return true
    parent = parent.parent
  }
  return false
}

function mapFieldsToStorage(fields) {
  const fieldMap = { birthOrder: 'bo', name: 'n', remark: 'r', sex: 's', dieYoung: 'dy', subtitle: 'sub' }
  return Object.keys(fields).reduce((acc, key) => {
    if (fieldMap[key]) acc[fieldMap[key]] = fields[key]
    return acc
  }, {})
}

// ==================== 暴露方法 ====================
defineExpose({
  tree,
  resetToViewAllNodes: handleViewAllNodes,
  crossChangeParent: (data) => {
    isChangingParent.value = true
    changeParentTarget.value = null
    Object.assign(changeParentData.value, data)
  },
})
</script>

<style scoped>
.tree-direction-top .member-name,
.tree-direction-bottom .member-name {
  writing-mode: horizontal-tb;
}

.tree-direction-left .member-name,
.tree-direction-right .member-name {
  writing-mode: vertical-rl;
}

.change-parent-mode [data-self] {
  cursor: pointer;
}

.change-parent-pending {
  outline: 2px dashed var(--el-color-warning);
  outline-offset: 2px;
}

.member-die-young {
  opacity: 0.6;
}

.tree-node-avatar img {
  width: var(--tree-avatar-size, 28px);
  height: var(--tree-avatar-size, 28px);
  border-radius: 50%;
  object-fit: cover;
}

.tree-node-avatar img.no-avatar {
  filter: grayscale(1);
  opacity: 0.5;
}

.tree-contextmenu {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  box-shadow: var(--el-box-shadow-light);
}

.tree-contextmenu li {
  padding: 4px 12px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tree-contextmenu li:hover {
  background: var(--el-fill-color-light);
}

.tree-contextmenu li[data-button] {
  display: flex;
  gap: 4px;
  padding: 2px 6px;
}

.tree-contextmenu li[data-button] button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 3px;
  color: var(--el-text-color-primary);
}

.tree-contextmenu li[data-button] button:hover {
  background: var(--el-fill-color-light);
}

.tree-toolbar {
  transition: opacity 0.2s;
}

.tree-toolbar:hover {
  opacity: 1 !important;
}
</style>
</script>
