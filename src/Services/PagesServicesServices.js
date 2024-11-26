import requests from "./api";

const pagesServices = {
  
  getPageList: async ({documentType }) => {
    
    if(documentType === "all"){
        return requests.post(`/page/list?page=${1}&pageSize=${500}`,);
    }else{
      return requests.post(`/page/list?page=${1}&pageSize=${500}&type=${documentType}`,);
    }
    
  },
  

}
export default pagesServices;
