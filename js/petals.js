document.addEventListener('DOMContentLoaded', function() {
    // 创建花瓣元素
    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // 随机大小 (10px-30px)
        const size = Math.random() * 20 + 10;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        
        // 随机起始位置
        petal.style.left = Math.random() * window.innerWidth + 'px';
        petal.style.top = -30 + 'px';
        
        // 随机透明度
        petal.style.opacity = Math.random() * 0.5 + 0.3;
        
        document.body.appendChild(petal);
        
        // 动画参数
        let posY = -30;
        let posX = parseFloat(petal.style.left);
        const sway = Math.random() * 3 + 1; // 摇摆幅度
        const speed = Math.random() * 2 + 1; // 下落速度
        let angle = Math.random() * Math.PI * 2; // 初始角度
        const rotationSpeed = Math.random() * 0.02 + 0.01; // 旋转速度
        
        // 动画函数
        function animate() {
            posY += speed;
            angle += rotationSpeed;
            posX += Math.sin(angle) * sway;
            
            petal.style.top = posY + 'px';
            petal.style.left = posX + 'px';
            petal.style.transform = `rotate(${angle * 30}deg)`;
            
            if (posY < window.innerHeight) {
                requestAnimationFrame(animate);
            } else {
                petal.remove();
                createPetal();
            }
        }
        
        animate();
    }
    
    // 创建多个花瓣
    for (let i = 0; i < 15; i++) {
        setTimeout(createPetal, i * 500);
    }
    
    // 窗口大小变化时重新计算
    window.addEventListener('resize', function() {
        document.querySelectorAll('.petal').forEach(p => p.remove());
        for (let i = 0; i < 15; i++) {
            setTimeout(createPetal, i * 500);
        }
    });
});