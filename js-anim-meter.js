const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/4
class MeterHolder {
    constructor(colors) {
        this.colors = colors
    }
    draw(context) {
        const colors = this.colors
        if(colors.length > 0) {
            const sweep = (180)/colors.length  - 5
            for(var i=0;i<colors.length;i++) {
                context.fillStyle = colors[i]
                this.drawArcShape(context,180+i*start,sweep)
            }
        }
    }
    drawArcShape(context,start,sweep) {
        context.beginPath()
        for(var i=start;i<=start+sweep;i++) {
            const x = size*Math.cos(i*Math.PI/180),y = size*Math.sin(i*Math.PI/180)
            if(i == start) {
                context.moveTo(x,y)
            }
            else {
                context.lineTo(x,y)
            }
            context.fill()
        }
    }
}
