import { useLocation, useSelector } from 'umi'
import { language } from '../../src/utils/language'
export function fetchAuth (){
  const location = useLocation()
  const authsList = useSelector(({ app }) => app.authsList)
  const writable = authsList.filter((item) => item.route === location.pathname)[0]?.writable
  return writable
}

// 数字输入框输入范围校验提示
export function valiCompare (value, callback, minVal, maxVal) {
  if (value < minVal || value > maxVal) {
    callback(language('project.number.minAndMax',{ min: minVal, max: maxVal}))
  } else {
    callback()
  }
}

//mock增删改方法封装 
export function mockMethod (type = "show", data, param, res) {
  let newData = data;
  switch (type) {
    case "show":
      res.json(newData);
      break;
    case "del":
      const ids = param.ids.split(',')
      ids.map((value)=>{
        newData.data = newData?.data?.filter((item) => item.id !==value);
      })
      newData.total = newData?.data?.length;
      res.json({ success: true, msg: "操作成功" });
      break;
    case "add":
      delete param.op;
      delete param.token;
      const uuid  = new Date().getTime().toString(36) + '-' + Math.random().toString(36).substr(2, 9) 
      newData?.data?.push({ ...param,id:uuid });
      newData.total = newData?.total + 1;
      res.json({ success: true, msg: "操作成功" });
      break;
    case "mod":
      delete param.op;
      delete param.token;
      const index = newData?.data?.findIndex((item) => item.id == param.id);
      newData.data[index] = { ...param };
      res.json({ success: true, msg: "操作成功" });
      break;
    default:
      res.json(newData);
      break;
  }
};