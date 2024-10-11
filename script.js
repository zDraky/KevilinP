let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Função para movimentar, adaptando para toque e mouse
    const moveHandler = (e) => {
      // Verifica se é evento de toque ou mouse
      const isTouch = e.type.startsWith("touch");
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      if (!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Evento de toque para movimentar
    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler);

    // Função para iniciar o arrasto (desktop e mobile)
    const startDrag = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;

      const isTouch = e.type.startsWith("touch");
      this.mouseTouchX = isTouch ? e.touches[0].clientX : e.clientX;
      this.mouseTouchY = isTouch ? e.touches[0].clientY : e.clientY;
      this.prevMouseX = this.mouseTouchX;
      this.prevMouseY = this.mouseTouchY;

      if (!isTouch && e.button === 2) {
        this.rotating = true;
      }
    };

    // Função para parar o arrasto (desktop e mobile)
    const stopDrag = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Eventos para desktop
    paper.addEventListener("mousedown", startDrag);
    window.addEventListener("mouseup", stopDrag);

    // Eventos para mobile
    paper.addEventListener("touchstart", startDrag);
    window.addEventListener("touchend", stopDrag);
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
