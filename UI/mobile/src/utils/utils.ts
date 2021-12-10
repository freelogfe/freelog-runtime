/**
 *
 * @param origin model
 * @param data wait to compare with model
 * @param diff  if only reserve difference set
 * delete the data's keys while they are (not) exist in origin
 */
export function compareObjects(origin: any, data: any, diff = false) {
  let otype = Object.prototype.toString.call(origin);
  let dtype = Object.prototype.toString.call(data);
  if (dtype === otype && otype === "[object Array]") {
    origin = { 0: origin };
    data = { 0: data };
  } else if (otype !== dtype || otype !== "[object Object]") {
    !["[object Array]", "[object object]"].includes(otype) &&
      console.error(origin + " is not object or array");
    !["[object Array]", "[object object]"].includes(dtype) &&
      console.error(data + " is not object or array");
    return;
  }
  Object.keys(data).forEach((dkey) => {
    // depend on whether diff
    let isDelete = !diff;
    Object.keys(origin).some((okey) => {
      if (dkey === okey) {
        isDelete = !isDelete;
        if (diff) {
          return true;
        }
        let otype = Object.prototype.toString.call(origin[okey]);
        let dtype = Object.prototype.toString.call(data[dkey]);
        // loop if they are object the same time
        if (otype === dtype && dtype === "[object Object]") {
          compareObjects(origin[okey], data[dkey], diff);
        } else if (
          otype === dtype &&
          dtype === "[object Array]" &&
          Object.prototype.toString.call(origin[dkey][0]) === "[object Object]"
        ) {
          // if they are array the same time and origin[dkey][0] is object,
          data[dkey].forEach((item: any) => {
            Object.prototype.toString.call(item) === "[object Array]" &&
              compareObjects(origin[okey][0], item, diff);
          });
        }
        return true;
      }
      return false;
    });
    isDelete && delete data[dkey];
  });
}

 
export function checkPhone(phone: string) {
  const reg = new RegExp('^1(3|4|5|6|7|8|9)\\d{9}$')
  if (!reg.test(phone)) {
    return false;
  }
  return true;
}
export function checkEmail(email: string) {
  const reg =
    new RegExp("^([a-zA-Z0-9]+[_|\\-|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\-|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$", 'gi');
  if (!reg.test(email)) {
    return false;
  }
  return true;
}
export function checkPassword(password: string){
  // const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,24})$/;
  // if (!reg.test(password)) {
  //   return false;
  // }
  return true;
}
export function checkPayPassword(password: string){
  const reg = new RegExp("^\\d{6}$");
  if (!reg.test(password)) {
    return false;
  }
  return true;
}
export function checkUsername(username: string){
  // const reg =  /^(?!-)[A-Za-z0-9-]{1,30}(?<!-)$/;
  // if (!reg.test(username)) {
  //   return false;
  // }
  return true;
}
