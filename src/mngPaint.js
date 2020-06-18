import { h, Component } from 'preact'
import Canvas from "../canvas/index"
import list from "./list"
export default class extends Component {
    state = {
        circles: list()
    }

    click = event => {
        return state => ({
            index: null
        })

    }

    active = event => {

        return state => ({

            circles: state.circles.set({
                x: event.clientX,
                y: event.clientY,
            }),
            index: state.circles.length,
        })
    }
    change = (event) => {

        return state => ({
            circles: state.circles.set({
                x: event.clientX,
                y: event.clientY,
            }, state.index),
            index: state.index //|| state.circles.length-1
        })
    }
    circle = {
        active() {

            return state => ({
                index: this.index
            })
        },
        focus(point) {
            return state => ({
                circles: state.circles.set(circle => { circle.r = 20 })
            })
        }
    }
    /*
    circles = state.last
        ? state.circles.concat([state.last])
        : state.circles
    ,*/

    render(props, state) {
        console.log(state.circles.size)
        let CircleList = (state) => state
            .circles.map((item, index) => (
                <ellipse
                    cx={item.x}
                    cy={item.y}
                    r={5}
                    index={index}
                    fill="orange"
                    onActive={this.circle.active}
                //onFocus = {circle.focus}
                />
            ))
        return (
            <Canvas
                fill="blue"

                onClick={this.click}
                onActive={this.active}
                onChange={this.change}
            >
                <polyline points={state.circles.value} />
                <CircleList {...state} />
            </Canvas>
        )
    }


} 
