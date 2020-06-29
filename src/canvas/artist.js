//import { debug } from "webpack";


export function createArtist(ctx, context) {
    let rgb = (red, green=red, blue=green, alfa = 1) => 
        `rgba(${red}, ${green}, ${blue}, ${alfa})`
    function getColorText(color) {

        console.log(color)
        if (!color) return;

        if ([Array, Uint8ClampedArray].includes(Object.getPrototypeOf(color).constructor)) {
            let [red, green, blue, alfa] = color
            return rgb(red, green, blue, alfa)
        } else if (typeof color == "object") {
            let index = ["linear", "radial"].indexOf(color.type),
                typesGradient = [
                    "createLinearGradient",
                    "createRadialGradient"
                ]
            if (index > -1) {
                if(index === 1) console.info(color)
                let { positions } = color;
                //let posit = position.map(item=> item/(max-min))
                //color.position = color.position || ((it, sz) => it / (sz - 1))
                return color.colors.reduce(
                    (gr, col, ind, { length }) => {
                        //debugger
                        gr.addColorStop(
                            positions
                                ? positions[ind]
                                : ind / (length - 1),
                            getColorText(col)
                        );
                        return gr;
                    },
                    ctx[typesGradient[index]](...color.config)
                )
            } else {
                let { red, green, blue, alfa } = color;
                return rgb(red, green, blue, alfa)
            }


        } else {
            return color
        }
    }
    var artist = {
        drawJSX(disp, { key, ref, ...config }) {
            let { children, show = true, ...props } = config.props;
            //console.log(this)
            if (!show) return;
            let listEvents = ["onClick", "onChange", "onStart", "onSubClick"]

            let data = { type: config.type, props };
            if (listEvents.some(name => name in props)) {
                disp.add(data, key)
            }

            if (ref !== undefined) {
                //let {klapan} = disp;
                let kondid = disp.klapan.get(ref) || [];
                disp.klapan.set(ref, [...kondid, data])
                return;
            }


            ctx.save()
            this.drawShape(config, disp);
            //console.log(config.props)
            //this.handItem(disp, children);

            if (children) {
                console.group(config.type, { props, children });
                this.handItem(disp, children);
                console.groupEnd()
            } else {
                console.log(config.type, props)
            }
            ctx.restore();

        },
        handItem(dispatcher, config) {
            if (!config) {
                return;
            }

            else if (typeof config.type == "function") {
                console.log(config)
                let addBefore = config.type(config.props);
                this.handItem(dispatcher, addBefore)
            }
            else if (Array.isArray(config)) {
                config.forEach(item => {
                    this.handItem(dispatcher, item)
                })
            }
            else if (config.type in this.helper) {
                let { children, ...props } = config.props;
                let callEach = item => {
                    item.props = {
                        ...this.helper[config.type](item, props),
                        ...item.props
                    }
                    this.handItem(dispatcher, item)
                };
                if (Array.isArray(children))
                    children.forEach(callEach);
                else
                    callEach(children);
            }
            else if (typeof config.type === "string") {
                this.drawJSX(dispatcher, config)
            }
        },

        style(props) {
            if (!props) return
            var { fill, stroke, lineWidth, opacity = 1 } = props
            var result = {
                fillStyle: fill,
                strokeStyle: stroke,
                globalAlpha: opacity,
                lineWidth
            }

            Object.keys(result).forEach(key => {
                if (key in result)
                    ctx[key] = getColorText(result[key]);
            })

            //console.log(ctx)    
        },
        transform(props) {
            Object.entries(props).forEach(([key, value]) => {
                if (["transform", "rotate", "scale", "translate"].includes(key)) {
                    console.log(props, value);
                    //debugger
                    ctx[key](...value)

                }
            })
        },
        drawShape(shape) {

            if (shape.type === "clear") {
                let { x, y, width, height } = shape.props
                ctx.clearRect(x, y, width, height)
            } else {
                let isRect = shape.type === "rect"
                ctx.beginPath();
                this.transform(shape.props)
                this.style(shape.props);

                console.log(shape.props)
                this.draw[shape.type](shape.props);




                if (shape.props.stroke)
                    ctx.stroke();
                if (shape.props.fill)
                    ctx.fill();
            }
        },


        contain(shape, point) {
            if (!shape) return
            ctx.save()
            ctx.beginPath();
            //console.log(shape, point)
            this.transform(shape.props)
            this.draw[shape.type](shape.props)
            
            ctx.restore();
            ctx.lineWidth = 5

            let { fill, stroke } = shape.props;

            return ctx.isPointInPath(point.x, point.y)
                || (ctx.isPointInStroke(point.x, point.y))

        },

        helper: {

            data(shape, props) {
                let result = {}
                for (let [key, value] of Object.entries(shape.props)) {
                    if (typeof value === "string" && value in props) {
                        result[key] = props[value]
                    }
                }
                return result;
            },
            group(shape, props) {
                return props
            }
        },
        draw: {

            rect({ x, y, width, height }) {
                ctx.rect(x, y, width, height)
            },
            image({ src, area, cut }) {
                let _getImage = (src, images = document.images) => {
                    return [].find.call(images, (image) => image.src === src)
                }
                let image = _getImage(src)
                if (!image || !area || !cut) return;
                ctx.drawImage(
                    image,
                    area.x, area.y, area.width, area.height,
                    cut.x, cut.y, cut.width, cut.height
                )
            },
            ellipse(props) {
                console.log(props)
                ctx.ellipse(
                    props.cx, props.cy,
                    props.r || props.rx, props.r || props.ry,
                    props.rotate * Math.PI / 180 || 2 * Math.PI,
                    0, 2 * Math.PI
                )
            },


            polyline(props) {

                let getCoord = (i) => { }
                let x = props.x.flat();
                let y = props.y.flat();
                let frech = props.t ||
                    (x.length && y.length
                        ? (x.length < y.length ? x : y)
                        : (x.length && x) || (y.length && y)
                    )

                if (!frech) return;
                frech.forEach((item, i) => {
                    if (!i) {
                        ctx.moveTo(x[i], y[i])
                    } else {
                        ctx.lineTo(x[i], y[i])
                    }
                })


            },
            path({
                x, y, ax, ay
            }) {

                let length = Math.min(
                    x.length,
                    ax.length,
                    y.length,
                    ay.length
                )
                if (length < 2) return;
                let n = 0;


                let drawVector = (x, y, ax, ay, oldX, oldY) => {
                    let bx = 2 * x - ax, by = 2 * y - ay;
                    ctx.bezierCurveTo(oldX, oldY, bx, by, x, y)
                }
                ctx.moveTo(x[0], y[0])
                while (++n < length + 1) {
                    let i = n % length;
                    drawVector(x[i], y[i], ax[i], ay[i], ax[n - 1], ay[n - 1])
                }
            }
        }

    }
    return artist
}