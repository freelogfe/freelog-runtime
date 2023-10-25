import frequest from "../services/handler";
import user from "../services/api/modules/user";
import node from "../services/api/modules/node";
export async function getCurrentUser() {
  return frequest(user.getCurrent, "", ""); 
}
// node.putUserData  node.getUserData 
export async function putUserData(query:any) {
  return frequest(node.putUserData, "", query); 
}
export async function getUserData(query:any) {
  return frequest(node.getUserData, "", query); 
}