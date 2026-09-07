import Taro from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import { Image, Input, Label, View } from '@tarojs/components'
import './itemInput.scss'
import './itemFile.scss'

const API_LIST = {
  dev: {
    baseUrl: 'https://api-agency-cms.agent.dragontrail.cn',
    liveUrl: 'https://api-live.agent.dragontrail.cn',
  },
  prod: {
    baseUrl: 'https://api.agency-cms.dragontrail.com',
    liveUrl: 'https://api.ctalive.com',
  },
}

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024

const uploadFile = (api, filePath, token, text) => new Promise((resolve, reject) => {
  Taro.uploadFile({
    url: `${api.baseUrl}/api/system/upload`,
    filePath,
    name: 'file',
    header: {
      'content-type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    formData: {
      type: 'image',
    },
    success: (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(text('activity.upload_failed', '上传失败')))
        return
      }
      try {
        resolve(JSON.parse(res.data))
      } catch (e) {
        reject(new Error(text('activity.upload_data_exception', '上传返回数据异常')))
      }
    },
    fail: () => reject(new Error(text('activity.upload_failed', '上传失败'))),
  })
})

const checkFaceImage = (api, url, text, lang = 'zh-CN') => new Promise((resolve, reject) => {
  Taro.request({
    url: `${api.liveUrl}/api/v1/system/face-check?lang=${lang}`,
    method: 'POST',
    data: { url },
    header: {
      'content-type': 'application/json',
    },
    success: (res) => {
      if (res.statusCode === 200 && res.data) {
        resolve(res.data)
      } else {
        reject(new Error(res?.data?.message || text('activity.face_recognition_failed', '人脸识别服务调用失败')))
      }
    },
    fail: () => reject(new Error(text('activity.face_recognition_failed', '人脸识别服务调用失败'))),
  })
})

export default function ItemFile({
  label,
  placeholder,
  name,
  value,
  required = true,
  disabled = false,
  subType = 'file',
  is_test = false,
  token = '',
  lang = 'zh-CN',
  languageData = {},
}) {
  const text = (key, fallback) => languageData[key] || fallback
  const isImage = subType === 'portrait' || subType === 'image'
  const inputRef = useRef()
  const [fileUrl, setFileUrl] = useState(value || '')

  useEffect(() => {
    setFileUrl(value || '')
  }, [value])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = fileUrl
    }
  }, [fileUrl])

  if (subType === 'file' && typeof Taro.chooseMessageFile !== 'function') {
    return null
  }

  const showTip = (msg) => {
    Taro.showToast({
      icon: 'none',
      title: msg || text('activity.operation_failed', '操作失败'),
      duration: 2500,
    })
  }

  const handleUploaded = async (filePath, file) => {
    if (disabled) {
      return
    }
    if (file && file.size > MAX_UPLOAD_SIZE) {
      showTip(text('activity.upload_limit_20mb', '文件大小不能超过20MB'))
      return
    }

    const api = API_LIST[is_test === true || is_test === 'true' ? 'dev' : 'prod']
    Taro.showLoading({ title: text('activity.uploading', '上传中'), mask: true })
    try {
      const uploadResult = await uploadFile(api, filePath, token, text)
      if (!uploadResult?.status || !uploadResult?.data) {
        showTip(uploadResult?.message || text('activity.upload_failed', '上传失败'))
        return
      }

      const url = uploadResult.data
      if (subType === 'portrait') {
        const faceResult = await checkFaceImage(api, url, text, lang)
        if (!faceResult?.status || !faceResult?.data?.is_face) {
          showTip(faceResult?.data?.message || faceResult?.message || text('activity.portrait_photo_hint', '请上传包含清晰人像的照片'))
          setFileUrl('')
          return
        }
      }
      setFileUrl(url)
    } catch (e) {
      showTip(e?.message || text('activity.upload_failed_retry', '上传失败，请重试'))
    } finally {
      Taro.hideLoading()
    }
  }

  const chooseFile = () => {
    if (disabled) {
      return
    }
    if (isImage) {
      Taro.chooseImage({
        count: 1,
        sizeType: ['compressed', 'original'],
        success: (res) => {
          const file = res.tempFiles?.[0]
          handleUploaded(res.tempFilePaths[0], file)
        },
        fail: () => {},
      })
      return
    }

    Taro.chooseMessageFile({
      count: 1,
      type: 'all',
      success: (res) => {
        const file = res.tempFiles?.[0]
        handleUploaded(file?.path || file?.tempFilePath, file)
      },
      fail: () => {},
    })
  }

  const renderUploadArea = () => {
    if (fileUrl) {
      if (isImage) {
        return (
          <View className={`file-upload-preview-body ${disabled ? 'disabled' : ''}`} onClick={chooseFile}>
            <Image className="file-upload-preview" src={fileUrl} mode="aspectFit" />
            {!disabled && <View className="file-upload-preview-change">{text('activity.click_change', '点击更换')}</View>}
          </View>
        )
      }

      return (
        <View className={`file-upload-file-box ${disabled ? 'disabled' : ''}`} onClick={chooseFile}>
          <View className="file-upload-file-icon">
            <View className="file-upload-file-icon-arrow" />
          </View>
          <View className="file-upload-file-name">{text('activity.uploaded_file', '已上传文件')}</View>
          {!disabled && <View className="file-upload-file-change">{text('activity.click_change', '点击更换')}</View>}
        </View>
      )
    }

    return (
      <View className={`file-upload-body file-upload-empty-body ${disabled ? 'disabled' : ''}`} onClick={chooseFile}>
        {isImage ? (
          <>
            <View className="file-upload-plus">＋</View>
            <View className="file-upload-empty">{placeholder || text('activity.click_upload_image', '点击上传图片')}</View>
          </>
        ) : (
          <>
            <View className="file-upload-plus">＋</View>
            <View className="file-upload-name">{placeholder || text('activity.click_upload_file', '点击上传文件')}</View>
          </>
        )}
      </View>
    )
  }

  return (
    <View className="input_con file-upload-item">
      <Label className={`label ${required ? "before:content-['*'] before:text-red-500 before:mr-2" : "before:content-['*'] before:text-white before:mr-2"}`}>
        {label}
      </Label>
      {renderUploadArea()}
      <Input
        ref={inputRef}
        className="input-not-style"
        name={name}
        value={fileUrl}
      />
    </View>
  )
}
