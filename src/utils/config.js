// 后端服务器基础地址
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 通用的路径拼接方法
export const getFileUrl = (path) => {
    if (!path) return '';
    // 如果已经是完整路径则直接返回
    if (path.startsWith('http')) return path;
    
    // 如果数据库里存的是以/files为开头的路径，则直接返回
    let relativePath = path;
    // 否则拼接基础地址
    if (!path.startsWith('/files')) {
        relativePath = `/files${path.startsWith('/') ? '' : '/'}${path}`;
    }

    return relativePath;
};
