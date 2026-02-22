// BMI仪表盘
export const BMI_GAUGE_CONFIG = {
    style: {
        fontFamily: 'inherit',
        chart: {
            backgroundColor: 'transparent',
            color: '#1A1A1A',
            animation: { use: true, speed: 1, acceleration: 1 },
            layout: {
                radiusRatio: 1,
                track: { size: 1, useGradient: true, gradientIntensity: 20 },
                markers: { show: true, color: '#1A1A1A', bold: true },
                pointer: {
                    show: true,
                    type: 'pointy',
                    size: 1,
                    useRatingColor: true,
                    circle: { radius: 10, color: '#FFFFFF' }
                }
            },
            legend: { show: false },
            title: { text: '' }
        }
    },
    userOptions: { show: false }
};

// BMI趋势图
export const SPARKLINE_CONFIG = {
    style: {
        backgroundColor: 'transparent',
        line: {
            color: '#6eb6ff',
            strokeWidth: 3,
            smooth: true
        },
        area: {
            show: true,
            useGradient: true,
            opacity: 30,
            color: '#6eb6ff'
        },
        cursor: { show: true },
        verticalIndicator: { show: true },
        // dataLabel: { show: false }
    }
};