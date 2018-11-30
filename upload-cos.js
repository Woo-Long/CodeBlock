import Vue from 'vue'
import QCloudCOS from 'cos-js-sdk-v5'

// 实例化上传COS
const cos = new QCloudCOS({
  async getAuthorization (options, callback) {
    const formData = uploadCOSHandle().formData
    const res = await Vue.api.UploadFile.getCosSecret(formData)

    /* eslint-disable-next-line */
    callback({
      Authorization: res.appSign
      // XCosSecurityToken: data.XCosSecurityToken, // 如果是临时密钥计算出来的签名，需要提供 XCosSecurityToken
    })
  }
})

// 默认配置
const defaultOptions = {
  bucketName: '', // Bucket的名称。命名规则为{name}-{appid} ，此处填写的存储桶名称必须为此格式
  bucketRegion: 'ap-guangzhou', // Bucket所在区域（https://cloud.tencent.com/document/product/436/6224）
  formData: {
    bucketName: 'filebag',
    expired: 3600,
    remotePath: ''
  },
  auto: true, // 自动上传
  fileData: null,
  filePrefix: '', // 文件名前缀
  fileExt: ['png', 'jpg', 'jpeg', 'm4a', 'amr', 'wav', 'mp4', 'mov', 'mp3', 'pptx', 'ppt', 'pdf', 'xlsx', 'xls', 'docx', 'doc'],
  fileSize: 50, // 文件大小限制，默认50M
  onTaskReady: false, // 上传任务创建时的回调函数，返回一个 taskId，唯一标识上传任务，可用于上传任务的取消（cancelTask），停止（pauseTask）和重新开始（restartTask）
  onTaskUploadBefore: true, // 上传任务之前回调函数
  onTaskHashProgress: false, // 计算文件MD5值的进度回调函数，回调参数为进度对象 progressData
  onTaskProgress: false, // 上传文件的进度回调函数，回调参数为进度对象 progressData
  onTaskSuccess: false, // 上传文件成功回调函数
  onTaskError: false, // 上传文件出错回调函数
  onTaskComplete: false // 上传文件完成，不管成功还是失败，都会执行的回调函数
}

// 上传处理
const uploadCOSHandle = (options) => {
  let message = '错误'

  options = Object.assign(defaultOptions, options)

  const fileData = options.fileData

  if (!fileData) {
    message = '错误：没有配置fileData'
    console.error(message)

    if (options.onTaskError) options.onTaskError(message)
    return {}
  }

  const fileSize = options.fileSize * 1024 * 1024
  const fileName = fileData.name
  const fileExt = fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase()
  const fileKey = `${options.filePrefix}_${new Date().getTime()}.${fileExt}`
  const isAllow = options.fileExt.indexOf(fileExt) > -1

  // 检查文件扩展名是否允许上传
  if (!isAllow) {
    message = '文件格式不正确'
    Vue.message.error(message)

    return {}
  }

  // 验证文件大小
  if (fileData.size > fileSize) {
    message = `文件大小不能超过${options.fileSize}M`
    Vue.message.error(message)

    return {}
  }

  options.Bucket = options.bucketName
  options.Region = options.bucketRegion
  options.Key = fileKey
  options.Body = fileData

  options.TaskReady = (taskId) => {
    if (options.onTaskReady) options.onTaskReady(taskId)
  }
  options.onHashProgress = (progressData) => {
    if (options.onTaskHashProgress) options.onTaskHashProgress(progressData)
  }
  options.onProgress = (progressData) => {
    if (options.onTaskProgress) options.onTaskProgress(progressData)
  }

  return options
}

// 上传COS实例
function UploadFileCOS (options) {
  options = uploadCOSHandle(options)

  this.options = options
  this.cos = cos

  if (options.auto) {
    this.startUpload()
  }
}

// 设置配置项
UploadFileCOS.prototype.setOption = function (options) {
  options = Object.assign(this.options, options)
}

// 开始上传任务
UploadFileCOS.prototype.startUpload = function () {
  const options = this.options

  options.onTaskUploadBefore()

  cos.sliceUploadFile(options, (error, data) => {
    data = data || {}

    if (data.statusCode !== 200) {
      Vue.message.error('哎呀，上传出错啦^o^')

      if (options.onTaskError) options.onTaskError(error)
    } else {
      if (options.onTaskSuccess) options.onTaskSuccess(data)
    }

    if (options.onTaskComplete) options.onTaskComplete(error, data)
  })
}

// 重新上传任务
UploadFileCOS.prototype.restartTask = function (taskId) {
  this.cos.restartTask(taskId)
}

// 暂停上传任务
UploadFileCOS.prototype.pauseUpload = function (taskId) {
  this.cos.pauseTask(taskId)
}

// 取消上传任务
UploadFileCOS.prototype.cancelUpload = function (taskId) {
  this.cos.cancelTask(taskId)
}

export default UploadFileCOS
