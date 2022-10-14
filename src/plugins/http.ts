import Vue from "vue";

// list of constants
const baseUrl: string = "https://cornie-assessment.herokuapp.com/"
const candidateId: string = "VNU02SLoZJdKS3p"


export async function fetchData() {
  let data: any [] | undefined = undefined
  let error: string| undefined = undefined
  try {
    const response = await fetch(`${baseUrl}users/${candidateId}`);
    const toJon = await response.json();
    console.log(toJon)
     return data = toJon.data;
  } catch (err) {
    error = err as string
  }
}

// we can use this to create a batch update with { Promise.All }
export async function MarkPaid(userId: string){
  const requestOptions: RequestInit = {
    method: "PATCH",
    mode: "cors",
    headers: {
    "Content-Type": "application/json",
    },
  };
  return fetch(`${baseUrl}mark-paid/${userId}`, requestOptions)
}



Vue.prototype.$ServiceFetchUser = fetchData;
Vue.prototype.$ServiceMarkAsPaid = MarkPaid


