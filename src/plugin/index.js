
import Taro from '@tarojs/taro'
import './index.scss'

export function sayHello () {
  console.log('Hello plugin!')
}

// 搜索高亮处理
export function brightenKeyword(result,keyword) {
  const Reg = new RegExp(keyword, 'gi')
  let res = result
  if (result) {
      res = result.replace(Reg, match => `<span class='search-name'>${match}</span>`)
  }
  console.log(res);
  
  return res
}

export function debounce(func, wait, flag) {
  let timer, args, that; 
  return function (args) {
  //args包含了func的事件对象,that为func的this指向(应当指向事件源)
      args = arguments;
      that = this;
      let callnow = flag && !timer;
      if (callnow) func.apply(that, args); //不传入参数flag这段行代码不执行
      clearTimeout(timer);
      timer = setTimeout(function () {
          timer = null;
          if (!flag) func.apply(that, args);
      }, wait);
  };
}



export const getLocalTimezone = () => {
  try {
      // 优先使用现代 API
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return {
          name: timeZone,
          offset: new Date().getTimezoneOffset(),
          offsetHours: -new Date().getTimezoneOffset() / 60
      };
  } catch (error) {
      // 降级到传统方法
      const offset = new Date().getTimezoneOffset();
      return {
          name: `UTC${-offset / 60 >= 0 ? '+' : ''}${-offset / 60}`,
          offset: offset,
          offsetHours: -offset / 60
      };
  }
}

/**
* @description 基于时区偏移量进行时间转换
* @param {string|Date} dateTime - 要转换的时间（字符串或Date对象）
* @param {number} fromOffset - 源时区偏移量（单位：小时，如 +8, -5, 0）
* @param {number} toOffset - 目标时区偏移量（单位：小时，如 +8, -5, 0）
* @param {string} format - 返回时间的格式，默认为 'YYYY-MM-DD HH:mm:ss'
* @returns {string} 转换后的时间字符串
*/
export const convertTimeByOffset = (dateTime, fromOffset, toOffset, format = 'YYYY-MM-DD HH:mm:ss') => {
  try {
      let sourceDate;
      
      // 处理输入时间
      if (typeof dateTime === 'string') {
          dateTime = dateTime.replaceAll('-','/');
          sourceDate = new Date(dateTime);
      } else if (dateTime instanceof Date) {
          sourceDate = new Date(dateTime);
      } else {
          throw new Error('无效的时间格式');
      }
      
      // 验证时间有效性
      if (isNaN(sourceDate.getTime())) {
          throw new Error('无效的时间');
      }
      
      // 验证偏移量参数
      if (typeof fromOffset !== 'number' || typeof toOffset !== 'number') {
          throw new Error('时区偏移量必须是数字');
      }
      
      if (fromOffset < -12 || fromOffset > 14 || toOffset < -12 || toOffset > 14) {
          throw new Error('时区偏移量超出有效范围（-12 到 +14）');
      }
      
      // 计算时区差值（小时）
      const offsetDiff = toOffset - fromOffset;
      
      // 转换时间
      const convertedTime = new Date(sourceDate.getTime() + offsetDiff * 60 * 60 * 1000);
      
      // 格式化输出
      const year = convertedTime.getFullYear();
      const month = String(convertedTime.getMonth() + 1).padStart(2, '0');
      const day = String(convertedTime.getDate()).padStart(2, '0');
      const hours = String(convertedTime.getHours()).padStart(2, '0');
      const minutes = String(convertedTime.getMinutes()).padStart(2, '0');
      const seconds = String(convertedTime.getSeconds()).padStart(2, '0');
      
      // 根据格式返回
      switch (format) {
          case 'YYYY-MM-DD':
              return `${year}-${month}-${day}`;
          case 'HH:mm:ss':
              return `${hours}:${minutes}:${seconds}`;
          case 'YYYY-MM-DD HH:mm':
              return `${year}-${month}-${day} ${hours}:${minutes}`;
          case 'MM/DD/YYYY HH:mm:ss':
              return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
          case 'YYYY/MM/DD HH:mm:ss':
              return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
          case 'DD-MM-YYYY HH:mm:ss':
              return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
          case 'YYYY-MM-DD HH:mm:ss':
          default:
              return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      
  } catch (error) {
      console.error('时区转换错误:', error.message);
      return false;
  }
};
/**
* @description 其他时区的时间转成当地的时区 同时比较大小
* @param {string|Date} fromTime - 要比较的时间（字符串或Date对象）
* @param {number} fromOffset - 源时区偏移量（单位：小时，如 +8, -5, 0）
* @returns {string} 比较结果 fromTime > currentTime
*/
export const compareTimeByOffset = (fromTime, fromOffset) => {
  let { offsetHours } = getLocalTimezone();
  let beforeTime = convertTimeByOffset(fromTime, fromOffset,offsetHours); //传入的时间转换为当地时区时间
  let currentTime = new Date();
  console.log(beforeTime,currentTime);

  return beforeTime > afterTime;
};


// export const answer = 42
