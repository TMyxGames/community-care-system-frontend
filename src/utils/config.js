// 后端服务器基础地址
export const API_BASE_URL = 'http://localhost:8081';

// 通用的路径拼接方法
export const getFullUrl = (relativePath) => {
    if (!relativePath) return '';
    // 如果已经是完整路径则直接返回
    if (relativePath.startsWith('http')) return relativePath;
    // 否则拼接基础地址
    return `${API_BASE_URL}${relativePath}`;
};
