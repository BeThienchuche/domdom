// ==========================================
// PHẦN 1: SETUP CHO ĐOM ĐÓM (Đã nâng cấp)
// ==========================================
const canvasF = document.getElementById("canvas");
const ctxF = canvasF.getContext("2d");
let wF = canvasF.width = window.innerWidth;
let hF = canvasF.height = window.innerHeight;
let f = [];

class Firefly {
    constructor() {
        this.x = Math.random() * wF;
        this.y = Math.random() * hF;
        this.s = Math.random() * 2 + 1; // Kích thước to hơn 1 xíu (1 - 3px)
        this.ang = Math.random() * 2 * Math.PI;
        this.v = (this.s * this.s) / 15;

        // --- CÁC THÔNG SỐ MỚI ĐỂ TẠO HIỆU ỨNG CHỚP TẮT ---
        this.alpha = Math.random(); // Độ sáng ban đầu (0 đến 1)
        this.fadeRate = Math.random() * 0.02 + 0.005; // Tốc độ chớp tắt (nhanh chậm khác nhau)
        this.fadeDir = Math.random() > 0.5 ? 1 : -1; // 1 là đang sáng lên, -1 là đang mờ đi
    }
    
    move() {
        // Cập nhật vị trí bay
        this.x += this.v * Math.cos(this.ang);
        this.y += this.v * Math.sin(this.ang);
        this.ang += (Math.random() * 20 * Math.PI) / 180 - (10 * Math.PI) / 180;

        // Cập nhật độ sáng (chớp tắt)
        this.alpha += this.fadeRate * this.fadeDir;
        if (this.alpha >= 1) {
            this.alpha = 1; // Sáng tối đa
            this.fadeDir = -1; // Bắt đầu mờ dần
        } else if (this.alpha <= 0) {
            this.alpha = 0; // Tối hoàn toàn
            this.fadeDir = 1; // Bắt đầu sáng dần lên
        }
    }
    
    show() {
        // Nếu độ sáng <= 0 thì không cần vẽ (tiết kiệm tài nguyên máy)
        if (this.alpha <= 0) return;

        ctxF.save(); // Lưu trạng thái bút vẽ
        
        ctxF.beginPath();
        ctxF.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
        
        // Màu vàng cam (#fddba3) kết hợp với độ sáng (alpha)
        ctxF.fillStyle = `rgba(253, 219, 163, ${this.alpha})`;
        
        // --- HIỆU ỨNG PHÁT SÁNG (GLOW) ---
        ctxF.shadowBlur = 15; // Độ tỏa sáng (càng cao càng tỏa rộng)
        ctxF.shadowColor = `rgba(255, 230, 120, ${this.alpha})`; // Màu của vầng hào quang
        
        ctxF.fill();
        
        ctxF.restore(); // Trả lại trạng thái bút vẽ để không làm ảnh hưởng con khác
    }
}

function drawFireflies() {
    // Duy trì số lượng khoảng 100 con
    if (f.length < 100) {
        for (let j = 0; j < 10; j++) {
            f.push(new Firefly());
        }
    }
    for (let i = 0; i < f.length; i++) {
        f[i].move();
        f[i].show();
        // Xóa đom đóm nếu bay ra khỏi màn hình để sinh con mới
        if (f[i].x < 0 || f[i].x > wF || f[i].y < 0 || f[i].y > hF) {
            f.splice(i, 1);
        }
    }
}

// ==========================================
// PHẦN 2: SETUP CHO BẦU TRỜI SAO (1/3 Màn hình)
// ==========================================
const canvasS = document.getElementById('starfield');
const ctxS = canvasS.getContext('2d');
let wS, hS, stars = [];

function initStars() {
    wS = canvasS.width = window.innerWidth;
    hS = canvasS.height = window.innerHeight;
    stars = [];
    
    // Giới hạn sao chỉ ở 1/3 phía trên màn hình
    const count = Math.round((wS * (hS / 3)) / 2200); 
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * wS,
            y: Math.random() * (hS / 3),
            r: Math.random() * 0.9 + 0.1,
            a: Math.random() * 0.8 + 0.2
        });
    }
}

function drawStars() {
    ctxS.clearRect(0, 0, wS, hS);
    for (const s of stars) {
        ctxS.globalAlpha = s.a;
        ctxS.fillStyle = '#fff';
        ctxS.beginPath();
        ctxS.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctxS.fill();
    }
    ctxS.globalAlpha = 1;
}

// ==========================================
// PHẦN 3: VÒNG LẶP CHUNG & TỰ ĐỘNG RESIZE
// ==========================================
function animate() {
    // Xóa khung hình cũ của đom đóm (dùng clearRect để không bị vệt)
    ctxF.clearRect(0, 0, wF, hF);
    
    // Vẽ 2 hiệu ứng
    drawFireflies();
    drawStars();

    // Gọi lại hàm animate để tạo chuyển động liên tục
    requestAnimationFrame(animate);
}

// Cập nhật lại kích thước canvas khi người dùng co giãn cửa sổ
window.addEventListener('resize', function() {
    wF = canvasF.width = window.innerWidth;
    hF = canvasF.height = window.innerHeight;
    initStars(); 
});

// Khởi động khi mở trang
initStars();
animate();

// ==========================================
// PHẦN 4: ĐIỀU KHIỂN NHẠC NỀN
// ==========================================
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🔈'; // Icon khi tắt nhạc
        isPlaying = false;
    } else {
        bgMusic.play();
        musicToggle.textContent = '🎵'; // Icon khi đang phát nhạc
        isPlaying = true;
    }
});

