import http from '../html-common'

export const uploadFile = (file, type) => {
    let formData = new FormData();

    formData.append("file", file);

    return http.post(`/contract-${type}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }); 
}
