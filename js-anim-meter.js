const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/4
class MeterHolder {
    constructor(colors) {
        this.colors = colors
    }
    draw(context) {
        const colors = this.colors
        if(colors.length > 0) {
            const sweep = (180)/colors.length  - 5
            context.save()
            context.translate(size,size)
            for(var i=0;i<colors.length;i++) {
                context.fillStyle = colors[i]
                this.drawArcShape(context,180+i*start,sweep)
            }
            context.restore()
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
class MeterRotator {
    constructor() {
        this.state = new MeterState()
    }
    draw(context) {
        context.save()
        context.fillStyle = 'white'
        context.translate(size,size)
        context.beginPath()
        context.arc(0,0,size,Math.PI,2*Math.PI)
        context.fill()
        context.save()
        context.rotate((this.deg*Math.PI/180)*this.state.scale)
        context.fillStyle = 'black'
        context.beginPath()
        context.arc(0,-size/3,size/3,0,Math.PI)
        context.lineTo(0,-size/2)
        context.lineTo(size/3,-size/3)
        context.fill()
        context.restore()
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(deg,startcb) {
        this.state.startUpdating(deg,startcb)
    }
}
class MeterState {
    constructor() {
        this.scale = 0
        this.deg = 0
        this.maxDeg = 0
        this.scaleDeg = 0
    }
    startUpdating(deg,startcb) {
        this.maxDeg = deg
        startcb()
    }
    update(stopcb) {
        this.scaleDeg += 10
        this.scale = Math.cos(this.scaleDeg*Math.PI/180)
        this.deg = this.maxDeg*this.scale
        if(this.scaleDeg > 180) {
            this.scaleDeg = 0
            this.scale = 0
            stopcb()
        }
    }
}
