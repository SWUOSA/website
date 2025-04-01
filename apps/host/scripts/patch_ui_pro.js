import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 为ESM模块创建__dirname等价物
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 确定项目根目录和@nuxt/ui-pro的路径
function findUiProPath() {
  // 尝试多个可能的路径，适配不同的项目结构
  const possiblePaths = [
    // 主项目node_modules下
    path.resolve('node_modules', '@nuxt', 'ui-pro'),
    // apps/host下
    path.resolve('apps', 'host', 'node_modules', '@nuxt', 'ui-pro'),
    // 相对于脚本位置
    path.resolve(__dirname, '..', 'node_modules', '@nuxt', 'ui-pro'),
    // pnpm全局存储
    path.resolve('../../', '.pnpm', '@nuxt+ui-pro@3.0.1', 'node_modules', '@nuxt', 'ui-pro')
  ]

  console.log('尝试查找@nuxt/ui-pro...')
  // 检查哪个路径存在
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        console.log(`找到@nuxt/ui-pro在: ${p}`)
        return p
      }
    } catch {
      // 忽略错误，继续尝试下一个路径
    }
  }

  throw new Error('无法找到@nuxt/ui-pro目录')
}

// 递归读取目录下的所有文件
function readDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.error(`目录不存在: ${dirPath}`)
      return 0
    }

    const files = fs.readdirSync(dirPath)
    let modifiedFiles = 0

    files.forEach((file) => {
      const filePath = path.join(dirPath, file)
      try {
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
          // 如果是目录，递归
          const subDirModified = readDirectory(filePath)
          if (typeof subDirModified === 'number') {
            modifiedFiles += subDirModified
          }
        } else if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.cjs') || filePath.endsWith('.mjs')) {
          // 如果是JS、TS、CJS或MJS文件，检查并替换
          if (modifyFile(filePath)) {
            modifiedFiles++
          }
        }
      } catch (err) {
        console.error(`处理文件时出错 ${filePath}:`, err)
      }
    })

    return modifiedFiles
  } catch (err) {
    console.error(`读取目录时出错 ${dirPath}:`, err)
    return 0
  }
}

// 修改文件中的validateLicense函数
function modifyFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    let modified = false

    // 匹配不同格式的validateLicense函数
    const regexPatterns = [
      // 异步函数声明
      /async\s+function\s+validateLicense\s*\([^)]*\)\s*\{[\s\S]*?/g,
      // 标准函数声明
      /function\s+validateLicense\s*\([^)]*\)\s*\{[\s\S]*?/g,
      // 箭头函数
      /const\s+validateLicense\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{[\s\S]*?/g,
      // 导出函数
      /export\s+(?:async\s+)?function\s+validateLicense\s*\([^)]*\)\s*\{[\s\S]*?/g,
      // 导出箭头函数
      /export\s+const\s+validateLicense\s*=\s*(?:async\s*)?\([^)]*\)\s*=>\s*\{[\s\S]*?/g
    ]

    let modifiedContent = fileContent

    // 应用所有正则表达式模式
    for (const regex of regexPatterns) {
      if (regex.test(modifiedContent)) {
        modifiedContent = modifiedContent.replace(regex, (match) => {
          // 保持函数名和参数，但替换函数体
          const funcStart = match.substring(0, match.indexOf('{') + 1)
          return `${funcStart}\n return true;`
        })
        modified = true
      }
    }

    // 如果有修改，写回文件
    if (modified) {
      fs.writeFileSync(filePath, modifiedContent, 'utf-8')
      console.log(`已修改: ${filePath}`)
      return true
    }

    return false
  } catch (err) {
    console.error(`处理文件时出错 ${filePath}:`, err)
    return false
  }
}

// 查找所有ui-pro相关文件
function findAllUiProFiles() {
  const possibleLocations = [
    path.resolve('node_modules'),
    path.resolve('apps', 'host', 'node_modules')
  ]

  let uiProFiles = []

  for (const location of possibleLocations) {
    try {
      if (fs.existsSync(location)) {
        findUiProFilesInDir(location, uiProFiles)
      }
    } catch (err) {
      console.error(`查找UI Pro文件时出错: ${err}`)
    }
  }

  return uiProFiles
}

// 递归查找文件
function findUiProFilesInDir(dir, results) {
  try {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const fullPath = path.join(dir, file)

      try {
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          // 避免进入过深的目录结构
          if (!fullPath.includes('node_modules/node_modules')) {
            findUiProFilesInDir(fullPath, results)
          }
        } else if (
          (file.startsWith('ui-pro') && (file.endsWith('.cjs') || file.endsWith('.mjs')))
          || (fullPath.includes('@nuxt/ui-pro') && (file.endsWith('.cjs') || file.endsWith('.mjs')))
        ) {
          results.push(fullPath)
        }
      } catch {
        // 忽略无法访问的文件
      }
    }
  } catch {
    // 忽略无法读取的目录
  }
}

// 主函数
function main() {
  try {
    console.log('开始修补@nuxt/ui-pro许可证验证...')

    // 方法1: 使用findUiProPath查找UI Pro目录
    let modifiedFiles = 0
    try {
      const uiProPath = findUiProPath()
      modifiedFiles = readDirectory(uiProPath)
    } catch (err) {
      console.warn(`通过目录路径查找失败: ${err.message}`)
    }

    // 方法2: 查找所有可能的UI Pro文件
    console.log('尝试查找所有UI Pro相关文件...')
    const uiProFiles = findAllUiProFiles()

    if (uiProFiles.length > 0) {
      console.log(`找到 ${uiProFiles.length} 个UI Pro相关文件`)

      for (const file of uiProFiles) {
        if (modifyFile(file)) {
          modifiedFiles++
        }
      }
    }

    if (modifiedFiles > 0) {
      console.log(`成功修补了${modifiedFiles}个文件`)
    } else {
      console.log('没有找到需要修补的文件，可能已经修补过或者结构已更改')
    }
  } catch (err) {
    console.error('修补过程中出错:', err)
    process.exit(1)
  }
}

// 执行主函数
main()
