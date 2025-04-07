/**
 * 图片服务工具类
 * 用于处理本地磁盘路径图片的显示
 */

import { ref } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * 将本地图片转换为base64格式
 * @param {string} imagePath - 本地图片路径
 * @returns {Promise<string>} - 返回base64格式的图片数据
 */
export const convertLocalImageToBase64 = async (imagePath) => {
  try {
    // 使用Fetch API读取本地图片
    const response = await fetch(`file://${imagePath}`)
    const blob = await response.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('图片转换失败:', error)
    ElMessage.error('图片加载失败')
    return ''
  }
}

/**
 * 处理产品图片显示
 * @param {string} imagePath - 图片路径
 * @returns {string} - 处理后的图片地址
 */
export const useProductImage = (imagePath) => {
  const imageUrl = ref('')

  const processImage = async () => {
    if (!imagePath) {
      imageUrl.value = 'https://img.freepik.com/free-photo/fresh-vegetables-wooden-table_144627-24544.jpg'
      return
    }

    if (imagePath.startsWith('http')) {
      imageUrl.value = imagePath
      return
    }

    try {
      const base64Image = await convertLocalImageToBase64(imagePath)
      imageUrl.value = base64Image || 'https://img.freepik.com/free-photo/fresh-vegetables-wooden-table_144627-24544.jpg'
    } catch (error) {
      console.error('处理图片失败:', error)
      imageUrl.value = 'https://img.freepik.com/free-photo/fresh-vegetables-wooden-table_144627-24544.jpg'
    }
  }

  processImage()

  return imageUrl
}