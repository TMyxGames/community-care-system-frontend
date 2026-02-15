export const checkInArea = (point, areaItem) => { 
    if (!window.AMap || !window.AMap.GeometryUtil) return true;
    if (!point || !areaItem || !areaItem.scopePath) return true;
    
    try {
        const path = typeof areaItem.scopePath === 'string' 
            ? JSON.parse(areaItem.scopePath) 
            : areaItem.scopePath;

        const polygonPath = path.map(p => {
            const lng = p.lng !== undefined ? p.lng : p[0];
            const lat = p.lat !== undefined ? p.lat : p[1];
            return [parseFloat(lng), parseFloat(lat)];
        }).filter(coord => !isNaN(coord[0]) && !isNaN(coord[1]));

        const isIn = window.AMap.GeometryUtil.isPointInPolygon(point, polygonPath);

        return isIn;
    } catch (error) { 
        console.error("区域校验失败", error);
        return true;
    }
};