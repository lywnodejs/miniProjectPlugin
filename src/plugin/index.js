
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


// export const answer = 42
