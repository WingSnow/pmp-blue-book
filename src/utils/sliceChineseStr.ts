// 截取字符串中的中文部分，
// 原理是查找字符串中的最后一个双字节字符，然后返回该字符位置之前的字串
// 特例：’认为是英文字符
const sliceChineseStr = (str: string) => {
  let index = 0
  for (let i = str.length - 1; i >= 0; i -= 1) {
    const charCode = str.charCodeAt(i)
    if (charCode > 255 && str[i] !== '’') {
      index = i
      break
    }
  }
  // 如果找不到中文，则原样返回，以处理全数字或英文的选项
  if (index === 0) {
    return str
  }
  return str.slice(0, index + 1)
}

export default sliceChineseStr
