import requests from "./api";

const pagesServices = {
  
  getPageList: async ({limit,page,documentType }) => {
    let datalimit = limit ? limit :500;
    let pageNumber =  page ? page : 1 
    if(documentType === "all"){
        return requests.post(`/page/list?page=${1}&pageSize=${500}`,);
    }else{
      return requests.post(`/page/list?page=${pageNumber}&pageSize=${datalimit}&type=${documentType}`,);
    }
  },
  getPostList:async({limit,page,body}) =>{
        return requests.post(`/post/list?page=${1}&pageSize=${500}`,body);
  }
  

}
export default pagesServices;
