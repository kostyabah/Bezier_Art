import { h, Component } from "preact"
import { createArtist } from "./artist"

export class Canvas extends Component {
    static defaultProps = {
        redraw: true,
        stroke: "black",
        //background: "white",
        fill: "white",
        opacity: 1,
        lineWidth: 1,
        top: 0,
        left: 0,
        scale: 1,
        shouldUpdate: () => true,
    }


    shouldComponentUpdate(nextProps) {
        let { shouldUpdate } = this.props,
            { _changeData: change } = this.context

        if (Array.isArray(shouldUpdate)) {
            return shouldUpdate.some(key => equals(key))
        } else {
            return shouldUpdate.apply(this, arguments)
        }
    };
    getEvent = e => {
        let that = this.base,
            coord = that.getBoundingClientRect(),
            { top, left, scale } = this.props,
            clientX = left + (e.clientX - coord.left) *
                that.width / scale / that.clientWidth,
            clientY = top + (e.clientY - coord.top) *
                that.height / scale / that.clientHeight;
        return {
            clientX, 
            clientY,
            which: e.which,
            shift: e.shiftKey,
            alt: e.altKey,
            ctrl: e.ctrlKey,
            getColor: (x = 1, y = 1)=>{
                return this.ctx.getImageData(clientX, clientY, x, y).data;
            }	
        }
    }
    componentDidMount() {


        this.base.width = this.props.width || this.base.clientWidth
        this.base.height = this.props.height || this.base.clientHeight

        this.ctx = this.base.getContext("2d")
        this.artist = createArtist(this.ctx);

        if (this.props._ref) {
            let { width, height } = this.base
            this.props._ref({ width, height })
        }

        this.startFill();
        if (this.props.onLoad) {
            this.props.onLoad();
        } else {
            this.drawTo();
        }

    }
    dispatcher = {

        clear() {
            this.targets = [];
            this.klapan = new Map();
        },
        add(value, key) {
            if (key) {
                this.targets[key] = value
            } else {
                this.targets.push(value)
            }
        }

    }
    startFill = () => {
        this.ctx.save();
        this.ctx.fillStyle = this.props.fill;
        this.ctx.fillRect(0, 0, this.base.width, this.base.height);
        this.ctx.restore();
    }
    repaint(jsx, action = "init") {
        console.groupCollapsed(action, jsx);
        this.artist.handItem(this.dispatcher, jsx)
        console.log(this.dispatcher)
        console.groupEnd();
    }
    drawTo = () => {

        if (!this.ctx)
            return;
        //console.log(this.props)    
        this.artist.style(this.props);
        if (this.props.redraw) {
            this.startFill()
        }


        let jsxList = this.props.children;

        this.dispatcher.clear();
        this.repaint(jsxList)
    }


    componentDidUpdate(_props, _state) {
        console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
        this.drawTo()
    }

    isEvent = false;


    getActiveId = ({ clientX: x, clientY: y }) => {
        let shapes = Object.entries(this.dispatcher.targets);

        console.log(shapes.slice())
        while (shapes.length) {
            let [key, shape] = shapes.pop();
            if (this.artist.contain(shape, { x, y })) {
                return key;
            }
            //[key, shape] = shapes.pop();
        }
        return "_"
        /*
        return Array.isArray(place)
            ? this.catchTarget(result = place.pop(), point)
                ? result
                : this.catchTarget(place, point)
            : this.artist.contain(place, point)
                ? place
                : null
        */
    }

    count = 0;
    update = (name, ...args) => {
        //let { onClick, onChange, onFocus, onSubClick } = this.props


        let { props: target } = this.dispatcher.targets[this.activeId] || this
        //let target = activeShape.props;
        console.log("activeId=", {
            id: this.activeId,
            name,
            target
        });

        let handler = target[name] //|| this.props[name]
        if (!handler) return;
        else if(Array.isArray(handler)){
            handler[args[0].which](target, ...args)
        }
        //else if (args[0].which > 1) return
        else if (typeof handler !== "function") {
            let jsx = this.dispatcher.klapan.get(handler);
            if (jsx === undefined) return;
            this.repaint(jsx, handler)
        } else {
            handler(target, ...args)
        }


    }
    managerMove = (type, point) => move => {
        let current = this.getEvent(move)
        if (type == "onChange")
            this.count = 0;

        this.update(type, current, point)
    }
    onMouseDown = event => {
        this.count++;
        let point = this.getEvent(event)
        this.activeId = this.getActiveId(point, "onStart");
        if (point.which > 1) return;
        this.base.onmousemove = this.managerMove("onChange", point)
        this.update("onStart", point)
    }
    onMouseUp = event => {
        //console.log(event)
        //let point = this.getEvent(event)
        this.base.onmousemove = null//this.managerMove("onFocus", point)

    }
    onClick = event => {
        if (!this.count) return;
        this.update("onClick", this.getEvent(event))
    }
    onSubClick = event => {
        event.preventDefault()
        this.update("onSubClick", this.getEvent(event))
    }

    onKeyUp = event => {
        //console.log(event.key, this.props.onKey)
        let lower = event.key.toLowerCase()
        if (!this.props.onKey || !(lower in this.props.onKey))
            return
        this.props.onKey[lower](this.target)
    }

    render(props) {
        console.log(props)
        return (
            <canvas
                tabIndex={1000}
                style={props.style}
                class={props.class}
                width={props.width}
                height={props.height}
                ref = {props.ref}
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
                onKeyUp={this.onKeyUp}
                onClick={this.onClick}
                onContextMenu={this.onSubClick}
            />
        )
    }
}

