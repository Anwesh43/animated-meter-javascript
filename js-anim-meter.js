const w = window.innerWidth,h = window.innerHeight,size = Math.min(w,h)/4
class MeterHolder {
    constructor(colors) {
        this.colors = colors
    }
    draw(context) {
        const colors = this.colors
        if(colors.length > 0) {
            const sweep = (180)/colors.length
            context.save()
            context.translate(size,size)
            for(var i=0;i<colors.length;i++) {
                const start = sweep*i
                context.fillStyle = colors[i]
                const new_deg = 180+start
                this.drawArcShape(context,new_deg,sweep-5)
            }
            context.restore()
        }
    }
    drawArcShape(context,start,sweep) {
        context.beginPath()
        context.moveTo(0,0)
        for(var i=start;i<=start+sweep;i++) {
            const x = size*Math.cos(i*Math.PI/180),y = size*Math.sin(i*Math.PI/180)
            context.lineTo(x,y)
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
        context.save()
        const varying_deg = ((this.state.deg*Math.PI/180))
        console.log(varying_deg)
        context.rotate(-Math.PI/2+varying_deg)
        context.fillStyle = 'black'
        context.beginPath()
        context.arc(0,-size/6,size/6,0,Math.PI)
        context.lineTo(0,-size)
        context.lineTo(size/6,-size/6)
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
        this.scale = Math.sin(this.scaleDeg*Math.PI/180)
        this.deg = this.maxDeg*this.scale
        if(this.scaleDeg > 180) {
            this.scaleDeg = 0
            this.scale = 0
            this.deg = 0
            stopcb()
        }
    }
}
class Animator  {
    constructor() {
        this.animated = false
    }
    startUpdating(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(()=>{
                console.log("updating")
                updatecb()
            },120)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
class Stage {
    constructor() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = 2*size
        this.canvas.height = size
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
        this.holder = new MeterHolder(['#FF5722','#01579B','#9C27B0','#42A5F5','#f44336'])
        this.meterRotator = new MeterRotator()
        this.animator = new Animator()
    }
    render() {
        this.context.clearRect(0,0,2*size,size)
        this.holder.draw(this.context)
        this.meterRotator.draw(this.context)
        this.meterRotator.update(()=> {
            this.animator.stop()
            this.render()
        })
    }
    startRendering(deg) {
        this.meterRotator.startUpdating(deg,()=>{
            this.animator.startUpdating(()=>{
                this.render()
            })
        })

    }
}
class HoldCounter {
    constructor() {
        this.deg = 0
        this.lineIndicator = new LineIndicator()
    }
    updateLineIndicator() {
        this.lineIndicator.update(this.deg/180)
    }
    start() {
        this.interval = setInterval(()=>{
            this.deg++
            this.updateLineIndicator()
            if(this.deg > 180) {
                this.deg = 180
            }
            console.log(this.deg)
        },10)
    }
    stop(cb) {
        clearInterval(this.interval)
        cb(this.deg)
        this.deg = 0
        this.updateLineIndicator()
    }
}
class LineIndicator {
    constructor() {
        this.createDom()
    }
    createDom() {
        this.div = document.createElement('div')
        this.div.style.background = '#69F0AE'
        this.div.style.width = 0
        this.div.style.height = size/10
        this.div.style.borderRadius = `${size/20}px`
        this.div.style.position = 'absolute'
        this.div.style.left = w/4
        this.div.style.top = 4*h/5
        document.body.appendChild(this.div)
    }
    update(scale) {
        this.div.style.width = (w/2)*scale
    }
}
const stage = new Stage()
const holdCounter = new HoldCounter()
var isDown = false
stage.render()
window.onmousedown = (event) => {
    if(!isDown) {
        holdCounter.start()
        isDown = true
    }
}
window.onmouseup = (event) => {
    if(isDown) {
        isDown = false
        holdCounter.stop((deg)=>{
            stage.startRendering(deg)
        })
    }
}
